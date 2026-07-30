"""
AI Chat Fact-Checking Assistant Engine for TruthLens AI.
"""

def generate_ai_chat_response(query: str) -> str:
    """
    Generates intelligent responses for fact-checking, machine learning,
    and misinformation inquiries.
    """
    lower = query.lower().strip()

    if "why" in lower and ("fake" in lower or "misinformation" in lower):
        return (
            "TruthLens AI classifies articles as FAKE when they display high concentrations of "
            "sensational wording (e.g. 'SHOCKING', 'SECRET'), clickbait formatting, low similarity to "
            "verified news corpora, or unverified claims lacking credible citation sources."
        )

    if "tf-idf" in lower or "tfidf" in lower or "vectorizer" in lower:
        return (
            "TF-IDF (Term Frequency - Inverse Document Frequency) evaluates word importance by calculating "
            "how often a term appears in a specific article relative to its frequency across the entire ISOT dataset. "
            "TruthLens AI extracts 5,000 unigram and bigram TF-IDF features for precise ML model classification."
        )

    if "model" in lower or "algorithm" in lower or "accuracy" in lower:
        return (
            "TruthLens AI evaluates four candidate machine learning algorithms: Logistic Regression, "
            "Multinomial Naive Bayes, Linear SVM (with probability calibration), and Random Forest. "
            "The system automatically benchmarks models and selects the highest F1-Score classifier."
        )

    if "isot" in lower or "dataset" in lower:
        return (
            "The ISOT Fake News Dataset comprises thousands of real news articles from Reuters and "
            "flagged misinformation articles from unverified portals. TruthLens AI pre-processes these "
            "articles using lowercasing, stopword removal, and WordNet lemmatization."
        )

    if "how to verify" in lower or "fact check" in lower or "tips" in lower:
        return (
            "To verify news authenticity: 1) Cross-check with established news outlets, "
            "2) Inspect author credentials and publication domain, 3) Watch out for emotional clickbait titles, "
            "and 4) Use TruthLens AI for automated NLP and probability scoring."
        )

    return (
        f"TruthLens AI Fact-Checker Assistant: Regarding '{query}' — our system continuously analyzes text syntax, "
        "sentiment, clickbait probability, and TF-IDF feature distributions to help users identify misinformation."
    )
