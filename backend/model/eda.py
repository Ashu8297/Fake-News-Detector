"""
Exploratory Data Analysis (EDA) Script for ISOT Fake News Dataset.

Calculates:
- Class distribution (Fake vs Real)
- Text length & word count distributions
- Top N most common words per class
- Word Cloud generation
- Saves plots as PNG and prints analysis report
"""

import os
import sys
from collections import Counter
import pandas as pd
import matplotlib.pyplot as plt
from wordcloud import WordCloud

# Add parent directory to path to import preprocess module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from model.preprocess import preprocess_text
from dataset.generate_sample_dataset import generate_datasets


def run_eda(dataset_dir: str = None):
    """
    Executes EDA pipeline and displays/saves analytical charts.
    """
    if dataset_dir is None:
        dataset_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dataset")

    fake_path = os.path.join(dataset_dir, "Fake.csv")
    true_path = os.path.join(dataset_dir, "True.csv")

    if not (os.path.exists(fake_path) and os.path.exists(true_path)):
        print("[EDA] Datasets not found. Generating sample datasets...")
        generate_datasets()

    print("[EDA] Loading datasets...")
    df_fake = pd.read_csv(fake_path)
    df_true = pd.read_csv(true_path)

    df_fake['label'] = 0
    df_true['label'] = 1

    df_fake['full_text'] = df_fake['title'].fillna('') + ' ' + df_fake['text'].fillna('')
    df_true['full_text'] = df_true['title'].fillna('') + ' ' + df_true['text'].fillna('')

    df = pd.concat([df_fake, df_true], ignore_index=True)

    print("\n" + "="*50)
    print("        ISOT FAKE NEWS DATASET SUMMARY REPORT")
    print("="*50)
    print(f"Total Samples:      {len(df)}")
    print(f"Fake News Samples:  {len(df_fake)} (Label 0)")
    print(f"Real News Samples:  {len(df_true)} (Label 1)")

    # Text length & word count distributions
    df['char_length'] = df['full_text'].apply(len)
    df['word_count'] = df['full_text'].apply(lambda t: len(t.split()))

    print("\nText Word Count Statistics:")
    print(f"  Fake News Avg Word Count: {df[df['label']==0]['word_count'].mean():.2f}")
    print(f"  Real News Avg Word Count: {df[df['label']==1]['word_count'].mean():.2f}")

    # Preprocess text for word frequency analysis
    print("\n[EDA] Preprocessing text for term analysis...")
    df['cleaned_text'] = df['full_text'].apply(preprocess_text)

    fake_words = " ".join(df[df['label'] == 0]['cleaned_text']).split()
    real_words = " ".join(df[df['label'] == 1]['cleaned_text']).split()

    top_fake = Counter(fake_words).most_common(10)
    top_real = Counter(real_words).most_common(10)

    print("\nTop 10 Most Common Words in FAKE News:")
    for w, c in top_fake:
        print(f"  - {w}: {c}")

    print("\nTop 10 Most Common Words in REAL News:")
    for w, c in top_real:
        print(f"  - {w}: {c}")

    # Plot Visualizations
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    fig.suptitle("ISOT Fake News Dataset - Exploratory Data Analysis", fontsize=16, fontweight='bold')

    # Graph 1: Class Distribution
    counts = [len(df_fake), len(df_true)]
    labels = ['Fake (0)', 'Real (1)']
    colors = ['#EF4444', '#10B981']
    axes[0, 0].bar(labels, counts, color=colors, edgecolor='black', alpha=0.8)
    axes[0, 0].set_title("Class Distribution", fontsize=12, fontweight='bold')
    axes[0, 0].set_ylabel("Count")
    for i, v in enumerate(counts):
        axes[0, 0].text(i, v / 2, str(v), ha='center', va='center', fontweight='bold', color='white')

    # Graph 2: Word Count Distribution
    axes[0, 1].hist(df[df['label'] == 0]['word_count'], bins=20, alpha=0.6, label='Fake', color='#EF4444')
    axes[0, 1].hist(df[df['label'] == 1]['word_count'], bins=20, alpha=0.6, label='Real', color='#10B981')
    axes[0, 1].set_title("Text Word Count Distribution", fontsize=12, fontweight='bold')
    axes[0, 1].set_xlabel("Word Count")
    axes[0, 1].set_ylabel("Frequency")
    axes[0, 1].legend()

    # Graph 3: Top 10 Words in Fake News
    fake_top_df = pd.DataFrame(top_fake, columns=['word', 'count'])
    axes[1, 0].barh(fake_top_df['word'], fake_top_df['count'], color='#EF4444', alpha=0.8)
    axes[1, 0].set_title("Top 10 Common Words (Fake News)", fontsize=12, fontweight='bold')
    axes[1, 0].invert_yaxis()

    # Graph 4: Top 10 Words in Real News
    real_top_df = pd.DataFrame(top_real, columns=['word', 'count'])
    axes[1, 1].barh(real_top_df['word'], real_top_df['count'], color='#10B981', alpha=0.8)
    axes[1, 1].set_title("Top 10 Common Words (Real News)", fontsize=12, fontweight='bold')
    axes[1, 1].invert_yaxis()

    plt.tight_layout(rect=[0, 0.03, 1, 0.95])

    save_plot_path = os.path.join(dataset_dir, "eda_plots.png")
    plt.savefig(save_plot_path, dpi=300)
    print(f"\n[EDA] Analytical charts saved to: {save_plot_path}")

    # Generate Word Clouds
    try:
        wc_fake = WordCloud(width=600, height=400, background_color='white').generate(" ".join(fake_words))
        wc_fake.to_file(os.path.join(dataset_dir, "wordcloud_fake.png"))

        wc_real = WordCloud(width=600, height=400, background_color='white').generate(" ".join(real_words))
        wc_real.to_file(os.path.join(dataset_dir, "wordcloud_real.png"))
        print("[EDA] Word cloud images generated successfully.")
    except Exception as e:
        print(f"[EDA] Note on WordCloud: {e}")

    plt.close('all')


if __name__ == "__main__":
    run_eda()
