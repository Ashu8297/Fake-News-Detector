"""
Text Preprocessing Module for AI Fake News Detection System.

Performs full NLP cleaning pipeline:
- Lowercase conversion
- URL removal
- HTML tag removal
- Punctuation removal
- Number removal
- Special character removal
- Extra space normalization
- Tokenization
- Stopword removal
- Lemmatization
"""

import re
import string
import nltk
from typing import List

# Ensure NLTK resources are available safely
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet', quiet=True)

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Standard English stopwords fallback set if NLTK load fails
try:
    ENGLISH_STOPWORDS = set(stopwords.words('english'))
except Exception:
    ENGLISH_STOPWORDS = {
        "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your",
        "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she",
        "her", "hers", "herself", "it", "its", "itself", "they", "them", "their",
        "theirs", "themselves", "what", "which", "who", "whom", "this", "that",
        "these", "those", "am", "is", "are", "was", "were", "be", "been", "being",
        "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an",
        "the", "and", "but", "if", "or", "because", "as", "until", "while", "of",
        "at", "by", "for", "with", "about", "against", "between", "into", "through",
        "during", "before", "after", "above", "below", "to", "from", "up", "down",
        "in", "out", "on", "off", "over", "under", "again", "further", "then",
        "once", "here", "there", "when", "where", "why", "how", "all", "any",
        "both", "each", "few", "more", "most", "other", "some", "such", "no",
        "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s",
        "t", "can", "will", "just", "don", "should", "now"
    }

lemmatizer = WordNetLemmatizer()


def preprocess_text(text: str) -> str:
    """
    Cleans raw news text by performing lowercase conversion, URL/HTML removal,
    punctuation/number filtering, tokenization, stopword removal, and lemmatization.

    Args:
        text (str): Raw input news text.

    Returns:
        str: Space-separated cleaned and lemmatized tokens.
    """
    if not isinstance(text, str) or not text.strip():
        return ""

    # 1. Lowercase conversion
    cleaned = text.lower()

    # 2. Remove URLs
    cleaned = re.sub(r'https?://\S+|www\.\S+', '', cleaned)

    # 3. Remove HTML tags
    cleaned = re.sub(r'<.*?>', '', cleaned)

    # 4. Remove punctuation
    cleaned = cleaned.translate(str.maketrans('', '', string.punctuation))

    # 5. Remove numbers
    cleaned = re.sub(r'\d+', '', cleaned)

    # 6. Remove special characters
    cleaned = re.sub(r'[^a-zA-Z\s]', '', cleaned)

    # 7. Remove extra spaces
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()

    # 8. Tokenization
    tokens = cleaned.split()

    # 9. Stopword removal & 10. Lemmatization
    cleaned_tokens: List[str] = []
    for token in tokens:
        if token not in ENGLISH_STOPWORDS and len(token) > 1:
            try:
                lemma = lemmatizer.lemmatize(token)
            except Exception:
                lemma = token
            cleaned_tokens.append(lemma)

    return " ".join(cleaned_tokens)


if __name__ == "__main__":
    sample_raw = "SHOCKING NEWS! Check out https://fake-news.com <b>Click NOW</b>! 100% true story in 2024!"
    result = preprocess_text(sample_raw)
    print(f"Raw Input:  '{sample_raw}'")
    print(f"Clean Output: '{result}'")
