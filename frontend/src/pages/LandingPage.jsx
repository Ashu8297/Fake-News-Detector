import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Search, 
  BrainCircuit, 
  Zap, 
  TrendingUp, 
  Lock, 
  Bot, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle 
} from 'lucide-react';

export default function LandingPage({ setActivePage, setPreloadedText }) {
  const [openFaq, setOpenFaq] = useState(null);

  const featuresList = [
    { title: "AI Fake News Detection", desc: "ML classification into Real or Fake with confidence score for raw text input." },
    { title: "AI Explanation Generator", desc: "Bullet-point reasons explaining linguistic markers and patterns." },
    { title: "Suspicious Keyword Detection", desc: "Highlights terms like BREAKING, SHOCKING, SECRET, and EXCLUSIVE." },
    { title: "Animated Confidence Meter", desc: "Circular gauge visualizing classification certainty." },
    { title: "Fake vs Real Probabilities", desc: "Calibrated probability distribution bar." },
    { title: "5-Bullet AI Summarizer", desc: "Generates concise 5-bullet summary for long articles." },
    { title: "Sentiment Analysis", desc: "Evaluates Positive, Neutral, and Negative article tone." },
    { title: "Emotion Detection", desc: "Measures Fear, Anger, Joy, Sadness, and Surprise metrics." },
    { title: "Clickbait Score", desc: "Calculates clickbait probability index from 0 to 100." },
    { title: "Text-to-Speech Playback", desc: "Audio playback of prediction rationale." },
    { title: "SQLite Audit History", desc: "Persistent prediction logs with search and pagination." },
    { title: "Multi-Format Export", desc: "Export history to CSV and JSON formats." },
    { title: "Analytics Dashboard", desc: "Interactive Pie, Bar, and Line charts using Recharts." },
    { title: "AI Chat Assistant", desc: "Embedded chatbot answering fact-checking queries." },
    { title: "Batch Article Analysis", desc: "Predict bulk lists of news text." },
    { title: "JWT User Authentication", desc: "Secure Register, Login, and Profile authorization." },
    { title: "Saved Bookmarks", desc: "Bookmark key verification reports." },
    { title: "Admin Management Panel", desc: "User management and system performance metrics." },
    { title: "Dark / Light Mode", desc: "Smooth animated theme switching with persistence." }
  ];

  const faqs = [
    { q: "What dataset is TruthLens AI trained on?", a: "TruthLens AI is trained on the ISOT Fake News Dataset, which combines real Reuters articles with flagged misinformation across world news and politics." },
    { q: "How is raw text prepared for prediction?", a: "Input text is cleaned by removing HTML, punctuation, and stopwords, then normalized and transformed with TF-IDF for reliable truth/fake classification." },
    { q: "What algorithms are evaluated during training?", a: "The system fits 5,000 TF-IDF n-grams and benchmarks Logistic Regression, Multinomial Naive Bayes, Linear SVM (Calibrated), and Random Forest to select the top model by F1 Score." }
  ];

  const latestAiNews = [
    { title: "Global AI Safety Standards Finalized at Geneva Summit", date: "Today", tag: "AI Governance" },
    { title: "Deep Learning NLP Models Achieve New Benchmarks in Misinformation Detection", date: "Yesterday", tag: "Machine Learning" }
  ];

  return (
    <div className="space-y-16 py-4">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-12 md:p-16 border border-slate-300 dark:border-slate-800">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>TruthLens AI v2.0 • Intelligent Fact-Checking Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Empirical Fact-Checking & <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Fake News Detection
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
            Paste any news article, social media post, or raw text to determine whether it is Real or Fake using AI-powered classification and explainable insights.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setActivePage('predict')}
              className="flex items-center space-x-3 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition-all"
            >
              <Search className="w-5 h-5" />
              <span>Launch Fact-Checker</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActivePage('dashboard')}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold transition-all"
            >
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>View Analytics Dashboard</span>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Platform Capabilities Overview</h2>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            TruthLens AI combines raw text verification, Machine Learning benchmarking, and interactive visualizations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuresList.map((feat, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-300 dark:border-slate-800 space-y-2 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{feat.title}</h4>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest AI News Feed Widget */}
      <section className="glass-panel p-8 rounded-3xl border border-slate-300 dark:border-slate-800 space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span>Latest AI & Misinformation Research News</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {latestAiNews.map((news, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 font-bold">
                  {news.tag}
                </span>
                <span className="text-slate-600 dark:text-slate-400 font-bold">{news.date}</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{news.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <HelpCircle className="w-6 h-6 text-indigo-600" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel rounded-2xl border border-slate-300 dark:border-slate-800 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex justify-between items-center text-sm font-bold text-slate-900 dark:text-slate-100"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs font-medium text-slate-800 dark:text-slate-200 border-t border-slate-200 dark:border-slate-800/50 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
