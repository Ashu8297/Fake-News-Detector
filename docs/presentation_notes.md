# TruthLens AI - Major Project Presentation Outline & Speaker Notes

---

## Slide 1: Title & Project Identification
- **Title**: TruthLens AI: An Intelligent Fake News Detection & Fact Checking Platform
- **Domain**: Machine Learning, Natural Language Processing, Cybersecurity & Full-Stack Web Development
- **Presenter**: Final-Year Computer Science & Engineering Candidate

---

## Slide 2: Problem Statement & Motivation
- **Problem**: Misinformation and fake news propagate rapidly across online media, misleading the public and damaging trust.
- **Motivation**: Traditional manual fact-checking cannot scale to internet speeds. An automated NLP and ML platform provides instantaneous, empirical veracity evaluation.

---

## Slide 3: System Architecture & Workflow
- **Frontend**: React.js, Vite, Tailwind CSS v4, Framer Motion, Recharts, Axios.
- **Backend**: Python FastAPI REST API with CORS security, Pydantic validation, and JWT Authentication.
- **ML Engine**: Scikit-Learn TF-IDF vectorization (5,000 features), 4 candidate model benchmark, Joblib model persistence.
- **Database**: Multi-table SQLite database (`Users`, `PredictionHistory`, `Feedback`, `Bookmarks`).

---

## Slide 4: Natural Language Processing & Feature Engineering
- 5-Step Preprocessing: Lowercasing -> Regex URL/HTML removal -> Punctuation filtering -> Tokenization & Stopwords -> WordNet Lemmatization.
- TF-IDF Unigrams & Bigrams (`ngram_range=(1,2)`).

---

## Slide 5: Multi-Modal Capabilities & AI Analytics
- Input Modes: Raw Text, News URL Web Scraper, PDF Parser, Image/Screenshot OCR, Voice Speech-to-Text.
- AI Outputs: Real/Fake prediction, Animated Confidence Meter, 5-Bullet News Summary, Sentiment & Emotion Metrics, Clickbait Score (0-100), Suspicious Keyword Highlighter, AI Fact-Checking Chatbot.

---

## Slide 6: Demonstration & Conclusion
- Live Demo of TruthLens AI platform.
- Conclusion: TruthLens AI provides a scalable, empirical solution suitable for academic research and production deployment.
