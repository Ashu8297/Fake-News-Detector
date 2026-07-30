import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, ShieldCheck, AlertOctagon, Phone, Calendar, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { authApi } from '../auth/authApi';
import { getErrorMessage, normalizeAuthPayload } from '../auth/authHelpers';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage({ setActivePage, showToast }) {
  const { loginSuccess } = useAuth();
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName || !dob || !email || !phoneNumber || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (fullName.length < 3 || fullName.length > 50) {
      setError('Full name must be between 3 and 50 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('Please accept the Terms & Privacy policy.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await authApi.register(normalizeAuthPayload({
        full_name: fullName,
        dob,
        email,
        phone: phoneNumber,
        password,
        confirm_password: confirmPassword
      }));

      if (res.data?.access_token) {
        loginSuccess(res.data);
        showToast('Registration successful. Welcome to TruthLens AI.');
        setActivePage('dashboard');
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.15),_transparent_30%),linear-gradient(135deg,#050B16_0%,#091A33_45%,#112A4A_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_35px_120px_-40px_rgba(0,0,0,0.75)] backdrop-blur-2xl sm:p-8 lg:p-10"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-slate-400">Create Account</p>
              <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Welcome</h1>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              <AlertOctagon className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  <User className="h-4 w-4 text-cyan-300" /> Full Name
                </label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400" placeholder="Asha Nair" />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  <Calendar className="h-4 w-4 text-cyan-300" /> Date of Birth
                </label>
                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  <Mail className="h-4 w-4 text-cyan-300" /> Email Address
                </label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400" placeholder="name@example.com" />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  <Phone className="h-4 w-4 text-cyan-300" /> Phone Number
                </label>
                <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400" placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  <Lock className="h-4 w-4 text-cyan-300" /> Password
                </label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400" placeholder="Create a secure password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-200">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  <Lock className="h-4 w-4 text-cyan-300" /> Confirm Password
                </label>
                <div className="relative">
                  <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400" placeholder="Confirm password" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-200">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent" />
              <span>I agree to Terms & Privacy</span>
            </label>

            <motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(34,211,238,0.24)] transition-all">
              {loading ? 'Creating account...' : 'Create Account'}
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-300">
            Already have an account?{' '}
            <button type="button" onClick={() => setActivePage('login')} className="font-semibold text-cyan-200 transition hover:text-cyan-100">
              Sign In
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
