"""
Unit Tests for NLP Text Preprocessing Module.
"""

import pytest
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from model.preprocess import preprocess_text


def test_preprocess_lowercasing():
    raw = "THIS IS A TEST ARTICLE"
    cleaned = preprocess_text(raw)
    assert cleaned == cleaned.lower()


def test_preprocess_url_removal():
    raw = "Breaking news at http://example.com/test check it out"
    cleaned = preprocess_text(raw)
    assert "http" not in cleaned
    assert "example" not in cleaned


def test_preprocess_html_removal():
    raw = "<h1>Headline</h1><p>Paragraph text here</p>"
    cleaned = preprocess_text(raw)
    assert "<h1>" not in cleaned
    assert "headline" in cleaned
    assert "paragraph" in cleaned


def test_preprocess_punctuation_and_numbers():
    raw = "Breaking 100% news!! Special report #2024."
    cleaned = preprocess_text(raw)
    assert "100" not in cleaned
    assert "2024" not in cleaned
    assert "!" not in cleaned


def test_preprocess_empty_and_invalid():
    assert preprocess_text("") == ""
    assert preprocess_text("   ") == ""
    assert preprocess_text(None) == ""
