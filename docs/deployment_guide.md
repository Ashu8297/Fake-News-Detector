# Deployment Guide - AI Fake News Detection System

This guide outlines step-by-step instructions for deploying the system in production:
- **Backend**: Deployed on Render (Python FastAPI)
- **Frontend**: Deployed on Vercel (React + Vite)

---

## 1. Backend Deployment (Render)

### Step 1: Prepare Repository
Ensure `requirements.txt` and `backend/main.py` are committed to GitHub.

### Step 2: Create Web Service on Render
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set configuration parameters:
   - **Name**: `truthguard-backend-api`
   - **Root Directory**: `fake-news-detector`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

### Step 3: Deploy
Render will build the dependencies, initialize SQLite, auto-train or load pre-trained model binaries, and assign a web URL (e.g. `https://truthguard-backend-api.onrender.com`).

---

## 2. Frontend Deployment (Vercel)

### Step 1: Create Vercel Configuration
In `fake-news-detector/frontend/vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://truthguard-backend-api.onrender.com/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 2: Deploy to Vercel
1. Log in to [Vercel Dashboard](https://vercel.com/).
2. Click **Add New Project** and import your repository.
3. Set **Framework Preset** to **Vite**.
4. Set **Root Directory** to `fake-news-detector/frontend`.
5. Click **Deploy**.

Your application will be live with full HTTPS backend proxying!
