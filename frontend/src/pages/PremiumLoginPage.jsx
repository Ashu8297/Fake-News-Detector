import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Phone, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../auth/authApi';
import GoogleAuthGateway from '../components/GoogleAuthGateway';
import { getErrorMessage } from '../auth/authHelpers';

export default function PremiumLoginPage({ setActivePage, showToast }) {
  const { loginSuccess } = useAuth();
  const [mode, setMode] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoOtp, setDemoOtp] = useState('');
  const [showGoogleGateway, setShowGoogleGateway] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login({ email: email.trim().toLowerCase(), password, remember_me: rememberMe });
      if (res.data?.access_token) {
        loginSuccess(res.data);
        showToast('Welcome back to TruthLens AI');
        setActivePage('dashboard');
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid email or password.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      setError('Please enter your phone number.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await authApi.sendPhoneOtp({ phone_number: phoneNumber });
      setOtpSent(true);
      setDemoOtp(res.data?.demo_otp || '');
      showToast('OTP sent to your number.');
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to send OTP.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) {
      setError('Please enter the OTP code.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await authApi.verifyPhoneOtp({ phone_number: phoneNumber, otp_code: otpCode });
      if (res.data?.requires_profile_completion) {
        showToast('Phone verified. Complete profile to create account.');
        setActivePage('register');
      } else if (res.data?.access_token) {
        loginSuccess(res.data);
        showToast('Logged in successfully with phone OTP.');
        setActivePage('dashboard');
      }
    } catch (err) {
      setError(getErrorMessage(err, 'OTP verification failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(135deg,#050B16_0%,#091A33_45%,#112A4A_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_35px_120px_-40px_rgba(0,0,0,0.75)] backdrop-blur-2xl sm:p-8 lg:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[0.9fr_0.95fr] lg:items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-100">
                <ShieldCheck className="h-4 w-4 text-cyan-200" />
                Secure Login
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Welcome back</h1>
                <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  Access your fake-news dashboard with email, phone OTP, or Google sign-in in seconds.
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <div className="mb-2 flex items-center gap-2 text-cyan-100">
                  <KeyRound className="h-4 w-4 text-cyan-200" />
                  Available methods
                </div>
                <ul className="space-y-2 pl-5 text-sm text-slate-400">
                  <li>• Email + Password</li>
                  <li>• Phone Number + OTP</li>
                  <li>• Google Sign In</li>
                </ul>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-4 sm:p-6">
              <div className="mb-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => setMode('email')} className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${mode === 'email' ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>Email</button>
                <button type="button" onClick={() => setMode('phone')} className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${mode === 'phone' ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>Phone OTP</button>
                <button type="button" onClick={() => setMode('google')} className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${mode === 'google' ? 'bg-blue-500 text-slate-950' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>Google</button>
              </div>

              {error && (
                <div className="mb-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div>
              )}

              {mode === 'email' && (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                      <Mail className="h-4 w-4 text-cyan-300" /> Email address
                    </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400" placeholder="name@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                      <Lock className="h-4 w-4 text-cyan-300" /> Password
                    </label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400" placeholder="Enter your password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-200">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-white/20 bg-transparent" />
                    <span>Remember Me</span>
                  </label>
                  <motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(34,211,238,0.24)] transition-all">
                    {loading ? 'Signing in...' : 'Sign In'}
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                  <button type="button" onClick={() => setActivePage('forgot-password')} className="w-full text-center text-sm font-semibold text-cyan-200 transition hover:text-cyan-100">Forgot Password?</button>
                </form>
              )}

              {mode === 'google' && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
                    Continue with Google or use the secure in-page gateway for quick access.
                  </div>
                  <motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setShowGoogleGateway(true)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(34,211,238,0.24)] transition-all">
                    <Sparkles className="h-4 w-4" /> Continue with Google
                  </motion.button>
                </div>
              )}

              {mode === 'phone' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                      <Phone className="h-4 w-4 text-cyan-300" /> Phone number
                    </label>
                    <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400" placeholder="+91 98765 43210" />
                  </div>
                  {!otpSent ? (
                    <motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }} type="button" onClick={handleSendOtp} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(16,185,129,0.2)] transition-all">
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                    </motion.button>
                  ) : (
                    <div className="space-y-4">
                      {demoOtp && <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm font-mono text-emerald-100">Demo OTP: {demoOtp}</div>}
                      <input type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-lg tracking-[0.3em] text-white outline-none placeholder:text-slate-500" placeholder="123456" />
                      <motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }} type="button" onClick={handleVerifyOtp} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(16,185,129,0.2)] transition-all">
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </motion.button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {showGoogleGateway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl rounded-[32px] border border-white/10 bg-slate-950/90 p-2 shadow-[0_35px_120px_-30px_rgba(0,0,0,0.85)]">
            <button type="button" onClick={() => setShowGoogleGateway(false)} className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300 transition hover:bg-white/10">Close</button>
            <GoogleAuthGateway showToast={showToast} setActivePage={setActivePage} onComplete={() => setShowGoogleGateway(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
