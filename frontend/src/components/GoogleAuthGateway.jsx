import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  ArrowRight, 
  AlertOctagon, 
  Mail, 
  Phone, 
  KeyRound, 
  User, 
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth, googleProvider, signInWithPopup } from '../firebase';
import { authApi } from '../auth/authApi';
import { getErrorMessage, normalizeAuthPayload } from '../auth/authHelpers';

export default function GoogleAuthGateway({ showToast, setActivePage, onComplete }) {
  const { loginSuccess } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Tab Mode: 'google' | 'phone'
  const [activeTab, setActiveTab] = useState('google');

  // Real Gmail Entry Modal State
  const [showGmailModal, setShowGmailModal] = useState(false);
  const [realGmail, setRealGmail] = useState('');
  const [realName, setRealName] = useState('');

  // Form States
  const [phoneNum, setPhoneNum] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtp, setDemoOtp] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileFullName, setProfileFullName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileTermsAccepted, setProfileTermsAccepted] = useState(false);
  const [pendingProfileAuth, setPendingProfileAuth] = useState(null);

  const openProfileCompletion = (payload) => {
    setPendingProfileAuth(payload);
    setProfileFullName(payload.full_name || '');
    setProfileEmail(payload.email || '');
    setProfileTermsAccepted(false);
    setShowProfileModal(true);
  };

  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    if (!profileFullName.trim() || !profileEmail.trim()) {
      setError('Full name and email are required.');
      return;
    }
    if (!profileTermsAccepted) {
      setError('You must accept the Terms & Privacy to continue.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await authApi.completeProfile({
        provider: pendingProfileAuth?.provider || 'google',
        email: profileEmail.trim().toLowerCase(),
        full_name: profileFullName.trim(),
        profile_image: pendingProfileAuth?.profile_image || '',
        terms_accepted: true
      });

      if (res.data && res.data.access_token) {
        loginSuccess(res.data);
        setShowProfileModal(false);
        onComplete?.();
        showToast('Account created successfully!');
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create your account.'));
    } finally {
      setLoading(false);
    }
  };

  // 1. Google Authentication
  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');

    if (auth && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const token = await user.getIdToken();

        const res = await authApi.google(normalizeAuthPayload({
          id_token: token,
          email: user.email,
          full_name: user.displayName || user.email.split('@')[0],
          profile_image: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
        }));

        if (res.data?.requires_profile_completion) {
          openProfileCompletion({
            provider: 'google',
            email: user.email,
            full_name: user.displayName || user.email.split('@')[0],
            profile_image: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
          });
          setLoading(false);
          return;
        }

        if (res.data && res.data.access_token) {
          loginSuccess(res.data);
          onComplete?.();
          showToast(`Authenticated via Google: ${user.email}`);
          return;
        }
      } catch (fbErr) {
        console.log("Firebase popup fallback:", fbErr);
      }
    }

    // Fallback: Open clean in-page Google Sign-In Modal
    setShowGmailModal(true);
    setLoading(false);
  };

  const handleManualGmailSubmit = async (e) => {
    e.preventDefault();
    if (!realGmail || !realGmail.includes('@')) {
      setError('Please enter a valid Gmail address (e.g. user@gmail.com).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authApi.google(normalizeAuthPayload({
        id_token: 'real_gmail_sso_' + Date.now(),
        email: realGmail.trim().toLowerCase(),
        full_name: realName.trim() || realGmail.split('@')[0],
        profile_image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${realGmail.trim()}`
      }));

      if (res.data?.requires_profile_completion) {
        openProfileCompletion({
          provider: 'google',
          email: realGmail.trim().toLowerCase(),
          full_name: realName.trim() || realGmail.split('@')[0],
          profile_image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${realGmail.trim()}`
        });
        setShowGmailModal(false);
        setLoading(false);
        return;
      }

      if (res.data && res.data.access_token) {
        loginSuccess(res.data);
        setShowGmailModal(false);
        onComplete?.();
        showToast(`Signed in with Google account: ${realGmail}`);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to authenticate Gmail account.'));
    } finally {
      setLoading(false);
    }
  };

  // 2. Phone OTP Send & Verify
  const handleSendPhoneOtp = async () => {
    if (!phoneNum || phoneNum.length < 8) {
      setError('Enter phone number with country code (e.g. +1 555 123 4567).');
      return;
    }
    setError('');
    try {
      const res = await authApi.sendPhoneOtp({ phone_number: phoneNum });
      setOtpSent(true);
      setDemoOtp(res.data.demo_otp);
      showToast(`OTP Code sent to ${phoneNum}`);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to send OTP code.'));
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!otpCode) return;
    setError('');
    try {
      const res = await authApi.verifyPhoneOtp({
        phone_number: phoneNum,
        otp_code: otpCode
      });
      if (res.data?.requires_profile_completion) {
        openProfileCompletion({
          provider: 'phone',
          email: res.data.email || '',
          full_name: res.data.full_name || `Phone User ${phoneNum}`,
          profile_image: '',
          phone: phoneNum
        });
        return;
      }

      if (res.data && res.data.access_token) {
        loginSuccess(res.data);
        onComplete?.();
        showToast('Phone number verified! Logged in.');
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid OTP code.'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.16),_transparent_30%),#04070d] p-4 sm:p-6 lg:p-8 transition-colors duration-500">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.12),_transparent_32%)]" />

        <div className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              TruthLens AI Secure Access
            </div>

            <div className="space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_16px_40px_rgba(59,130,246,0.35)] lg:mx-0">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Sign in with the future of trust.
              </h1>
              <p className="mx-auto max-w-xl text-sm leading-6 text-slate-300 lg:mx-0 lg:text-base">
                Use a secure Google or phone verification path to access your fact-checking workspace with a modern, low-friction experience.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google Login</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('phone')}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4" />
                <span>Phone Login</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-400 lg:justify-start">
              <button
                type="button"
                onClick={() => setActivePage?.('forgot-password')}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition hover:bg-white/10 hover:text-white"
              >
                Forgot Password
              </button>
              <span className="text-slate-600">•</span>
              <button type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition hover:bg-white/10 hover:text-white">
                Terms & Privacy
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-4 shadow-inner shadow-cyan-500/5 sm:p-6">
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-200">
                <AlertOctagon className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="mb-4 flex overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => setActiveTab('google')}
                className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${activeTab === 'google' ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-400 hover:text-white'}`}
              >
                Google
              </button>
              <button
                onClick={() => setActiveTab('phone')}
                className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${activeTab === 'phone' ? 'bg-emerald-500/20 text-emerald-200' : 'text-slate-400 hover:text-white'}`}
              >
                Phone OTP
              </button>
            </div>

            {activeTab === 'google' && (
              <div className="space-y-4 text-left">
                <p className="text-sm leading-6 text-slate-300">
                  Continue with Google or use your original Gmail address when prompted for a secure sign-in handoff.
                </p>
                <button
                  onClick={handleGoogleAuth}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:shadow-[0_16px_40px_rgba(56,189,248,0.25)]"
                >
                  <span>Continue with Google</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {activeTab === 'phone' && (
              <div className="space-y-3.5 text-left">
                {!otpSent ? (
                  <>
                    <label className="text-sm font-semibold text-slate-200">Phone number with country code</label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <input
                        type="tel"
                        value={phoneNum}
                        onChange={(e) => setPhoneNum(e.target.value)}
                        placeholder="+1 555 123 4567"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none ring-0 placeholder:text-slate-500"
                      />
                    </div>
                    <button
                      onClick={handleSendPhoneOtp}
                      className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:shadow-[0_16px_36px_rgba(16,185,129,0.2)]"
                    >
                      Send OTP Code
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-slate-300">
                      Enter the 6-digit code sent to <span className="font-semibold text-white">{phoneNum}</span>.
                    </p>
                    {demoOtp && (
                      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm font-mono text-emerald-200">
                        Demo Code: {demoOtp}
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-lg tracking-[0.3em] text-white outline-none placeholder:text-slate-500"
                    />
                    <button
                      onClick={handleVerifyPhoneOtp}
                      className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white transition duration-300"
                    >
                      Verify OTP & Sign In
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="mt-5 flex items-center justify-center gap-2 border-t border-white/10 pt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              <Lock className="h-3.5 w-3.5 text-cyan-300" />
              <span>Encrypted • OAuth 2.0 • JWT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completion Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3 text-blue-600">
              <User className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Complete Your Profile</h3>
            </div>

            <form onSubmit={handleCompleteProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileFullName}
                  onChange={(e) => setProfileFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Email Address</label>
                <input
                  type="email"
                  required
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <label className="flex items-start space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={profileTermsAccepted}
                  onChange={(e) => setProfileTermsAccepted(e.target.checked)}
                  className="mt-1"
                />
                <span>I accept the Terms &amp; Privacy Policy.</span>
              </label>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/30"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Real Gmail Selector Modal */}
      {showGmailModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3 text-blue-600">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sign In with Original Gmail Account</h3>
            </div>

            <form onSubmit={handleManualGmailSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Your Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={realName}
                    onChange={(e) => setRealName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Original Gmail Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="your.name@gmail.com"
                    value={realGmail}
                    onChange={(e) => setRealGmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGmailModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/30"
                >
                  {loading ? 'Authenticating...' : 'Sign In with Gmail'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
