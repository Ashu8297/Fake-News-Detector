"""
Main Entry Point for TruthLens AI FastAPI Backend.
"""

import logging
import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger("truthlens.main")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

from routes.health_routes import router as health_router
from routes.predict_routes import router as predict_router
from routes.auth_routes import router as auth_router
from services.db_service import init_db
from model.train import train_and_select_best_model


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing SQLite database...")
    init_db()

    saved_models_dir = os.path.join(BASE_DIR, "saved_models")
    model_path = os.path.join(saved_models_dir, "fake_news_model.joblib")
    vectorizer_path = os.path.join(saved_models_dir, "tfidf_vectorizer.joblib")

    if not (os.path.exists(model_path) and os.path.exists(vectorizer_path)):
        logger.info("Trained model files missing. Executing auto-training pipeline...")
        try:
            train_and_select_best_model()
        except Exception as err:
            logger.warning("Auto-training skipped due to error: %s", err)
    else:
        logger.info("Found pre-trained ML model and vectorizer assets.")

    yield


app = FastAPI(
    title="TruthLens AI - Intelligent Fake News Detection API",
    description="AI Fake News Detection API for raw text analysis with explainable veracity classification.",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    detail = exc.detail if isinstance(exc.detail, str) else "Request failed."
    logger.warning("HTTP %s for %s: %s", exc.status_code, request.url.path, detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": detail,
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning("Validation failed for %s: %s", request.url.path, exc.errors())
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation failed.",
            "errors": exc.errors(),
        },
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception for %s", request.url.path)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal Server Error.",
        }
    )

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(predict_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
