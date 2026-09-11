import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Lock,
  User,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Flame,
  KeyRound,
  LogOut,
  Target,
  Calendar,
  Clock,
  AlertTriangle,
  RefreshCw,
  Key
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  tier?: 'Essential' | 'Performance' | 'Elite VIP' | 'Guest';
  fitnessGoal?: string;
  joinedDate?: string;
  joinedTimestamp?: number;
  membershipExpiryDate?: string;
  membershipExpiryTimestamp?: number;
  isExpired?: boolean;
}

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
}

const FAKE_EMAILS = [
  'rohan@mehta.com',
  'ananya@roy.com',
  'karan@malhotra.dev',
  'sneha@reddy.org',
  'aditya@verma.io',
  'priya@sharma.com',
  'member@shrex.com',
  'vip@shrex.com',
  'test@shrex.com',
  'vikram@example.com',
  'arjun@example.com'
];

export const getStoredMembers = (): MemberRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('shrex_members_db');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Strict filter: genuine user records only, no fake mock accounts
    return parsed.filter(
      (m) =>
        m &&
        m.email &&
        m.name &&
        m.role === 'user' &&
        !FAKE_EMAILS.includes(m.email.toLowerCase())
    );
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const saveStoredMembers = (members: MemberRecord[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('shrex_members_db', JSON.stringify(members));
    window.dispatchEvent(new Event('shrex_members_updated'));
  } catch (e) {
    console.error(e);
  }
};

export const renewMemberMembership = (id: string, days: number = 30) => {
  const members = getStoredMembers();
  const updated = members.map((m) => {
    if (m.id === id) {
      const now = Date.now();
      const baseTime = m.membershipExpiryTimestamp && m.membershipExpiryTimestamp > now
        ? m.membershipExpiryTimestamp
        : now;
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
  saveStoredMembers(updated);
  return updated;
};

export const expireMemberMembership = (id: string) => {
  const members = getStoredMembers();
  const updated = members.map((m) => {
    if (m.id === id) {
      return {
        ...m,
        isExpired: true,
        membershipExpiryDate: 'Expired by Admin (' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ')',
      };
    }
    return m;
  });
  saveStoredMembers(updated);
  return updated;
};

export const deleteStoredMember = (id: string) => {
  const members = getStoredMembers();
  const updated = members.filter((m) => m.id !== id);
  saveStoredMembers(updated);
  return updated;
};

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onLogin: (user: AuthUser) => void;
  onLogout: () => void;
  initialTab?: 'login' | 'signup' | 'admin' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  initialTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'admin' | 'forgot'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupGoal, setSignupGoal] = useState('Hypertrophy & Muscle Building');
  const [signupTier, setSignupTier] = useState<'Essential' | 'Performance' | 'Elite VIP'>('Performance');

  // Admin access state
  const [adminCode, setAdminCode] = useState('');
  const [adminKey, setAdminKey] = useState('');

  // Forgot Password / OTP Verification State
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'new_password'>('email');
  const [resetEmail, setResetEmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpDispatchedNotice, setOtpDispatchedNotice] = useState<{
    email: string;
    time: string;
  } | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
    setErrorMessage('');
    setSuccessMessage('');
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setInterval(() => {
      setOtpCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCountdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const trimmed = resetEmail.trim().toLowerCase();

    if (!trimmed) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    const members = getStoredMembers();
    const existing = members.find((m) => m.email.trim().toLowerCase() === trimmed);
    if (!existing) {
      setErrorMessage('No registered account found with this email. Please check the spelling or sign up.');
      return;
    }

    // Generate random 6-digit OTP code (private, never revealed in UI)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setEnteredOtp('');
    setOtpCountdown(60);
    setIsSendingOtp(true);

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOtpDispatchedNotice({
      email: trimmed,
      time: nowTime,
    });

    // Output to developer console for local testing assistance
    console.info(
      `%c[SHREX SECURITY] 🔐 Verification OTP: ${code} dispatched to ${trimmed}`,
      'color: #10b981; font-weight: bold; font-size: 13px; background: #0A0A0F; padding: 4px 8px; border: 1px solid #10b981; border-radius: 4px;'
    );

    // Dispatch to server email endpoint (Nodemailer / Resend)
    try {
      await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, otp: code }),
      });
    } catch (err) {
      console.warn('API send-otp unreachable, verification remains active locally', err);
    } finally {
      setIsSendingOtp(false);
    }

    setSuccessMessage(`A 6-digit security OTP has been sent to ${trimmed}`);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
    setForgotStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const trimmedOtp = enteredOtp.trim();

    if (!trimmedOtp) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    if (trimmedOtp !== generatedOtp) {
      setErrorMessage('Invalid verification code. Please check the OTP sent to your email.');
      return;
    }

    setSuccessMessage('OTP verified successfully! Please enter your new password.');
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.5 } });
    setForgotStep('new_password');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please ensure both fields match.');
      return;
    }

    const members = getStoredMembers();
    const memberIndex = members.findIndex((m) => m.email.toLowerCase() === resetEmail.trim().toLowerCase());

    if (memberIndex < 0) {
      setErrorMessage('Account not found in database. Please try again.');
      return;
    }

    // Update password in real database
    members[memberIndex].password = newPassword;
    saveStoredMembers(members);

    setSuccessMessage('Password updated successfully! You can now log in with your new password.');
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });

    // Set credentials in login form for instant sign in
    setLoginEmail(resetEmail);
    setLoginPassword(newPassword);

    setTimeout(() => {
      setActiveTab('login');
      setForgotStep('email');
      setOtpDispatchedNotice(null);
      setNewPassword('');
      setConfirmPassword('');
      setEnteredOtp('');
    }, 1500);
  };

  const handleResendOtp = async () => {
    if (otpCountdown > 0 || isSendingOtp) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const trimmed = resetEmail.trim().toLowerCase();
    setGeneratedOtp(code);
    setOtpCountdown(60);
    setIsSendingOtp(true);

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOtpDispatchedNotice({
      email: trimmed,
      time: nowTime,
    });

    console.info(
      `%c[SHREX SECURITY] 🔐 Verification OTP Resent: ${code} dispatched to ${trimmed}`,
      'color: #10b981; font-weight: bold; font-size: 13px; background: #0A0A0F; padding: 4px 8px; border: 1px solid #10b981; border-radius: 4px;'
    );

    try {
      await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, otp: code }),
      });
    } catch (err) {
      console.warn('API send-otp unreachable', err);
    } finally {
      setIsSendingOtp(false);
    }

    setSuccessMessage('A fresh 6-digit verification OTP has been dispatched to your email.');
  };

  // When logged in as member, compute membership validity and countdown
  const now = Date.now();
  const expiryTs = currentUser?.membershipExpiryTimestamp || (now + 30 * 24 * 60 * 60 * 1000);
  const isMemberExpired = currentUser?.isExpired || now > expiryTs;
  const daysRemaining = Math.max(0, Math.ceil((expiryTs - now) / (1000 * 60 * 60 * 24)));
  const progressPct = isMemberExpired ? 0 : Math.min(100, Math.max(5, (daysRemaining / 30) * 100));

  const handleUserSelfRenew = () => {
    if (!currentUser) return;
    const updated = renewMemberMembership(currentUser.id, 30);
    const renewed = updated.find((m) => m.id === currentUser.id);
    if (renewed) {
      onLogin({
        ...currentUser,
        isExpired: false,
        membershipExpiryDate: renewed.membershipExpiryDate,
        membershipExpiryTimestamp: renewed.membershipExpiryTimestamp,
      });
      setSuccessMessage('Membership renewed successfully (+30 Days)!');
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
      setTimeout(() => setSuccessMessage(''), 2500);
    }
  };

  if (!isOpen) return null;

  const handleMemberLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = loginEmail.trim().toLowerCase();
    const trimmedPassword = loginPassword.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    // Check if admin credentials were typed into normal login
    if (
      trimmedPassword === '20078' ||
      (trimmedEmail.includes('admin') && (trimmedPassword === 'admin' || trimmedPassword === '20078'))
    ) {
      const adminUser: AuthUser = {
        id: 'ADM-001',
        name: 'Admin Shreyas',
        email: trimmedEmail || 'admin@shrex.club',
        role: 'admin',
        tier: 'Elite VIP',
        joinedDate: '01 Jan 2024',
      };
      onLogin(adminUser);
      setSuccessMessage('Welcome back, Admin!');
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1000);
      return;
    }

    // Verify against registered accounts database
    const members = getStoredMembers();
    const existingUser = members.find((u) => u.email.trim().toLowerCase() === trimmedEmail);

    if (!existingUser) {
      setErrorMessage('No account found with this email. Please sign up first.');
      return;
    }

    // Verify password if set
    if (existingUser.password && existingUser.password !== trimmedPassword) {
      setErrorMessage('Incorrect password. Please try again.');
      return;
    }

    // Update member last active timestamp
    existingUser.lastLogin = 'Just Now';
    saveStoredMembers(members);

    const now = Date.now();
    const fallbackExpiryTs = now + 30 * 24 * 60 * 60 * 1000;
    const expiryTimestamp = existingUser.membershipExpiryTimestamp || fallbackExpiryTs;
    const expiryDate = existingUser.membershipExpiryDate || new Date(expiryTimestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const isExp = existingUser.isExpired || now > expiryTimestamp;

    // Successfully found account and verified credentials
    const user: AuthUser = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role || 'user',
      tier: existingUser.tier || 'Performance',
      fitnessGoal: existingUser.fitnessGoal,
      joinedDate: existingUser.joinedDate,
      joinedTimestamp: existingUser.joinedTimestamp || now,
      membershipExpiryDate: expiryDate,
      membershipExpiryTimestamp: expiryTimestamp,
      isExpired: isExp,
    };

    onLogin(user);
    setSuccessMessage(`Welcome back, ${user.name}!`);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.5 } });
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1000);
  };

  const handleMemberSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedName = signupName.trim();
    const trimmedEmail = signupEmail.trim().toLowerCase();
    const trimmedPassword = signupPassword.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      setErrorMessage('Please provide your name, email, and password.');
      return;
    }

    // Check if account already exists
    const members = getStoredMembers();
    const existing = members.find((u) => u.email.trim().toLowerCase() === trimmedEmail);
    if (existing) {
      setErrorMessage('An account with this email already exists. Please log in.');
      return;
    }

    const now = Date.now();
    const expiryTimestamp = now + 30 * 24 * 60 * 60 * 1000;
    const expiryDate = new Date(expiryTimestamp).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const newMember: MemberRecord = {
      id: `MEM-${Math.floor(1000 + Math.random() * 9000)}`,
      name: trimmedName,
      email: trimmedEmail,
      password: trimmedPassword,
      role: 'user',
      tier: signupTier,
      fitnessGoal: signupGoal,
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      joinedTimestamp: now,
      membershipExpiryDate: expiryDate,
      membershipExpiryTimestamp: expiryTimestamp,
      isExpired: false,
      lastLogin: 'Just Now',
    };

    // Save newly created real account into database
    saveStoredMembers([newMember, ...members.filter((m) => m.email.toLowerCase() !== trimmedEmail)]);

    const authUser: AuthUser = {
      id: newMember.id,
      name: newMember.name,
      email: newMember.email,
      role: 'user',
      tier: newMember.tier,
      fitnessGoal: newMember.fitnessGoal,
      joinedDate: newMember.joinedDate,
      joinedTimestamp: newMember.joinedTimestamp,
      membershipExpiryDate: newMember.membershipExpiryDate,
      membershipExpiryTimestamp: newMember.membershipExpiryTimestamp,
      isExpired: false,
    };

    onLogin(authUser);
    setSuccessMessage(`Welcome to Shrex Club, ${newMember.name}! Your account is registered.`);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1200);
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const entered = (adminCode || adminKey).trim();

    if (entered === '20078' || entered.toLowerCase() === 'admin') {
      const adminUser: AuthUser = {
        id: 'ADM-001',
        name: 'Admin Shreyas',
        email: 'admin@shrex.club',
        role: 'admin',
        tier: 'Elite VIP',
        joinedDate: 'Founder & Head Administrator',
      };
      onLogin(adminUser);
      setSuccessMessage('Admin Access Verified! Admin Dashboard Unlocked.');
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.4 } });
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1000);
    } else {
      setErrorMessage('Invalid Admin Security Passcode. Access denied.');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-lg bg-[#0A0A0F] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-red-900/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-20 border border-white/10"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* If already logged in */}
          {currentUser ? (
            <div className="space-y-6 pt-2">
              <div className="flex items-center gap-4 pb-5 border-b border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-950 p-[2px] shadow-lg shadow-red-600/20">
                  <div className="w-full h-full bg-[#0E0E14] rounded-[14px] flex items-center justify-center">
                    {currentUser.role === 'admin' ? (
                      <Shield className="w-7 h-7 text-red-500" />
                    ) : (
                      <User className="w-7 h-7 text-red-500" />
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-extrabold text-xl text-white">
                      {currentUser.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold tracking-wider ${
                        currentUser.role === 'admin'
                          ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(229,9,20,0.6)]'
                          : 'bg-white/10 text-gray-300 border border-white/15'
                      }`}
                    >
                      {currentUser.role === 'admin' ? 'ADMIN' : currentUser.tier || 'MEMBER'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{currentUser.email}</p>
                </div>
              </div>

              {/* Membership Dates & Validity Card (Prominently displayed for logged-in members) */}
              {currentUser.role === 'user' && (
                <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#12121A] to-[#0A0A0F] border border-white/15 shadow-xl relative overflow-hidden space-y-4">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Header row: Tier and Status Badge */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">
                        MEMBERSHIP STATUS
                      </span>
                      <span className="font-heading font-black text-base text-white">
                        {currentUser.tier || 'Performance VIP'} Plan
                      </span>
                    </div>

                    {isMemberExpired ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-red-950/80 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(229,9,20,0.4)]">
                        <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />
                        MEMBERSHIP EXPIRED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        ACTIVE PLAN
                      </span>
                    )}
                  </div>

                  {/* Date Grid: Joined and Expiration Date */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                      <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-mono uppercase mb-1">
                        <Calendar className="w-3 h-3 text-red-400" />
                        <span>MEMBER SINCE</span>
                      </div>
                      <span className="font-mono text-white text-xs font-bold block truncate">
                        {currentUser.joinedDate || 'Active 2026'}
                      </span>
                      <span className="text-[9px] font-mono text-gray-500">Account Registered</span>
                    </div>

                    <div className={`p-3 rounded-xl border ${isMemberExpired ? 'bg-red-950/20 border-red-500/40' : 'bg-white/[0.03] border-white/10'}`}>
                      <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-mono uppercase mb-1">
                        <Clock className={`w-3 h-3 ${isMemberExpired ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`} />
                        <span>EXPIRATION DATE</span>
                      </div>
                      <span className={`font-mono text-xs font-bold block truncate ${isMemberExpired ? 'text-red-400' : 'text-emerald-400'}`}>
                        {currentUser.membershipExpiryDate || 'In 30 Days'}
                      </span>
                      <span className="text-[9px] font-mono text-gray-400">
                        {isMemberExpired ? 'Access Suspended' : `${daysRemaining} Days Remaining`}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar & Countdown Banner */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-gray-400">Billing Cycle Validity</span>
                      <span className={isMemberExpired ? 'text-red-400 font-bold' : 'text-white font-bold'}>
                        {isMemberExpired ? 'Expired' : `${daysRemaining} of 30 Days Remaining`}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${isMemberExpired ? 'bg-red-600' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Renew button if expired */}
                  {isMemberExpired ? (
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-left">
                        <span className="text-xs font-heading font-bold text-white block">RENEW YOUR MEMBERSHIP</span>
                        <span className="text-[10px] font-mono text-gray-300">Renew +30 days of unhindered gym floor & recovery access.</span>
                      </div>
                      <button
                        onClick={handleUserSelfRenew}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-heading font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/40 border border-red-500/50 transition-all shrink-0"
                      >
                        RENEW PLAN (+30d)
                      </button>
                    </div>
                  ) : daysRemaining <= 10 && (
                    <button
                      onClick={handleUserSelfRenew}
                      className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs uppercase font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Extend Membership by +30 Days</span>
                    </button>
                  )}
                </div>
              )}

              {/* Account Details Box */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Account ID:</span>
                  <span className="text-white font-bold">{currentUser.id}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Membership Tier:</span>
                  <span className="text-red-400 font-bold">{currentUser.tier || 'Performance VIP'}</span>
                </div>
                {currentUser.fitnessGoal && (
                  <div className="flex justify-between text-gray-400">
                    <span>Fitness Focus:</span>
                    <span className="text-white font-bold">{currentUser.fitnessGoal}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>Account Validity:</span>
                  <span className={isMemberExpired ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {isMemberExpired ? 'EXPIRED' : `ACTIVE (Expires ${currentUser.membershipExpiryDate || 'in 30 days'})`}
                  </span>
                </div>
              </div>

              {currentUser.role === 'admin' ? (
                <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white font-heading">ADMINISTRATOR PRIVILEGES ACTIVE</p>
                    <p className="text-[11px] text-gray-300 mt-0.5">
                      You have full command access. The Admin Dashboard button is visible in the navigation header.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white font-heading">MEMBER SANCTUARY ACCESS ACTIVE</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Your VIP benefits, training telemetry, and bookings are linked to your profile.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-red-600/20 text-white font-heading font-bold text-xs uppercase tracking-wider border border-white/15 hover:border-red-500/40 flex items-center justify-center gap-2 transition-all"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>LOG OUT</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-800 text-white font-heading font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 hover:shadow-red-600/50 flex items-center justify-center gap-2 transition-all"
                >
                  <span>RETURN TO CLUB</span>
                </button>
              </div>
            </div>
          ) : (
            /* Logged out: Sign In / Sign Up / Admin Access Tabs */
            <div className="space-y-5">
              {/* Header Title */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 font-mono text-[10px] tracking-widest uppercase mb-2">
                  <Sparkles className="w-3 h-3" />
                  <span>SHREX CLUB AUTHENTICATION</span>
                </div>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-wide">
                  {activeTab === 'login' && 'MEMBER SIGN IN'}
                  {activeTab === 'signup' && 'JOIN THE SANCTUARY'}
                  {activeTab === 'admin' && 'ADMIN PORTAL'}
                </h2>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  {activeTab === 'login' && 'Access your member dashboard, biometric tracking, and club bookings.'}
                  {activeTab === 'signup' && 'Create your official Shrex Club profile to unlock luxury access.'}
                  {activeTab === 'admin' && 'Restricted to club administration and management personnel.'}
                </p>
              </div>

              {/* Segmented Mode Selector */}
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/15">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage('');
                  }}
                  className={`py-2 rounded-xl text-xs font-heading font-extrabold uppercase tracking-wider transition-all ${
                    activeTab === 'login'
                      ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-md shadow-red-600/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  LOGIN
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setErrorMessage('');
                  }}
                  className={`py-2 rounded-xl text-xs font-heading font-extrabold uppercase tracking-wider transition-all ${
                    activeTab === 'signup'
                      ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-md shadow-red-600/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  SIGN UP
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('admin');
                    setErrorMessage('');
                  }}
                  className={`py-2 rounded-xl text-xs font-heading font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'admin'
                      ? 'bg-red-950 text-red-300 border border-red-500/50 shadow-md shadow-red-900/40'
                      : 'text-gray-400 hover:text-red-400'
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  <span>ADMIN</span>
                </button>
              </div>

              {/* Error and Success alerts */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/60 text-red-300 text-xs font-mono flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                    <span className="font-semibold">{errorMessage}</span>
                  </div>
                  {errorMessage.includes('No account found') && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('signup');
                        setErrorMessage('');
                        setSignupEmail(loginEmail);
                      }}
                      className="self-start px-3 py-1 rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-white font-heading text-[11px] font-bold uppercase tracking-wider transition-colors"
                    >
                      Click here to Sign Up →
                    </button>
                  )}
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* TAB 1: LOGIN */}
              {activeTab === 'login' && (
                <form onSubmit={handleMemberLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="member@shrex.club"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('forgot');
                          setForgotStep('email');
                          setResetEmail(loginEmail);
                          setErrorMessage('');
                          setSuccessMessage('');
                        }}
                        className="text-[11px] font-mono text-red-400 hover:text-red-300 hover:underline transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-800 text-white font-heading font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-red-600/30 hover:shadow-red-600/50 border border-red-500/50 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    <span>SIGN IN TO CLUB</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* TAB: FORGOT PASSWORD (OTP RESET WORKFLOW) */}
              {activeTab === 'forgot' && (
                <div className="space-y-4">
                  {/* Step Tracker Header & Back to Login */}
                  <div className="flex items-center justify-between pb-1 border-b border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('login');
                        setErrorMessage('');
                        setSuccessMessage('');
                        setOtpDispatchedNotice(null);
                      }}
                      className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Sign In</span>
                    </button>
                    <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">
                      STEP {forgotStep === 'email' ? '1/3: EMAIL' : forgotStep === 'otp' ? '2/3: OTP' : '3/3: NEW PASS'}
                    </span>
                  </div>

                  {/* Security OTP Dispatched Confirmation Banner (Never shows OTP code on screen) */}
                  {otpDispatchedNotice && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-[#0C140F] to-black border border-emerald-500/30 text-left shadow-xl space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          SECURITY OTP DISPATCHED
                        </span>
                        <span className="text-gray-400">{otpDispatchedNotice.time}</span>
                      </div>
                      <div className="text-xs font-mono text-gray-300">
                        Dispatched to: <span className="text-white font-bold">{otpDispatchedNotice.email}</span>
                      </div>
                      <p className="text-[11px] font-mono text-gray-400 leading-relaxed">
                        Please check your inbox (and Spam/Junk folder) for your 6-digit code. For your security, the code is never shown on screen.
                      </p>
                    </div>
                  )}

                  {/* STEP 1: ENTER REGISTERED EMAIL */}
                  {forgotStep === 'email' && (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-gray-300 font-mono space-y-1">
                        <p className="font-bold text-white flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-red-500" />
                          ACCOUNT RECOVERY
                        </p>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          Enter your registered email address. We will dispatch a secure 6-digit one-time passcode (OTP) to reset your password.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                          Registered Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="email"
                            required
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder="e.g. member@shrex.club"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500 transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingOtp}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-800 text-white font-heading font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-red-600/30 hover:shadow-red-600/50 border border-red-500/50 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSendingOtp ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>DISPATCHING OTP TO EMAIL...</span>
                          </>
                        ) : (
                          <>
                            <span>SEND VERIFICATION OTP</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* STEP 2: VERIFY 6-DIGIT OTP */}
                  {forgotStep === 'otp' && (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-gray-300 font-mono space-y-1">
                        <p className="font-bold text-white flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-red-500" />
                          ENTER SECURITY OTP
                        </p>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          Please enter the 6-digit code sent to <strong className="text-white">{resetEmail}</strong>.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                            6-Digit Verification Code
                          </label>
                          {otpCountdown > 0 ? (
                            <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-red-400" />
                              Resend in {otpCountdown}s
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              className="text-[10px] font-mono text-red-400 hover:text-red-300 font-bold underline transition-colors"
                            >
                              Resend OTP Now
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                          placeholder="••••••"
                          className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 text-center font-mono font-black text-xl tracking-[0.5em] focus:outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(229,9,20,0.3)] transition-all"
                        />
                      </div>

                      <div className="flex gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            setForgotStep('email');
                            setErrorMessage('');
                          }}
                          className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-mono text-xs uppercase font-bold transition-colors"
                        >
                          Change Email
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-800 text-white font-heading font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-red-600/30 hover:shadow-red-600/50 border border-red-500/50 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
                        >
                          <span>VERIFY OTP CODE</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  )}

                  {/* STEP 3: SET NEW PASSWORD */}
                  {forgotStep === 'new_password' && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-gray-300 font-mono space-y-1">
                        <p className="font-bold text-white flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-emerald-400" />
                          CREATE NEW PASSWORD
                        </p>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          Your identity has been verified. Set a new strong password for your account.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                          New Password (Min 6 Characters)
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500 transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500 transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-heading font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/30 border border-emerald-500/50 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>UPDATE PASSWORD & SIGN IN</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: SIGN UP */}
              {activeTab === 'signup' && (
                <form onSubmit={handleMemberSignup} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        required
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="e.g. Vikram Malhotra"
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="vikram@example.com"
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                        Tier Preference
                      </label>
                      <select
                        value={signupTier}
                        onChange={(e) => setSignupTier(e.target.value as any)}
                        className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-red-500 transition-colors"
                      >
                        <option value="Essential" className="bg-[#0C0C12] text-white">Essential</option>
                        <option value="Performance" className="bg-[#0C0C12] text-white">Performance</option>
                        <option value="Elite VIP" className="bg-[#0C0C12] text-white">Elite VIP</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                        Primary Goal
                      </label>
                      <select
                        value={signupGoal}
                        onChange={(e) => setSignupGoal(e.target.value)}
                        className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-red-500 transition-colors"
                      >
                        <option value="Hypertrophy" className="bg-[#0C0C12] text-white">Hypertrophy</option>
                        <option value="Fat Loss & Definition" className="bg-[#0C0C12] text-white">Fat Loss</option>
                        <option value="Strength & Power" className="bg-[#0C0C12] text-white">Strength</option>
                        <option value="Longevity & Recovery" className="bg-[#0C0C12] text-white">Longevity</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                      Create Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Create secure password"
                        className="w-full pl-10 pr-10 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-800 text-white font-heading font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-red-600/30 hover:shadow-red-600/50 border border-red-500/50 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    <span>CREATE MEMBER ACCOUNT</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* TAB 3: ADMIN PORTAL */}
              {activeTab === 'admin' && (
                <form onSubmit={handleAdminAuth} className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 space-y-1">
                    <div className="flex items-center gap-2 text-red-400 font-heading font-bold text-xs uppercase tracking-wider">
                      <KeyRound className="w-4 h-4" />
                      <span>RESTRICTED OWNER / ADMIN ACCESS</span>
                    </div>
                    <p className="text-[11px] text-gray-300 font-mono leading-relaxed">
                      Only authorized staff and gym administrators can access the Command Center. Regular members cannot view administrative controls.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block">
                      Admin Passcode / Master Key
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                      <input
                        type="password"
                        required
                        value={adminCode}
                        onChange={(e) => setAdminCode(e.target.value)}
                        placeholder="Enter master admin passcode..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-red-950/20 border border-red-500/40 text-white placeholder-gray-500 text-sm font-mono focus:outline-none focus:border-red-400 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white font-heading font-extrabold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(229,9,20,0.5)] border border-red-500/60 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    <Shield className="w-4 h-4 text-red-300" />
                    <span>VERIFY ADMIN PRIVILEGES</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
