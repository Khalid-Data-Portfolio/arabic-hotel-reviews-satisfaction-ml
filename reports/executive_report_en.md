# Executive Report: Hotel Review Satisfaction Analysis

## Project Overview

This portfolio project analyzes real Arabic hotel reviews from the HARD Arabic Hotel Reviews Dataset. The workflow cleans review text, converts ratings into clear satisfaction indicators, and trains a machine learning model that predicts whether a review indicates high customer satisfaction.

The public dataset does not include a reliable review date column, so this project does not claim a real time trend. The same workflow can be extended with monthly satisfaction tracking when dated client data is available.

## Dataset Size

- Cleaned reviews: 93,631
- Hotels represented: 976
- Users represented: 4
- Review language: Arabic text used as model input, with English-facing reports and charts.

## Key Findings

- Average customer rating: 3.12 out of 5.
- High-satisfaction reviews, defined as rating 4 or 5: 50.0%.
- Positive sentiment label share: 50.0%.
- Top hotel in the sample, among hotels with at least 20 reviews: Hotel 1752 with an average rating of 4.82.
- Best stay-length segment by high-satisfaction share: 4-7 nights at 54.8%.

## Machine Learning Result

The model predicts high satisfaction from Arabic review text plus simple review features such as stay length, review length, and word count.

- Accuracy: 0.890
- Precision: 0.877
- Recall: 0.907
- F1-score: 0.892
- ROC-AUC: 0.953

## Business Value

This project shows an end-to-end customer feedback analytics workflow: cleaning raw review data, measuring customer satisfaction, finding stronger-performing hotel segments, and building a reusable predictive model for future review classification.

## Time Trend Note

The public dataset does not contain a date column for each review, so a true increase-or-decrease-over-time analysis cannot be calculated from this source alone. With client data that includes review dates, the same pipeline can add:

- Monthly average satisfaction.
- Monthly positive review share.
- Satisfaction increase or decrease over time.
- Alerts for periods with a clear drop in satisfaction.

## Output Files

- Cleaned data: `data/processed/arabic_hotel_reviews_cleaned.csv`
- Hotel summary: `reports/hotel_satisfaction_summary.csv`
- Stay-length summary: `reports/stay_length_satisfaction_summary.csv`
- Model metrics: `reports/model_metrics.csv`
- Model feature importance: `reports/model_feature_importance.csv`
- Sample predictions: `reports/sample_predictions.csv`
- English charts: `reports/figures/*_en.png`
- Saved model: `models/arabic_hotel_satisfaction_model.joblib`
