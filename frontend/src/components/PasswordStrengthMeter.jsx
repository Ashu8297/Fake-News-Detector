import React from 'react';
import { Check, X } from 'lucide-react';

export default function PasswordStrengthMeter({ password = '' }) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };

  const score = Object.values(checks).filter(Boolean).length;

  let strengthLabel = 'Weak';
  let strengthColor = 'bg-rose-500 text-rose-500';
  let widthPercent = '33%';

  if (score >= 5) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-emerald-500 text-emerald-500';
    widthPercent = '100%';
  } else if (score >= 3) {
    strengthLabel = 'Medium';
    strengthColor = 'bg-amber-500 text-amber-500';
    widthPercent = '66%';
  } else if (password.length > 0) {
    strengthLabel = 'Weak';
    strengthColor = 'bg-rose-500 text-rose-500';
    widthPercent = '33%';
  } else {
    return null;
  }

  return (
    <div className="space-y-2 pt-1 text-xs">
      <div className="flex items-center justify-between font-bold">
        <span className="text-slate-700 dark:text-slate-300">Password Strength:</span>
        <span className={strengthColor.split(' ')[1]}>{strengthLabel}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${strengthColor.split(' ')[0]} transition-all duration-300`}
          style={{ width: widthPercent }}
        ></div>
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 pt-1">
        <div className="flex items-center space-x-1">
          {checks.length ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-slate-400" />}
          <span>8+ Characters</span>
        </div>
        <div className="flex items-center space-x-1">
          {checks.uppercase ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-slate-400" />}
          <span>Uppercase (A-Z)</span>
        </div>
        <div className="flex items-center space-x-1">
          {checks.lowercase ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-slate-400" />}
          <span>Lowercase (a-z)</span>
        </div>
        <div className="flex items-center space-x-1">
          {checks.number ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-slate-400" />}
          <span>Number (0-9)</span>
        </div>
        <div className="flex items-center space-x-1 col-span-2">
          {checks.special ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-slate-400" />}
          <span>Special Character (!@#$)</span>
        </div>
      </div>
    </div>
  );
}
