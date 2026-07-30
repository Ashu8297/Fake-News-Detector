import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-subtle">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl shadow-xl backdrop-blur-md border transition-all ${
        isSuccess
          ? 'bg-emerald-500/90 dark:bg-emerald-600/90 text-white border-emerald-400'
          : 'bg-rose-500/90 dark:bg-rose-600/90 text-white border-rose-400'
      }`}>
        {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-80">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
