from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import joblib
import os
from collections import defaultdict
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error

base_dir = os.path.dirname(os.path.abspath(__file__))

# Correctly construct the relative path to the model and label encoder files
model_path = os.path.join(base_dir, 'carbon_emission_model.pkl')
label_encoder_path = os.path.join(base_dir, 'transport_label_encoder.pkl')

# Load the model and label encoder
try:
    model = joblib.load(model_path)
    transport_label_encoder = joblib.load(label_encoder_path)
except FileNotFoundError as e:
    print(f"Error: {e}")
    print(f"Model path: {model_path}")
    print(f"Label encoder path: {label_encoder_path}")
    raise  # Re-raise the exception after logging the error

def preprocess_data(dataframe):
    """
    Function to preprocess the input dataframe.
    Encodes categorical features and extracts numeric values.
    """
    dataframe.columns = dataframe.columns.str.strip()  # Clean column names

    # Encode transport_method using LabelEncoder
    dataframe['transport_method'] = transport_label_encoder.transform(dataframe['transport_method'])

    # Extract numerical values from carbonEmissions
    dataframe['carbonEmissions'] = dataframe['carbonEmissions'].apply(
        lambda x: float(eval(x)['kilograms']) if isinstance(x, str) else x
    )

    return dataframe

def split_data(dataframe):
    """
    Function to split the data into features (X) and target (y),
    and create training and testing sets.
    """
    X = dataframe[['weight_value', 'distance_value', 'transport_method']]
    y = dataframe['carbonEmissions']
    return train_test_split(X, y, test_size=0.2, random_state=42)

def assess_risk(emission_value):
    """
    Function to determine the risk level based on the emission value.
    """
    if emission_value < 500:
        return 'Low Risk'
    elif emission_value < 2000:
        return 'Moderate Risk'
    elif emission_value < 5000:
        return 'High Risk'
    else:
        return 'Severe Risk'

def predict_emissions_and_risk(days_data):
    """
    Function to predict emissions and assess risk levels for a 7-day input.
    Each day's predictions and risks are displayed.
    """
    results = []  # To store predictions and risks for all 7 days

    for day, day_data in enumerate(days_data, start=1):
        day_results = []  # Store results for one day

        for entry in day_data:
            # Extract features from the entry
            weight_unit, weight_value, distance_unit, distance_value, transport_method = entry

            # Convert transport_method to numeric
            transport_method_encoded = transport_label_encoder.transform([transport_method])[0]

            # Create a DataFrame with proper column names
            features = pd.DataFrame([[weight_value, distance_value, transport_method_encoded]],
                                    columns=['weight_value', 'distance_value', 'transport_method'])

            # Predict emissions
            predicted_emission = model.predict(features)[0]

            # Assess risk
            risk_level = assess_risk(predicted_emission)

            # Store prediction and risk level
            day_results.append({'Trasport Method':transport_method,'Predicted Emission': predicted_emission, 'Risk Level': risk_level})

        # Add day's results to the main results list
        results.append({'Day': day, 'Results': day_results})

    return results

def calculate_monthly_summary_and_format(daily_predictions):
    # Initialize structures for monthly aggregation
    monthly_emissions = defaultdict(lambda: defaultdict(list))
    monthly_risk_summary = defaultdict(lambda: defaultdict(int))
    transport_methods = defaultdict(set)
    formatted_output = []

    # Define the months and their corresponding day ranges
    months = {
        "January": range(1, 32),
        "February": range(32, 60),
        "March": range(60, 91),
        "April": range(91, 121),
        "May": range(121, 152),
        "June": range(152, 182),
        "July": range(182, 213),
        "August": range(213, 244),
        "September": range(244, 274),
        "October": range(274, 305),
        "November": range(305, 335),
        "December": range(335, 366)
    }

    # Process each day's data
    for prediction in daily_predictions:
        day_number = prediction['Day']
        month = None
        for m, day_range in months.items():
            if day_number in day_range:
                month = m
                break

        if month:
            for transport_data in prediction['Results']:
                # Aggregate monthly emissions
                monthly_emissions[month]['emissions'].append(transport_data['Predicted Emission'])

                # Count risk levels for monthly risk summary
                monthly_risk_summary[month][transport_data['Risk Level']] += 1

                # Collect transport methods
                transport_methods[month].add(transport_data['Trasport Method'])

    # Calculate monthly averages for emissions
    for month in months:
        if monthly_emissions[month]['emissions']:
            avg_emissions = sum(monthly_emissions[month]['emissions']) / len(monthly_emissions[month]['emissions'])
        else:
            avg_emissions = 0

        month_summary = {
            "Month": month,
            "Transport Methods": list(transport_methods[month]),
            "Average Emissions": avg_emissions,
            "Risk Levels": {}
        }

        # Summarize risk levels for the month
        risk_counts = monthly_risk_summary[month]
        total_risks = sum(risk_counts.values())
        for risk_level, count in risk_counts.items():
            month_summary["Risk Levels"][risk_level] = f"{(count / total_risks) * 100:.2f}%"

        formatted_output.append(month_summary)

    return formatted_output
