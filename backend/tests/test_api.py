"""
Unit Tests for FastAPI Backend Endpoints using TestClient.
"""

import pytest
import sys
import os
import tempfile
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["TRUTHLENS_DB_PATH"] = os.path.join(tempfile.gettempdir(), f"truthlens_test_{os.getpid()}.db")

from main import app
from dataset.generate_sample_dataset import generate_datasets
from model.train import train_and_select_best_model

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_environment():
    import importlib
    import services.db_service as db_service
    importlib.reload(db_service)
    db_path = db_service.get_db_path()
    if os.path.exists(db_path):
        try:
            os.remove(db_path)
        except PermissionError:
            pass
    db_service.init_db()
    """Ensure trained models exist for API testing."""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_file = os.path.join(base_dir, "saved_models", "fake_news_model.joblib")
    if not os.path.exists(model_file):
        generate_datasets()
        train_and_select_best_model()


def test_google_auth_requests_profile_completion_for_new_user():
    response = client.post("/auth/google", json={
        "id_token": "test-google-token",
        "email": "new-google-user@example.com",
        "full_name": "New Google User",
        "profile_image": ""
    })
    assert response.status_code == 200
    assert response.json()["requires_profile_completion"] is True
    assert response.json()["user"] is None


def test_complete_profile_creates_account_when_terms_are_accepted():
    response = client.post("/auth/complete-profile", json={
        "provider": "google",
        "email": "new-google-user@example.com",
        "full_name": "New Google User",
        "profile_image": "",
        "terms_accepted": True
    })
    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert response.json()["user"]["email"] == "new-google-user@example.com"


def test_email_forgot_password_returns_reset_code():
    response = client.post("/auth/forgot-password", json={"email": "student@truthlens.ai"})
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["mode"] == "email"
    assert response.json()["demo_otp"]


def test_login_returns_meaningful_auth_payload():
    response = client.post("/auth/login", json={
        "email": "student@truthlens.ai",
        "password": "student123"
    })
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["message"]
    assert response.json()["access_token"]


def test_phone_forgot_password_returns_reset_code():
    response = client.post("/auth/forgot-password", json={"phone": "+919123456789"})
    assert response.status_code == 200
    assert response.json()["mode"] == "phone"
    assert response.json()["demo_otp"]


def test_health_endpoints():
    response_root = client.get("/")
    assert response_root.status_code == 200
    assert response_root.json()["status"] == "online"

    response_health = client.get("/health")
    assert response_health.status_code == 200
    assert response_health.json()["status"] == "healthy"


def test_predict_endpoint_valid():
    payload = {
        "text": "GENEVA (Reuters) - Representatives from over 190 countries finalized a climate agreement aimed at accelerating solar and wind power deployment."
    }
    res = client.post("/predict", json=payload)
    assert res.status_code == 200
    json_data = res.json()
    assert json_data["status"] == "success"
    assert "prediction" in json_data["data"]
    assert "confidence" in json_data["data"]


def test_predict_endpoint_invalid_short():
    payload = {"text": "A"}
    res = client.post("/predict", json=payload)
    assert res.status_code == 422 or res.status_code == 400


def test_history_endpoints():
    # Make a prediction first
    client.post("/predict", json={
        "text": "LONDON (Reuters) - Major global central banks signaled a cautious approach to monetary policy."
    })

    res_history = client.get("/history?page=1&limit=5")
    assert res_history.status_code == 200
    assert "data" in res_history.json()
    assert "pagination" in res_history.json()


def test_csv_export():
    res = client.get("/history/export")
    assert res.status_code == 200
    assert "text/csv" in res.headers["content-type"]
