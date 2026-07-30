import React from 'react';

export default function ProbabilityBar({ probReal = 0, probFake = 0 }) {
  const realPct = (probReal * 100).toFixed(1);
  const fakePct = (probFake * 100).toFixed(1);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-emerald-600 dark:text-emerald-400">Real Probability: {realPct}%</span>
        <span className="text-rose-600 dark:text-rose-400">Fake Probability: {fakePct}%</span>
      </div>

      <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex p-0.5">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-l-full transition-all duration-700"
          style={{ width: `${realPct}%` }}
          title={`Real: ${realPct}%`}
        />
        <div
          className="h-full bg-gradient-to-r from-rose-500 to-red-400 rounded-r-full transition-all duration-700"
          style={{ width: `${fakePct}%` }}
          title={`Fake: ${fakePct}%`}
        />
      </div>
    </div>
  );
}
