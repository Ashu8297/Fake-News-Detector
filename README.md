# AI Fake News Detection System 🛡️

A production-quality, modular, end-to-end Web Application for classifying news articles as **REAL** or **FAKE** using Natural Language Processing (NLP) and Machine Learning (ML).

Designed for final-year Computer Science engineering projects, research, and empirical truth verification.

---

## 🌟 Project Overview

Misinformation and fake news proliferate rapidly across web media. TruthGuard AI provides an automated pipeline that pre-processes raw news text (lowercasing, regex cleaning, tokenization, stopword removal, and WordNet lemmatization), extracts **TF-IDF unigram and bigram features**, benchmarks **4 machine learning models**, and selects the top performing classifier based on F1-Score.

Results are served via a **FastAPI REST API**, saved in a persistent **SQLite Database**, and presented through a modern, responsive **React + Vite + Tailwind CSS** glassmorphic dashboard.

---

## ✨ Features

- **Empirical NLP Preprocessing Pipeline**: Cleans raw text by stripping URLs, HTML tags, punctuation, digits, and extra spaces before tokenization, stopword filtering, and lemmatization.
- **TF-IDF Feature Extraction**: Configured with `max_features=5000` and `ngram_range=(1,2)`.
- **Ensemble Model Benchmarking**: Automatically evaluates:
  1. Logistic Regression
  2. Multinomial Naive Bayes
  3. Linear SVM (Calibrated)
  4. Random Forest
- **Auto Model Selection**: Computes Accuracy, Precision, Recall, and F1-Score, selects the best model by F1 Score, and saves assets with Joblib.
- **FastAPI REST Backend**: Validates input, rejects short text, calculates confidence percentages and calibrated probabilities, and highlights suspicious keywords.
- **SQLite History Storage**: Automatically logs all classification requests into `PredictionHistory` table (`id`, `news_text`, `prediction`, `confidence`, `created_at`).
- **Interactive React Dashboard**:
  - Dark / Light Mode theme toggler
  - Live character and word counter
  - Animated confidence progress gauge
  - Real (Green) / Fake (Red) visual badge indicators
  - Searchable and paginated prediction history table
  - Downloadable CSV history export
  - Copy prediction summary action
  - Preset news text buttons for instant testing

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js, Vite, Tailwind CSS v4, Axios, Lucide Icons | Responsive glassmorphic SPA |
| **Backend** | FastAPI, Uvicorn, Pydantic, SQLAlchemy | Production Python REST API |
| **Machine Learning** | Scikit-learn, Pandas, NumPy, Joblib | Model evaluation & persistence |
| **NLP** | NLTK (WordNet, Stopwords, Punkt) | Text cleaning & lemmatization |
| **Database** | SQLite3 (`fake_news.db`) | Prediction audit history storage |
| **Testing** | Pytest, TestClient | Automated backend unit testing |

---

## 📁 Project Structure

```
fake-news-detector/
├── backend/
│   ├── dataset/
│   │   ├── generate_sample_dataset.py   # Dataset generator (Fake.csv & True.csv)
│   │   ├── Fake.csv                     # ISOT Fake News Dataset file (Label 0)
│   │   ├── True.csv                     # ISOT Real News Dataset file (Label 1)
│   │   └── eda_plots.png                # Generated EDA visualization charts
│   ├── model/
│   │   ├── preprocess.py                # NLP text cleaning & lemmatization
│   │   ├── eda.py                       # Exploratory Data Analysis script
│   │   ├── train.py                     # ML Model trainer & selector
│   │   └── predict.py                   # Model inference & confidence calculator
│   ├── routes/
│   │   ├── health_routes.py             # GET / and GET /health
│   │   └── predict_routes.py            # POST /predict, GET/DELETE /history, /feedback
│   ├── saved_models/
│   │   ├── fake_news_model.joblib       # Best performing ML model binary
│   │   ├── tfidf_vectorizer.joblib      # Fitted TF-IDF Vectorizer
│   │   └── model_metadata.joblib        # Evaluation metrics & selected model info
│   ├── services/
│   │   └── db_service.py                # SQLite database management
│   ├── utils/
│   │   └── nlp_utils.py                 # Validation helpers & CSV exporter
│   ├── tests/
│   │   ├── test_preprocess.py           # Unit tests for text cleaning
│   │   ├── test_predict.py              # Unit tests for inference engine
│   │   └── test_api.py                  # Integration tests for FastAPI endpoints
│   ├── fake_news.db                     # SQLite database file
│   └── main.py                          # FastAPI main entry point
├── frontend/
│   ├── src/
│   │   ├── components/                  # Navbar, Footer, Toast
│   │   ├── pages/                       # Home, Predict, History, About, 404
│   │   ├── App.jsx                      # Main router component
│   │   └── index.css                    # Tailwind & Glassmorphism styles
│   ├── package.json
│   └── vite.config.js                   # Proxy config to http://localhost:8000
├── docs/
│   ├── architecture.md                  # System Architecture diagram & breakdown
│   ├── api_docs.md                      # Complete REST API specification
│   └── deployment_guide.md              # Deployment guide (Render & Vercel)
├── README.md
└── requirements.txt                     # Python dependencies
```

---

## 🚀 Installation & Running Locally

### Prerequisites
- **Python 3.9+**
- **Node.js 18+** & `npm`

---

### Step 1: Backend Setup & Dependencies

1. Navigate into `fake-news-detector/`:
   ```bash
   cd fake-news-detector
   ```

2. Create virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

---

### Step 2: Train Machine Learning Model

To train the candidate classifiers and select the best model:
```bash
python backend/model/train.py
```

> **Note:** If `Fake.csv` and `True.csv` are not present in `backend/dataset/`, `train.py` automatically generates a representative dataset so you can run the application immediately without downloading raw 100MB files. You can also place full ISOT dataset CSVs directly into `backend/dataset/`.

---

### Step 3: Run Backend API Server

Start the FastAPI server on port 8000:
```bash
python backend/main.py
```
*Or using Uvicorn directly:*
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

- API Interactive Docs (Swagger UI): `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

---

### Step 4: Run Frontend Development Server

Open a second terminal window:

1. Navigate into `frontend/`:
   ```bash
   cd fake-news-detector/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start dev server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:3000` (or `http://localhost:5173`).

---

## 🧪 Running Unit Tests

Run automated tests covering NLP preprocessing, model prediction, and FastAPI endpoints:
```bash
pytest backend/tests
```

---

## 📸 Screenshots Overview

- **Home Overview**: Hero section, quick presets, feature grid, and recent prediction widget.
- **Predict Classifier**: Character counter, animated probability progress bar, confidence score, and keyword tags.
- **Audit History**: Filterable, paginated database table with single delete and CSV export.
- **About Documentation**: Preprocessing flow chart, dataset details, and full tech stack.

---

## 📄 License

This project is open-source under the MIT License.
