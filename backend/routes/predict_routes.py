"""
Prediction & Fact-Checking API Routes for TruthLens AI.
"""

from typing import List
from fastapi import APIRouter, HTTPException, status, Query, Response, Depends
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
    generate_ai_summary,
    analyze_sentiment,
    detect_emotions,
    calculate_clickbait_score,
    highlight_suspicious_keywords
)
from services.auth_service import get_current_user

router = APIRouter(tags=["Prediction & Fact Checking"])


class PredictRequest(BaseModel):
    text: str = Field(..., description="Raw news text or headline", min_length=3)


class ChatRequest(BaseModel):
    query: str = Field(..., min_length=2, description="Question for AI Fact-Checker Assistant")


class BatchPredictRequest(BaseModel):
    articles: List[str] = Field(..., min_length=1, description="List of news articles for bulk prediction")


class BookmarkRequest(BaseModel):
    news_text: str
    prediction: str
    confidence: float


def enrich_prediction_data(raw_text: str, result: dict) -> dict:
    """Enriches standard prediction result with AI analytics for raw text input."""
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
