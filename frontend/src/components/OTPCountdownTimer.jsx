import React, { useState, useEffect } from 'react';
import { RotateCw } from 'lucide-react';

export default function OTPCountdownTimer({ onResend, initialSeconds = 60 }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const handleResendClick = () => {
    setSeconds(initialSeconds);
    onResend();
  };

  return (
    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between pt-1">
      {seconds > 0 ? (
        <span>Resend OTP in <strong className="text-blue-600 font-mono">{seconds}s</strong></span>
      ) : (
        <button
          type="button"
          onClick={handleResendClick}
          className="flex items-center space-x-1 text-blue-600 hover:underline font-extrabold"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Resend OTP Code</span>
        </button>
      )}
    </div>
  );
}
