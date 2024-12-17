import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

function EmissionsPerTon() {
  const [coalMined, setCoalMined] = useState("");
  const [emissionsData, setEmissionsData] = useState([]);
  const [selectedRange, setSelectedRange] = useState("day");
  const [chartData, setChartData] = useState(null);

  const fetchData = async (range) => {
    try {
      const today = new Date();
      let startDate;
      if (range === "week") {
        startDate = new Date(today.setDate(today.getDate() - 7));
      } else if (range === "month") {
        startDate = new Date(today.setMonth(today.getMonth() - 1));
      } else if (range === "year") {
        startDate = new Date(today.setFullYear(today.getFullYear() - 1));
      } else {
        startDate = new Date();
      }
      startDate.setHours(0, 0, 0, 0);

      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = new Date().toISOString().split("T")[0];

      const response = await axios.get(
        `http://localhost:5000/api/data/${formattedStartDate}/${formattedEndDate}`
      );

      const { electricity, fuelCombustion, shipping, explosion } = response.data;

      const totalCO2 = 
        electricity.reduce((sum, entry) => sum + (entry.result.CO2?.value || 0), 0) +
        fuelCombustion.reduce((sum, entry) => sum + (entry.result.CO2?.value || 0), 0) +
        shipping.reduce((sum, entry) => sum + (parseFloat(entry.result.carbonEmissions.kilograms) || 0), 0) +
        explosion.reduce((sum, entry) => sum + (parseFloat(entry.emissions.CO2) || 0), 0);

      setEmissionsData({
        totalCO2,
        electricity: electricity.reduce((sum, entry) => sum + (entry.result.CO2?.value || 0), 0),
        fuelCombustion: fuelCombustion.reduce((sum, entry) => sum + (entry.result.CO2?.value || 0), 0),
        shipping: shipping.reduce((sum, entry) => sum + (parseFloat(entry.result.carbonEmissions.kilograms) || 0), 0),
        explosion: explosion.reduce((sum, entry) => sum + (parseFloat(entry.emissions.CO2) || 0), 0),
        range,
      });

      setChartData({
        labels: ["Electricity", "Fuel Combustion", "Shipping", "Explosion"],
        datasets: [
          {
            label: `Emissions per Ton (Range: ${range})`,
            data: [
              electricity.reduce((sum, entry) => sum + (entry.result.CO2?.value || 0), 0),
              fuelCombustion.reduce((sum, entry) => sum + (entry.result.CO2?.value || 0), 0),
              shipping.reduce((sum, entry) => sum + (parseFloat(entry.result.carbonEmissions.kilograms) || 0), 0),
              explosion.reduce((sum, entry) => sum + (parseFloat(entry.emissions.CO2) || 0), 0),
            ],
            backgroundColor: [
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching emissions data:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!coalMined) return alert("Please enter the coal mined in tons.");
    fetchData(selectedRange);
  };

  const getSuggestions = () => {
    if (!emissionsData.totalCO2) return "No data available to provide suggestions.";
    if (emissionsData.totalCO2 / coalMined > 10) {
      return "Consider optimizing fuel combustion processes and reducing shipping emissions.";
    }
    return "Your emissions per ton are within acceptable limits. Keep up the sustainable practices!";
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md text-white w-full max-w-9xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Emissions Per Ton of Coal Mined</h2>
      <form onSubmit={handleSubmit} className="mb-4 flex flex-col h-400px sm:flex-row gap-4">
        <input
          type="number"
          placeholder="Enter coal mined (tons)"
          value={coalMined}
          onChange={(e) => setCoalMined(e.target.value)}
          className="p-2 rounded-md text-black w-full font-bold sm:flex-1"
        />
        <select
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
          className="p-2 rounded-md text-black w-full sm:w-auto"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
        <button type="submit" className="bg-green-500 px-4 py-2 rounded-md w-full sm:w-auto">
          Calculate
        </button>
      </form>

      {emissionsData.totalCO2 && coalMined && (
        <div className="grid grid-cols-1 lg:grid-cols-2 text-xl gap-6 mt-6">
          <div className="bg-gray-700 p-4 rounded-lg text-xl">
            <h3 className="text-3x1 font-bold mb-2">Summary</h3>
            <p className="mb-1">Total Emissions: {emissionsData.totalCO2.toFixed(2)} tCO2</p>
            <p className="mb-2">Emissions per Ton: {(emissionsData.totalCO2 / parseFloat(coalMined)).toFixed(2)} tCO2/ton</p>
            <ul className="space-y-1">
              <li>Electricity: {emissionsData.electricity.toFixed(2)} tCO2</li>
              <li>Fuel Combustion: {emissionsData.fuelCombustion.toFixed(2)} tCO2</li>
              <li>Shipping: {emissionsData.shipping.toFixed(2)} tCO2</li>
              <li>Explosion: {emissionsData.explosion.toFixed(2)} tCO2</li>
            </ul>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Suggestions</h3>
            <p>{getSuggestions()}</p>
          </div>
        </div>
      )}

{chartData && (
  <div className="mt-6 bg-gray-700 p-4 rounded-lg">
    <Line 
      data={chartData} 
      options={{ 
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          x: { ticks: { color: 'white' } },
          y: { ticks: { color: 'white' } }
        },
        plugins: {
          legend: { labels: { color: 'white' } }
        }
      }} 
      height={300} 
      datasetIdKey="id"
      datasets={[
        {
          borderColor: 'rgba(75, 192, 192, 1)', // Vibrant turquoise
          backgroundColor: 'rgba(75, 192, 192, 0.2)', 
          borderWidth: 3,
        },
        {
          borderColor: 'rgba(255, 99, 132, 1)', // Vibrant red
          backgroundColor: 'rgba(255, 99, 132, 0.2)', 
          borderWidth: 3,
        }
      ]}
    />
  </div>
)}

    </div>
  );
}

export default EmissionsPerTon;
