import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, KeyRound, ArrowRight, CheckCircle2, AlertOctagon, ShieldCheck } from 'lucide-react';
import { authApi } from '../auth/authApi';
import { getErrorMessage } from '../auth/authHelpers';

export default function ForgotPasswordPage({ setActivePage, showToast }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [demoToken, setDemoToken] = useState('');
  const [mode, setMode] = useState('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (mode === 'email' && !email) {
      setError('Please enter the registered email address.');
      return;
    }
    if (mode === 'phone' && !phone) {
      setError('Please enter the registered phone number.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload = mode === 'email' ? { email } : { phone };
      const res = await authApi.forgotPassword(payload);
      setStep(2);
      if (res.data?.demo_otp) {
        setDemoToken(res.data.demo_otp);
        setToken(res.data.demo_otp);
      }
      setMode(res.data?.mode || mode);
      showToast('Reset code generated.');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to request password reset.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please enter the reset code.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload = mode === 'email' ? { email, otp_code: token } : { phone, otp_code: token };
      await authApi.verifyResetOtp(payload);
      setStep(3);
      showToast('OTP verified successfully.');
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid reset code.'));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    if (!token || !newPassword) {
      setError('Please enter a new password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.resetPassword({ token, new_password: newPassword });
      showToast('Password updated. You can log in now.');
      setActivePage('login');
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid reset token.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(135deg,#050B16_0%,#091A33_45%,#112A4A_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_35px_120px_-40px_rgba(0,0,0,0.75)] backdrop-blur-2xl sm:p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-slate-400">Account Recovery</p>
              <h1 className="text-2xl font-semibold text-white">Reset your password</h1>
            </div>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              <AlertOctagon className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="flex overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1">
                <button type="button" onClick={() => setMode('email')} className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${mode === 'email' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}>Email</button>
                <button type="button" onClick={() => setMode('phone')} className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${mode === 'phone' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}>Phone</button>
              </div>

              {mode === 'email' ? (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                    <Mail className="h-4 w-4 text-cyan-300" /> Registered email
                  </label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400" placeholder="name@example.com" />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                    <Phone className="h-4 w-4 text-cyan-300" /> Registered phone
                  </label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400" placeholder="+91 98765 43210" />
                </div>
              )}

              <motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(34,211,238,0.24)] transition-all">
                {loading ? 'Sending reset code...' : 'Send Reset Code'}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </form>
          ) : step === 2 ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {demoToken && <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm font-mono text-emerald-100">Demo OTP: {demoToken}</div>}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  <KeyRound className="h-4 w-4 text-cyan-300" /> Reset code
                </label>
                <input type="text" value={token} onChange={(e) => setToken(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400" placeholder="123456" />
              </div>
              <motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(34,211,238,0.24)] transition-all">
                {loading ? 'Verifying...' : 'Verify Code'}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleConfirmReset} className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  <KeyRound className="h-4 w-4 text-cyan-300" /> New password
                </label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400" placeholder="Create a strong new password" />
              </div>
              <motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(16,185,129,0.2)] transition-all">
                {loading ? 'Updating password...' : 'Update Password'}
                <CheckCircle2 className="h-4 w-4" />
              </motion.button>
            </form>
          )}

          <div className="mt-5 text-center text-sm text-slate-300">
            Remembered your password?{' '}
            <button type="button" onClick={() => setActivePage('login')} className="font-semibold text-cyan-200 transition hover:text-cyan-100">Back to Sign In</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
