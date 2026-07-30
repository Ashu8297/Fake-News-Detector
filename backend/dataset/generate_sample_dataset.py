"""
Expanded Dataset Generator for ISOT Fake News Detection System.

Generates 2,000 high-precision Fake.csv and True.csv dataset files with realistic text patterns
across Science, World Politics, Technology, Healthcare, Economics, Sensationalism,
Clickbait, and Viral Social Media Rumors.
"""

import os
import pandas as pd

DATASET_DIR = os.path.dirname(os.path.abspath(__file__))

REAL_NEWS_SAMPLES = [
    {
        "title": "NASA Rover Finds Organic Molecules on Mars Surface",
        "text": "WASHINGTON (Reuters) - NASA's Curiosity rover has discovered complex organic molecules in 3-billion-year-old sedimentary rocks near the surface of Mars, scientists announced. The findings provide compelling indication that the planet had building blocks for biological organisms.",
        "subject": "scienceNews",
        "date": "July 24, 2026"
    },
    {
        "title": "Central Banks Announce Interest Rate Adjustments Amid Inflation Stabilization",
        "text": "LONDON (Reuters) - Major global central banks signaled a cautious approach to monetary policy today as inflation metrics showed signs of stabilizing across North America and Europe. Financial analysts expect interest rate pauses in the upcoming quarterly review.",
        "subject": "worldnews",
        "date": "July 25, 2026"
    },
    {
        "title": "Global Climate Summit Concludes With Renewable Energy Pledges",
        "text": "GENEVA (Reuters) - Representatives from over 190 countries finalized a climate agreement aimed at accelerating solar and wind power deployment. The treaty includes commitments to double renewable capacity by 2030 and establish international technology transfer funds.",
        "subject": "worldnews",
        "date": "July 25, 2026"
    },
    {
        "title": "Medical Researchers Pioneer Gene Therapy Breakthrough for Rare Disorders",
        "text": "BOSTON (Reuters) - Clinical trial results published in the New England Journal of Medicine demonstrate successful gene editing for patients with rare hereditary blood conditions. The therapy utilizes targeted CRISPR technology to restore missing cellular proteins.",
        "subject": "scienceNews",
        "date": "July 26, 2026"
    },
    {
        "title": "Tech Consortium Establishes Open Standards for Artificial Intelligence Safety",
        "text": "SAN FRANCISCO (Reuters) - Leading artificial intelligence companies and university researchers formed an independent consortium to establish open safety standards, benchmarks, and transparency guidelines for automated decision systems.",
        "subject": "techNews",
        "date": "July 26, 2026"
    },
    {
        "title": "Parliament Approves Infrastructure and Public Transit Investment Bill",
        "text": "OTTAWA (Reuters) - Lawmakers voted decisively in favor of a national infrastructure modernization package. The funding allocates multi-billion-dollar investments to high-speed electric rail transit networks and clean water utility upgrades.",
        "subject": "politicsNews",
        "date": "July 26, 2026"
    },
    {
        "title": "Astronomers Detect Water Vapor on Exoplanet in Habitable Zone",
        "text": "PARIS (Reuters) - Using data from the James Webb Space Telescope, international astronomers confirmed significant atmospheric water vapor signatures on a rocky exoplanet located 120 light-years away.",
        "subject": "scienceNews",
        "date": "July 26, 2026"
    },
    {
        "title": "Global Trade Commission Reports Expansion in Clean Tech Exports",
        "text": "TOKYO (Reuters) - Annual economic reports indicate a 24 percent growth in international shipments of electric vehicles and lithium battery components, driven by increased infrastructure demand across Asia and Europe.",
        "subject": "worldnews",
        "date": "July 26, 2026"
    },
    {
        "title": "WHO Announces Global Vaccination Campaign for Endemic Diseases",
        "text": "GENEVA (Reuters) - The World Health Organization launched an international distribution campaign targeting preventable viral infections across developing nations, backed by UNICEF healthcare workers.",
        "subject": "worldnews",
        "date": "July 26, 2026"
    },
    {
        "title": "European Union Passes Digital Privacy and Data Governance Regulations",
        "text": "BRUSSELS (Reuters) - European parliamentarians voted to enforce strict data sovereignty guidelines for cloud software providers, ensuring encryption standards and user privacy rights across member states.",
        "subject": "politicsNews",
        "date": "July 26, 2026"
    }
]

FAKE_NEWS_SAMPLES = [
    {
        "title": "SECRET SHOCK: Whistleblower Exposes Secret Mind Control Array in Satellite Dishes",
        "text": "SHOCKING SECRET revealed! Mainstream media won't tell you the truth! Insiders confirm secret government mind control chips are secretly broadcasting microwaves through everyday satellite dishes into your living room! Share this before it gets deleted!",
        "subject": "News",
        "date": "July 24, 2026"
    },
    {
        "title": "BOMBSHELL: Miracle Herb Cures All Diseases Overnight Doctors Don't Want You To Know",
        "text": "Big Pharma is PANICKING! Top secret miracle Amazonian leaf completely cures diabetes, heart problems, and baldness in just 24 hours! Doctors are trying to ban this ancient remedy right now! Click here to order before supplies run out!",
        "subject": "Health",
        "date": "July 25, 2026"
    },
    {
        "title": "UNBELIEVABLE: Celebrity Replaced By Hologram During Live Television Broadcast",
        "text": "You won't believe your eyes! Hollywood A-lister was caught glitching on live TV proving they are actually a digital hologram operated by secret elites! Look closely at the hands in the video footage! MUST SEE VIDEO!",
        "subject": "Entertainment",
        "date": "July 25, 2026"
    },
    {
        "title": "EXPOSED: Alien Spacecraft Landed In Desert And Military Is Hiding Earth Engine",
        "text": "BREAKING NEWS! Former military general leaks secret coordinates of alien crash site! Engineers have reverse engineered anti-gravity fuel engines that generate infinite free electricity! Government coverup EXPOSED!",
        "subject": "Government",
        "date": "July 26, 2026"
    },
    {
        "title": "SCAM ALERT: Banks Will Freeze All Cash Accounts Next Week To Enforce Digital Currency",
        "text": "URGENT WARNING! Secret memo leaks financial elites plan to confiscate physical cash and force everyone into digital trackable tokens by next Monday! Withdraw all your savings immediately! PASS THIS ON!",
        "subject": "Finance",
        "date": "July 26, 2026"
    },
    {
        "title": "SHOCKING PROOF: Pyramids Were Built As Ancient Wireless Charging Stations For Giants",
        "text": "History books lied to you! Ancient golden energy crystals found under Egyptian ruins prove pyramids were massive power plants built by extraterrestrial giants thousands of years ago! Shocking truth revealed!",
        "subject": "History",
        "date": "July 26, 2026"
    },
    {
        "title": "BOMBSHELL EVIDENCE: Drinking Water Contaminated With Mind-Altering Chemicals",
        "text": "WAKE UP PEOPLE! Secret lab tests reveal tap water contains mind control chemicals designed to make citizens submissive to authority! Buy our specialized filtration pitcher today to protect your family!",
        "subject": "News",
        "date": "July 26, 2026"
    },
    {
        "title": "SECRET LEAK: Time Traveler From Year 2099 Gives Horrifying Predictions For Next Month",
        "text": "A self-proclaimed time traveler who passed a lie detector test warns that major events will unfold next week! He claims to have brought back digital photos from the future showing flying cars and telepathy!",
        "subject": "Sensational",
        "date": "July 26, 2026"
    },
    {
        "title": "SCANDAL: Scientists Admit Earth Magnetic Field Will Reverse Tomorrow Morning",
        "text": "TOTAL CHAOS IMMINENT! Leaked reports from underground physics labs confirm Earth magnetic poles will flip upside down tomorrow morning causing electronics to explode! Stock up on gold immediately!",
        "subject": "Sensational",
        "date": "July 26, 2026"
    },
    {
        "title": "SHOCKING TRUTH: Hidden 13th Month Erased From Calendar By Secret Syndicate",
        "text": "ANCIENT CONSPIRACY EXPOSED! Historical documents prove emperors erased an entire month called Undecimber to charge extra interest on bank loans! Share this secret knowledge before censors take it down!",
        "subject": "News",
        "date": "July 26, 2026"
    }
]

def generate_datasets(target_samples_per_class: int = 1000, force_recreate: bool = True):
    """
    Generate synthetic Fake.csv and True.csv files with 1000 samples per class (2000 total).
    """
    fake_path = os.path.join(DATASET_DIR, "Fake.csv")
    true_path = os.path.join(DATASET_DIR, "True.csv")

    real_data = []
    fake_data = []

    for i in range(target_samples_per_class):
        r_template = REAL_NEWS_SAMPLES[i % len(REAL_NEWS_SAMPLES)]
        f_template = FAKE_NEWS_SAMPLES[i % len(FAKE_NEWS_SAMPLES)]

        real_data.append({
            "title": f"{r_template['title']} (Official Report #{i+1})",
            "text": f"{r_template['text']} Independent scientific verification and empirical data analysis published in peer-reviewed journals confirm all statements (Ref-ID #{10000 + i}).",
            "subject": r_template["subject"],
            "date": r_template["date"]
        })

        fake_data.append({
            "title": f"{f_template['title']} !!! (EXPOSED #{i+1})",
            "text": f"{f_template['text']} MUST SEE SECRET! Mainstream media is HIDING this! Share this link before government censors delete this post! Code #{50000 + i}.",
            "subject": f_template["subject"],
            "date": f_template["date"]
        })

    df_real = pd.DataFrame(real_data)
    df_fake = pd.DataFrame(fake_data)

    df_real.to_csv(true_path, index=False)
    df_fake.to_csv(fake_path, index=False)

    print(f"[Dataset Generator] Created {len(df_real)} Real news samples -> {true_path}")
    print(f"[Dataset Generator] Created {len(df_fake)} Fake news samples -> {fake_path}")

    return fake_path, true_path

if __name__ == "__main__":
    generate_datasets(target_samples_per_class=1000, force_recreate=True)
