import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from collections import defaultdict
import joblib
import os
import logging
import json


le = LabelEncoder()
scaler = StandardScaler()
model = RandomForestRegressor()

# Set up logging
logging.basicConfig(level=logging.INFO)

# Load the LabelEncoder and scaler from files
base_dir = os.path.dirname(os.path.abspath(__file__))
scaler_path = os.path.join(base_dir,  'scaler.pkl')
label_encoder_path = os.path.join(base_dir, 'label_encoder.pkl')
model_path = os.path.join(base_dir, 'random_forest_model.pkl')

scaler = joblib.load(scaler_path)
label_encoder = joblib.load(label_encoder_path)
model = joblib.load(model_path)


# Function to preprocess the input data
def preprocess_data(input_data):
    """
    Preprocess input data for predictions with 'stateName' as the first feature.
    """
    # Convert JSON data to DataFrame
    input_df = pd.DataFrame(input_data)
    
    # Ensure required columns exist
    required_columns = ['stateName', 'energyPerTime', 'responsibleArea', 'totalArea']
    missing_columns = [col for col in required_columns if col not in input_df.columns]
    if missing_columns:
        raise ValueError(f"Missing columns in input data: {missing_columns}")
    
    # Reorder columns to match training order
    input_df = input_df[required_columns]

    # Encode 'stateName' using the LabelEncoder
    input_df['stateName'] = label_encoder.transform(input_df['stateName'])

    # Scale the features using the previously fitted scaler
    input_scaled = scaler.transform(input_df)
    
    return input_scaled

# Function to predict emissions and evaluate risk
def predict_emissions_and_risk(days_data, state_name):
    """
    Predict CO2 emissions and evaluate risk for the provided data.

    Args:
        days_data (list of dict): List of dictionaries with daily data.
        state_name (str): The state name.

    Returns:
        list of dict: Predictions with risk levels.
    """
    # Add the state name to each day's data
    for day in days_data:
        day['stateName'] = state_name
    
    # Preprocess the input data
    input_scaled = preprocess_data(days_data)

    # Predict CO2 emissions
    predictions = model.predict(input_scaled)

    # Create a response with risk levels
    response = []
    for i, predicted_co2 in enumerate(predictions):
        risk_level, predicted_value = assess_risk(predicted_co2)
        response.append({
            "Entry No ": i + 1,
            "predicted_co2": predicted_value,
            "risk_level": risk_level
        })

    return response

# Function to assess risk based on CO2 levels
def assess_risk(predicted_co2):
    """
    Assess risk level based on CO2 levels.
    """
    if predicted_co2 < 300:
        return "Low Risk", predicted_co2
    elif predicted_co2 < 700:
        return "Moderate Risk", predicted_co2
    elif predicted_co2 < 1200:
        return "High Risk", predicted_co2
    else:
        return "Severe Risk", predicted_co2

def calculate_monthly_summary_and_format(daily_predictions):
    

        monthly_emissions = defaultdict(lambda: defaultdict(list))
        monthly_risk_summary = defaultdict(lambda: defaultdict(int))
        formatted_output = []

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

        for prediction in daily_predictions:
            entry_number = prediction['Entry No ']
            month = None
            for m, entry_range in months.items():
                if entry_number in entry_range:
                    month = m
                    break

            if month:
                monthly_emissions[month]['emissions'].append(prediction['predicted_co2'])
                monthly_risk_summary[month][prediction['risk_level']] += 1

        for month in months:
            if monthly_emissions[month]['emissions']:
                avg_emissions = sum(monthly_emissions[month]['emissions']) / len(monthly_emissions[month]['emissions'])
            else:
                avg_emissions = 0

            month_summary = {
                "Month": month,
                "Average Emissions": avg_emissions,
                "Risk Levels": {}
            }

            risk_counts = monthly_risk_summary[month]
            total_risks = sum(risk_counts.values())
            for risk_level, count in risk_counts.items():
                month_summary["Risk Levels"][risk_level] = f"{(count / total_risks) * 100:.2f}%"

            formatted_output.append(month_summary)

        return formatted_output
