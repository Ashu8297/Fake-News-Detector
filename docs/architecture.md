# System Architecture - AI Fake News Detection System

## Overview

The AI Fake News Detection System is built as a modular multi-tier application separating NLP preprocessing, Machine Learning model inference, persistent SQLite database storage, and a modern web interface.

```
+-----------------------------------------------------------------------+
|                            USER INTERFACE                             |
|                    React.js + Vite + Tailwind CSS                     |
|           (Home, Predict, History, About, Theme Toggler)              |
+-----------------------------------------------------------------------+
                                   |
                             Axios HTTP / JSON
                                   v
+-----------------------------------------------------------------------+
|                            FASTAPI BACKEND                            |
|             CORS Middleware | Input Validation | Error Handler        |
+-----------------------------------------------------------------------+
        |                                     |
        v                                     v
+-----------------------+           +-----------------------------------+
|  NLP & PREPROCESSING  |           |          DATABASE SERVICE         |
|  - Lowercase regex    |           |   SQLite (fake_news.db)           |
|  - Tokenization       |           |   - PredictionHistory Table       |
|  - Stopwords Filter   |           +-----------------------------------+
|  - WordNet Lemma      |
+-----------------------+
        |
        v
+-----------------------------------------------------------------------+
|                       MACHINE LEARNING ENGINE                         |
|   - TF-IDF Vectorizer (max_features=5000, ngram_range=(1,2))          |
|   - Ensemble Models (Logistic Regression, Naive Bayes, Linear SVM, RF)|
|   - Best Model Persistence via Joblib                                 |
+-----------------------------------------------------------------------+
```

## Modular Components

### 1. Data Preprocessing Module (`backend/model/preprocess.py`)
Applies deterministic text transformations:
- Lowercase normalization
- URL removal (`https?://\S+|www\.\S+`)
- HTML tag stripping (`<.*?>`)
- Punctuation and digit filtering
- NLTK English stopword removal
- WordNet lemmatization

### 2. Model Training Engine (`backend/model/train.py`)
- Merges ISOT dataset `Fake.csv` (0) and `True.csv` (1)
- Extracts TF-IDF unigram and bigram features
- Benchmarks Logistic Regression, Multinomial Naive Bayes, Linear SVM (Calibrated), and Random Forest
- Evaluates Accuracy, Precision, Recall, and F1-Score
- Selects the top performing classifier based on F1-Score
- Persists model (`fake_news_model.joblib`) and vectorizer (`tfidf_vectorizer.joblib`)

### 3. Prediction Service (`backend/model/predict.py`)
- Receives raw text input
- Transforms text using pre-trained TF-IDF vectorizer
- Generates prediction label (`Real` / `Fake`), confidence score, probability distributions, explanation notes, and suspicious keyphrases.

### 4. Database Service (`backend/services/db_service.py`)
- Uses SQLite database `fake_news.db` with table `PredictionHistory`
- Auto-initializes on startup
- Provides query methods for pagination, search, single item deletion, clear all, and CSV export.
