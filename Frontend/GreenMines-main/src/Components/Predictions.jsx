import React, { useState } from "react";
import Navbar from "./Navbar"; // Assuming Navbar is in the same directory
import axios from "axios";
import ChatAssistant from "./ChatAssistant";
import { toast } from 'react-toastify'; // Ensure you have this import

function EmissionPredictionPage() {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()-1); // Default to current year
  const [selectedCategory, setSelectedCategory] = useState(" ");
  const [selectedOption, setSelectedOption] = useState("Separate Data"); 

  const [aggregatedData, setAggregatedData] = useState(null);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPredictions(null); // Clear predictions when category changes
    setError(null); // Clear any existing error
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setPredictions(null); // Clear predictions when option changes
    setError(null); // Clear any existing error
  };

  const handleYearChange = (e) => {
    const inputYear = parseInt(e.target.value, 10);
    const currentYear = new Date().getFullYear();

    if (inputYear < currentYear) {
      setSelectedYear(inputYear);
      setError(null);  // Clear the error if the year is valid
    } else {
      setError("Year cannot be greater than the current year.");  // Set error message
    }
  };

  const fetchData = async () => {
    const startDate = `${selectedYear}-01-01`;
    const endDate = `${selectedYear}-12-31`;

    setLoading(true);
    setError(null);

    try {
      // Fetching data from your Flask API
      const response = await axios.get(
        `http://localhost:5000/api/data/${startDate}/${endDate}`
      );

      const categoryData = response.data[selectedCategory] || [];

      // Check if there's no data for the selected category
      if (categoryData.length === 0) {
        setError(
          `No data available for the selected category (${selectedCategory}) for the year ${selectedYear}.`
        );
        setPredictions(null);
        return;
      }

      // Format the data
      const formattedData = formatDataForCategory(selectedCategory, categoryData);

     
      // Send the formatted data to Flask
      const flaskRoute = getFlaskRoute(selectedCategory);
      const apiResponse = await axios.post(flaskRoute, formattedData);
      setPredictions(apiResponse.data);
    } catch (err) {
      console.error("Error:", err);
      setError("An unexpected error occurred. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };
  const formatDataForCategory = (category, data) => {
    switch (category) {
      case "fuelCombustion":
        return formatFuelData(data);
      case "electricity":
        return formatElectricityData(data);
      case "explosion":
        return formatExplosionData(data);
      case "shipping":
        return formatTransportData(data);
      default:
        throw new Error("Invalid category selected.");
    }
  };

  // Format fuel data
  const formatFuelData = (fuelData) => {
    // Create an object to group fuel data by date
    const groupedByDate = {};
  
    // Iterate over the fuel data
    fuelData.forEach((fuel) => {
      const date = new Date(fuel.createdAt).toISOString().split("T")[0]; // Extract date in YYYY-MM-DD format
  
      // If the date doesn't exist in the grouped object, initialize it
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
  
      // Push the fuel data (type and quantity) into the array for that date
      groupedByDate[date].push([fuel.fuel, fuel.quantityFuelConsumed]);
    });
  
    // Convert the grouped object into an array of arrays for `days_data`
    const daysData = Object.values(groupedByDate);
  
    return { days_data: daysData };
  };
  

  // Format electricity data
  const formatElectricityData = (data) => {
    if (!data || data.length === 0) {
      console.log("No data available for electricity. Returning default payload.");
      return {
        state_name: "Unknown",
        days_data: [],
      };
    }
  
    // Try to determine `state_name` from the first valid entry in the data
    let stateName = "Unknown"; // Default fallback
    for (let entry of data) {
      if (entry?.stateName) {
        stateName = entry.stateName;
        break;
      }
    }
  
    // Transform the `data` array into `days_data`
    const daysData = data
      .filter(entry => entry.energyPerTime !== undefined) // Filter out invalid entries
      .map(entry => ({
        energyPerTime: entry.energyPerTime || 0,
        responsibleArea: entry.responsibleArea || "N/A",
        totalArea: entry.totalArea || "N/A",
      }));
  
    return {
      state_name: stateName,
      days_data: daysData,
    };
  };
  
  
  


  // Format explosion data
  const formatExplosionData = (data) => {
    const groupedByDate = {};
  
    // Iterate over each entry in the data
    data.forEach((entry) => {
      const date = new Date(entry.createdAt).toISOString().split('T')[0];  // Extract the date in YYYY-MM-DD format
  
      // Initialize the array for that date if it doesn't exist yet
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
  
      // Push the explosive data (type and amount) into the array for that date
      groupedByDate[date].push([entry.explosiveType, entry.amount]);
    });
  
    // Convert groupedByDate into the required days_data format
    const days_data = Object.values(groupedByDate);
  
    return {
      days_data: days_data
    };
  };
  
  // Format transport data
  const formatTransportData = (data) => {
    // Group the data by day
    const groupedByDay = {};

    // Iterate over the data and group by 'createdAt' (or any other date field)
    data.forEach(entry => {
        const date = new Date(entry.createdAt).toISOString().split('T')[0]; // Extract date (YYYY-MM-DD)

        // Initialize the array for that day if it doesn't exist yet
        if (!groupedByDay[date]) {
            groupedByDay[date] = [];
        }

        // Push the transport record in the desired format
        if (
            entry.weight_unit &&
            entry.weight_value &&
            entry.distance_unit &&
            entry.distance_value &&
            entry.transport_method
        ) {
            groupedByDay[date].push([
                entry.weight_unit,
                entry.weight_value,
                entry.distance_unit,
                entry.distance_value,
                entry.transport_method
            ]);
        } else {
            console.error("Missing data in entry", entry);
        }
    });

    // Convert groupedByDay into an array of days with the respective transport data
    const formattedData = Object.values(groupedByDay);

    return { days_data: formattedData };
};

  


  const getFlaskRoute = (category) => {
    switch (category) {
      case "fuelCombustion":
        return "http://127.0.0.1:8800/ml/fuel";
      case "electricity":
        return "http://127.0.0.1:8800/ml/electricity";
      case "explosion":
        return "http://127.0.0.1:8800/ml/explosive";
      case "shipping":
        return "http://127.0.0.1:8800/ml/transport";
      default:
        throw new Error("Invalid category selected.");
    }
  };

  const handleCombineEmission = async () => {
    const startDate = `${selectedYear}-01-01`;
    const endDate = `${selectedYear}-12-31`;
  
    setLoading(true);
    setError(null);
  
    try {
      // Step 1: Fetch all data from MongoDB API
      const mongoResponse = await axios.get(`http://localhost:5000/api/data/${startDate}/${endDate}`);
      const { fuelCombustion, electricity, explosion, shipping } = mongoResponse.data;
  
      // Step 2: Format data for each category
      const formattedFuelData = formatFuelData(fuelCombustion);
      const formattedElectricityData = formatElectricityData(electricity);
      const formattedExplosionData = formatExplosionData(explosion);
      const formattedTransportData = formatTransportData(shipping);
  
      // Helper function to get Flask route
      const getFlaskRoute = (category) => {
        switch (category) {
          case "fuelCombustion":
            return "http://127.0.0.1:8800/ml/fuel";
          case "electricity":
            return "http://127.0.0.1:8800/ml/electricity";
          case "explosion":
            return "http://127.0.0.1:8800/ml/explosive";
          case "shipping":
            return "http://127.0.0.1:8800/ml/transport";
          default:
            throw new Error("Invalid category selected.");
        }
      };
  
      // Step 3: Send formatted data to respective Flask routes
      const flaskRequests = [
        { category: "fuelCombustion", data: formattedFuelData },
        { category: "electricity", data: formattedElectricityData },
        { category: "explosion", data: formattedExplosionData },
        { category: "shipping", data: formattedTransportData },
      ];
  
      const flaskResponses = await Promise.all(
        flaskRequests.map(({ category, data }) =>
          axios.post(getFlaskRoute(category), data).then((res) => ({
            category,
            response: res.data,
          }))
        )
      );
  
      // Step 4: Create a JSON combining the responses
      const finalJson = {};
      flaskResponses.forEach(({ category, response }) => {
        finalJson[category] = response;
      });
  
       // Aggregate monthly data and return it
    const aggregatedData = aggregateMonthlyData(finalJson);

       // Set the aggregated data into state for React rendering
       //setAggregatedData(aggregatedData);

    return aggregatedData;
    } catch (err) {
      console.error("Error:", err);
      setError("An unexpected error occurred. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCombineEmissionSet = async () => {
    const aggregateFetched = await handleCombineEmission();
    setAggregatedData(aggregateFetched);
  }

  const aggregateMonthlyData = (finalJson) => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const aggregatedData = {};

    months.forEach((month) => {
        let totalCO2 = 0; // To hold the total CO2 emissions for the month
        let riskAggregations = {}; // To aggregate risk levels

        // Iterate over each category in finalJson
        Object.keys(finalJson).forEach((category) => {
            const categoryData = finalJson[category]?.monthly_summary;

            if (!categoryData) return;

            // Find data for the current month
            const monthData = categoryData.find((entry) => entry.Month === month);

            if (!monthData) return;

            // Add CO2 Emissions from the category (handle multiple possible fields)
            if (monthData.Emissions?.["CO2 (kg)"]) {
                totalCO2 += monthData.Emissions["CO2 (kg)"];
            }
            if (monthData["Average Emissions"]) {
                totalCO2 += monthData["Average Emissions"];
            }
            if (monthData.Emissions?.CO) {
                totalCO2 += monthData.Emissions.CO;
            }

            // Aggregate Risk Levels
            const riskData = monthData["Risk Levels"] || monthData["Risk Evaluation"];

            if (riskData) {
                Object.entries(riskData).forEach(([riskLevel, value]) => {
                    // Check if value is a string before using split
                    if (typeof value === 'string') {
                        const percentage = parseFloat(value.split("-")[1]?.trim().replace("%", "") || value.replace("%", ""));
                        riskAggregations[riskLevel] = (riskAggregations[riskLevel] || 0) + percentage;
                    } else {
                        // If it's not a string, fallback behavior (skip or handle differently)
                        console.warn(`Unexpected value for risk level ${riskLevel}: ${value}`);
                    }
                });
            }
        });

        // Normalize risk levels by dividing by the number of categories
        const totalCategories = Object.keys(finalJson).length;
        const normalizedRiskLevels = {};
        Object.entries(riskAggregations).forEach(([riskLevel, totalPercentage]) => {
            normalizedRiskLevels[riskLevel] = (totalPercentage / totalCategories).toFixed(2) + "%";
        });

        // Convert totalCO2 to tonnes (1 tonne = 1000 kg) and round to 2 decimal places
        const totalCO2InTonnes = (totalCO2 / 1000).toFixed(2);

        // Store aggregated data for the month
        aggregatedData[month] = {
            totalCO2: totalCO2InTonnes, // Rounded to 2 decimal places
            riskLevels: normalizedRiskLevels
        };
    });
  // setAggregatedData(aggregatedData);
  return aggregatedData;
};


const handleTotalyear = async () => {
  // Set loading to true when starting the data aggregation process
  setLoading(true);
  setError(null);  // Clear any previous error messages

  try {
    // First, ensure we have the aggregated monthly data from handleCombineEmission
    const aggregatedData = await handleCombineEmission();

    if (!aggregatedData) {
      throw new Error("No aggregated data available.");
    }

    let totalCO2 = 0; // To store the total CO2 emissions for the year
    let riskAggregations = {}; // To aggregate risk levels for the year

    // Iterate through each month in the aggregatedData
    Object.values(aggregatedData).forEach((monthData) => {
      // Add CO2 Emissions from each month
      totalCO2 += parseFloat(monthData.totalCO2);

      // Aggregate risk levels for each month
      const monthRiskLevels = monthData.riskLevels;
      Object.entries(monthRiskLevels).forEach(([riskLevel, percentage]) => {
        const riskPercentage = parseFloat(percentage.replace('%', ''));
        riskAggregations[riskLevel] = (riskAggregations[riskLevel] || 0) + riskPercentage;
      });
    });

    // Normalize risk levels by dividing by the number of months
    const totalMonths = Object.keys(aggregatedData).length;
    const normalizedRiskLevels = {};
    Object.entries(riskAggregations).forEach(([riskLevel, totalPercentage]) => {
      normalizedRiskLevels[riskLevel] = (totalPercentage / totalMonths).toFixed(2) + "%";
    });

    // Convert totalCO2 to tonnes and round to 2 decimal places
    const totalCO2InTonnes = totalCO2.toFixed(2);

    // Update the frontend with the calculated data
    setPredictions({
      totalCO2: totalCO2InTonnes,
      riskLevels: normalizedRiskLevels
    });
  } catch (err) {
    // Handle errors and set the error state to display in the UI
    console.error("Error in handleTotalyear:", err);
    setError("An unexpected error occurred. Please check the console for details.");
  } finally {
    // Set loading to false once the operation is completed (either success or failure)
    setLoading(false);
  }
};
  
  return (
    <div className="min-h-screen bg-[#342F49] px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full">
        <Navbar />
        <ChatAssistant />
      </div>
      <div className="w-full max-w-4xl mt-10 mx-auto bg-[#231E3D] rounded-2xl shadow-lg overflow-hidden border-2 border-[#66C5CC]">
        <div className="p-4 sm:p-8 md:p-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#66C5CC] mb-6 sm:mb-8 text-center">
            Emission Prediction Dashboard
          </h1>

          {/* Year Selection Section */}
          <div className="mb-6">
            <label className="block text-[#4da5aa] mb-2">Select Year</label>
            <input
              type="number"
              className="w-full p-3 rounded-lg border border-[#66C5CC] bg-[#342F49] text-white"
              value={selectedYear}
              min="1900"
              max={new Date().getFullYear()}
              onChange={handleYearChange}
            />
          </div>

          {/* Top-level Radio Buttons */}
          <div className="mb-6">
            <label className="block text-[#4da5aa] mb-4">Data View Option</label>
            <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6">
              {["Separate Data", "Combine Emission", "Total Year Data"].map(
                (option) => (
                  <label key={option} className="flex items-center text-base sm:text-lg">
                    <input
                      type="radio"
                      value={option}
                      checked={selectedOption === option}
                      onChange={handleOptionChange}
                      className="mr-3 w-4 h-4 sm:w-6 sm:h-6"
                    />
                    <span className="text-white">{option}</span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Show category radio buttons only if Separate Data is selected */}
          {selectedOption === "Separate Data" && (
            <div className="mb-8">
              <label className="block text-[#4da5aa] mb-4">
                Predict Emission Category
              </label>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-between gap-4 sm:gap-6">
                {["fuelCombustion", "electricity", "explosion", "shipping"].map(
                  (category) => (
                    <label key={category} className="flex items-center text-base sm:text-lg">
                      <input
                        type="radio"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={handleCategoryChange}
                        className="mr-3 w-4 h-4 sm:w-6 sm:h-6"
                      />
                      <span className="text-white capitalize">{category}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          )}
        
          {/* Predict Risk Button */}
          <div className="text-center">
            <button
              onClick={() => {
                if (selectedOption === "Separate Data") {
                  fetchData();
                } else if (selectedOption === "Combine Emission") {
                  handleCombineEmissionSet();
                } else if (selectedOption === "Total Year Data") {
                   handleTotalyear();
                }
              }}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-[#66C5CC] text-white text-base sm:text-lg font-bold rounded-lg hover:bg-[#4da5aa] transition"
            >
              Fetch and Predict Risk
            </button>
          </div>

          {/* Combined Emissions Section */}
          {selectedOption === "Combine Emission" && aggregatedData && (
            <div className="mt-6 bg-[#1d1d1f] p-4 sm:p-6 rounded-lg text-[#66C5CC]">
              <h3 className="text-xl sm:text-2xl mb-4">Combined Emissions for {selectedYear + 1}</h3>
              {Object.entries(aggregatedData).map(([month, data], index) => (
                <div key={index} className="border-b border-[#66C5CC] pb-4 mb-4">
                  <h4 className="text-lg sm:text-xl font-semibold mb-2">{month}</h4>
                  <p>
                    <strong>Total CO2e Emissions:</strong> {data.totalCO2} tonnes
                  </p>
                  <p>
                    <strong>Risk Levels:</strong>
                  </p>
                  <ul className="ml-4 list-disc">
                    {Object.entries(data.riskLevels).map(([riskLevel, percentage], idx) => (
                      <li key={idx}>
                        <strong>{riskLevel}:</strong> {percentage}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Total Year Data Section */}
          {selectedOption === "Total Year Data" && predictions && (
            <div className="mt-6 bg-[#1d1d1f] p-4 sm:p-6 rounded-lg text-[#66C5CC]">
              <h3 className="text-xl sm:text-2xl mb-4">Total Year Data for {selectedYear + 1}</h3>
              <p><strong>Total CO2 Emissions for {selectedYear + 1}:</strong> {predictions.totalCO2} tonnes</p>
              <div>
                <strong>Risk Levels:</strong>
                <ul className="ml-4 list-disc">
                  {Object.entries(predictions.riskLevels).map(([riskLevel, percentage]) => (
                    <li key={riskLevel}>
                      {riskLevel}: {percentage}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Loading or Error Message */}
          {loading && <div className="text-center mt-6 text-[#66C5CC]">Loading...</div>}
          {error && <div className="text-center mt-6 text-red-500">{error}</div>}

          {/* Display Predictions */}
          {selectedOption === "Separate Data" && predictions && !loading && (
            <div className="mt-6 bg-[#1d1d1f] p-4 sm:p-6 rounded-lg text-[#66C5CC]">
              <h3 className="text-xl sm:text-2xl mb-4"><b>{selectedYear+1}</b></h3>
              <h3 className="text-xl sm:text-2xl mb-4">Predictions for {selectedCategory}</h3>
              
              {/* Fuel Combustion Section */}
              {selectedCategory === 'fuelCombustion' && predictions.monthly_summary && (
                <div className="space-y-4">
                  {predictions.monthly_summary.map((summary, index) => (
                    <div key={index} className="border-b border-[#66C5CC] pb-4">
                      <h4 className="text-lg sm:text-xl font-semibold mb-2">{summary.Month}</h4>
                      <p className="mb-2">
                        <strong>Fuel Types:</strong> {summary["Fuel Types"].join(', ') || 'None'}
                      </p>
                      <div className="mb-2">
                        <h5 className="font-medium">Emissions:</h5>
                        <ul className="ml-4 list-disc">
                          {Object.entries(summary.Emissions).map(([key, value]) => (
                            <li key={key}>
                              <strong>{key}:</strong> {value}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium">Risk Levels:</h5>
                        <ul className="ml-4 list-disc">
                          {Object.entries(summary["Risk Levels"]).map(([emissionType, risks]) => (
                            <li key={emissionType}>
                              <strong>{emissionType}:</strong>
                              <ul className="ml-4 list-disc">
                                {Object.entries(risks).map(([riskLevel, description]) => (
                                  <li key={riskLevel}>{description}</li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Electricity Section */}
              {selectedCategory === 'electricity' && (
                <div className="space-y-4">
                  {predictions && predictions.monthly_summary ? (
                    <>
                      <p className="text-base sm:text-lg"><strong>State:</strong> {predictions.state}</p>
                      {Array.isArray(predictions.monthly_summary) && predictions.monthly_summary.length > 0 ? (
                        predictions.monthly_summary.map((monthData, index) => (
                          <div key={index} className="border-b border-[#66C5CC] pb-4">
                            <h4 className="text-lg sm:text-xl font-semibold mb-2">Month: {monthData.Month}</h4>
                            <p className="mb-2">
                              <strong>Average Emissions:</strong> {monthData["Average Emissions"]} 
                            </p>
                            <p>
                              <strong>Risk Levels:</strong>
                            </p>
                            {Object.entries(monthData["Risk Levels"]).length > 0 ? (
                              Object.entries(monthData["Risk Levels"]).map(([riskLevel, percentage], idx) => (
                                <p key={idx}>
                                  {riskLevel}: {percentage}
                                </p>
                              ))
                            ) : (
                              <p>No risk data available</p>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-red-500">
                          No monthly summary available for electricity
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-red-500">
                      Unexpected predictions format
                    </div>
                  )}
                </div>
              )}

              {/* Explosion Section */}
              {selectedCategory === 'explosion' && (
                <div className="space-y-4">
                  {predictions ? (
                    predictions.map((prediction, index) => (
                      <div key={index} className="mb-6">
                        <h3 className="text-xl sm:text-2xl font-semibold mb-4">{prediction.Month}</h3>
                        <div className="border-b border-[#66C5CC] pb-4 mb-4">
                          {/* Explosive Types */}
                          {Array.isArray(prediction['Explosive Type']) && prediction['Explosive Type'].length > 0 ? (
                            <div>
                              <p className="mb-2">
                                <strong>Explosive Type:</strong> {prediction['Explosive Type'].join(', ')}
                              </p>
                            </div>
                          ) : (
                            <p className="mb-2 text-red-500">No explosive types available</p>
                          )}

                          {/* Emissions */}
                          <div className="mb-2">
                            <h5 className="font-medium">Emissions:</h5>
                            <ul className="ml-4 list-disc">
                              {Object.entries(prediction.Emissions).map(([key, value]) => (
                                <li key={key}>
                                  <strong>{key}:</strong> {value}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Risk Evaluation */}
                          {Object.keys(prediction['Risk Evaluation']).length > 0 ? (
                            <div>
                              <h5 className="font-medium">Risk Levels:</h5>
                              <ul className="ml-4 list-disc">
                                {Object.entries(prediction['Risk Evaluation']).map(([key, value]) => (
                                  <li key={key}>
                                    <strong>{key}:</strong> {value}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <p className="mb-2 text-red-500">No risk evaluation available</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-red-500">
                      Unexpected predictions format
                    </div>
                  )}
                </div>
              )}

              {/* Shipping Section */}
              {selectedCategory === 'shipping' && (
                <div className="space-y-4">
                  {Array.isArray(predictions.monthly_summary) ? (
                    predictions.monthly_summary.map((monthData, monthIndex) => (
                      <div key={monthIndex}>
                        <h3 className="text-xl sm:text-2xl font-semibold mb-4">{monthData.Month}</h3>
                        <p className="mb-2">
                          <strong>Average Emissions CO2:</strong> {monthData["Average Emissions"]}
                        </p>
                        {Object.keys(monthData["Risk Levels"]).length > 0 ? (
                          <div>
                            <strong>Risk Levels:</strong>
                            {Object.entries(monthData["Risk Levels"]).map(([riskLevel, percentage], riskIndex) => (
                              <p key={riskIndex} className="mb-2">
                                {riskLevel}: {percentage}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p>No risk levels available for this month.</p>
                        )}
                        {monthData["Transport Methods"].length > 0 ? (
                          <div>
                            <strong>Transport Methods:</strong>
                            <ul className="ml-4 list-disc">
                              {monthData["Transport Methods"].map((method, methodIndex) => (
                                <li key={methodIndex}>{method}</li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p>No transport methods available for this month.</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-red-500">
                      No predictions available for shipping
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmissionPredictionPage;