import React, { useState } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, CardHeader, Select } from '@mui/material';

const CarbonSinkForm = () => {
  const [targetCarbonSequestration, setTargetCarbonSequestration] = useState('');
  const [landType, setLandType] = useState('forest');
  const [forestType, setForestType] = useState('tropical');
  const [projectDuration, setProjectDuration] = useState("");
  const [soilCondition, setSoilCondition] = useState('ideal');
  const [calculationResults, setCalculationResults] = useState(null);
  const [error, setError] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      targetCarbonSequestration,
      landType,
      forestType,
      projectDuration,
      soilCondition
    };

    try {
      const response = await axios.post('http://localhost:5000/api/requiredland ', data);
      setCalculationResults(response.data.data);
      setError(null); // Reset any previous errors
    } catch (error) {
      setError(error.response.data.error || 'An error occurred');
      setCalculationResults(null); // Clear previous results
    }
  };

  return (
    <div className="p-6 md:p-10 mt-0 lg:p-20 min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#342F49] to-[#2B263F] relative overflow-hidden">
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-r from-[#66C5CC] to-[#55B2B6] opacity-30 animate-gradient overflow-hidden"></div>
    </div>
    
    <div className="w-full max-w-4xl bg-[#2B263F] shadow-lg rounded-lg p-8">
      <h1 className="text-4xl font-bold text-[#cad9ed] text-center mb-8">Carbon Sink Land Calculation</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="targetCarbonSequestration" className="block text-[#cad9ed]">Target Carbon Sequestration (tonnes)</label>
          <input
            id="targetCarbonSequestration"
            type="number"
            value={targetCarbonSequestration}
            onChange={(e) => setTargetCarbonSequestration(e.target.value)}
            className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="landType" className="block text-[#cad9ed]">Land Type</label>
          <select
            id="landType"
            value={landType}
            onChange={(e) => setLandType(e.target.value)}
            className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
            required
          >
            <option value="forest">Forest</option>
            <option value="mangrove">Mangrove</option>
            <option value="grassland">Grassland</option>
            <option value="wetland">Wetland</option>
            <option value="agroforestry">Agroforestry</option>
          </select>
        </div>

        {landType === 'forest' && (
          <div className="space-y-2">
            <label htmlFor="forestType" className="block text-[#cad9ed]">Forest Type</label>
            <select
              id="forestType"
              value={forestType}
              onChange={(e) => setForestType(e.target.value)}
              className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
              required
            >
              <option value="tropical">Tropical</option>
              <option value="temperate">Temperate</option>
              <option value="boreal">Boreal</option>
            </select>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="projectDuration" className="block text-[#cad9ed]">Project Duration (years)</label>
          <input
            id="projectDuration"
            type="number"
            value={projectDuration}
            onChange={(e) => setProjectDuration(e.target.value)}
            className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="soilCondition" className="block text-[#cad9ed]">Soil Condition</label>
          <select
            id="soilCondition"
            value={soilCondition}
            onChange={(e) => setSoilCondition(e.target.value)}
            className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
            required
          >
            <option value="ideal">Ideal (Fertile soil, excellent vegetation)</option>
            <option value="moderately_suitable">Moderately Suitable (Slightly degraded soil)</option>
            <option value="marginally_suitable">Marginally Suitable (Poor soil quality)</option>
            <option value="unsuitable">Unsuitable (Highly degraded land)</option>
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="py-3 px-6 bg-[#66C5CC] hover:bg-[#55B2B6] text-[#2B263F] font-bold rounded-md transition duration-300"
          >
            Calculate
          </button>
        </div>
      </form>

      {error && <div className="mt-4 text-[#FF6B6B]">{error}</div>}

      {calculationResults && (
        <div className="mt-6 p-6 bg-[#342F49] border border-[#66C5CC] rounded-lg">
          <h2 className="text-3xl font-semibold text-[#cad9ed] mb-4">Calculation Results</h2>
          <div className="text-[#cad9ed] text-xl">
  <p className="bold"><strong>Required Land:</strong> {calculationResults.requiredLand} hectares</p>
  <p className="bold"><strong>Sequestration Rate:</strong> {calculationResults.sequestrationRate} tonnes/ha/year</p>
  <p className="bold"><strong>Total Carbon Sequestered:</strong> {calculationResults.totalCarbonSequestered.toFixed(2)} tonnes</p>
</div>

        </div>
      )}
    </div>
  </div>
  );
};

export default CarbonSinkForm;
