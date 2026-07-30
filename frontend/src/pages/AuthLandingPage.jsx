import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';

const particles = Array.from({ length: 18 });

export default function AuthLandingPage({ setActivePage }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_30%),linear-gradient(135deg,#050B16_0%,#091A33_45%,#112A4A_100%)] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((_, index) => (
          <motion.span
            key={index}
            className="absolute h-1.5 w-1.5 rounded-full bg-cyan-300/70"
            initial={{ opacity: 0.2, x: `${(index % 6) * 20}%`, y: `${(index % 3) * 25}%` }}
            animate={{ opacity: [0.2, 0.8, 0.2], y: [0, -18, 0], x: [0, 10, 0] }}
            transition={{ duration: 5 + (index % 5), repeat: Infinity, ease: 'easeInOut' }}
            style={{ left: `${6 + (index % 8) * 12}%`, top: `${8 + (index % 6) * 14}%` }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.02fr_0.94fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_35px_120px_-40px_rgba(0,0,0,0.7)] backdrop-blur-3xl sm:p-10"
          >
            <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(96,165,250,0.12),_transparent_35%)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-100">
                <ShieldCheck className="h-4 w-4 text-cyan-200" />
                TruthLens AI
              </div>

              <div className="mt-8 space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Detect Fake News with AI</h1>
                <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  AI-powered fake news detection and fact verification platform.
                </p>
              </div>

              <div className="mt-8 space-y-3 text-[11px] uppercase tracking-[0.26em] text-slate-400">
                <p>Developed by: The Coders Team</p>
                <p>Academic Project: Gandhi Institute of Technology and Management ,BBSR,Gitam</p>
                <p>Internship: NIRMAN Organization (3-Month Internship)</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.08 }}
            className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.75)] backdrop-blur-2xl sm:p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_16px_40px_rgba(34,211,238,0.3)]">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.34em] text-slate-400">Secure Auth</p>
                <h2 className="text-2xl font-semibold text-white">Welcome</h2>
              </div>
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActivePage('register')}
                className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 px-5 py-4 text-left text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(34,211,238,0.24)] transition-all"
              >
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>

              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActivePage('login')}
                className="flex w-full items-center justify-between rounded-2xl border border-cyan-300/20 bg-white/5 px-5 py-4 text-left text-sm font-semibold text-white transition-all hover:border-cyan-200/40 hover:bg-white/10"
              >
                <span>Already have an account? Sign In</span>
                <Lock className="h-4 w-4 text-cyan-200" />
              </motion.button>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <p className="font-medium text-cyan-100">Simple and secure access</p>
              <p className="mt-1 text-sm text-slate-400">Email, phone OTP, and Google sign-in remain available after you enter the platform.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
