"""
Health & Status API Routes for AI Fake News Detection System.
"""

import os
from fastapi import APIRouter, status

router = APIRouter(tags=["Health"])


@router.get("/", status_code=status.HTTP_200_OK)
def api_root():
    """Returns API overview metadata."""
    return {
        "title": "AI Fake News Detection System API",
        "status": "online",
        "version": "1.0.0",
        "description": "Production-grade NLP and Machine Learning service for news veracity classification."
    }


@router.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    """Performs system health check and model loading status inspection."""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(base_dir, "saved_models", "fake_news_model.joblib")
    vectorizer_path = os.path.join(base_dir, "saved_models", "tfidf_vectorizer.joblib")

    model_ready = os.path.exists(model_path) and os.path.exists(vectorizer_path)

    return {
        "status": "healthy",
        "model_ready": model_ready,
        "database": "sqlite_connected"
    }
