import fs from 'node:fs';
import path from 'node:path';

const CLOUD_MEMBERS_URL = 'https://api.restful-api.dev/objects/ff808181a067127101a08f60221b72d1';
const CLOUD_ACTIVITY_URL = 'https://api.restful-api.dev/objects/ff808181a067127101a08f60ec3a72d3';

function getFilePath(): string {
  const dataDir = process.env.VERCEL ? '/tmp' : path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch (e) {}
  }
  const file = path.join(dataDir, 'members_db.json');
  if (!fs.existsSync(file)) {
    try {
      fs.writeFileSync(file, '[]', 'utf-8');
    } catch (e) {}
  }
  return file;
}

function getActivityFilePath(): string {
  const dataDir = process.env.VERCEL ? '/tmp' : path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch (e) {}
  }
  const file = path.join(dataDir, 'activity_log.json');
  if (!fs.existsSync(file)) {
    try {
      fs.writeFileSync(file, '[]', 'utf-8');
    } catch (e) {}
  }
  return file;
}

function readMembers(): any[] {
  try {
    const file = getFilePath();
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf-8') || '[]');
  } catch (err) {
    return [];
  }
}

function writeMembers(members: any[]): void {
  try {
    const file = getFilePath();
    fs.writeFileSync(file, JSON.stringify(members, null, 2), 'utf-8');
  } catch (err) {}
}

async function fetchCloudMembers(): Promise<any[]> {
  try {
    const res = await fetch(CLOUD_MEMBERS_URL, { headers: { 'Cache-Control': 'no-cache' } });
    if (res.ok) {
      const json = await res.json();
      if (json?.data?.members && Array.isArray(json.data.members)) {
        return json.data.members;
      }
    }
  } catch (e) {}
  return [];
}

async function syncCloudMembers(members: any[]): Promise<void> {
  try {
    await fetch(CLOUD_MEMBERS_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Shrex Club Members DB',
        data: { members },
      }),
    });
  } catch (e) {}
}

async function syncCloudActivity(event: any): Promise<void> {
  try {
    const res = await fetch(CLOUD_ACTIVITY_URL, { headers: { 'Cache-Control': 'no-cache' } });
    let currentActivities: any[] = [];
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
  } catch (e) {}
}

function logActivity(type: 'USER_REGISTERED' | 'USER_ENTERED' | 'MEMBERSHIP_RENEWED', member: any): any {
  try {
    const file = getActivityFilePath();
    const list = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8') || '[]') : [];
    const now = Date.now();
    const event = {
      id: `ACT-${now}-${Math.floor(100 + Math.random() * 900)}`,
      type,
      member: {
        id: member.id,
        name: member.name,
        email: member.email,
        tier: member.tier || 'Essential',
      },
      timestamp: now,
      formattedTime: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: new Date(now).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    const updated = [event, ...list].slice(0, 100);
    fs.writeFileSync(file, JSON.stringify(updated, null, 2), 'utf-8');
    syncCloudActivity(event).catch(() => {});
    return event;
  } catch (e) {
    return null;
  }
}

function mergeMembers(listA: any[], listB: any[]): any[] {
  const map = new Map<string, any>();
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
  return Array.from(map.values()).filter((m) => m && m.email && m.name);
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const local = readMembers();
      const cloud = await fetchCloudMembers();
      const merged = mergeMembers(local, cloud);
      writeMembers(merged);
      return res.status(200).json({ success: true, members: merged });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { action, member, email, password, id, days } = body || {};
      let members = readMembers();
      const cloud = await fetchCloudMembers();
      members = mergeMembers(members, cloud);
      let newEvent = null;

      if (action === 'register' && member) {
        const cleanEmail = member.email.trim().toLowerCase();
        const existingIdx = members.findIndex((m: any) => m.email.toLowerCase() === cleanEmail);
        const newRecord = {
          ...member,
          email: cleanEmail,
          isOnline: true,
          lastLogin: 'Just Now',
          lastLoginTimestamp: Date.now(),
        };
        if (existingIdx >= 0) {
          members[existingIdx] = { ...members[existingIdx], ...newRecord };
        } else {
          members = [newRecord, ...members];
        }
        writeMembers(members);
        syncCloudMembers(members).catch(() => {});
        newEvent = logActivity('USER_REGISTERED', newRecord);
      } else if (action === 'login' && email) {
        const cleanEmail = email.trim().toLowerCase();
        const existingIdx = members.findIndex((m: any) => m.email.toLowerCase() === cleanEmail);
        let userRec: any = null;

        if (existingIdx >= 0) {
          members[existingIdx].lastLogin = 'Just Now';
          members[existingIdx].lastLoginTimestamp = Date.now();
          members[existingIdx].isOnline = true;
          if (member && member.name) members[existingIdx].name = member.name;
          if (member && member.tier) members[existingIdx].tier = member.tier;
          userRec = members[existingIdx];
        } else {
          userRec = {
            ...(member || {}),
            id: member?.id || `MEM-${Math.floor(1000 + Math.random() * 9000)}`,
            name: member?.name || cleanEmail.split('@')[0],
            email: cleanEmail,
            role: 'user',
            tier: member?.tier || 'Essential',
            joinedDate:
              member?.joinedDate ||
              new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            joinedTimestamp: member?.joinedTimestamp || Date.now(),
            membershipExpiryDate: member?.membershipExpiryDate || 'In 30 Days',
            membershipExpiryTimestamp: member?.membershipExpiryTimestamp || Date.now() + 30 * 24 * 60 * 60 * 1000,
            isExpired: false,
            isOnline: true,
            lastLogin: 'Just Now',
            lastLoginTimestamp: Date.now(),
          };
          members = [userRec, ...members];
        }
        writeMembers(members);
        syncCloudMembers(members).catch(() => {});
        newEvent = logActivity('USER_ENTERED', userRec);
      } else if (action === 'renew' && id) {
        const renewDays = days || 30;
        const now = Date.now();
        members = members.map((m: any) => {
          if (m.id === id) {
            const base = m.membershipExpiryTimestamp && m.membershipExpiryTimestamp > now ? m.membershipExpiryTimestamp : now;
            const newTs = base + renewDays * 24 * 60 * 60 * 1000;
            const newDate = new Date(newTs).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            const updated = { ...m, isExpired: false, membershipExpiryTimestamp: newTs, membershipExpiryDate: newDate };
            newEvent = logActivity('MEMBERSHIP_RENEWED', updated);
            return updated;
          }
          return m;
        });
        writeMembers(members);
        syncCloudMembers(members).catch(() => {});
      } else if (action === 'expire' && id) {
        members = members.map((m: any) => {
          if (m.id === id) {
            return {
              ...m,
              isExpired: true,
              membershipExpiryDate: 'Expired (' + new Date().toLocaleDateString('en-GB') + ')',
            };
          }
          return m;
        });
        writeMembers(members);
        syncCloudMembers(members).catch(() => {});
      } else if (action === 'reset-password' && email && password) {
        const cleanEmail = email.trim().toLowerCase();
        members = members.map((m: any) => {
          if (m.email.toLowerCase() === cleanEmail) {
            return { ...m, password };
          }
          return m;
        });
        writeMembers(members);
        syncCloudMembers(members).catch(() => {});
      } else if (member) {
        const cleanEmail = member.email.trim().toLowerCase();
        const existingIdx = members.findIndex((m: any) => m.email.toLowerCase() === cleanEmail);
        if (existingIdx >= 0) {
          members[existingIdx] = { ...members[existingIdx], ...member };
        } else {
          members = [member, ...members];
        }
        writeMembers(members);
        syncCloudMembers(members).catch(() => {});
      }

      return res.status(200).json({ success: true, members, newEvent });
    }

    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { members } = body || {};
      if (Array.isArray(members)) {
        writeMembers(members);
        syncCloudMembers(members).catch(() => {});
      }
      return res.status(200).json({ success: true, members: readMembers() });
    }

    if (req.method === 'DELETE') {
      const id = req.query?.id || (typeof req.body === 'string' ? JSON.parse(req.body || '{}').id : req.body?.id);
      if (id) {
        let members = readMembers();
        members = members.filter((m: any) => m.id !== id);
        writeMembers(members);
        syncCloudMembers(members).catch(() => {});
      }
      return res.status(200).json({ success: true, members: readMembers() });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Server error', details: error?.message });
  }
}
