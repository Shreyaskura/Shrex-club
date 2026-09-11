export interface MemberRecord {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user';
  tier: 'Essential' | 'Performance' | 'Elite VIP';
  fitnessGoal?: string;
  joinedDate: string;
  joinedTimestamp: number;
  membershipExpiryDate: string;
  membershipExpiryTimestamp: number;
  isExpired: boolean;
  lastLogin?: string;
  lastLoginTimestamp?: number;
  isOnline?: boolean;
}

export interface ActivityEvent {
  id: string;
  type: 'USER_REGISTERED' | 'USER_ENTERED' | 'MEMBERSHIP_RENEWED';
  member: {
    id: string;
    name: string;
    email: string;
    tier: string;
  };
  timestamp: number;
  formattedTime: string;
  date: string;
}

const STORAGE_KEY = 'shrex_members_db';

// Real-time Cloud Datastore Endpoints for cross-device synchronization (Mobile, Laptop, Vercel)
export const CLOUD_MEMBERS_URL = 'https://api.restful-api.dev/objects/ff808181a067127101a08f60221b72d1';
export const CLOUD_ACTIVITY_URL = 'https://api.restful-api.dev/objects/ff808181a067127101a08f60ec3a72d3';

// Web Audio API synthesizer for luxury athletic chime
export function playNewUserChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Tone 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.01, now);
    gain1.gain.exponentialRampToValueAtTime(0.25, now + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2: 880 Hz (A5) slightly delayed
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.01, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.3, now + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.65);
  } catch (err) {
    // Audio contexts might be blocked until user interacts with document
  }
}

// Filter authentic members — ensures genuine user records with valid email and name
export function filterRealMembers(list: any[]): MemberRecord[] {
  if (!Array.isArray(list)) return [];
  return list.filter(
    (m) =>
      m &&
      typeof m.email === 'string' &&
      m.email.trim().length > 3 &&
      typeof m.name === 'string' &&
      m.name.trim().length > 0 &&
      m.role === 'user'
  );
}

// Resilient bidirectional merger for multi-device sync
export function mergeMembers(listA: MemberRecord[], listB: MemberRecord[]): MemberRecord[] {
  const map = new Map<string, MemberRecord>();
  for (const m of listA) {
    if (m && m.email) map.set(m.email.toLowerCase().trim(), m);
  }
  for (const m of listB) {
    if (m && m.email) {
      const cleanEmail = m.email.toLowerCase().trim();
      const existing = map.get(cleanEmail);
      if (!existing) {
        map.set(cleanEmail, m);
      } else {
        const newerTimestamp = Math.max(existing.lastLoginTimestamp || 0, m.lastLoginTimestamp || 0);
        map.set(cleanEmail, {
          ...existing,
          ...m,
          isOnline: m.isOnline || existing.isOnline,
          lastLoginTimestamp: newerTimestamp,
          lastLogin:
            (m.lastLoginTimestamp || 0) >= (existing.lastLoginTimestamp || 0)
              ? (m.lastLogin || existing.lastLogin)
              : existing.lastLogin,
        });
      }
    }
  }
  return filterRealMembers(Array.from(map.values()));
}

// Local cache helpers
export function getLocalMembers(): MemberRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return filterRealMembers(JSON.parse(raw));
  } catch (e) {
    return [];
  }
}

export function setLocalMembers(members: MemberRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    window.dispatchEvent(new Event('shrex_members_updated'));
  } catch (e) {}
}

// Synchronous fetch for initial render
export function getStoredMembers(): MemberRecord[] {
  return getLocalMembers();
}

// Synchronous local save + triggers asynchronous cloud and server sync
export function saveStoredMembers(members: MemberRecord[]): void {
  setLocalMembers(members);
  syncMembersBulkToServer(members).catch(() => {});
}

// Cloud REST API direct access helpers
async function fetchCloudMembers(): Promise<MemberRecord[]> {
  try {
    const res = await fetch(CLOUD_MEMBERS_URL, {
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data.members)) {
        return filterRealMembers(json.data.members);
      }
    }
  } catch (err) {}
  return [];
}

async function saveCloudMembers(members: MemberRecord[]): Promise<void> {
  try {
    await fetch(CLOUD_MEMBERS_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Shrex Club Members DB',
        data: { members: filterRealMembers(members) },
      }),
    });
  } catch (err) {}
}

async function logCloudActivity(event: ActivityEvent): Promise<void> {
  try {
    const res = await fetch(CLOUD_ACTIVITY_URL, {
      headers: { 'Cache-Control': 'no-cache' },
    });
    let currentActivities: ActivityEvent[] = [];
    let currentHeartbeats: Record<string, number> = {};
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        currentActivities = json.data.activities || [];
        currentHeartbeats = json.data.heartbeats || {};
      }
    }
    const updated = [event, ...currentActivities.filter((a) => a.id !== event.id)].slice(0, 100);
    if (event.member && event.member.email) {
      currentHeartbeats[event.member.email.toLowerCase().trim()] = Date.now();
    }
    await fetch(CLOUD_ACTIVITY_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Shrex Club Activity DB',
        data: {
          activities: updated,
          heartbeats: currentHeartbeats,
        },
      }),
    });
  } catch (err) {}
}

// Asynchronous API calls with Dual-Layer synchronization (/api + Cloud DB)
export async function fetchServerMembers(): Promise<MemberRecord[]> {
  let serverList: MemberRecord[] = [];

  // Layer 1: Local /api/members
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('/api/members', {
      headers: { 'Cache-Control': 'no-cache' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.members)) {
        serverList = filterRealMembers(data.members);
      }
    }
  } catch (err) {}

  // Layer 2: Cloud Datastore (enables mobile <-> laptop sync across all networks)
  try {
    const cloudList = await fetchCloudMembers();
    if (cloudList.length > 0) {
      serverList = mergeMembers(serverList, cloudList);
    }
  } catch (err) {}

  const local = getLocalMembers();
  const merged = mergeMembers(local, serverList);
  setLocalMembers(merged);

  // If local or merged has newer records missing from cloud, push them up
  if (merged.length > serverList.length) {
    syncMembersBulkToServer(merged).catch(() => {});
  }

  return merged;
}

export async function syncMembersBulkToServer(members: MemberRecord[]): Promise<void> {
  const filtered = filterRealMembers(members);
  // Sync to local /api/members
  try {
    fetch('/api/members', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ members: filtered }),
    }).catch(() => {});
  } catch (err) {}

  // Sync to cloud datastore
  try {
    saveCloudMembers(filtered).catch(() => {});
  } catch (err) {}
}

export async function registerMemberOnServer(member: MemberRecord): Promise<MemberRecord[]> {
  const local = getLocalMembers();
  const cleanEmail = member.email.toLowerCase().trim();
  const updatedMember: MemberRecord = {
    ...member,
    email: cleanEmail,
    isOnline: true,
    lastLogin: 'Just Now',
    lastLoginTimestamp: Date.now(),
  };
  const updated = [updatedMember, ...local.filter((m) => m.email.toLowerCase().trim() !== cleanEmail)];
  setLocalMembers(updated);

  const now = Date.now();
  const actEvent: ActivityEvent = {
    id: `ACT-${now}-${Math.floor(100 + Math.random() * 900)}`,
    type: 'USER_REGISTERED',
    member: {
      id: updatedMember.id,
      name: updatedMember.name,
      email: updatedMember.email,
      tier: updatedMember.tier,
    },
    timestamp: now,
    formattedTime: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    date: new Date(now).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };

  // Dispatch to local /api/members
  try {
    fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', member: updatedMember }),
    }).catch(() => {});
  } catch (err) {}

  // Dispatch to Cloud DB
  try {
    const cloudMembers = await fetchCloudMembers();
    const cloudMerged = mergeMembers([updatedMember], cloudMembers);
    await saveCloudMembers(cloudMerged);
    await logCloudActivity(actEvent);
  } catch (err) {}

  return updated;
}

export async function recordLoginOnServer(
  memberOrEmail: MemberRecord | { email: string; name?: string } | string,
  maybeName?: string
): Promise<void> {
  const email = (typeof memberOrEmail === 'string' ? memberOrEmail : memberOrEmail.email).toLowerCase().trim();
  const memberObj = typeof memberOrEmail === 'object' ? (memberOrEmail as any) : undefined;
  const name = memberObj?.name || maybeName || email.split('@')[0];
  const now = Date.now();

  // Update local memory
  const local = getLocalMembers();
  const matchIdx = local.findIndex((m) => m.email.toLowerCase().trim() === email);
  let updatedMember: MemberRecord;
  if (matchIdx >= 0) {
    local[matchIdx].lastLogin = 'Just Now';
    local[matchIdx].lastLoginTimestamp = now;
    local[matchIdx].isOnline = true;
    if (memberObj?.name) local[matchIdx].name = memberObj.name;
    if (memberObj?.tier) local[matchIdx].tier = memberObj.tier;
    updatedMember = local[matchIdx];
  } else {
    updatedMember = {
      ...(memberObj || {}),
      id: memberObj?.id || `MEM-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      role: 'user',
      tier: memberObj?.tier || 'Essential',
      joinedDate: memberObj?.joinedDate || new Date(now).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      joinedTimestamp: memberObj?.joinedTimestamp || now,
      membershipExpiryDate: memberObj?.membershipExpiryDate || 'In 30 Days',
      membershipExpiryTimestamp: memberObj?.membershipExpiryTimestamp || now + 30 * 24 * 60 * 60 * 1000,
      isExpired: false,
      lastLogin: 'Just Now',
      lastLoginTimestamp: now,
      isOnline: true,
    };
    local.unshift(updatedMember);
  }
  setLocalMembers(local);

  const actEvent: ActivityEvent = {
    id: `ACT-${now}-${Math.floor(100 + Math.random() * 900)}`,
    type: 'USER_ENTERED',
    member: {
      id: updatedMember.id,
      name: updatedMember.name,
      email: updatedMember.email,
      tier: updatedMember.tier,
    },
    timestamp: now,
    formattedTime: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    date: new Date(now).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };

  // 1. Post to /api/members
  try {
    fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, name, member: updatedMember }),
    }).catch(() => {});
  } catch (err) {}

  // 2. Post to Cloud DB for instant cross-device detection
  try {
    const cloudMembers = await fetchCloudMembers();
    const cloudMerged = mergeMembers([updatedMember], cloudMembers);
    await saveCloudMembers(cloudMerged);
    await logCloudActivity(actEvent);
  } catch (err) {}
}

export async function renewMemberOnServer(id: string, days: number = 30): Promise<MemberRecord[]> {
  const local = getLocalMembers();
  const now = Date.now();
  const updatedLocal = local.map((m) => {
    if (m.id === id) {
      const baseTime = m.membershipExpiryTimestamp && m.membershipExpiryTimestamp > now ? m.membershipExpiryTimestamp : now;
      const newTimestamp = baseTime + days * 24 * 60 * 60 * 1000;
      const newDate = new Date(newTimestamp).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      return {
        ...m,
        isExpired: false,
        membershipExpiryTimestamp: newTimestamp,
        membershipExpiryDate: newDate,
      };
    }
    return m;
  });
  setLocalMembers(updatedLocal);
  syncMembersBulkToServer(updatedLocal).catch(() => {});

  try {
    fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'renew', id, days }),
    }).catch(() => {});
  } catch (err) {}

  return updatedLocal;
}

export async function expireMemberOnServer(id: string): Promise<MemberRecord[]> {
  const local = getLocalMembers();
  const updatedLocal = local.map((m) => {
    if (m.id === id) {
      return {
        ...m,
        isExpired: true,
        membershipExpiryDate: 'Expired (' + new Date().toLocaleDateString('en-GB') + ')',
      };
    }
    return m;
  });
  setLocalMembers(updatedLocal);
  syncMembersBulkToServer(updatedLocal).catch(() => {});

  try {
    fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'expire', id }),
    }).catch(() => {});
  } catch (err) {}

  return updatedLocal;
}

export async function deleteMemberOnServer(id: string): Promise<MemberRecord[]> {
  const local = getLocalMembers();
  const updatedLocal = local.filter((m) => m.id !== id);
  setLocalMembers(updatedLocal);
  syncMembersBulkToServer(updatedLocal).catch(() => {});

  try {
    fetch(`/api/members?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }).catch(() => {});
  } catch (err) {}

  return updatedLocal;
}

export async function resetPasswordOnServer(email: string, password: string): Promise<void> {
  const clean = email.trim().toLowerCase();
  const local = getLocalMembers();
  const updated = local.map((m) => {
    if (m.email.toLowerCase().trim() === clean) {
      return { ...m, password };
    }
    return m;
  });
  setLocalMembers(updated);
  syncMembersBulkToServer(updated).catch(() => {});

  try {
    fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset-password', email: clean, password }),
    }).catch(() => {});
  } catch (err) {}
}

export async function sendHeartbeat(email: string): Promise<void> {
  if (!email) return;
  const clean = email.trim().toLowerCase();
  try {
    fetch('/api/activity/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: clean }),
    }).catch(() => {});
  } catch (err) {}

  // Update cloud heartbeat map directly
  try {
    const res = await fetch(CLOUD_ACTIVITY_URL, {
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (res.ok) {
      const json = await res.json();
      const current = json?.data || { activities: [], heartbeats: {} };
      const heartbeats = current.heartbeats || {};
      heartbeats[clean] = Date.now();
      await fetch(CLOUD_ACTIVITY_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Shrex Club Activity DB',
          data: {
            activities: current.activities || [],
            heartbeats,
          },
        }),
      });
    }
  } catch (err) {}
}

export async function fetchLiveActivity(sinceTimestamp: number = 0): Promise<{
  activities: ActivityEvent[];
  onlineEmails: string[];
}> {
  let localActivities: ActivityEvent[] = [];
  let onlineEmails: string[] = [];

  // 1. Fetch from local /api/activity
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`/api/activity?since=${sinceTimestamp}`, {
      headers: { 'Cache-Control': 'no-cache' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data) {
        localActivities = data.activities || [];
        onlineEmails = data.onlineEmails || [];
      }
    }
  } catch (err) {}

  // 2. Fetch from Cloud DB for cross-network mobile telemetry
  try {
    const res = await fetch(CLOUD_ACTIVITY_URL, {
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (res.ok) {
      const json = await res.json();
      const data = json?.data;
      if (data && Array.isArray(data.activities)) {
        const cloudActivities: ActivityEvent[] = data.activities;
        const filtered = sinceTimestamp > 0
          ? cloudActivities.filter((a) => a.timestamp > sinceTimestamp)
          : cloudActivities;

        const combinedMap = new Map<string, ActivityEvent>();
        for (const a of localActivities) combinedMap.set(a.id, a);
        for (const a of filtered) combinedMap.set(a.id, a);
        localActivities = Array.from(combinedMap.values()).sort((a, b) => b.timestamp - a.timestamp);

        // Compute online users from cloud heartbeats (active in last 3 mins)
        if (data.heartbeats) {
          const now = Date.now();
          const emailSet = new Set<string>(onlineEmails.map((e) => e.toLowerCase()));
          for (const [em, ts] of Object.entries(data.heartbeats)) {
            if (typeof ts === 'number' && now - ts < 180000) {
              emailSet.add(em.toLowerCase());
            }
          }
          onlineEmails = Array.from(emailSet);
        }
      }
    }
  } catch (err) {}

  return { activities: localActivities, onlineEmails };
}

// Initial bootstrap: Merge local members and server/cloud members bidirectionally
export async function bootstrapMemberSync(): Promise<MemberRecord[]> {
  try {
    const local = getLocalMembers();
    const serverMembers = await fetchServerMembers();
    const merged = mergeMembers(local, serverMembers);
    setLocalMembers(merged);

    // If local had members that the server/cloud didn't have, upload them so all devices have them!
    if (merged.length > serverMembers.length) {
      await syncMembersBulkToServer(merged);
    }
    return merged;
  } catch (e) {}
  return getLocalMembers();
}
