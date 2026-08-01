import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Sparkles, 
  AlertOctagon, 
  Copy, 
  Check, 
  Loader2, 
  Info, 
  Tag, 
  Volume2, 
  Bookmark, 
  BrainCircuit, 
  Smile, 
  Zap
} from 'lucide-react';
import axios from 'axios';
import ConfidenceMeter from '../components/ConfidenceMeter';
import ProbabilityBar from '../components/ProbabilityBar';

export default function PredictPage({ preloadedText, setPreloadedText, showToast }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (preloadedText) {
      setText(preloadedText);
      setPreloadedText('');
    }
  }, [preloadedText, setPreloadedText]);

  const handlePredict = async () => {
    setError('');
    setLoading(true);
    setResult(null);
    setBookmarked(false);

    try {
      if (!text || !text.trim()) {
        setError('Please paste the news article text or social media post to evaluate.');
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/predict', { text: text.trim() });
      if (response && response.data && response.data.data) {
        setResult(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze news input. Please verify server status.');
    } finally {
      setLoading(false);
    }
  };


  const handleTextToSpeech = () => {
    if (!result) return;
    const speechText = `TruthLens AI classification result: ${result.prediction} news with ${result.confidence} percent confidence. ${result.explanation}`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    window.speechSynthesis.speak(utterance);
    showToast('Playing audio summary...');
  };

  const handleBookmark = async () => {
    if (!result || bookmarked) return;
    try {
      await axios.post('/api/bookmarks', {
        news_text: result.cleaned_text || text,
        prediction: result.prediction,
        confidence: result.confidence
      });
      setBookmarked(true);
      showToast('Prediction bookmarked to your profile!');
    } catch (err) {
      showToast('Failed to save bookmark.', 'error');
    }
  };

  const handleCopyResult = () => {
    if (!result) return;
    const summary = `TruthLens AI Prediction: ${result.prediction.toUpperCase()}\nConfidence: ${result.confidence}%\nReasons:\n${result.reasons?.map((r) => '• ' + r).join('\n')}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    showToast('Result copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopySummary = () => {
    if (!result?.summary) return;
    const formatted = `TruthLens AI Executive Summary:\n` + result.summary.map((b, i) => `${i + 1}. ${b}`).join('\n');
    navigator.clipboard.writeText(formatted);
    setCopiedSummary(true);
    showToast('AI Executive Summary copied to clipboard!');
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError('');
  };

  const isReal = result?.prediction === 'Real';

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          AI Fake News Detection
        </h1>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Paste any news article, social media post, or text to verify whether it is Real or Fake using AI.
        </p>
      </div>

      {/* Input Container */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-300 dark:border-slate-800">
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Article Text or Headline
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste article text or social media post here..."
            rows={8}
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleClear}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Input</span>
          </button>

          <button
            onClick={handlePredict}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-500/30 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing AI Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Veracity</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Card Section */}
      {result && !loading && (
        <div className={`p-8 rounded-3xl border shadow-xl space-y-6 transition-all duration-300 ${
          isReal 
            ? 'bg-emerald-500/10 border-emerald-500/40 dark:bg-emerald-950/20' 
            : 'bg-rose-500/10 border-rose-500/40 dark:bg-rose-950/20'
        }`}>
          
          {/* Top Bar with Gauge & Audio Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-300/60 dark:border-slate-800/60 pb-6">
            
            <div className="flex items-center space-x-6">
              <ConfidenceMeter confidence={result.confidence} isReal={isReal} size={130} />

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Veracity Result</span>
                <h2 className={`text-4xl font-extrabold ${isReal ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                  {result.prediction.toUpperCase()} NEWS
                </h2>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Clickbait Score: <span className="font-mono text-indigo-700 dark:text-indigo-400 font-bold">{result.clickbait_score?.toFixed(0)}/100</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleTextToSpeech}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100"
              >
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span>Text-to-Speech</span>
              </button>

              <button
                onClick={handleBookmark}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border ${
                  bookmarked ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>

              <button
                onClick={handleCopyResult}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

          </div>

          {/* Probability Bar */}
          {result.probability && (
            <ProbabilityBar probReal={result.probability.Real} probFake={result.probability.Fake} />
          )}

          {/* Reason Section */}
          {result.reasons && result.reasons.length > 0 && (
            <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Reason:</span>
              </div>
              <ul className="space-y-1.5 text-sm font-bold text-slate-800 dark:text-slate-100">
                {result.reasons.map((reasonText, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <span className="text-blue-600 font-extrabold">•</span>
                    <span>{reasonText}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* REDESIGNED: 5-Bullet AI Executive Key Summary */}
          {result.summary && result.summary.length > 0 && (
            <div className="p-6 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-300 dark:border-slate-800 space-y-4 shadow-lg">
              
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-wide">
                      AI News Executive Key Summary
                    </h4>
                    <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400">
                      5-Point NLP Extractive Intelligence Analysis
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCopySummary}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
                </button>
              </div>

              {/* 5 Card Bullets */}
              <div className="space-y-2.5">
                {result.summary.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start space-x-3 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span className="flex-shrink-0 px-2 py-1 rounded-lg bg-indigo-600 text-white font-mono text-[11px] font-extrabold">
                      0{idx + 1}
                    </span>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-relaxed pt-0.5">
                      {bullet}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* Sentiment & Emotion Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sentiment */}
            {result.sentiment && (
              <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Smile className="w-4 h-4 text-emerald-600" />
                  <span>Sentiment Analysis ({result.sentiment.dominant})</span>
                </div>
                <div className="text-xs space-y-1 font-semibold text-slate-800 dark:text-slate-200">
                  <div>Positive: <span className="font-bold text-emerald-600">{result.sentiment.positive}%</span></div>
                  <div>Neutral: <span className="font-bold text-blue-600">{result.sentiment.neutral}%</span></div>
                  <div>Negative: <span className="font-bold text-rose-600">{result.sentiment.negative}%</span></div>
                </div>
              </div>
            )}

            {/* Emotion */}
            {result.emotions && (
              <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Emotion Metrics</span>
                </div>
                <div className="text-xs flex flex-wrap gap-2">
                  {Object.entries(result.emotions).map(([emo, val], idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200">
                      {emo}: <strong>{val.toFixed(0)}%</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Suspicious Keywords */}
          {result.keywords && result.keywords.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Tag className="w-4 h-4 text-indigo-600" />
                <span>Indicative Tokens & Keywords</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${
                      isReal
                        ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200 border-emerald-300'
                        : 'bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200 border-rose-300'
                    }`}
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
