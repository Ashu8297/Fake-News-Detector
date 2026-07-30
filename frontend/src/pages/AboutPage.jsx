import React, { useState } from 'react';
import { 
  Info, 
  BrainCircuit, 
  Database, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Code2, 
  HelpCircle, 
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('arch'); // arch | viva | presentation
  const [openViva, setOpenViva] = useState(null);

  const vivaQuestions = [
    {
      q: "Q1: What is the primary objective of TruthLens AI?",
      a: "TruthLens AI is an intelligent misinformation detection platform that classifies news text as REAL or FAKE using TF-IDF feature extraction, benchmarks multiple machine learning algorithms (Logistic Regression, Naive Bayes, Linear SVM, Random Forest), and provides AI explanations, URL scraping, PDF/Image OCR parsing, sentiment analysis, emotion detection, and clickbait scoring."
    },
    {
      q: "Q2: How does the NLP Preprocessing pipeline clean input text?",
      a: "Text passes through a 5-step pipeline: 1) Lowercase conversion, 2) Regex URL/HTML removal, 3) Punctuation & number removal, 4) Tokenization & English stopword filtering, and 5) WordNet lemmatization to isolate canonical word roots."
    },
    {
      q: "Q3: Explain the role of TF-IDF Vectorization.",
      a: "TF-IDF (Term Frequency - Inverse Document Frequency) measures term importance relative to the corpus. High TF-IDF weights indicate distinctive vocabulary. TruthLens AI extracts up to 5,000 unigram and bigram features (ngram_range=(1,2))."
    },
    {
      q: "Q4: How does the system handle multi-modal inputs (URL, PDF, OCR)?",
      a: "URL input uses BeautifulSoup to extract main article paragraphs; PDF upload uses pypdf to extract document streams; and Image/Screenshot upload uses PIL and OCR to extract headline text before passing the clean string to the prediction pipeline."
    },
    {
      q: "Q5: What security controls are implemented?",
      a: "Security features include JWT Bearer authentication, PBKDF2 HMAC SHA-256 password hashing, Pydantic input validation, CORS protection, SQL injection prevention via parameterized SQLite queries, and error handling middleware."
    }
  ];

  const presentationNotes = [
    { slide: "Slide 1: Title & Project Overview", notes: "TruthLens AI: An Intelligent Fake News Detection & Fact-Checking Platform designed for final-year Computer Science project evaluation." },
    { slide: "Slide 2: Problem Statement & Motivation", notes: "The rapid spread of online misinformation poses severe societal risks. Manual fact-checking is slow; TruthLens AI provides instant, automated empirical verification." },
    { slide: "Slide 3: System Architecture & Workflow", notes: "Highlight the multi-tier architecture: React SPA -> FastAPI REST API -> Scikit-learn NLP Engine -> SQLite History Database." },
    { slide: "Slide 4: Machine Learning & NLP Results", notes: "Discuss the ISOT dataset evaluation: 5,000 TF-IDF features, benchmark results for 4 candidate classifiers, and 100% F1-score selection." },
    { slide: "Slide 5: Live Demonstration & Features", notes: "Demonstrate multi-modal classification (Text, URL, PDF, OCR, Voice), animated confidence gauge, 5-bullet summary, sentiment gauges, and dashboard charts." }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          TruthLens AI Project Documentation
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Complete academic guide including system architecture, Viva defense questions, and presentation slides.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-2 p-1.5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('arch')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'arch' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          System Architecture
        </button>
        <button
          onClick={() => setActiveTab('viva')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'viva' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Viva Defense Q&A
        </button>
        <button
          onClick={() => setActiveTab('presentation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'presentation' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Presentation Slide Notes
        </button>
      </div>

      {/* Tab 1: System Architecture */}
      {activeTab === 'arch' && (
        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Multi-Tier Architecture Specification</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              TruthLens AI decouples the React SPA frontend from the FastAPI Python backend service. Communication is executed over REST JSON endpoints with CORS security and optional JWT authentication headers.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Viva Q&A Guide */}
      {activeTab === 'viva' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
            <HelpCircle className="w-6 h-6" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Project Viva Defense Q&A</h3>
          </div>
          <div className="space-y-3">
            {vivaQuestions.map((viva, idx) => (
              <div key={idx} className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <button
                  onClick={() => setOpenViva(openViva === idx ? null : idx)}
                  className="w-full p-4 text-left flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  <span>{viva.q}</span>
                  {openViva === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openViva === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/50 leading-relaxed">
                    {viva.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Presentation Slide Notes */}
      {activeTab === 'presentation' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
            <FileText className="w-6 h-6" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Final Year Project Presentation Slide Notes</h3>
          </div>
          <div className="space-y-3">
            {presentationNotes.map((slide, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-xs text-blue-600 dark:text-blue-400">{slide.slide}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{slide.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
