from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
# Import model prediction functions from individual model files
from Transport.transport import predict_emissions_and_risk as predict_transport_emissions_trans
from Transport.transport import calculate_monthly_summary_and_format as calculate_monthly_summary_and_format_trans
from Fuel.fuel import predict_emissions_and_risk as predict_fuel_emissions  # Import the fuel model's prediction function
from Fuel.fuel import calculate_monthly_summary_and_format as calculate_monthly_summary_and_format_fuel
from Electricity.electricity import predict_emissions_and_risk as predict_emissions_and_risk  # Import the appropriate function
from Electricity.electricity import calculate_monthly_summary_and_format as calculate_monthly_summary_and_format  # Import the appropriate function
from Explosives.explosive import predict_7_days_multiple_explosives as predict_7_days_multiple_explosives  # Import the appropriate function
from Explosives.explosive import calculate_monthly_summary_and_format as calculate_monthly_summary_and_format_explosives

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route('/ml/transport', methods=['POST'])
def ml_transport():
    """
    Flask route for the transport model that accepts input data,
    processes it, and returns predictions with risk levels.
    """
    try:
        # Parse the JSON data from the POST request
        data = request.get_json()

        # Validate incoming data
        if 'days_data' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Missing required field: days_data.'
            }), 400

        # Extract the necessary fields
        daily_transport_data = data['days_data']

        # Call the transport model's prediction function
        daily_predictions = predict_transport_emissions_trans(daily_transport_data)

        # Calculate monthly summary
        monthly_summary = calculate_monthly_summary_and_format_trans(daily_predictions)

        # Return the monthly summary as a JSON response
        response = {
            'status': 'success',
            'monthly_summary': monthly_summary
        }

        return jsonify(response), 200

    except ValueError as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f"An unexpected error occurred: {str(e)}"
        }), 500

@app.route('/ml/explosive', methods=['POST'])
def ml_explosive():
    """
    Flask route for the explosive model that accepts input data,
    processes it, and returns predictions with risk levels.
    """
    data = request.get_json()  # Get the JSON data from the request
    # Call the explosive model's prediction function
    daily_predictions = predict_7_days_multiple_explosives(data['days_data'])
    # Calculate monthly summary
    monthly_summary = calculate_monthly_summary_and_format_explosives(daily_predictions)
    return jsonify(monthly_summary)  # Return the monthly summary as a JSON response

@app.route('/ml/fuel', methods=['POST'])
def ml_fuel():
    """
    Flask route for the fuel model that accepts input data,
    processes it, and returns predictions with risk levels.
    """
    try:
        # Parse the JSON data from the POST request
        data = request.get_json()

        # Validate incoming data
        if 'days_data' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Missing required field: days_data.'
            }), 400

        # Extract the necessary fields
        daily_fuel_data = data['days_data']

        # Call the fuel model's prediction function
        daily_predictions = predict_fuel_emissions(daily_fuel_data)

        # Calculate monthly summary
        monthly_summary = calculate_monthly_summary_and_format_fuel(daily_predictions)

        # Return the monthly summary as a JSON response
        response = {
            'status': 'success',
            'monthly_summary': monthly_summary
        }

        return jsonify(response), 200

    except ValueError as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f"An unexpected error occurred: {str(e)}"
        }), 500

@app.route('/ml/electricity', methods=['POST'])
@cross_origin(origins='http://localhost:3000')  # Explicitly allow CORS on this route
def ml_electricity():
    """
    Flask route for the electricity model that accepts input data,
    processes it, and returns predictions with risk levels.
    """
    try:
        # Parse JSON data from the POST request
        data = request.get_json()

        # Validate incoming data
        if 'days_data' not in data or 'state_name' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Missing required fields: days_data or state_name.'
            }), 400

        # Extract the necessary fields
        days_data = data['days_data']
        state_name = data['state_name']

        # Call the electricity model's prediction function
        predictions = predict_emissions_and_risk(days_data, state_name)

        monthly_summary = calculate_monthly_summary_and_format(predictions)
        # Return the predictions as a JSON response
        response = {
            'status': 'success',
            'state': state_name,
            'monthly_summary': monthly_summary
        }

        return jsonify(response), 200

    except ValueError as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f"An unexpected error occurred: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=8800)  # Run Flask app on port 8800
