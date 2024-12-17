import pandas as pd
import numpy as np
import joblib
import json
import os
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from collections import defaultdict

label_encoder = LabelEncoder()
scaler = StandardScaler()
model = RandomForestRegressor()

# Load the LabelEncoder and scaler from files
base_dir = os.path.dirname(os.path.abspath(__file__))
scaler_path = os.path.join(base_dir, 'fuel_scaler.pkl')
label_encoder_path = os.path.join(base_dir, 'fuel_label_encoder.pkl')
model_path = os.path.join(base_dir, 'fuel_model.pkl')

model = joblib.load(model_path)
scaler = joblib.load(scaler_path)
label_encoder = joblib.load(label_encoder_path)

# Risk level function
def assign_risk(value, emission_type):
    thresholds = {
        'CO2 (kg)': [2000, 9000, 15000],
        'Nitrous Oxide CO2e (kg)': [200, 500, 1000],
        'Methane CO2e (kg)': [30, 100, 200],
        'Total Direct CO2e (kg)': [2000, 9000, 15000],
        'Indirect CO2e (kg)': [500, 1000, 1500],
        'Life Cycle CO2e (kg)': [10000, 15000, 20000]
    }

    if emission_type in thresholds:
        if value < thresholds[emission_type][0]:
            return "Low Risk"
        elif value < thresholds[emission_type][1]:
            return "Moderate Risk"
        elif value < thresholds[emission_type][2]:
            return "High Risk"
        else:
            return "Severe Risk"
    return "Unknown"

# Predict emissions and risk
def predict_emissions_and_risk(daily_fuel_data):
    """
    Predict emissions and risk levels for 7 days of fuel data.
    Args:
        daily_fuel_data (list): A list of 7 days, each containing tuples of fuel type and volume.
    Returns:
        dict: JSON-formatted predictions with risk levels.
    """
    results = []

    for day_index, fuels in enumerate(daily_fuel_data, start=1):
        for fuel_type, volume in fuels:
            # Encode fuel type and prepare data
            fuel_encoded = label_encoder.transform([fuel_type])[0]
            input_features = np.array([[fuel_encoded, volume]])  # numpy array

            # Convert input to DataFrame with the feature names used during training
            input_df = pd.DataFrame(input_features, columns=["Fuel", "Quantity Fuel Consumed (liters)"])

            # Scale the input features
            input_scaled = scaler.transform(input_df)

            # Predict emissions
            prediction = model.predict(input_scaled)[0]

            # Create result for this fuel, rounding the emission values to 3 decimal places
            fuel_result = {
                "fuel_type": fuel_type,
                "quantity_fuel_consumed_liters": volume,
                "emissions": {
                    "CO2 (kg)": round(prediction[0], 3),
                    "Nitrous Oxide CO2e (kg)": round(prediction[1], 3),
                    "Methane CO2e (kg)": round(prediction[2], 3),
                    "Total Direct CO2e (kg)": round(prediction[3], 3),
                    "Indirect CO2e (kg)": round(prediction[4], 3),
                    "Life Cycle CO2e (kg)": round(prediction[5], 3)
                },
                "risk_levels": {
                    "CO2 (kg)": assign_risk(prediction[0], "CO2 (kg)"),
                    "Nitrous Oxide CO2e (kg)": assign_risk(prediction[1], "Nitrous Oxide CO2e (kg)"),
                    "Methane CO2e (kg)": assign_risk(prediction[2], "Methane CO2e (kg)"),
                    "Total Direct CO2e (kg)": assign_risk(prediction[3], "Total Direct CO2e (kg)"),
                    "Indirect CO2e (kg)": assign_risk(prediction[4], "Indirect CO2e (kg)"),
                    "Life Cycle CO2e (kg)": assign_risk(prediction[5], "Life Cycle CO2e (kg)")
                }
            }

            # Append the result for this fuel to the daily predictions
            results.append({
                "day": day_index,
                "fuel_data": fuel_result
            })

    # Return the formatted JSON response with the "status" and "predictions" keys
    response = {
        "status": "success",
        "predictions": results
    }

    return response
def calculate_monthly_summary_and_format(daily_predictions):
    # Initialize structures for monthly aggregation
    monthly_emissions = defaultdict(lambda: defaultdict(list))
    monthly_risk_summary = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))
    fuel_types = defaultdict(set)
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
    for prediction in daily_predictions['predictions']:
        day_number = prediction['day']
        month = None
        for m, day_range in months.items():
            if day_number in day_range:
                month = m
                break

        if month:
            fuel_data = prediction['fuel_data']
            # Aggregate monthly emissions
            for emission_type, value in fuel_data['emissions'].items():
                monthly_emissions[month][emission_type].append(value)

            # Count risk levels for monthly risk summary
            for emission_type, risk_level in fuel_data['risk_levels'].items():
                monthly_risk_summary[month][emission_type][risk_level] += 1

            # Collect fuel types
            fuel_types[month].add(fuel_data['fuel_type'])

    # Calculate monthly averages for emissions
    for month in months:
        month_summary = {
            "Month": month,
            "Fuel Types": list(fuel_types[month]),
            "Emissions": {emission_type: 0 for emission_type in ["CO2 (kg)", "Nitrous Oxide CO2e (kg)", "Methane CO2e (kg)", "Total Direct CO2e (kg)", "Indirect CO2e (kg)", "Life Cycle CO2e (kg)"]},
            "Risk Levels": {}
        }

        # Calculate average emissions for the month
        for emission_type, values in monthly_emissions[month].items():
            month_summary["Emissions"][emission_type] = sum(values) / len(values) if values else 0

        # Summarize risk levels for the month
        for emission_type, risk_levels in monthly_risk_summary[month].items():
            total_risks = sum(risk_levels.values())
            risk_summary = {}
            for risk_level, count in risk_levels.items():
                risk_summary[risk_level] = f"{risk_level} - {(count / total_risks) * 100:.2f}%"
            month_summary["Risk Levels"][emission_type] = risk_summary

        formatted_output.append(month_summary)

    return formatted_output