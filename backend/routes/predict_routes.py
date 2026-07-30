"""
Multi-Modal Prediction & Fact-Checking API Routes for TruthLens AI.
Enforces a strict 20 MB maximum file size limit on PDF and Image uploads.
"""

from typing import Optional, List
from fastapi import APIRouter, HTTPException, status, Query, Response, UploadFile, File, Depends
from pydantic import BaseModel, Field

from model.predict import predict_news
from services.db_service import (
    add_prediction,
    get_history,
    delete_prediction,
    clear_all_history,
    get_all_history_for_export,
    get_dashboard_analytics,
    add_bookmark,
    get_user_bookmarks
)
from services.ai_chat_service import generate_ai_chat_response
from utils.nlp_utils import (
    validate_news_input,
    generate_csv_export,
    generate_json_export,
    extract_text_from_url,
    extract_text_from_pdf,
    extract_text_from_image,
    generate_ai_summary,
    analyze_sentiment,
    detect_emotions,
    calculate_clickbait_score,
    highlight_suspicious_keywords
)
from services.auth_service import get_current_user

router = APIRouter(tags=["Multi-Modal Prediction & Fact Checking"])

# 20 MB maximum file size limit (20 * 1024 * 1024 bytes)
MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024


class PredictRequest(BaseModel):
    text: str = Field(..., description="Raw news text or headline", min_length=3)


class UrlPredictRequest(BaseModel):
    url: str = Field(..., description="News article URL to scrape and classify")


class ChatRequest(BaseModel):
    query: str = Field(..., min_length=2, description="Question for AI Fact-Checker Assistant")


class BatchPredictRequest(BaseModel):
    articles: List[str] = Field(..., min_length=1, description="List of news articles for bulk prediction")


class BookmarkRequest(BaseModel):
    news_text: str
    prediction: str
    confidence: float


def enrich_prediction_data(raw_text: str, result: dict) -> dict:
    """Enriches standard prediction result with multi-modal AI analytics."""
    result["summary"] = generate_ai_summary(raw_text)
    result["sentiment"] = analyze_sentiment(raw_text)
    result["emotions"] = detect_emotions(raw_text)
    result["clickbait_score"] = calculate_clickbait_score(raw_text)
    result["suspicious_highlights"] = highlight_suspicious_keywords(raw_text)
    return result


@router.post("/predict", status_code=status.HTTP_200_OK)
def predict_article(request: PredictRequest, current_user: dict = Depends(get_current_user)):
    """Classifies a news article into REAL or FAKE with full AI analytics."""
    is_valid, error_msg = validate_news_input(request.text)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)

    try:
        result = predict_news(request.text)
        result = enrich_prediction_data(request.text, result)

        db_entry = add_prediction(
            news_text=request.text,
            prediction=result["prediction"],
            confidence=result["confidence"]
        )
        result["id"] = db_entry["id"]
        result["created_at"] = db_entry["created_at"]

        return {"status": "success", "data": result}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@router.post("/predict-url", status_code=status.HTTP_200_OK)
def predict_from_url(request: UrlPredictRequest, current_user: dict = Depends(get_current_user)):
    """Scrapes news article from URL and classifies veracity."""
    try:
        scraped_text = extract_text_from_url(request.url)
        is_valid, error_msg = validate_news_input(scraped_text)
        if not is_valid:
            raise HTTPException(status_code=400, detail=f"Could not extract sufficient news text from URL: {error_msg}")

        result = predict_news(scraped_text)
        result = enrich_prediction_data(scraped_text, result)
        result["source_url"] = request.url

        db_entry = add_prediction(scraped_text, result["prediction"], result["confidence"])
        result["id"] = db_entry["id"]
        result["created_at"] = db_entry["created_at"]

        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"URL Scraper error: {str(e)}")


@router.post("/predict-pdf", status_code=status.HTTP_200_OK)
async def predict_from_pdf(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    """Parses text from an uploaded PDF news report (under 20 MB) and classifies veracity."""
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a .pdf document.")

    content = await file.read()

    # Enforce 20 MB size limit check
    if len(content) > MAX_FILE_SIZE_BYTES:
        size_mb = len(content) / (1024 * 1024)
        raise HTTPException(
            status_code=400,
            detail=f"File size ({size_mb:.1f} MB) exceeds the maximum limit of 20 MB. Please upload a smaller file under 20 MB."
        )

    try:
        extracted_text = extract_text_from_pdf(content)
        result = predict_news(extracted_text)
        result = enrich_prediction_data(extracted_text, result)
        result["filename"] = file.filename

        db_entry = add_prediction(extracted_text, result["prediction"], result["confidence"])
        result["id"] = db_entry["id"]
        result["created_at"] = db_entry["created_at"]

        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF Parsing error: {str(e)}")


@router.post("/predict-image", status_code=status.HTTP_200_OK)
async def predict_from_image(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    """Extracts text from news screenshot/image (under 20 MB) using OCR and runs classification."""
    content = await file.read()

    # Enforce 20 MB size limit check
    if len(content) > MAX_FILE_SIZE_BYTES:
        size_mb = len(content) / (1024 * 1024)
        raise HTTPException(
            status_code=400,
            detail=f"File size ({size_mb:.1f} MB) exceeds the maximum limit of 20 MB. Please upload a smaller file under 20 MB."
        )

    try:
        ocr_text = extract_text_from_image(content)
        result = predict_news(ocr_text)
        result = enrich_prediction_data(ocr_text, result)
        result["filename"] = file.filename

        db_entry = add_prediction(ocr_text, result["prediction"], result["confidence"])
        result["id"] = db_entry["id"]
        result["created_at"] = db_entry["created_at"]

        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image OCR error: {str(e)}")


@router.post("/speech", status_code=status.HTTP_200_OK)
def predict_from_speech(request: PredictRequest, current_user: dict = Depends(get_current_user)):
    """Processes speech-to-text transcript and runs veracity prediction."""
    return predict_article(request)


@router.post("/chat", status_code=status.HTTP_200_OK)
def ai_fact_checker_chat(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    """Interactive AI Assistant responding to fact-checking and NLP questions."""
    reply = generate_ai_chat_response(request.query)
    return {
        "status": "success",
        "query": request.query,
        "response": reply
    }


@router.post("/batch", status_code=status.HTTP_200_OK)
def predict_batch_articles(request: BatchPredictRequest, current_user: dict = Depends(get_current_user)):
    """Bulk prediction endpoint for multiple articles."""
    results = []
    for text in request.articles:
        try:
            res = predict_news(text)
            results.append({"text": text[:100] + "...", "prediction": res["prediction"], "confidence": res["confidence"]})
        except Exception:
            results.append({"text": text[:100] + "...", "prediction": "Error", "confidence": 0.0})

    return {"status": "success", "data": results}


@router.get("/analytics", status_code=status.HTTP_200_OK)
def get_analytics_metrics(current_user: dict = Depends(get_current_user)):
    """Retrieves aggregated metrics for dashboard charts."""
    metrics = get_dashboard_analytics()
    return {"status": "success", "data": metrics}


@router.get("/history", status_code=status.HTTP_200_OK)
def fetch_history(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str = Query(""),
    current_user: dict = Depends(get_current_user)
):
    records, total = get_history(page=page, limit=limit, search=search)
    total_pages = (total + limit - 1) // limit if total > 0 else 1
    return {
        "status": "success",
        "data": records,
        "pagination": {"page": page, "limit": limit, "total_items": total, "total_pages": total_pages}
    }


@router.delete("/history/{record_id}", status_code=status.HTTP_200_OK)
def delete_single_history(record_id: int, current_user: dict = Depends(get_current_user)):
    if not delete_prediction(record_id):
        raise HTTPException(status_code=404, detail="Record not found.")
    return {"status": "success", "message": f"Deleted record {record_id}."}


@router.delete("/history", status_code=status.HTTP_200_OK)
def delete_all_history_entries(current_user: dict = Depends(get_current_user)):
    count = clear_all_history()
    return {"status": "success", "message": f"Cleared history ({count} deleted)."}


@router.get("/history/export", status_code=status.HTTP_200_OK)
def export_history(format: str = Query("csv"), current_user: dict = Depends(get_current_user)):
    records = get_all_history_for_export()
    if format.lower() == "json":
        json_data = generate_json_export(records)
        return Response(content=json_data, media_type="application/json", headers={"Content-Disposition": "attachment; filename=prediction_history.json"})

    csv_data = generate_csv_export(records)
    return Response(content=csv_data, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=prediction_history.csv"})


@router.post("/bookmarks", status_code=status.HTTP_200_OK)
def create_bookmark(request: BookmarkRequest, current_user: dict = Depends(get_current_user)):
    email = current_user.get("sub") if current_user else "anonymous@truthlens.ai"
    bm = add_bookmark(email, request.news_text, request.prediction, request.confidence)
    return {"status": "success", "data": bm}


@router.get("/bookmarks", status_code=status.HTTP_200_OK)
def fetch_bookmarks(current_user: dict = Depends(get_current_user)):
    email = current_user.get("sub") if current_user else "anonymous@truthlens.ai"
    bms = get_user_bookmarks(email)
    return {"status": "success", "data": bms}
