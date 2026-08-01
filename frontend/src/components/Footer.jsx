import React from 'react';
import { ShieldCheck, Cpu, Database, Code2 } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="mt-20 border-t border-slate-300 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TruthLens AI
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium max-w-md">
              A production-ready NLP & Machine Learning system designed to analyze and classify news articles using raw text verification. Built for academic research and empirical truth verification.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <button onClick={() => setActivePage('home')} className="text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('predict')} className="text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors">
                  Fact Checker Engine
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('dashboard')} className="text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors">
                  Analytics Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('history')} className="text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors">
                  Prediction History
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('about')} className="text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors">
                  System Architecture & Viva Guide
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">Tech Stack Highlights</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 text-xs rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-300 font-bold">
                FastAPI
              </span>
              <span className="px-2.5 py-1 text-xs rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border border-indigo-300 font-bold">
                Scikit-Learn
              </span>
              <span className="px-2.5 py-1 text-xs rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-300 font-bold">
                TF-IDF 5K
              </span>
              <span className="px-2.5 py-1 text-xs rounded-md bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 border border-cyan-300 font-bold">
                React + Vite
              </span>
              <span className="px-2.5 py-1 text-xs rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-300 font-bold">
                SQLite DB
              </span>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <p>© {new Date().getFullYear()} TruthLens AI Platform. Final-Year Computer Science Project.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span>Empirical NLP Analytics</span>
            <span>•</span>
            <span>ISOT Dataset Trained</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
