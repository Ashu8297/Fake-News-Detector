import React, { useState } from 'react';
import { GitCompare, Loader2, CheckCircle2, AlertOctagon } from 'lucide-react';
import axios from 'axios';
import ProbabilityBar from '../components/ProbabilityBar';

export default function ComparePage() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [loading, setLoading] = useState(false);
  const [resA, setResA] = useState(null);
  const [resB, setResB] = useState(null);
  const [error, setError] = useState('');
  const [conclusion, setConclusion] = useState('');

  const getConclusion = (articleA, articleB) => {
    if (!articleA || !articleB) return '';

    if (articleA.prediction === 'Real' && articleB.prediction === 'Fake') {
      return 'Article A appears more trustworthy.';
    }
    if (articleA.prediction === 'Fake' && articleB.prediction === 'Real') {
      return 'Article B appears more trustworthy.';
    }
    if (articleA.prediction === 'Real' && articleB.prediction === 'Real') {
      return 'Both articles are predicted as Real.';
    }
    if (articleA.prediction === 'Fake' && articleB.prediction === 'Fake') {
      return 'Both articles are predicted as Fake.';
    }

    return 'Both articles were analyzed successfully.';
  };

  const handleCompare = async () => {
    if (!textA.trim() || !textB.trim()) {
      setError('Please enter both article texts before comparing.');
      return;
    }

    setError('');
    setLoading(true);
    setResA(null);
    setResB(null);
    setConclusion('');

    try {
      const [rA, rB] = await Promise.all([
        axios.post('/api/predict', { text: textA.trim() }),
        axios.post('/api/predict', { text: textB.trim() })
      ]);

      const resultA = rA.data?.data;
      const resultB = rB.data?.data;

      setResA(resultA);
      setResB(resultB);
      setConclusion(getConclusion(resultA, resultB));
    } catch (err) {
      const message = err.response?.data?.detail || err.message || 'Failed to compare articles. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const renderResultCard = (result, title) => {
    if (!result) return null;

    return (
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-bold uppercase text-slate-500">{title}</label>
            <div className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Prediction</div>
          </div>
          <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
            result.prediction === 'Real'
              ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-800 dark:text-rose-200 border border-rose-500/30'
          }`}>
            {result.prediction}
          </span>
        </div>

        <div className={`p-4 rounded-2xl border ${
          result.prediction === 'Real'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
        }`}>
          <div className="font-bold text-lg">{result.prediction.toUpperCase()} ({result.confidence}%)</div>
          <p className="text-xs mt-1 leading-5 text-slate-700 dark:text-slate-200">{result.explanation}</p>
        </div>

        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wide font-bold text-slate-500 dark:text-slate-400">Probability Breakdown</div>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-700 dark:text-slate-200">
            <div className="rounded-2xl bg-slate-100 dark:bg-slate-950/40 p-3 border border-slate-200 dark:border-slate-800">
              <div className="font-semibold">Real</div>
              <div>{(result.probability?.Real ?? 0) * 100}%</div>
            </div>
            <div className="rounded-2xl bg-slate-100 dark:bg-slate-950/40 p-3 border border-slate-200 dark:border-slate-800">
              <div className="font-semibold">Fake</div>
              <div>{(result.probability?.Fake ?? 0) * 100}%</div>
            </div>
          </div>
          <ProbabilityBar probReal={result.probability?.Real ?? 0} probFake={result.probability?.Fake ?? 0} />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center space-x-3">
          <GitCompare className="w-8 h-8 text-blue-600" />
          <span>Side-by-Side News Comparison</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Compare two articles simultaneously to evaluate relative veracity and confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
          <label className="text-xs font-bold uppercase text-slate-500">Article Sample A</label>
          <textarea
            rows={5}
            placeholder="Paste first article text..."
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
          <label className="text-xs font-bold uppercase text-slate-500">Article Sample B</label>
          <textarea
            rows={5}
            placeholder="Paste second article text..."
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-700 text-rose-700 dark:text-rose-200 text-sm font-semibold flex items-center gap-2">
          <AlertOctagon className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handleCompare}
          disabled={loading || !textA.trim() || !textB.trim()}
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 disabled:opacity-40 transition-all"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GitCompare className="w-5 h-5" />}
          <span>{loading ? 'Comparing Articles...' : 'Compare Both Articles'}</span>
        </button>
      </div>

      {(resA || resB) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderResultCard(resA, 'Article A')}
          {renderResultCard(resB, 'Article B')}
        </div>
      )}

      {conclusion && !loading && (
        <div className="rounded-3xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            <span>{conclusion}</span>
          </div>
        </div>
      )}
    </div>
  );
}
