import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CreditCard, Smartphone, CheckCircle2, Zap, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MembershipPlan } from '../data/gymData';
import { getStoredMembers, saveStoredMembers, MemberRecord } from './AuthModal';

interface CheckoutModalProps {
  plan: MembershipPlan | null;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ plan, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!plan) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedName || !trimmedEmail) return;

    // Save or update member in database
    const members = getStoredMembers();
    const existingIndex = members.findIndex((m) => m.email.toLowerCase() === trimmedEmail);
    const now = Date.now();
    const expiryTimestamp = now + 30 * 24 * 60 * 60 * 1000;
    const expiryDate = new Date(expiryTimestamp).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const chosenTier: 'Essential' | 'Performance' | 'Elite VIP' = plan.name.includes('VIP')
      ? 'Elite VIP'
      : plan.name.includes('Performance')
      ? 'Performance'
      : 'Essential';

    if (existingIndex >= 0) {
      members[existingIndex].tier = chosenTier;
      members[existingIndex].isExpired = false;
      members[existingIndex].membershipExpiryTimestamp = expiryTimestamp;
      members[existingIndex].membershipExpiryDate = expiryDate;
    } else {
      const newMember: MemberRecord = {
        id: `MEM-${Math.floor(1000 + Math.random() * 9000)}`,
        name: trimmedName,
        email: trimmedEmail,
        role: 'user',
        tier: chosenTier,
        fitnessGoal: 'Premium Athlete Training',
        joinedDate:
          new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
          ' ' +
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        joinedTimestamp: now,
        membershipExpiryDate: expiryDate,
        membershipExpiryTimestamp: expiryTimestamp,
        isExpired: false,
        lastLogin: 'Never (Checkout)',
      };
      members.push(newMember);
    }
    saveStoredMembers(members);

    setIsSuccess(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 4000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl bg-[#0C0C12] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-red-600 text-white transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center flex flex-col items-center justify-center"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.6)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black font-heading text-white mb-2">
                WELCOME TO SHREX CLUB!
              </h2>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-4">
                MEMBERSHIP ACTIVATED • {plan.name} TIER
              </span>
              <p className="text-xs text-gray-300 max-w-xs font-light leading-relaxed">
                Your VIP digital access key has been dispatched to <strong className="text-white">{email}</strong>. See you on the floor!
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleCheckout} className="space-y-5">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="p-3 rounded-xl bg-red-600/20 border border-red-500/40 text-red-500">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-widest block">
                    SHREX MEMBERSHIP CHECKOUT
                  </span>
                  <h2 className="text-xl font-black font-heading text-white">
                    {plan.name} PASS — {plan.price} {plan.billingPeriod}
                  </h2>
                </div>
              </div>

              {/* User Inputs */}
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Arjun Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="arjun@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                    PHONE
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 90144 04462"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-2">
                  PAYMENT GATEWAY METHOD
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'upi'
                        ? 'bg-red-600/20 border-red-500 text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-red-500" />
                    <span className="text-[10px] font-mono font-bold">UPI / GPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-red-600/20 border-red-500 text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span className="text-[10px] font-mono font-bold">Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'bg-red-600/20 border-red-500 text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    <Lock className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-mono font-bold">NetBanking</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-[10px] font-mono text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>256-Bit SSL Encrypted Instant VIP Pass Issuance</span>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-heading font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(229,9,20,0.5)] border border-red-400/50 flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <span>COMPLETE {plan.price} MEMBERSHIP</span>
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
