import React, { useState } from 'react';
import axios from 'axios';

const CoalEmission = () => {
  const [coalType, setCoalType] = useState('');
  const [coalConsumption, setCoalConsumption] = useState('');
  const [co2Emissions, setCo2Emissions] = useState(null);
  const [error, setError] = useState('');

  const handleCoalTypeChange = (event) => {
    setCoalType(event.target.value);
  };

  const handleCoalConsumptionChange = (event) => {
    setCoalConsumption(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!coalType || !coalConsumption) {
      setError('Please provide both coal type and consumption');
      return;
    }

    try {
      // Sending POST request using axios
      const response = await axios.post('http://localhost:5000/api/coal-emission', {
        coalType,
        coalConsumption: parseFloat(coalConsumption),
      });

      setCo2Emissions(response.data.co2Emissions);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error calculating emissions');
    }
  };

  return (
    <div className="p-6 bg-[#2B263F] shadow-lg rounded-lg">
      {error && <p className="text-red-400 text-center mb-4">{error}</p>}
  
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="coalType"
            className="block text-sm font-medium text-[#cad9ed] mb-2"
          >
            Coal Type
          </label>
          <select
            id="coalType"
            name="coalType"
            value={coalType}
            onChange={handleCoalTypeChange}
            className="w-full px-4 py-3 border border-[#66C5CC] bg-[#2B263F] text-[#cad9ed] rounded-md focus:outline-none focus:ring-2 focus:ring-[#66C5CC]"
          >
            <option value="" className="text-gray-500">
              Select Coal Type
            </option>
            <option value="Lignite">Lignite</option>
            <option value="Sub-bituminous">Sub-bituminous</option>
            <option value="Bituminous">Bituminous</option>
            <option value="Anthracite">Anthracite</option>
          </select>
        </div>
  
        <div>
          <label
            htmlFor="coalConsumption"
            className="block text-sm font-medium text-[#cad9ed] mb-2"
          >
            Coal Consumption (in tons)
          </label>
          <input
            type="number"
            id="coalConsumption"
            name="coalConsumption"
            value={coalConsumption}
            onChange={handleCoalConsumptionChange}
            className="w-full px-4 py-3 border border-[#66C5CC] bg-[#2B263F] text-[#cad9ed] rounded-md focus:outline-none focus:ring-2 focus:ring-[#66C5CC]"
            placeholder="Enter coal consumption in tons"
            min="0"
            required
          />
        </div>
  
        <button
          type="submit"
          className="w-full bg-[#66C5CC] text-[#2B263F] font-semibold py-3 rounded-md hover:bg-[#57b1ba] focus:outline-none focus:ring-2 focus:ring-[#66C5CC]"
        >
          Calculate Emissions
        </button>
      </form>
  
      {co2Emissions !== null && (
        <div className="mt-8 p-4 bg-[#1E1A2E] border border-[#66C5CC] rounded-md">
          <h3 className="text-xl font-semibold text-[#cad9ed] mb-2">
            Calculated CO2 Emissions:
          </h3>
          <p className="text-lg text-[#cad9ed]">
            CO2 Emissions: {co2Emissions.toFixed(2)} kg
          </p>
        </div>
      )}
    </div>
  );
  };
  
  export default CoalEmission;
  