import React from 'react';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage({ setActivePage }) {
  return (
    <div className="max-w-md mx-auto py-20 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-xl">
        <AlertCircle className="w-10 h-10" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">404 - Page Not Found</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The requested page or view route does not exist.
        </p>
      </div>
      <button
        onClick={() => setActivePage('home')}
        className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-lg shadow-blue-500/30 transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home Overview</span>
      </button>
    </div>
  );
}
