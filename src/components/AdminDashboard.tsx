import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Shield, Users, DollarSign, Activity, AlertTriangle, CheckCircle2,
  Search, Plus, Download, RefreshCw, Cpu, Flame, Zap, BarChart3, Settings
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MemberRecord {
  id: string;
  name: string;
  email: string;
  tier: 'Essential' | 'Performance' | 'Elite VIP';
  status: 'Active' | 'Pending' | 'Expired';
  checkIn: string;
  joinedDate: string;
}

const INITIAL_MEMBERS: MemberRecord[] = [
  { id: 'AK-9041', name: 'Rohan Mehta', email: 'rohan@mehta.com', tier: 'Elite VIP', status: 'Active', checkIn: '09:14 AM Today', joinedDate: '12 Jan 2025' },
  { id: 'AK-8820', name: 'Ananya Roy', email: 'ananya@roy.com', tier: 'Performance', status: 'Active', checkIn: '08:30 AM Today', joinedDate: '04 Mar 2025' },
  { id: 'AK-7712', name: 'Karan Malhotra', email: 'karan@malhotra.dev', tier: 'Elite VIP', status: 'Active', checkIn: '10:02 AM Today', joinedDate: '18 Nov 2024' },
  { id: 'AK-6540', name: 'Dr. Sneha Reddy', email: 'sneha@reddy.org', tier: 'Performance', status: 'Active', checkIn: '07:45 AM Today', joinedDate: '01 Feb 2026' },
  { id: 'AK-5411', name: 'Aditya Verma', email: 'aditya@verma.io', tier: 'Essential', status: 'Active', checkIn: 'Yesterday', joinedDate: '15 Aug 2025' },
  { id: 'AK-4320', name: 'Priya Sharma', email: 'priya@sharma.com', tier: 'Essential', status: 'Pending', checkIn: '2 Days Ago', joinedDate: '24 Aug 2026' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'roster' | 'classes' | 'sensors'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<MemberRecord[]>(INITIAL_MEMBERS);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // New Member Form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTier, setNewTier] = useState<'Essential' | 'Performance' | 'Elite VIP'>('Performance');

  if (!isOpen) return null;

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newRec: MemberRecord = {
      id: `AK-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newName,
      email: newEmail,
      tier: newTier,
      status: 'Active',
      checkIn: 'Just Now',
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setMembers([newRec, ...members]);
    setShowAddMemberModal(false);
    setNewName('');
    setNewEmail('');

    confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Name,Email,Tier,Status,CheckIn,JoinedDate']
        .concat(members.map((m) => `${m.id},"${m.name}",${m.email},${m.tier},${m.status},${m.checkIn},${m.joinedDate}`))
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SHREX_Member_Roster_${Date.now()}.csv`);
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
        className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-6xl max-h-[92vh] glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl bg-[#09090E] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-red-600 text-white shadow-[0_0_20px_rgba(229,9,20,0.6)]">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-red-500 font-bold uppercase tracking-widest block">
                  COMMAND CENTER • PRIVILEGED ACCESS
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight flex items-center gap-2">
                  SHREX <span className="text-gradient-red">ADMIN DASHBOARD</span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white flex items-center gap-2 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">EXPORT CSV</span>
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/10 hover:bg-red-600 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dashboard Navigation Tabs */}
          <div className="flex items-center gap-2 py-4 border-b border-white/10 overflow-x-auto shrink-0" data-lenis-prevent>
            {[
              { id: 'overview', label: 'OVERVIEW & TELEMETRY', icon: BarChart3 },
              { id: 'roster', label: `MEMBER ROSTER (${members.length})`, icon: Users },
              { id: 'classes', label: 'CLASS & FLOOR ROSTER', icon: Flame },
              { id: 'sensors', label: 'FACILITY SENSOR NODES', icon: Cpu },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 ${
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

          {/* Main Dashboard Body Viewport */}
          <div className="flex-1 overflow-y-auto pt-6 space-y-6 scrollbar-thin" data-lenis-prevent>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 4 Telemetry Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest">MONTHLY REVENUE</span>
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="font-heading font-black text-3xl text-white">₹24,50,000</span>
                    <span className="text-[10px] font-mono text-emerald-400 mt-1">↑ +18.4% vs last month</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest">ACTIVE MEMBERS</span>
                      <Users className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="font-heading font-black text-3xl text-white">1,248</span>
                    <span className="text-[10px] font-mono text-blue-400 mt-1">94 Elite VIP • 312 Performance</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest">FLOOR OCCUPANCY</span>
                      <Activity className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="font-heading font-black text-3xl text-white">128 / 200</span>
                    <span className="text-[10px] font-mono text-amber-400 mt-1">64% Capacity (Peak Hours)</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest">EQUIPMENT HEALTH</span>
                      <Zap className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="font-heading font-black text-3xl text-emerald-400">99.2%</span>
                    <span className="text-[10px] font-mono text-gray-400 mt-1">All Racks Calibrated</span>
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
                        onClick={() => setShowAddMemberModal(true)}
                        className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Plus className="w-4 h-4" />
                        <span>REGISTER NEW MEMBER</span>
                      </button>

                      <button
                        onClick={() => alert('Broadcast Announcement Sent to 1,248 Members!')}
                        className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase flex items-center justify-center gap-2"
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>BROADCAST ANNOUNCEMENT</span>
                      </button>

                      <button
                        onClick={handleExportCSV}
                        className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4 text-blue-400" />
                        <span>EXPORT MEMBER ROSTER CSV</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'roster' && (
              <div className="space-y-4">
                {/* Search Bar & Add Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search member by name, email or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD MEMBER</span>
                  </button>
                </div>

                {/* Member Roster Table */}
                <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 text-[10px] font-mono uppercase text-gray-400">
                        <th className="p-3.5">MEMBER ID</th>
                        <th className="p-3.5">NAME & EMAIL</th>
                        <th className="p-3.5">TIER</th>
                        <th className="p-3.5">STATUS</th>
                        <th className="p-3.5">LAST CHECK-IN</th>
                        <th className="p-3.5 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {filteredMembers.map((m) => (
                        <tr key={m.id} className="hover:bg-white/[0.04] transition-colors">
                          <td className="p-3.5 font-mono font-bold text-red-400">{m.id}</td>
                          <td className="p-3.5">
                            <span className="font-heading font-extrabold text-white block">{m.name}</span>
                            <span className="text-[11px] font-mono text-gray-400">{m.email}</span>
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
                            <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              {m.status}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-gray-300">{m.checkIn}</td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => alert(`Granted VIP Pass to ${m.name}`)}
                              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-red-600 text-white font-mono text-[10px] uppercase transition-colors"
                            >
                              GRANT ACCESS
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

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
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">MEMBER NAME</label>
                    <input
                      type="text"
                      required
                      placeholder="Vikram Sharma"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      required
                      placeholder="vikram@example.com"
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
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 font-heading font-extrabold text-xs uppercase tracking-widest text-white shadow-lg"
                  >
                    ADD MEMBER TO DATABASE
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
