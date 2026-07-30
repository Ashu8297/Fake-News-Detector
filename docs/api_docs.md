# API Documentation - AI Fake News Detection System

Base URL: `http://localhost:8000`

---

## 1. System Health

### GET `/`
Returns API metadata and online status.

**Response (200 OK):**
```json
{
  "title": "AI Fake News Detection System API",
  "status": "online",
  "version": "1.0.0",
  "description": "Production-grade NLP and Machine Learning service for news veracity classification."
}
```

### GET `/health`
Returns health check status and ML model initialization readiness.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "model_ready": true,
  "database": "sqlite_connected"
}
```

---

## 2. Classification & History

### POST `/predict`
Classifies a raw news article into REAL or FAKE and logs result to database.

**Request Body:**
```json
{
  "text": "WASHINGTON (Reuters) - NASA Curiosity rover discovers organic molecules in Mars crater sedimentary rock."
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "prediction": "Real",
    "confidence": 98.45,
    "probability": {
      "Fake": 0.0155,
      "Real": 0.9845
    },
    "explanation": "Classified as REAL news with 98.45% confidence using Linear SVM.",
    "keywords": ["nasa", "curiosity", "rover", "organic", "mars"],
    "cleaned_text": "washington reuters nasa curiosity rover discover organic molecule mar crater sedimentary rock",
    "id": 1,
    "created_at": "2026-07-26T00:30:00+00:00"
  }
}
```

---

### GET `/history`
Retrieves paginated prediction audit history with optional search query.

**Query Parameters:**
- `page` (default: 1): Page number
- `limit` (default: 10): Records per page
- `search` (default: ""): Filter text or prediction label

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "news_text": "WASHINGTON (Reuters)...",
      "prediction": "Real",
      "confidence": 98.45,
      "created_at": "2026-07-26T00:30:00+00:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total_items": 1,
    "total_pages": 1
  }
}
```

---

### DELETE `/history/{record_id}`
Deletes a single prediction entry by ID.

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Successfully deleted record 1."
}
```

---

### DELETE `/history`
Clears all stored prediction history records.

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Cleared all prediction history records (5 deleted)."
}
```

---

### GET `/history/export`
Exports prediction history as a downloadable `.csv` file.

**Response Header:** `Content-Type: text/csv`

---

### POST `/feedback`
Submits user feedback regarding prediction accuracy.

**Request Body:**
```json
{
  "prediction_id": 1,
  "is_accurate": true,
  "user_comment": "Accurate result!"
}
```
