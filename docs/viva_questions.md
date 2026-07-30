# TruthLens AI - Viva Defense Questions & Answers Guide

This document prepares students for the major project viva voce defense, covering core concepts in Natural Language Processing (NLP), Machine Learning (ML), FastAPI Backend Architecture, Database Design, and Security.

---

### Q1: What is the main objective and novelty of TruthLens AI?
**Answer:**
TruthLens AI is an intelligent, multi-modal fact-checking platform that classifies news text into REAL or FAKE with high empirical accuracy. Unlike simple single-text classifiers, TruthLens AI provides multi-modal input processing (Raw Text, URL Scraping, PDF parsing, Image OCR, and Voice Speech-to-Text), AI explanations (bullet-point reasons), 5-bullet news summaries, sentiment & emotion metrics, clickbait scoring (0-100), and interactive Recharts analytics dashboards.

---

### Q2: Explain the Natural Language Processing (NLP) Preprocessing Pipeline.
**Answer:**
Every news string passes through a 5-stage NLP pipeline in `preprocess.py`:
1. **Lowercase Conversion**: Standardizes text representation.
2. **Regex URL & HTML Removal**: Strips hyperlinks (`https?://\S+`) and embedded tags (`<.*?>`).
3. **Punctuation & Digit Filtering**: Removes special characters and numbers to isolate words.
4. **Tokenization & Stopword Filtering**: Converts text to tokens and filters out non-informative English stopwords (e.g. "the", "and").
5. **WordNet Lemmatization**: Converts inflected words into their canonical dictionary lemmas (e.g., "discovered" -> "discover").

---

### Q3: How does TF-IDF Feature Extraction work?
**Answer:**
TF-IDF (Term Frequency - Inverse Document Frequency) evaluates word importance:
- **Term Frequency ($TF$)**: Ratio of term count within a document.
- **Inverse Document Frequency ($IDF$)**: Logarithmic ratio of total documents to documents containing the term.
$$\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \log\left(\frac{|D|}{|\{d \in D : t \in d\}|}\right)$$
TruthLens AI extracts 5,000 unigram and bigram features (`ngram_range=(1,2)`).

---

### Q4: Which Machine Learning algorithms are benchmarked?
**Answer:**
1. **Logistic Regression**: Linear probabilistic baseline.
2. **Multinomial Naive Bayes**: Fast probabilistic algorithm ideal for word counts and TF-IDF distributions.
3. **Linear SVM (Calibrated)**: Support Vector Classifier with Platt scaling probability calibration.
4. **Random Forest**: Ensemble decision tree classifier capturing complex feature interactions.
The pipeline automatically evaluates Accuracy, Precision, Recall, and F1-Score, selects the best model based on F1-Score, and saves model binaries using Joblib.

---

### Q5: How are multi-modal inputs (URL, PDF, OCR) processed?
**Answer:**
- **URL**: BeautifulSoup extracts main article paragraphs (`<p>`).
- **PDF**: `pypdf` parses raw text streams from PDF pages.
- **Image OCR**: PIL and Tesseract OCR extract headline text from uploaded screenshots.
- **Voice**: Web Speech API converts speech to text prior to TF-IDF feature transformation.

---

### Q6: What security measures protect the application?
**Answer:**
- **JWT Bearer Token Authentication**: Secures protected endpoints.
- **PBKDF2 HMAC SHA-256**: Secure password hashing with unique salts.
- **Input Validation**: Pydantic schemas enforce type safety and length boundaries.
- **SQL Injection Prevention**: Parameterized queries via SQLite.
- **CORS Protection**: Configured middleware headers.
