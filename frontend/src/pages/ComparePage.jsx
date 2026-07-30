import React, { useState } from 'react';
import { GitCompare, Sparkles, Loader2, CheckCircle2, AlertOctagon } from 'lucide-react';
import axios from 'axios';

export default function ComparePage() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [loading, setLoading] = useState(false);
  const [resA, setResA] = useState(null);
  const [resB, setResB] = useState(null);

  const handleCompare = async () => {
    if (!textA.trim() || !textB.trim()) return;
    setLoading(true);
    setResA(null);
    setResB(null);

    try {
      const [rA, rB] = await Promise.all([
        axios.post('/api/predict', { text: textA.trim() }),
        axios.post('/api/predict', { text: textB.trim() })
      ]);
      setResA(rA.data.data);
      setResB(rB.data.data);
    } catch (err) {
      console.log('Compare error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center space-x-3">
          <GitCompare className="w-8 h-8 text-blue-600" />
          <span>Side-by-Side News Comparison</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Compare two articles simultaneously to evaluate relative veracity and linguistic patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Article A */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
          <label className="text-xs font-bold uppercase text-slate-500">Article Sample A</label>
          <textarea
            rows={5}
            placeholder="Paste first article text..."
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {resA && (
            <div className={`p-4 rounded-2xl border ${
              resA.prediction === 'Real' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
            }`}>
              <div className="font-bold text-lg">{resA.prediction.toUpperCase()} ({resA.confidence}%)</div>
              <p className="text-xs mt-1">{resA.explanation}</p>
            </div>
          )}
        </div>

        {/* Article B */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
          <label className="text-xs font-bold uppercase text-slate-500">Article Sample B</label>
          <textarea
            rows={5}
            placeholder="Paste second article text..."
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {resB && (
            <div className={`p-4 rounded-2xl border ${
              resB.prediction === 'Real' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
            }`}>
              <div className="font-bold text-lg">{resB.prediction.toUpperCase()} ({resB.confidence}%)</div>
              <p className="text-xs mt-1">{resB.explanation}</p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleCompare}
          disabled={loading || !textA.trim() || !textB.trim()}
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 disabled:opacity-40 transition-all"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GitCompare className="w-5 h-5" />}
          <span>Compare Both Articles</span>
        </button>
      </div>
    </div>
  );
}
