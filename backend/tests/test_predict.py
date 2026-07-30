"""
Unit Tests for Machine Learning Prediction Engine.
"""

import pytest
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from dataset.generate_sample_dataset import generate_datasets
from model.train import train_and_select_best_model
from model.predict import predict_news


@pytest.fixture(scope="module", autouse=True)
def setup_model():
    """Ensures model is trained prior to running prediction tests."""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_file = os.path.join(base_dir, "saved_models", "fake_news_model.joblib")
    if not os.path.exists(model_file):
        generate_datasets()
        train_and_select_best_model()


def test_predict_real_news_structure():
    sample_text = "WASHINGTON (Reuters) - NASA Curiosity rover discovers organic molecules in Mars crater sedimentary rock."
    res = predict_news(sample_text)
    assert "prediction" in res
    assert res["prediction"] in ["Real", "Fake"]
    assert "confidence" in res
    assert 0.0 <= res["confidence"] <= 100.0
    assert "probability" in res
    assert "Real" in res["probability"]
    assert "Fake" in res["probability"]


def test_predict_empty_text_raises_error():
    with pytest.raises(ValueError):
        predict_news("")


def test_predict_short_text_raises_error():
    with pytest.raises(ValueError):
        predict_news("Hi")
