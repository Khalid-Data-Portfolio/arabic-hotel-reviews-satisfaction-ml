# Data Sources

## HARD Arabic Hotel Reviews Dataset

- Name: HARD Arabic Hotel Reviews Dataset
- Domain: Arabic hotel reviews
- Original source: GitHub
- Source link: https://github.com/abedkhooli/HARD-Arabic-Dataset-v1
- Hugging Face mirror: https://huggingface.co/datasets/Elnagara/hard
- File used: `balanced-reviews.csv`
- Records in the selected file: 93,700 reviews
- Language: Arabic, including Modern Standard Arabic and Arabic dialects
- Original review source listed by the dataset: Booking.com

## Why This Source Fits the Project

This dataset is suitable for a portfolio project focused on Arabic customer feedback because the raw reviews are real Arabic text, not translated or generated examples. It also includes review text, numeric ratings from 1 to 5, sentiment labels, hotel IDs, user IDs, and stay length.

The dataset supports:

- Customer satisfaction analysis from Arabic reviews.
- A model that predicts whether a review indicates high or low satisfaction.
- Review-term analysis for words associated with positive or negative outcomes.
- Hotel-level and stay-length summaries.

## Data Limitation

The dataset does not include a review date for each row. Because of that, it cannot support a real time-trend claim such as whether satisfaction is increasing month by month. For a client implementation, dated review data would be required to calculate satisfaction trends accurately.
