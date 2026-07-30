import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 animate-bounce">
        <ShieldCheck className="w-7 h-7" />
      </div>
      <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300">
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        <span>{message}</span>
      </div>
    </div>
  );
}
