import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import CarbonSinkEstimation from "./CarbonSinkEstimation";
import axios from "axios";

interface SinkEntry {
_id?: string;
type: string;
co2Absorbed: number;
date?: string;
}

const SinkGraphs = () => {
  const defaultChartData = {
    labels: ["No Data"],
    datasets: [{
      label: 'No Data',
      data: [0],
      backgroundColor: '#4CAF50',
      borderColor: '#388E3C',
      borderWidth: 2
    }]
  };
const [sinkEntries, setSinkEntries] = useState([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [sinkTypeFilter, setSinkTypeFilter] = useState('');
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Get current date in YYYY-MM-DD format
const [graphData, setGraphData] = useState({
    week: defaultChartData,
    month: defaultChartData,
    year: defaultChartData
  });
  const [graphLoading, setGraphLoading] = useState(true);
  const [graphError, setGraphError] = useState(null);

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Date range calculation utility
  const calculateDateRange = (period) => {
    const end = new Date();
    const start = new Date();

    switch(period) {
      case 'week':
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start.setMonth(end.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        return null;
    }

    // Format dates as YYYY-MM-DD
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };

    return `${formatDate(start)}/${formatDate(end)}`;
  };

  // Fetch sink entries method


  // Fetch Graph Data
  const fetchGraphData = async () => {
    setGraphLoading(true);
    setGraphError(null);

    try {
      const periods = ['week', 'month', 'year'];
      const graphDataPromises = periods.map(async (period) => {
        const dateRange = calculateDateRange(period);
        const response = await axios.get(
          `http://localhost:5000/api/existingsinks/date-range/${dateRange}`
        );

        return processGraphData(response.data.existingSinkData, period);
      });

      const [weekData, monthData, yearData] = await Promise.all(graphDataPromises);

      setGraphData({
        week: weekData,
        month: monthData,
        year: yearData
      });
    } catch (err) {
      console.error("Graph data fetch error:", err);
      setGraphError("Failed to fetch graph data");
      setGraphData({ 
        week: defaultChartData, 
        month: defaultChartData, 
        year: defaultChartData 
      });
    } finally {
      setGraphLoading(false);
    }
  };

  // Data processing method
  const processGraphData = (entries, period) => {
    const periodLabels = {
      week: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      month: ["Week 1", "Week 2", "Week 3", "Week 4"],
      year: [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
      ]
    };

    const colorSchemes = {
      week: { backgroundColor: "#4CAF50", borderColor: "#388E3C" },
      month: { backgroundColor: "#FF9800", borderColor: "#F57C00" },
      year: { backgroundColor: "#E91E63", borderColor: "#C2185B" }
    };

    // Group and sum data based on the period
    const groupedData = entries.reduce((acc, entry) => {
      const date = new Date(entry.createdAt);
      let key;

      switch(period) {
        case 'week':
          key = date.getDay();
          break;
        case 'month':
          key = Math.floor(date.getDate() / 7);
          break;
        case 'year':
          key = date.getMonth();
          break;
      }

      acc[key] = (acc[key] || 0) + entry.dailySequestrationRate;
      return acc;
    }, {});

    const data = periodLabels[period].map((_, index) => groupedData[index] || 0);

    return {
      labels: periodLabels[period],
      datasets: [{
        label: `${period.charAt(0).toUpperCase() + period.slice(1)} Sequestration`,
        data: data,
        backgroundColor: colorSchemes[period].backgroundColor,
        borderColor: colorSchemes[period].borderColor,
        borderWidth: 2
      }]
    };
  };

  // Fetch entries and graph data on component mount and filter changes
  useEffect(() => {
    fetchSinkEntries();
    fetchGraphData();
  }, [startDate, endDate, sinkTypeFilter]);

  // Initialize selected profit data with default
  const [selectedProfitData, setSelectedProfitData] = useState(defaultChartData);

  // Update selected profit data when graph data changes
  useEffect(() => {
    if (graphData.week) {
      setSelectedProfitData(graphData.week);
    }
  }, [graphData]);


// Fetch sink entries
// Updated data-fetching logic in fetchSinkEntries function
const fetchSinkEntries = async () => {
setLoading(true);
setError(null);

try {
let url = `http://localhost:5000/api/existingsinks`; // Default endpoint
const params: any = {};

// Include the sink type filter in the query parameters
if (sinkTypeFilter.trim() !== '') {
params.type = sinkTypeFilter.trim().toLowerCase(); // Ensure consistency in casing
}

// Handle date-based filtering
if (startDate && endDate) {
url = `http://localhost:5000/api/existingsinks/date-range/${startDate}/${endDate}`;
} else if (startDate) {
url = `http://localhost:5000/api/existingsinks/date/${startDate}`;
} else {
url = `http://localhost:5000/api/existingsinks/date/${getCurrentDate()}`;
}

// Fetch data with query parameters
const response = await axios.get(url, { params });

console.log("API Response:", response.data);

// Map API response to the required format
const sinkData = response.data.existingSinkData.map((entry: any) => ({
_id: entry._id,
type: entry.vegetationType, // Display vegetation type as sink type
co2Absorbed: entry.dailySequestrationRate, // Use dailySequestrationRate for CO2 absorption
}));

// Update the sink entries state
setSinkEntries(sinkData);

if (sinkData.length === 0) {
console.log("No data found for the specified criteria.");
}
} catch (err) {
console.error("Error fetching sink entries:", err);

if (err.response) {
console.error("Response error:", err.response.data);
}

setError("Failed to fetch sink entries. Please try again.");
setSinkEntries([]); // Reset sink entries on error
} finally {
setLoading(false);
}
};


// Fetch entries on component mount and when filters change


// Handle deleting a sink entry
const handleDelete = async (id: string) => {
try {
await axios.delete(`http://localhost:5000/api/existingsinks/${id}`);
setSinkEntries(prevEntries =>
prevEntries.filter(entry => entry._id !== id)
);
} catch (err) {
console.error('Error deleting sink entry:', err.response ? err.response.data : err.message);
setError('Failed to delete sink entry');
}
};

// Handle showing more entries
const handleShowMore = () => {
setCurrentIndex((prevIndex) => prevIndex + 4);
};

// Handle showing previous entries
const handleShowLess = () => {
setCurrentIndex((prevIndex) => (prevIndex - 4 >= 0 ? prevIndex - 4 : 0));
};

// Filtered sink entries to display (only 4 at a time)
const displayedEntries = sinkEntries
.slice(currentIndex, currentIndex + 4);


  // Render component
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 xl:col-span-3 p-1 mb-6">
    {/* Left Hand Section - Sink Entries and Carbon Sink Estimation */}
    <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-4 lg:p-6 mt-6 w-full lg:w-[30%] min-w-[300px]">
      {/* Date Range Inputs */}
      <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-4 lg:p-6 mt-6 w-full">
        <div className="space-y-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="date"
              className="p-2 rounded-lg bg-gray-700 text-gray-300 w-full sm:w-auto"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="p-2 rounded-lg bg-gray-700 text-gray-300 w-full sm:w-auto"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
  
        {/* Loading and Error States */}
        {loading && (
          <div className="text-gray-300 mb-4">Loading sink entries...</div>
        )}
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}
  
        {/* No Data Message */}
        {!loading && sinkEntries.length === 0 && (
          <div className="text-gray-300 mb-4">No sink entries found.</div>
        )}
  
        {/* Sink Entries */}
        <h2 className="text-lg font-bold text-gray-300 mb-4">Sink Entries</h2>
        <div className="space-y-4">
          {displayedEntries.map((entry, index) => (
            <div key={entry._id || index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <div className="text-gray-300 w-full sm:w-1/3">
                <p><strong>{entry.type}</strong></p>
              </div>
              <div className="text-gray-300 w-full sm:w-1/3">
                <p>{entry.co2Absorbed} CO2 absorbed</p>
              </div>
              <div className="w-full sm:w-1/3 text-left sm:text-right">
                <button
                  onClick={() => entry._id && handleDelete(entry._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 w-full sm:w-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
  
        {/* Navigation Buttons */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={handleShowLess}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
            disabled={currentIndex === 0}
          >
            &lt; Prev
          </button>
          <button
            onClick={handleShowMore}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
            disabled={currentIndex + 4 >= sinkEntries.length}
          >
            Next &gt;
          </button>
        </div>
      </div>
      
      {/* Carbon Sink Estimation */}
      <CarbonSinkEstimation />
      
    </div>
  
    {/* Right section with graphs */}
    <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-4 lg:p-6 mt-6 w-full lg:w-[70%]">
      <h2 className="text-lg font-bold text-gray-300 mb-4">Sink Status</h2>
  
      {/* Time Range Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSelectedProfitData(graphData.week)}
          className="px-3 py-1 lg:px-4 lg:py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition text-sm lg:text-base"
        >
          Past Week
        </button>
        <button
          onClick={() => setSelectedProfitData(graphData.month)}
          className="px-3 py-1 lg:px-4 lg:py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition text-sm lg:text-base"
        >
          Past Month
        </button>
        <button
          onClick={() => setSelectedProfitData(graphData.year)}
          className="px-3 py-1 lg:px-4 lg:py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition text-sm lg:text-base"
        >
          Past Year
        </button>
      </div>
  
      {graphLoading ? (
        <div>Loading graph data...</div>
      ) : graphError ? (
        <div>{graphError}</div>
      ) : (
        <>
          {/* Bar Chart */}
          <div className="w-full h-[300px] lg:h-[400px] mb-6">
            <Bar
              data={selectedProfitData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: { color: "#4A5568" },
                    ticks: { color: "#E2E8F0", font: { size: 10 } },
                  },
                  y: {
                    grid: { color: "#4A5568" },
                    ticks: { color: "#E2E8F0", font: { size: 10 } },
                  },
                },
                plugins: {
                  legend: {
                    labels: { color: "#E2E8F0", font: { size: 12 } },
                  },
                },
              }}
            />
          </div>
  
          {/* Line Chart */}
          <div className="w-full h-[300px] lg:h-[400px]">
            <Line
              data={selectedProfitData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: { color: "#4A5568" },
                    ticks: { color: "#E2E8F0", font: { size: 10 } },
                  },
                  y: {
                    grid: { color: "#4A5568" },
                    ticks: { color: "#E2E8F0", font: { size: 10 } },
                  },
                },
                plugins: {
                  legend: {
                    labels: { color: "#E2E8F0", font: { size: 12 } },
                  },
                },
              }}
            />
          </div>
        </>
      )}
    </div>
  </div>
  
  
  );
              }

export default SinkGraphs;