'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function OverviewSection() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [totalAbsorption, setTotalAbsorption] = useState(0);

  // Calculate derived values
  const gap = totalEmissions - totalAbsorption;
  const neutralityProgress = totalEmissions > 0 ? (totalAbsorption / totalEmissions) * 100 : 0;

  // Donut chart properties
  const size = 180;
  const strokeWidth = 8;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (neutralityProgress / 100) * circumference;

  // Function to calculate CO2 sum (from your reference code)
  const calculateCO2Sum = (data) => {
    let sum = 0;
    if (data && typeof data === 'object') {
      const categories = ['electricity', 'fuelCombustion', 'shipping', 'explosion'];
      categories.forEach(category => {
        if (Array.isArray(data[category])) {
          data[category].forEach(item => {
            let co2Value = 0;
            if (item.result && item.result.CO2) {
              co2Value = parseFloat(item.result.CO2.value) / 1000;
            } else if (item.emissions && item.emissions.CO2) {
              co2Value = parseFloat(item.emissions.CO2) / 1000;
            } else if (item.result && item.result.carbonEmissions) {
              co2Value = parseFloat(item.result.carbonEmissions.metricTonnes);
            }
            sum += !isNaN(co2Value) ? co2Value : 0;
          });
        }
      });
    }
    if (data && data.existingSinkData && Array.isArray(data.existingSinkData)) {
      data.existingSinkData.forEach(sink => {
        // Use daily sequestration rate (already in tons)
        const sinkValue = parseFloat(sink.dailySequestrationRate) || 0;
        sum += sinkValue;
      });
    }
    
    return sum;
  };

  // Calculate date range
  const calculateDateRange = () => {
    const today = new Date().toISOString().split('T')[0];
    let startDate;

    if (selectedTimeRange === 'week') {
      startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    } else if (selectedTimeRange === 'month') {
      startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    } else if (selectedTimeRange === 'year') {
      startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    }

    return { 
      startDate: startDate.toISOString().split('T')[0], 
      endDate: today 
    };
  };

  // Fetch data
  const fetchData = async () => {
    try {
      const { startDate, endDate } = calculateDateRange();
      
      const [emissionsResponse, existingSinkResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/data/${startDate}/${endDate}`),
        axios.get(`http://localhost:5000/api/existingsinks/date-range/${startDate}/${endDate}`)
      ]);

      const totalEmissionCO2 = calculateCO2Sum(emissionsResponse.data);
      const existingSinkCO2 = calculateCO2Sum(existingSinkResponse.data);

      setTotalEmissions(totalEmissionCO2);
      setTotalAbsorption(existingSinkCO2);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data when time range changes
  useEffect(() => {
    fetchData();
  }, [selectedTimeRange]);

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mt-8 relative">
  {/* Time Range Selector - Hidden on phones */}
  <div className="absolute top-4 sm:top-6 left-4 sm:left-6 hidden md:block">
    <select
      className="bg-gray-700 text-white p-2 rounded text-sm"
      value={selectedTimeRange}
      onChange={(e) => setSelectedTimeRange(e.target.value)}
    >
      <option value="week">Last Week</option>
      <option value="month">Last Month</option>
      <option value="year">Last Year</option>
    </select>
  </div>

  {/* Responsive Donut Chart */}
  <div className="mb-6 md:mb-0 md:absolute md:top-6 md:right-6 flex justify-center">
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#4B5563"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#10B981"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          fill="none"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-white">{neutralityProgress.toFixed(0)}%</span>
      </div>
    </div>
  </div>

  {/* Main Content */}
  <div className="mt-6 md:mt-0">
    <h2 className="text-xl font-semibold text-[#fcfcfc] mb-4">Overview</h2>
    <div className="space-y-4">
      <div>
        <p className="text-sm text-white">Total Carbon Emissions</p>
        <p className="text-xl sm:text-2xl font-bold text-red-600">{totalEmissions.toLocaleString()} tons</p>
      </div>
      <div>
        <p className="text-sm text-white">Carbon Absorption by Sinks</p>
        <p className="text-xl sm:text-2xl font-bold text-green-600">{totalAbsorption.toLocaleString()} tons</p>
      </div>
      <div>
        <p className="text-sm text-white">Gap Analysis</p>
        <p className="text-xl sm:text-2xl font-bold text-yellow-600">{gap.toLocaleString()} tons</p>
      </div>
      <div>
        <p className="text-sm text-white mb-2">Carbon Neutrality Progress</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
          <div
            className="bg-green-600 h-2.5 rounded-full"
            style={{ width: `${neutralityProgress}%` }}
            role="progressbar"
            aria-valuenow={neutralityProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
        <p className="text-sm text-white">{neutralityProgress.toFixed(2)}% Complete</p>
      </div>
    </div>
  </div>
</div>


  
  );
}