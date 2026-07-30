import React from 'react';
import { TrendingUp, Tag, ShieldAlert, Cpu } from 'lucide-react';

export default function AnalyticsPage() {
  const topFakeKeywords = [
    { word: "BREAKING", count: 42, severity: "High" },
    { word: "SHOCKING", count: 38, severity: "High" },
    { word: "SECRET", count: 35, severity: "High" },
    { word: "EXCLUSIVE", count: 29, severity: "Medium" },
    { word: "VIRAL", count: 25, severity: "Medium" },
    { word: "MUST WATCH", count: 22, severity: "High" },
    { word: "100% TRUE", count: 19, severity: "High" },
    { word: "MEDICAL MIRACLE", count: 16, severity: "High" },
    { word: "BOMBSHELL", count: 14, severity: "Medium" }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
          <TrendingUp className="w-8 h-8 text-indigo-600" />
          <span>Misinformation Analytics & Term Word Cloud</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Empirical term frequency analysis across flagged articles.
        </p>
      </div>

      {/* Common Fake Keywords Cloud */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Tag className="w-5 h-5 text-rose-500" />
          <span>Most Frequent Sensational Keywords</span>
        </h3>

        <div className="flex flex-wrap gap-3">
          {topFakeKeywords.map((item, idx) => (
            <div
              key={idx}
              className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center space-x-2"
            >
              <span className="font-mono font-bold text-xs text-rose-700 dark:text-rose-300">#{item.word}</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 text-[10px] font-bold">
                {item.count} occurrences
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">World Politics</h4>
          <p className="text-xs text-slate-500">Highest proportion of factual Reuters reporting corpora.</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Healthcare & Miracle Cures</h4>
          <p className="text-xs text-slate-500">Highest clickbait frequency and emotional fear scores.</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Sensational Headlines</h4>
          <p className="text-xs text-slate-500">Contains high uppercase character density and exclamation marks.</p>
        </div>
      </div>

    </div>
  );
}
