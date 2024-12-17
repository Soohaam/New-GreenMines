import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Enavbar from './Enavbar';
import ChatAssistant from './ChatAssistant';

export default function CCSCalculator() {
  // State for form data
  const [formData, setFormData] = useState({
    mineName: '',
    annualEmissions: '',
    mineSize: '',
    ccsTechnology: '',
    installationCostPerTon: '',
    annualMaintenanceCost: ''
  });

  // State for result, error, and loading
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/ccs', formData);
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while calculating CCS');
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="min-h-screen bg-[#342F49] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
    <ChatAssistant />
    {/* Navbar */}
    <div className="w-full bg-[#231E3D] fixed top-0 left-0 z-10 shadow-lg">
      <Enavbar />
    </div>
    {/* Main Container */}
    <div className="w-full max-w-4xl mx-auto mt-28 bg-[#231E3D] rounded-2xl shadow-lg overflow-hidden border-2 border-[#66C5CC]">
      <div className="p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#66C5CC] mb-8 text-center">
          Carbon Capture and Storage (CCS) Calculator
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mine Name */}
            <div>
              <label
                htmlFor="mineName"
                className="block text-xl font-medium text-[#66C5CC] mb-2"
              >
                Mine Name
              </label>
              <input
                type="text"
                name="mineName"
                id="mineName"
                required
                className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
                placeholder="Enter the mine name"
                value={formData.mineName}
                onChange={handleChange}
              />
            </div>
  
            {/* Annual Emissions */}
            <div>
              <label
                htmlFor="annualEmissions"
                className="block text-xl font-medium text-[#66C5CC] mb-2"
              >
                Annual Emissions (tons)
              </label>
              <input
                type="number"
                name="annualEmissions"
                id="annualEmissions"
                required
                className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
                placeholder="Enter annual emissions"
                value={formData.annualEmissions}
                onChange={handleChange}
              />
            </div>
  
            {/* Mine Size */}
            <div>
              <label
                htmlFor="mineSize"
                className="block text-xl font-medium text-[#66C5CC] mb-2"
              >
                Mine Size
              </label>
              <select
                name="mineSize"
                id="mineSize"
                required
                className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
                value={formData.mineSize}
                onChange={handleChange}
              >
                <option value="">Select mine size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>
  
            {/* CCS Technology */}
            <div>
              <label
                htmlFor="ccsTechnology"
                className="block text-xl font-medium text-[#66C5CC] mb-2"
              >
                CCS Technology
              </label>
              <select
                name="ccsTechnology"
                id="ccsTechnology"
                required
                className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
                value={formData.ccsTechnology}
                onChange={handleChange}
              >
                <option value="">Select CCS Technology</option>
                <option value="PostCombustion">Post-Combustion Capture</option>
                <option value="PreCombustion">Pre-Combustion Capture</option>
                <option value="OxyCombustion">Oxy-Combustion Capture</option>
              </select>
            </div>
  
            {/* Installation Cost Per Ton */}
            <div>
              <label
                htmlFor="installationCostPerTon"
                className="block text-xl font-medium text-[#66C5CC] mb-2"
              >
                Installation Cost Per Ton (₹)
              </label>
              <input
                type="number"
                name="installationCostPerTon"
                id="installationCostPerTon"
                className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
                placeholder="Enter installation cost"
                value={formData.installationCostPerTon}
                onChange={handleChange}
              />
            </div>
  
            {/* Annual Maintenance Cost */}
            <div>
              <label
                htmlFor="annualMaintenanceCost"
                className="block text-xl font-medium text-[#66C5CC] mb-2"
              >
                Annual Maintenance Cost (₹)
              </label>
              <input
                type="number"
                name="annualMaintenanceCost"
                id="annualMaintenanceCost"
                className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
                placeholder="Enter maintenance cost"
                value={formData.annualMaintenanceCost}
                onChange={handleChange}
              />
            </div>
          </div>
  
          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
          <button
                type="submit"
                className={`w-full max-w-xs py-3 px-4 text-lg font-semibold text-black rounded-lg shadow-lg ${
                  loading ? 'bg-gray-500' : 'bg-[#66C5CC]'
                } hover:bg-[#5eb6b7]`}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Calculate Impact'}
              </button>
          </div>
        </form>
  
        {/* Error Message */}
        {error && (
          <div className="mt-6 text-center text-red-500 text-lg">{error}</div>
        )}
      </div>
    </div>
  
    {/* Result Display */}
    {result && (
      <div className="w-full max-w-4xl bg-[#342F49] rounded-lg p-10 border-2 border-[#66C5CC] mt-10">
        <h2 className="text-3xl font-bold text-[#66C5CC] mb-4">Results:</h2>
        <dl className="space-y-4 text-lg font-semibold text-white">
          {Object.entries(result).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <dt className="font-bold text-[#4da5aa]">{key}</dt>
              <dd className="font-bold">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    )}
  </div>
  
  );
}