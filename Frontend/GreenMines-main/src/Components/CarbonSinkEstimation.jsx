'use client';

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

// Register required chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function CarbonSinkEstimation() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week'); // Default to 'week'
  const [weekData, setWeekData] = useState([0, 0]);  // Default values
  const [monthData, setMonthData] = useState([0, 0]);
  const [yearData, setYearData] = useState([0, 0]);

  // Function to calculate CO2 sum
 const calculateCO2Sum = (data) => {
  let sum = 0;
  
  // Check if data is an object with multiple categories
  if (data && typeof data === 'object') {
    const categories = ['electricity', 'fuelCombustion', 'shipping', 'explosion'];
    
    categories.forEach(category => {
      if (Array.isArray(data[category])) {
        data[category].forEach(item => {
          let co2Value = 0;
          
          // Handle different data structures
          if (item.result && item.result.CO2) {
            // For electricity and fuel combustion: convert kg to tons
            co2Value = parseFloat(item.result.CO2.value) / 1000;
          } else if (item.emissions && item.emissions.CO2) {
            // For explosion data: convert kg to tons
            co2Value = parseFloat(item.emissions.CO2) / 1000;
          } else if (item.result && item.result.carbonEmissions) {
            // For shipping data: already in metric tons
            co2Value = parseFloat(item.result.carbonEmissions.metricTonnes);
          }
          
          sum += !isNaN(co2Value) ? co2Value : 0;
        });
      }
    });
  }
  
  // Handle existing sink data separately
  if (data && data.existingSinkData && Array.isArray(data.existingSinkData)) {
    data.existingSinkData.forEach(sink => {
      // Use daily sequestration rate (already in tons)
      const sinkValue = parseFloat(sink.dailySequestrationRate) || 0;
      sum += sinkValue;
    });
  }
  
  return sum;
};

const fetchDataForDateRange = async (startDate, endDate) => {
  try {
    console.log(`Fetching data for range: ${startDate} to ${endDate}`);

    const [emissionsResponse, existingSinkResponse] = await Promise.all([
      axios.get(`http://localhost:5000/api/data/${startDate}/${endDate}`),
      axios.get(`http://localhost:5000/api/existingsinks/date-range/${startDate}/${endDate}`),
    ]);

    const totalEmissionCO2 = calculateCO2Sum(emissionsResponse.data);
    const existingSinkCO2 = calculateCO2Sum(existingSinkResponse.data);

    // Calculate required sink as difference between emissions and existing sink
    const requiredSinkCO2 = Math.max(totalEmissionCO2 - existingSinkCO2, 0);

    console.log(`Total Emissions CO2: ${totalEmissionCO2} tons`);
    console.log(`Existing Sink CO2: ${existingSinkCO2} tons`);
    console.log(`Required Sink CO2: ${requiredSinkCO2} tons`);
    
    return [existingSinkCO2, requiredSinkCO2];
  } catch (error) {
    console.error('Error fetching data:', error);
    return [0, 0];
  }
};

  // Function to calculate date ranges based on selected time range
  const calculateDateRange = () => {
    const today = new Date().toISOString().split('T')[0];
    let startDate;

    if (selectedTimeRange === 'week') {
      const lastWeekDate = new Date(new Date().setDate(new Date().getDate() - 7));
      startDate = lastWeekDate.toISOString().split('T')[0];
    } else if (selectedTimeRange === 'month') {
      const lastMonthDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
      startDate = lastMonthDate.toISOString().split('T')[0];
    } else if (selectedTimeRange === 'year') {
      const lastYearDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
      startDate = lastYearDate.toISOString().split('T')[0];
    }

    return { startDate, endDate: today };
  };

  // Fetch data for the selected range
  const fetchSelectedRangeData = async () => {
    const { startDate, endDate } = calculateDateRange();
    const [existingSinkCO2, requiredSinkCO2] = await fetchDataForDateRange(startDate, endDate);

    if (selectedTimeRange === 'week') {
      setWeekData([existingSinkCO2, requiredSinkCO2]);
    } else if (selectedTimeRange === 'month') {
      setMonthData([existingSinkCO2, requiredSinkCO2]);
    } else if (selectedTimeRange === 'year') {
      setYearData([existingSinkCO2, requiredSinkCO2]);
    }
  };

  // Fetch week data by default on mount
  useEffect(() => {
    fetchSelectedRangeData();
  }, [selectedTimeRange]);

  // Data for the chart
  const barData = {
    labels: ['Existing Sinks', 'Required Sinks'],
    datasets: [
      {
        label: 'Carbon Sequestration Capacity (tons CO2)',
        data:
          selectedTimeRange === 'week'
            ? weekData
            : selectedTimeRange === 'month'
            ? monthData
            : yearData,
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#E2E8F0',
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Sink Type',
          font: {
            size: 14,
          },
          color: '#4A5568',
        },
        ticks: {
          color: '#E2E8F0',
        },
        grid: {
          color: '#4A5568',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Capacity (tons CO2)',
          font: {
            size: 14,
          },
          color: '#4A5568',
        },
        ticks: {
          color: '#E2E8F0',
        },
        grid: {
          color: '#4A5568',
        },
      },
    },
  };

  return (
    <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-[100%] h-full mt-6">
    {/* Title Section */}
    <h2 className="text-lg font-bold text-white mb-4">Carbon Sink Estimation</h2>
    <div className="flex justify-between items-center mb-6">
      <span className="text-white">Time Range:</span>
      <select
        className="bg-gray-700 text-white p-2 rounded"
        value={selectedTimeRange}
        onChange={(e) => setSelectedTimeRange(e.target.value)}
      >
        <option value="week">Last Week</option>
        <option value="month">Last Month</option>
        <option value="year">Last Year</option>
      </select>
    </div>
    {/* Bar Chart */}
    <div className="flex-grow w-full">
      <Bar data={barData} options={barOptions} />
    </div>
  </div>
  
  );
}

export default CarbonSinkEstimation;
