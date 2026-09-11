import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Shield, Users, Activity, AlertTriangle,
  Search, Plus, Download, Cpu, Flame, Zap, BarChart3, CheckCircle2,
  Trash2, RefreshCw, Calendar, Radio, MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';

import {
  AuthUser,
  MemberRecord,
  getStoredMembers,
  saveStoredMembers,
  renewMemberMembership,
  expireMemberMembership,
  deleteStoredMember
} from './AuthModal';
import {
  fetchServerMembers,
  fetchLiveActivity,
  playNewUserChime,
  registerMemberOnServer,
  ActivityEvent,
} from '../data/memberStore';
import { LiveStatusBar } from './LiveStatusBar';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: AuthUser | null;
  onOpenAuth?: (tab?: 'login' | 'signup' | 'admin') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'roster' | 'activity' | 'overview' | 'classes' | 'sensors'>('metrics');
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<MemberRecord[]>(() => getStoredMembers());
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [onlineEmails, setOnlineEmails] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [newAthleteAlert, setNewAthleteAlert] = useState<{
    name: string;
    email: string;
    tier?: string;
    type: 'USER_REGISTERED' | 'USER_ENTERED';
    time: string;
  } | null>(null);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // New Member Form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTier, setNewTier] = useState<'Essential' | 'Performance' | 'Elite VIP'>('Performance');
  const [newGoal, setNewGoal] = useState('Hypertrophy & Muscle Building');

  const prevMembersCountRef = useRef<number>(members.length);
  const lastActivityTimestampRef = useRef<number>(0);
  const hasInitializedRef = useRef<boolean>(false);

  // Live polling and synchronization across devices
  const doSync = useCallback(async (isManual: boolean = false) => {
    if (isManual) setIsSyncing(true);
    try {
      const [freshMembers, liveActivity] = await Promise.all([
        fetchServerMembers(),
        fetchLiveActivity(lastActivityTimestampRef.current),
      ]);

      setMembers(freshMembers);
      if (liveActivity && liveActivity.onlineEmails) {
        setOnlineEmails(liveActivity.onlineEmails);
      }
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      // Process new activities if any
      if (liveActivity && Array.isArray(liveActivity.activities) && liveActivity.activities.length > 0) {
        const sorted = [...liveActivity.activities].sort((a, b) => b.timestamp - a.timestamp);
        const newest = sorted[0];
        lastActivityTimestampRef.current = Math.max(
          lastActivityTimestampRef.current,
          ...liveActivity.activities.map((a) => a.timestamp)
        );

        setActivities((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          const fresh = liveActivity.activities.filter((a) => !existingIds.has(a.id));
          return [...fresh, ...prev].slice(0, 100);
        });

        // Trigger alert banner and chime if a user entered or registered
        if (hasInitializedRef.current && (newest.type === 'USER_REGISTERED' || newest.type === 'USER_ENTERED')) {
          playNewUserChime();
          setNewAthleteAlert({
            name: newest.member.name,
            email: newest.member.email,
            tier: newest.member.tier,
            type: newest.type,
            time: newest.formattedTime,
          });
          setNewlyAddedId(newest.member.id);
        }
      } else if (hasInitializedRef.current && freshMembers.length > prevMembersCountRef.current) {
        const newest = freshMembers[0];
        playNewUserChime();
        setNewAthleteAlert({
          name: newest.name,
          email: newest.email,
          tier: newest.tier,
          type: 'USER_REGISTERED',
          time: 'Just now',
        });
        setNewlyAddedId(newest.id);
      }

      hasInitializedRef.current = true;
      prevMembersCountRef.current = freshMembers.length;
    } catch (err) {
      console.error('Admin sync error:', err);
    } finally {
      if (isManual) {
        setTimeout(() => setIsSyncing(false), 400);
      }
    }
  }, []);

  // Poll every 2.5 seconds to detect live cross-device entries
  useEffect(() => {
    doSync(false);
    const interval = setInterval(() => {
      doSync(false);
    }, 2500);

    const handleLocalSync = () => {
      setMembers(getStoredMembers());
    };
    window.addEventListener('shrex_members_updated', handleLocalSync);
    window.addEventListener('storage', handleLocalSync);

    return () => {
      clearInterval(interval);
      window.removeEventListener('shrex_members_updated', handleLocalSync);
      window.removeEventListener('storage', handleLocalSync);
    };
  }, [doSync]);

  // Authentic Online Calculation:
  // User is online if their email is in onlineEmails, OR last login was within last 10 minutes (600,000ms), OR marked isOnline, OR currentUser matches
  const isMemberOnline = (m: MemberRecord): boolean => {
    const clean = m.email.toLowerCase().trim();
    if (onlineEmails.map((e) => e.toLowerCase().trim()).includes(clean)) return true;
    if (m.isOnline && (!m.lastLoginTimestamp || Date.now() - m.lastLoginTimestamp < 600000)) return true;
    if (m.lastLoginTimestamp && Date.now() - m.lastLoginTimestamp < 600000) return true;
    if (m.lastLogin === 'Just Now') return true;
    if (currentUser && currentUser.email.toLowerCase().trim() === clean) return true;
    return false;
  };

  const totalRegisteredUsers = members.length;
  const activeMembershipsCount = members.filter(
    (m) => !m.isExpired && (!m.membershipExpiryTimestamp || Date.now() <= m.membershipExpiryTimestamp)
  ).length;
  const expiredMembershipsCount = members.filter(
    (m) => m.isExpired || (m.membershipExpiryTimestamp && Date.now() > m.membershipExpiryTimestamp)
  ).length;
  const currentlyLoggedInCount = members.filter(isMemberOnline).length;

  // Filter members based on search
  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  // Authorization Guard: If unauthorized user tries to open dashboard
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#0A0A0F] border border-red-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(229,9,20,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/50 flex items-center justify-center mx-auto mb-4 text-red-500 shadow-lg shadow-red-600/30">
              <Shield className="w-8 h-8 animate-pulse" />
            </div>
            <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-widest block mb-1">
              PRIVILEGED ACCESS ONLY
            </span>
            <h2 className="font-heading font-black text-2xl text-white tracking-wide mb-2">
              ADMIN AUTHORIZATION REQUIRED
            </h2>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed font-mono">
              The Shrex Club Command Center is strictly reserved for administrators. Please authenticate with administrator credentials to proceed.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  onClose();
                  if (onOpenAuth) onOpenAuth('admin');
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-800 text-white font-heading font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-600/40 border border-red-500/50 transition-all hover:scale-[1.01]"
              >
                SIGN IN AS ADMINISTRATOR
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors"
              >
                CANCEL & RETURN
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newName.trim();
    const trimmedEmail = newEmail.trim().toLowerCase();
    if (!trimmedName || !trimmedEmail) return;

    const now = Date.now();
    const expiryTimestamp = now + 30 * 24 * 60 * 60 * 1000;
    const expiryDate = new Date(expiryTimestamp).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const newRec: MemberRecord = {
      id: `MEM-${Math.floor(1000 + Math.random() * 9000)}`,
      name: trimmedName,
      email: trimmedEmail,
      role: 'user',
      tier: newTier,
      fitnessGoal: newGoal,
      joinedDate:
        new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ' ' +
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      joinedTimestamp: now,
      membershipExpiryDate: expiryDate,
      membershipExpiryTimestamp: expiryTimestamp,
      isExpired: false,
      lastLogin: 'Never (Admin Registered)',
      lastLoginTimestamp: now,
    };

    const updated = [newRec, ...members.filter((m) => m.email.toLowerCase() !== trimmedEmail)];
    saveStoredMembers(updated);
    registerMemberOnServer(newRec).catch(() => {});
    setMembers(updated);
    setShowAddMemberModal(false);
    setNewName('');
    setNewEmail('');

    confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
  };

  const handleToggleExpire = (id: string, currentlyExpired: boolean) => {
    if (currentlyExpired) {
      const updated = renewMemberMembership(id, 30);
      setMembers(updated);
    } else {
      const updated = expireMemberMembership(id);
      setMembers(updated);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete user "${name}" from the database?`)) {
      const updated = deleteStoredMember(id);
      setMembers(updated);
    }
  };

  const handleExportCSV = () => {
    if (members.length === 0) {
      alert('No member records to export.');
      return;
    }
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Name,Email,Tier,Status,CreatedDate,ExpiryDate,LoginStatus']
        .concat(
          members.map((m) => {
            const isExp = m.isExpired || (m.membershipExpiryTimestamp ? Date.now() > m.membershipExpiryTimestamp : false);
            const isOnline = currentUser && currentUser.email.toLowerCase() === m.email.toLowerCase();
            return `${m.id},"${m.name}",${m.email},${m.tier},${isExp ? 'EXPIRED' : 'ACTIVE'},"${m.joinedDate}","${m.membershipExpiryDate || 'N/A'}",${isOnline ? 'LOGGED_IN_NOW' : 'OFFLINE'}`;
          })
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SHREX_Real_Members_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-6xl max-h-[92vh] glass-panel p-5 sm:p-8 rounded-3xl border border-white/20 shadow-2xl bg-[#09090E] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-red-600 text-white shadow-[0_0_20px_rgba(229,9,20,0.6)]">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-red-500 font-bold uppercase tracking-widest block">
                    COMMAND CENTER • PRIVILEGED ACCESS ONLY
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                    {currentUser?.name || 'Administrator'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight flex items-center gap-2">
                  SHREX <span className="text-gradient-red">ADMIN DASHBOARD</span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Live Sync Telemetry Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isSyncing ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isSyncing ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                </span>
                <span className="text-[11px] text-gray-300 hidden md:inline">
                  {isSyncing ? 'Syncing...' : `LIVE SYNC (${lastSyncTime})`}
                </span>
                <button
                  onClick={() => doSync(true)}
                  className="text-gray-400 hover:text-white transition-colors ml-0.5 p-1 rounded hover:bg-white/5"
                  title="Force refresh member data from central server"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white flex items-center gap-2 transition-all"
                title="Export real members to CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">EXPORT CSV</span>
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/10 hover:bg-red-600 text-white transition-colors"
                title="Close Dashboard"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dashboard Navigation Tabs */}
          <div className="flex items-center gap-2 py-3.5 border-b border-white/10 overflow-x-auto shrink-0" data-lenis-prevent>
            {[
              { id: 'metrics', label: 'LIVE CLUB METRICS', icon: Activity },
              { id: 'roster', label: `REGISTERED USERS & SESSIONS (${members.length})`, icon: Users },
              { id: 'activity', label: `LIVE ENTRY STREAM (${activities.length})`, icon: Radio },
              { id: 'overview', label: 'EXECUTIVE OVERVIEW', icon: BarChart3 },
              { id: 'classes', label: 'TRAINERS ON FLOOR', icon: Flame },
              { id: 'sensors', label: 'FACILITY SENSORS', icon: Cpu },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 ${
                    isActive
                      ? 'bg-red-600 text-white border border-red-400 shadow-[0_0_15px_#E50914]'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Real-Time Detection Notification Banner */}
          <AnimatePresence>
            {newAthleteAlert && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                className="mt-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-red-950/90 via-[#161622] to-emerald-950/90 border border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.3)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/20">
                    <Zap className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        {newAthleteAlert.type === 'USER_REGISTERED' ? 'NEW USER REGISTERED' : 'ATHLETE ENTERED / LOGGED IN'}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {newAthleteAlert.time}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-heading font-black text-white mt-0.5">
                      {newAthleteAlert.name} <span className="text-gray-400 font-mono text-xs font-normal">({newAthleteAlert.email})</span>
                      {newAthleteAlert.tier && (
                        <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-600/30 text-red-300 border border-red-500/40">
                          {newAthleteAlert.tier} Tier
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      setActiveTab('roster');
                      setNewAthleteAlert(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[11px] font-bold uppercase tracking-wider transition-all shadow-md"
                  >
                    VIEW IN ROSTER
                  </button>
                  <button
                    onClick={() => setNewAthleteAlert(null)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    title="Dismiss notification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Dashboard Body Viewport */}
          <div className="flex-1 overflow-y-auto pt-5 space-y-6 scrollbar-thin" data-lenis-prevent>
            {/* TAB 1: DEDICATED LIVE CLUB METRICS SECTION */}
            {activeTab === 'metrics' && (
              <div className="space-y-6">
                {/* Section Header Notice */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-red-950/20 border border-red-500/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
                      <Radio className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-widest">
                          ADMIN ONLY TELEMETRY
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                          LIVE SENSORS LINKED
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-heading font-black text-white">
                        PRAGATHI NAGAR HEADQUARTERS • LIVE FACILITY STATUS
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>Kukatpally, Hyderabad</span>
                  </div>
                </div>

                {/* Relocated LiveStatusBar Component */}
                <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02]">
                  <LiveStatusBar isDashboard={true} />
                </div>

                {/* Sub-section: Live Floor Zone Capacities */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-red-500" />
                      LIVE ARENA OCCUPANCY BREAKDOWN
                    </h4>
                    <span className="text-[10px] font-mono text-gray-400">
                      Total Active: 128 / 200 Max
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { zone: 'Weights & Power Pit', current: 84, max: 100, pct: '84%', color: 'bg-red-600' },
                      { zone: 'Cardio Deck & HIIT', current: 28, max: 50, pct: '56%', color: 'bg-amber-500' },
                      { zone: 'Cryo & Cold Plunge', current: 8, max: 15, pct: '53%', color: 'bg-blue-500' },
                      { zone: 'Combat & Boxing Octagon', current: 8, max: 20, pct: '40%', color: 'bg-emerald-500' },
                    ].map((z, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-heading font-bold text-white">{z.zone}</span>
                          <span className="font-mono text-red-400 font-bold">{z.pct}</span>
                        </div>
                        <div className="text-[11px] font-mono text-gray-400 mb-2">
                          {z.current} / {z.max} Athletes
                        </div>
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${z.color}`} style={{ width: z.pct }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub-section: Facility Systems & Environmental Health */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] font-mono text-gray-400 block uppercase">CRYO CHAMBER</span>
                    <span className="font-heading font-black text-xl text-blue-400">-2.5 °C</span>
                    <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">● Sub-Zero Nominal</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] font-mono text-gray-400 block uppercase">INFRARED SAUNA</span>
                    <span className="font-heading font-black text-xl text-amber-400">72.0 °C</span>
                    <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">● Optimal Thermal</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] font-mono text-gray-400 block uppercase">SOUND PRESSURE</span>
                    <span className="font-heading font-black text-xl text-red-500">84.5 dB</span>
                    <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">● 128 BPM Club Sync</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] font-mono text-gray-400 block uppercase">BIOMETRIC TURNSTILES</span>
                    <span className="font-heading font-black text-xl text-emerald-400">4 / 4 ONLINE</span>
                    <span className="text-[10px] font-mono text-gray-400 block mt-0.5">Zero Queues</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: REGISTERED USERS & SESSIONS (REAL DATA ONLY, ZERO FAKE DATASETS) */}
            {activeTab === 'roster' && (
              <div className="space-y-4">
                {/* Search Bar & Action Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search real user by name, email or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setShowAddMemberModal(true)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>REGISTER MEMBER</span>
                    </button>
                  </div>
                </div>

                {/* Dynamic Counter Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                    <span className="text-[10px] font-mono text-gray-400 block">TOTAL REGISTERED</span>
                    <span className="font-heading font-black text-lg text-white">{totalRegisteredUsers}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                    <span className="text-[10px] font-mono text-gray-400 block">CURRENTLY LOGGED IN</span>
                    <span className="font-heading font-black text-lg text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      {currentlyLoggedInCount}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                    <span className="text-[10px] font-mono text-gray-400 block">ACTIVE MEMBERSHIPS</span>
                    <span className="font-heading font-black text-lg text-blue-400">{activeMembershipsCount}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                    <span className="text-[10px] font-mono text-gray-400 block">EXPIRED MEMBERSHIPS</span>
                    <span className="font-heading font-black text-lg text-red-400">{expiredMembershipsCount}</span>
                  </div>
                </div>

                {/* Member Roster Table Or Empty State */}
                {filteredMembers.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                    <Users className="w-12 h-12 text-gray-600 mb-3" />
                    <h4 className="text-white font-heading font-black text-lg">NO REGISTERED MEMBERS YET</h4>
                    <p className="text-xs font-mono text-gray-400 max-w-md mt-1 leading-relaxed">
                      No fake dataset examples are loaded. As real users create new accounts or log in via the Login / Sign Up portal, their real-time session, credentials, and membership expiry status will be tracked here live.
                    </p>
                    <button
                      onClick={() => setShowAddMemberModal(true)}
                      className="mt-4 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-bold tracking-wider transition-colors"
                    >
                      + REGISTER FIRST MEMBER MANUALLY
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/5 text-[10px] font-mono uppercase text-gray-400">
                            <th className="p-3.5">MEMBER ID</th>
                            <th className="p-3.5">NAME & CONTACT</th>
                            <th className="p-3.5">TIER</th>
                            <th className="p-3.5">ACCOUNT CREATED</th>
                            <th className="p-3.5">LOGIN STATUS</th>
                            <th className="p-3.5">MEMBERSHIP VALIDITY</th>
                            <th className="p-3.5 text-right">ADMIN ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs">
                          {filteredMembers.map((m) => {
                            const isCurrentActive = isMemberOnline(m);
                            const isExp = m.isExpired || (m.membershipExpiryTimestamp ? Date.now() > m.membershipExpiryTimestamp : false);
                            const isNewlyAdded = newlyAddedId === m.id;

                            return (
                              <tr
                                key={m.id}
                                className={`transition-all ${
                                  isNewlyAdded
                                    ? 'bg-emerald-950/20 border-l-2 border-emerald-500'
                                    : 'hover:bg-white/[0.04]'
                                }`}
                              >
                                <td className="p-3.5 font-mono font-bold text-red-400">{m.id}</td>
                                <td className="p-3.5">
                                  <span className="font-heading font-extrabold text-white block flex items-center gap-2">
                                    {m.name}
                                    {isNewlyAdded && (
                                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                        NEW
                                      </span>
                                    )}
                                  </span>
                                  <span className="text-[11px] font-mono text-gray-400 block">{m.email}</span>
                                  {m.fitnessGoal && (
                                    <span className="text-[10px] font-mono text-gray-500 block">Goal: {m.fitnessGoal}</span>
                                  )}
                                </td>
                                <td className="p-3.5">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                                      m.tier === 'Elite VIP'
                                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                                        : m.tier === 'Performance'
                                        ? 'bg-red-950/60 text-red-300 border-red-500/40'
                                        : 'bg-white/10 text-gray-300 border-white/10'
                                    }`}
                                  >
                                    {m.tier}
                                  </span>
                                </td>
                                <td className="p-3.5">
                                  <span className="font-mono text-gray-300 text-xs block">{m.joinedDate}</span>
                                  <span className="text-[10px] font-mono text-gray-500">Account Registered</span>
                                </td>
                                <td className="p-3.5">
                                  {isCurrentActive ? (
                                    <div className="flex items-center gap-2">
                                      <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                                      </span>
                                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-black tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                                        LOGGED IN NOW
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[11px]">
                                      <span className="h-2 w-2 rounded-full bg-gray-600" />
                                      <span>Offline ({m.lastLogin || 'Never'})</span>
                                    </div>
                                  )}
                                </td>
                                <td className="p-3.5">
                                  {isExp ? (
                                    <div className="flex flex-col gap-1">
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950/80 text-red-400 border border-red-500/50 w-fit">
                                        <AlertTriangle className="w-3 h-3 text-red-500" />
                                        EXPIRED
                                      </span>
                                      <span className="text-[10px] font-mono text-gray-400">
                                        {m.membershipExpiryDate ? `Expired: ${m.membershipExpiryDate}` : 'Membership Expired'}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col gap-1">
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/50 w-fit">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                        ACTIVE PLAN
                                      </span>
                                      <span className="text-[10px] font-mono text-gray-400">
                                        {m.membershipExpiryDate ? `Valid till: ${m.membershipExpiryDate}` : 'Active Plan'}
                                      </span>
                                    </div>
                                  )}
                                </td>
                                <td className="p-3.5 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleToggleExpire(m.id, isExp)}
                                      className={`px-2.5 py-1 rounded-lg font-mono text-[10px] uppercase transition-all flex items-center gap-1 border ${
                                        isExp
                                          ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 hover:bg-emerald-600 hover:text-white'
                                          : 'bg-amber-950/70 border-amber-500/50 text-amber-300 hover:bg-amber-600 hover:text-white'
                                      }`}
                                      title={isExp ? 'Renew membership by 30 days' : 'Expire membership immediately'}
                                    >
                                      <RefreshCw className="w-3 h-3" />
                                      <span>{isExp ? 'Renew (+30d)' : 'Expire'}</span>
                                    </button>

                                    <button
                                      onClick={() => handleDelete(m.id, m.name)}
                                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-600 text-gray-400 hover:text-white transition-colors"
                                      title="Delete user"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: LIVE ACTIVITY & ENTRY AUDIT STREAM */}
            {activeTab === 'activity' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
                      <Radio className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-widest block">
                        CROSS-DEVICE TELEMETRY STREAM
                      </span>
                      <h3 className="text-base sm:text-lg font-heading font-black text-white">
                        REAL-TIME USER ENTRIES & REGISTRATIONS
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-400">
                      Tracking all devices live
                    </span>
                    <button
                      onClick={() => doSync(true)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-white border border-white/10 flex items-center gap-1.5 transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {activities.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                    <Radio className="w-12 h-12 text-gray-600 mb-3 animate-pulse" />
                    <h4 className="text-white font-heading font-black text-lg">LISTENING FOR ATHLETE ENTRIES</h4>
                    <p className="text-xs font-mono text-gray-400 max-w-md mt-1 leading-relaxed">
                      The telemetry stream is active and monitoring all connected laptops and mobile devices. When an athlete signs up, enters, or renews from any machine, their event will stream here instantly in real-time.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {activities.map((act) => {
                      const isReg = act.type === 'USER_REGISTERED';
                      const isRenew = act.type === 'MEMBERSHIP_RENEWED';
                      return (
                        <motion.div
                          key={act.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
                        >
                          <div className="flex items-center gap-3.5">
                            <div
                              className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                                isReg
                                  ? 'bg-blue-950/60 border-blue-500/40 text-blue-400'
                                  : isRenew
                                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-400'
                                  : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                              }`}
                            >
                              {isReg ? <Users className="w-5 h-5" /> : isRenew ? <RefreshCw className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                    isReg
                                      ? 'bg-blue-950/80 border-blue-500/40 text-blue-300'
                                      : isRenew
                                      ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                                      : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                                  }`}
                                >
                                  {isReg ? 'New Account Created' : isRenew ? 'Membership Renewed' : 'Athlete Entered / Logged In'}
                                </span>
                                <span className="text-[10px] font-mono text-gray-500">
                                  {act.formattedTime} • {act.date}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-heading font-extrabold text-sm text-white">{act.member.name}</span>
                                <span className="text-xs font-mono text-gray-400">({act.member.email})</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-gray-300">
                              {act.member.tier} Tier
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: EXECUTIVE OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 4 Dynamic Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest">REGISTERED USERS</span>
                      <Users className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="font-heading font-black text-3xl text-white">{totalRegisteredUsers}</span>
                    <span className="text-[10px] font-mono text-blue-400 mt-1">Authentic Database Records</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest">ACTIVE MEMBERS</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="font-heading font-black text-3xl text-emerald-400">{activeMembershipsCount}</span>
                    <span className="text-[10px] font-mono text-emerald-400 mt-1">Unexpired Valid Passholders</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest">EXPIRED MEMBERSHIPS</span>
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="font-heading font-black text-3xl text-red-400">{expiredMembershipsCount}</span>
                    <span className="text-[10px] font-mono text-red-400 mt-1">Requires Renewal</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest">FLOOR OCCUPANCY</span>
                      <Activity className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="font-heading font-black text-3xl text-white">128 / 200</span>
                    <span className="text-[10px] font-mono text-amber-400 mt-1">Pragathi Nagar HQ</span>
                  </div>
                </div>

                {/* Live Activity & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Chart Simulation */}
                  <div className="lg:col-span-8 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                        HOURLY FLOOR TRAFFIC (06:00 AM - 10:00 PM)
                      </h3>
                      <span className="text-[10px] font-mono text-red-500 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">
                        LIVE PULSE
                      </span>
                    </div>

                    <div className="h-48 flex items-end justify-between gap-2 pt-6">
                      {[35, 48, 85, 92, 60, 45, 78, 100, 95, 88, 70, 40, 25].map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                          <div
                            className="w-full bg-gradient-to-t from-red-950 via-red-600 to-red-400 rounded-t-md transition-all duration-500 group-hover:brightness-125"
                            style={{ height: `${val}%` }}
                          />
                          <span className="text-[9px] font-mono text-gray-500">
                            {6 + i < 10 ? `0${6 + i}` : 6 + i}:00
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Quick Controls */}
                  <div className="lg:col-span-4 p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white mb-4">
                      QUICK ADMIN ACTIONS
                    </h3>

                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveTab('metrics')}
                        className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 border border-white/10"
                      >
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <span>VIEW LIVE CLUB METRICS</span>
                      </button>

                      <button
                        onClick={() => setShowAddMemberModal(true)}
                        className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Plus className="w-4 h-4" />
                        <span>REGISTER NEW MEMBER</span>
                      </button>

                      <button
                        onClick={handleExportCSV}
                        className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 border border-white/10"
                      >
                        <Download className="w-4 h-4 text-blue-400" />
                        <span>EXPORT MEMBERS CSV</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: CLASS & FLOOR ROSTER */}
            {activeTab === 'classes' && (
              <div className="space-y-4">
                <h3 className="text-sm font-mono font-bold uppercase text-white mb-2">
                  LIVE FLOOR TRAINER ROSTER & SCHEDULE SHIFTS
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { trainer: 'Arjun Sharma', role: 'Head of Strength', status: 'ON FLOOR NOW', clientCount: 6 },
                    { trainer: 'Vikram Rathore', role: 'Physique Lead', status: 'AVAILABLE', clientCount: 4 },
                    { trainer: 'Maya Lin', role: 'CrossFit Lead', status: 'IN CLASS (METCON)', clientCount: 14 },
                    { trainer: 'Marcus Vance', role: 'Boxing Lead', status: 'SHIFT STARTS 04:00 PM', clientCount: 0 },
                  ].map((t, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                      <div>
                        <h4 className="font-heading font-extrabold text-base text-white">{t.trainer}</h4>
                        <span className="text-xs font-mono text-gray-400 block">{t.role}</span>
                        <span className="text-[10px] font-mono text-emerald-400 mt-1 block">Active Load: {t.clientCount} Athletes</span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 font-mono text-[10px] font-bold">
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: FACILITY SENSOR NODES */}
            {activeTab === 'sensors' && (
              <div className="space-y-4">
                <h3 className="text-sm font-mono font-bold uppercase text-white mb-2">
                  ENVIRONMENTAL & ARENA SENSOR NODES
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] font-mono text-gray-400 block">CRYO CHAMBER TEMP</span>
                    <span className="font-heading font-black text-2xl text-blue-400">-2.5 °C</span>
                    <span className="text-[10px] font-mono text-emerald-400 block mt-1">● NOMINAL</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] font-mono text-gray-400 block">INFRARED SAUNA TEMP</span>
                    <span className="font-heading font-black text-2xl text-amber-400">72.0 °C</span>
                    <span className="text-[10px] font-mono text-emerald-400 block mt-1">● NOMINAL</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] font-mono text-gray-400 block">AUDIO SOUND PRESSURE</span>
                    <span className="font-heading font-black text-2xl text-red-500">84.5 dB</span>
                    <span className="text-[10px] font-mono text-emerald-400 block mt-1">● OPTIMAL BEAT</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Add Member Sub-Modal Overlay */}
          {showAddMemberModal && (
            <div className="fixed inset-0 z-[10010] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-[#0F0F16] border border-white/20 p-6 rounded-3xl shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-black text-lg text-white">REGISTER NEW MEMBER</h3>
                  <button onClick={() => setShowAddMemberModal(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleAddMember} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">MEMBER FULL NAME *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">EMAIL ADDRESS *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. vikram@shrex.club"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">MEMBERSHIP TIER</label>
                    <select
                      value={newTier}
                      onChange={(e) => setNewTier(e.target.value as any)}
                      className="w-full bg-[#0D0D12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Essential">Essential (₹1,499/mo)</option>
                      <option value="Performance">Performance (₹2,999/mo)</option>
                      <option value="Elite VIP">Elite VIP (₹5,999/mo)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">PRIMARY FITNESS GOAL</label>
                    <select
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      className="w-full bg-[#0D0D12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Hypertrophy & Muscle Building">Hypertrophy & Muscle Building</option>
                      <option value="Fat Loss & Caloric Deficit">Fat Loss & Caloric Deficit</option>
                      <option value="Strength & Powerlifting Peak">Strength & Powerlifting Peak</option>
                      <option value="Cardiovascular Endurance">Cardiovascular Endurance</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 font-heading font-extrabold text-xs uppercase tracking-widest text-white shadow-lg transition-all"
                  >
                    ADD TO REAL DATABASE
                  </button>
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
