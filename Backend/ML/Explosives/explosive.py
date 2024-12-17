# Import necessary libraries
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os
from collections import defaultdict
import json
from flask import Flask, request, jsonify

app = Flask(__name__)

# Initialize the LabelEncoder instance
le = LabelEncoder()
scaler = StandardScaler()
model = RandomForestRegressor()
# Set the base directory and paths to the model, label encoder, and scaler
base_dir = os.path.dirname(os.path.abspath(__file__))
scaler_path = os.path.join(base_dir, 'scaler.pkl')
label_encoder_path = os.path.join(base_dir, 'label_encoder.pkl')
model_path = os.path.join(base_dir, 'random_forest_model.pkl')

# Load the LabelEncoder from the file
le = joblib.load(label_encoder_path)
scaler = joblib.load(scaler_path)
model = joblib.load(model_path)
# Now, 'le' is correctly loaded as an instance of LabelEncoder

# Function to handle unseen explosive types
def safe_transform(encoder, value):
    # Ensure the value is a string before transforming
    if not isinstance(value, str):
        print(f"Warning: '{value}' is not a string, returning placeholder value!")
        return -1  # Return a placeholder value if the input is not a string

    try:
        # Try transforming the value
        return encoder.transform([value])[0]
    except ValueError:
        # If the value is not recognized by the encoder, return a placeholder value
        print(f"Warning: '{value}' is an unseen category! Returning placeholder value.")
        return -1  # Assign a placeholder value for unseen types

# Risk evaluation thresholds
def risk_evaluation(row):
    thresholds = {
        'CO': [400, 700, 1000],
        'NOx': [20, 40, 60],
        'NH3': [50, 80, 120],
        'HCN': [20, 50, 80],
        'H2S': [20, 50, 80],
        'SO2': [1, 5, 10],
        'CO2': [1000, 5000, 10000]
    }

    risks = {}
    for gas, levels in thresholds.items():
        value = row.get(gas, 0)  # Safely get the value for the gas, default to 0 if not present
        if value > levels[2]:
            risks[gas] = "Severe"
        elif value > levels[1]:
            risks[gas] = "High"
        elif value > levels[0]:
            risks[gas] = "Moderate"
        else:
            risks[gas] = "Low"
    return risks

# Function to predict emissions and evaluate risks for multiple explosives per day
def predict_7_days_multiple_explosives(input_data):
    """
    Predict emissions and evaluate risks for each day over 7 days, where each day can contain one or more explosive types.

    Parameters:
    input_data (list of lists): List containing explosive types and amounts for each day.
                                E.g., [['TNT', 3000], ['Dynamite', 2000], ...]

    Returns:
    dict: Dictionary with predictions for each day.
    """
    all_predictions = {}

    # Loop through each day in the input data (days can have multiple explosives)
    for day, explosives in enumerate(input_data, start=1):
        daily_predictions = []

        for explosive_type, amount in explosives:
            # Prepare a DataFrame for the explosive
            input_df = pd.DataFrame([[explosive_type, amount]], columns=['explosiveType', 'amount'])

            # Encode explosive type
            input_df['explosiveType'] = input_df['explosiveType'].apply(lambda x: safe_transform(le, x))

            # Scale the input data
            input_df_scaled = scaler.transform(input_df)

            # Predict emissions for this explosive type
            predicted_emissions = model.predict(input_df_scaled)

            # Create a DataFrame for the predictions
            predicted_df = pd.DataFrame(predicted_emissions, columns=['CO', 'NOx', 'NH3', 'HCN', 'H2S', 'SO2', 'CO2'])

            # Add the explosive type as a new column
            predicted_df['Explosive Type'] = explosive_type

            # Add risk evaluations
            predicted_df['Risk Evaluation'] = predicted_df.apply(risk_evaluation, axis=1)

            ordered_columns = ['Explosive Type', 'Risk Evaluation', 'CO', 'NOx', 'NH3', 'HCN', 'H2S', 'SO2', 'CO2']
            ordered_df = predicted_df[ordered_columns]

            # Convert the DataFrame to a dictionary with the correct column order
            daily_predictions.append(ordered_df.to_dict(orient='records'))

        # Store the predictions for the day
        all_predictions[f"Day {day}"] = daily_predictions

    return all_predictions

def calculate_monthly_summary_and_format(all_predictions):
    # Initialize structures for monthly aggregation
    monthly_emissions = defaultdict(lambda: defaultdict(list))
    monthly_risk_summary = defaultdict(lambda: defaultdict(int))
    explosive_types = defaultdict(set)
    formatted_output = []

    # Define the months and their corresponding day ranges
    months = {
        "January": range(1, 31),
        "February": range(31, 60),
        "March": range(61, 91),
        "April": range(91, 121),
        "May": range(121, 151),
        "June": range(151, 181),
        "July": range(181, 212),
        "August": range(212, 243),
        "September": range(243, 273),
        "October": range(273, 304),
        "November": range(304, 334),
        "December": range(334, 365)
    }

    # Process each day's data
    for day, day_data in all_predictions.items():
        day_number = int(day.split()[1])
        month = None
        for m, day_range in months.items():
            if day_number in day_range:
                month = m
                break

        if month:
            for explosive_group in day_data:
                for explosive in explosive_group:
                    # Aggregate monthly emissions
                    for gas in ["CO", "NOx", "NH3", "HCN", "H2S", "SO2", "CO2"]:
                        monthly_emissions[month][gas].append(explosive[gas])

                    # Count risk levels for monthly risk summary
                    for gas, risk_level in explosive["Risk Evaluation"].items():
                        monthly_risk_summary[month][f"{gas} - {risk_level}"] += 1

                    # Collect explosive types
                    explosive_types[month].add(explosive["Explosive Type"])

    # Calculate monthly averages for emissions
    for month in months:
        month_summary = {
            "Month": month,
            "Explosive Type": list(explosive_types[month]),
            "Emissions": {gas: 0 for gas in ["CO", "NOx", "NH3", "HCN", "H2S", "SO2", "CO2"]},
            "Risk Evaluation": {}
        }

        # Calculate average emissions for the month
        for gas, values in monthly_emissions[month].items():
            month_summary["Emissions"][gas] = sum(values) / len(values) if values else 0

        # Summarize risk levels for the month
        risk_counts = monthly_risk_summary[month]
        total_risks = sum(risk_counts.values())
        for risk, count in risk_counts.items():
            gas, risk_level = risk.split(" - ")
            month_summary["Risk Evaluation"][gas] = f"{risk_level} - {(count / total_risks) * 100:.2f}%"

        formatted_output.append(month_summary)

    return formatted_output