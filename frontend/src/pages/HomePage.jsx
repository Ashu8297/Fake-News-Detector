import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Search, 
  History, 
  BrainCircuit, 
  Zap, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import axios from 'axios';

export default function HomePage({ setActivePage, setPreloadedText }) {
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  useEffect(() => {
    fetchRecent();
  }, []);

  const fetchRecent = async () => {
    setLoadingRecent(true);
    try {
      const res = await axios.get('/api/history?page=1&limit=3');
      if (res.data && res.data.data) {
        setRecentPredictions(res.data.data);
      }
    } catch (err) {
      console.log('Backend history preview notice:', err.message);
    } finally {
      setLoadingRecent(false);
    }
  };

  const sampleArticles = [
    {
      title: "NASA Rover Finds Organic Compounds on Mars",
      snippet: "WASHINGTON (Reuters) - NASA's Curiosity rover discovered complex organic molecules in 3-billion-year-old sedimentary rocks on Mars...",
      type: "Real"
    },
    {
      title: "BOMBSHELL: Secret Satellite Dishes Broadcast Microwave Control",
      snippet: "SHOCKING EXPOSE! Secret insider leaks evidence that mainstream satellite dishes transmit secret signals into homes! Share before deleted!",
      type: "Fake"
    }
  ];

  return (
    <div className="space-y-16 py-6">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-12 md:p-16 border border-slate-200/80 dark:border-slate-800">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Natural Language Processing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Detect Fake News with <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Empirical ML Precision
            </span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Verify article authenticity instantly. TruthLens AI utilizes advanced TF-IDF vectorization, lemmatization, and raw text ML classification benchmarked on the ISOT dataset to distinguish truth from sensationalized deception.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => setActivePage('predict')}
              className="flex items-center space-x-3 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition-all duration-200"
            >
              <Search className="w-5 h-5" />
              <span>Predict News Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActivePage('history')}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-all duration-200"
            >
              <History className="w-5 h-5" />
              <span>View History</span>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Core System Features</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Engineered using modern NLP preprocessing, raw text verification, and responsive design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4 hover:border-blue-500/50 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">NLP Pipeline</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Complete text cleaning: HTML removal, stopword filtering, tokenization, and WordNet lemmatization.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4 hover:border-indigo-500/50 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Ensemble ML Training</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Evaluates Logistic Regression, Naive Bayes, Linear SVM, and Random Forest; selects optimal model via F1 Score.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4 hover:border-purple-500/50 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">SQLite History & CSV</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Stores every prediction record persistently with search, pagination, single item delete, and CSV export capabilities.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Test Demo Section */}
      <section className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quick Test Presets</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Click any sample article below to auto-fill the classification tool:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleArticles.map((sample, idx) => (
            <div
              key={idx}
              onClick={() => {
                setPreloadedText(sample.snippet);
                setActivePage('predict');
              }}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-800/40 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                  sample.type === 'Real'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                }`}>
                  {sample.type} Example
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white">{sample.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{sample.snippet}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Predictions Widget */}
      {recentPredictions.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <History className="w-5 h-5 text-indigo-600" />
              <span>Recent Classifications Widget</span>
            </h3>
            <button
              onClick={() => setActivePage('history')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Full History →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentPredictions.map((pred) => (
              <div key={pred.id} className="p-4 rounded-xl glass-panel space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 font-bold rounded ${
                    pred.prediction === 'Real'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                  }`}>
                    {pred.prediction} ({pred.confidence}%)
                  </span>
                  <span className="text-slate-400">{new Date(pred.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{pred.news_text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
