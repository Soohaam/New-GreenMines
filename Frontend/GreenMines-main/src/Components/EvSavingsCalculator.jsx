import React, { useState } from 'react';
import axios from 'axios';
import Enavbar from "./Enavbar";

const EvSavingsCalculator = () => {
  const [formData, setFormData] = useState({
    vehicleType: 'Dumper Truck',
    numberOfVehicles: "",
    dailyHours: "",
    fuelType: 'Diesel',
    fuelPrice: "",
    carbonCreditPrice: "",
    workingDaysPerYear: ""
  });

  const [results, setResults] = useState(null);

  const vehicleTypes = [
    'Dumper Truck', 
    'Excavator', 
    'Loader', 
    'Haul Truck', 
    'Drill Machine'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'numberOfVehicles' || name === 'dailyHours' || 
              name === 'fuelPrice' || name === 'carbonCreditPrice' || 
              name === 'workingDaysPerYear' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/ev', formData);
      setResults(response.data.data);
    } catch (error) {
      console.error('Calculation error', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#342F49] py-12 px-4 sm:px-6 lg:px-8 justify-center flex flex-col items-center">
      <Enavbar />
    {/* Main Container */}
    <div className="w-full max-w-4xl mt-16 mx-auto bg-[#231E3D] rounded-2xl shadow-lg overflow-hidden border-2 border-[#66C5CC]">
      <div className="p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#66C5CC] mb-8 text-center">
          Mining Fleet EV Emissions Savings Calculator
        </h2>
  
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Vehicle Type Selection */}
          <div>
            <label className="block text-xl font-medium text-[#66C5CC] mb-2">
              Vehicle Type
            </label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
            >
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
  
          {/* Number of Vehicles */}
          <div>
            <label className="block text-xl font-medium text-[#66C5CC] mb-2">
              Number of Vehicles
            </label>
            <input
              type="number"
              name="numberOfVehicles"
              value={formData.numberOfVehicles}
              onChange={handleChange}
              min="1"
              className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
            />
          </div>
  
          {/* Daily Hours of Operation */}
          <div>
            <label className="block text-xl font-medium text-[#66C5CC] mb-2">
              Daily Hours of Operation
            </label>
            <input
              type="number"
              name="dailyHours"
              value={formData.dailyHours}
              onChange={handleChange}
              min="1"
              max="24"
              className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
            />
          </div>
  
          {/* Fuel Type */}
          <div>
            <label className="block text-xl font-medium text-[#66C5CC] mb-2">
              Fuel Type
            </label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
            >
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
            </select>
          </div>
  
          {/* Fuel Price */}
          <div>
            <label className="block text-xl font-medium text-[#66C5CC] mb-2">
              Fuel Price (per litre)
            </label>
            <input
              type="number"
              name="fuelPrice"
              value={formData.fuelPrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
            />
          </div>
  
          {/* Carbon Credit Price */}
          <div>
            <label className="block text-xl font-medium text-[#66C5CC] mb-2">
              Carbon Credit Price (per ton)
            </label>
            <input
              type="number"
              name="carbonCreditPrice"
              value={formData.carbonCreditPrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
            />
          </div>
  
          {/* Working Days per Year */}
          <div>
            <label className="block text-xl font-medium text-[#66C5CC] mb-2">
              Working Days per Year
            </label>
            <input
              type="number"
              name="workingDaysPerYear"
              value={formData.workingDaysPerYear}
              onChange={handleChange}
              min="1"
              className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
            />
          </div>
  
          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="w-full max-w-xs py-3 px-4 text-lg font-semibold text-black rounded-lg shadow-lg bg-[#66C5CC] hover:bg-[#5eb6b7] transition-colors duration-200"
            >
              Calculate Emissions Savings
            </button>
          </div>
        </form>
  
        {results && (
  <div className="mt-8 w-full bg-[#342F49] rounded-lg p-8 border-2 border-[#66C5CC] shadow-lg">
    <h3 className="text-2xl font-bold text-[#66C5CC] mb-6 pb-3 border-b-2 border-[#66C5CC] flex items-center">
      <span className="bg-[#66C5CC] w-1 h-8 mr-3 rounded"></span>
      Emissions Savings Results
    </h3>
    <dl className="space-y-6">
      <div className="grid gap-4">
        <div className="bg-[#3A3554] p-4 rounded-lg border border-[#4da5aa]/30">
          <div className="flex justify-between items-center">
            <dt className="text-xl font-bold text-[#4da5aa]">
              Total Emissions Savings
            </dt>
            <dd className="text-xl font-bold text-white bg-[#2D2A40] px-4 py-2 rounded-md">
              {results.calculationResults.emissionSavings.toFixed(2)} kg CO₂/day
            </dd>
          </div>
        </div>
        <div className="bg-[#3A3554] p-4 rounded-lg border border-[#4da5aa]/30">
          <div className="flex justify-between items-center">
            <dt className="text-xl font-bold text-[#4da5aa]">
              Percentage Reduction
            </dt>
            <dd className="text-xl font-bold text-white bg-[#2D2A40] px-4 py-2 rounded-md">
              {results.calculationResults.percentageReduction.toFixed(2)}%
            </dd>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-xl font-bold text-[#66C5CC] mb-4 pb-2 border-b border-[#66C5CC]/50 flex items-center">
          <span className="bg-[#66C5CC] w-1 h-6 mr-3 rounded"></span>
          Cost Savings
        </h4>
        <div className="grid gap-4">
          <div className="bg-[#3A3554] p-4 rounded-lg border border-[#4da5aa]/30">
            <div className="flex justify-between items-center">
              <dt className="text-lg font-bold text-[#4da5aa]">
                Daily Fuel Cost Savings
              </dt>
              <dd className="text-lg font-bold text-white bg-[#2D2A40] px-4 py-2 rounded-md">
                ₹{results.calculationResults.dailyFuelCostSavings.toFixed(2)}
              </dd>
            </div>
          </div>
          <div className="bg-[#3A3554] p-4 rounded-lg border border-[#4da5aa]/30">
            <div className="flex justify-between items-center">
              <dt className="text-lg font-bold text-[#4da5aa]">
                Annual Fuel Cost Savings
              </dt>
              <dd className="text-lg font-bold text-white bg-[#2D2A40] px-4 py-2 rounded-md">
                ₹{results.calculationResults.annualFuelCostSavings.toFixed(2)}
              </dd>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-xl font-bold text-[#66C5CC] mb-4 pb-2 border-b border-[#66C5CC]/50 flex items-center">
          <span className="bg-[#66C5CC] w-1 h-6 mr-3 rounded"></span>
          Carbon Credits
        </h4>
        <div className="grid gap-4">
          <div className="bg-[#3A3554] p-4 rounded-lg border border-[#4da5aa]/30">
            <div className="flex justify-between items-center">
              <dt className="text-lg font-bold text-[#4da5aa]">
                Carbon Credits Earned
              </dt>
              <dd className="text-lg font-bold text-white bg-[#2D2A40] px-4 py-2 rounded-md">
                ₹{results.calculationResults.carbonCreditsEarned.toFixed(2)} credits
              </dd>
            </div>
          </div>
          <div className="bg-[#3A3554] p-4 rounded-lg border border-[#4da5aa]/30">
            <div className="flex justify-between items-center">
              <dt className="text-lg font-bold text-[#4da5aa]">
                Carbon Credits Revenue
              </dt>
              <dd className="text-lg font-bold text-white bg-[#2D2A40] px-4 py-2 rounded-md">
                ₹{results.calculationResults.carbonCreditsRevenue.toFixed(2)}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </dl>
  </div>
)}
      </div>
    </div>
  </div>
  
  );
};

export default EvSavingsCalculator;