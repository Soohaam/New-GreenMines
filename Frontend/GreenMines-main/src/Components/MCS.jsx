import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Enavbar from './Enavbar';
import ChatAssistant from './ChatAssistant';

export default function MCSCalculator() {
  const [formData, setFormData] = useState({
    mineName: '',
    annualMethaneEmissions: 0,
    mineSize: '',
    mcsTechnology: '',
    utilization: '',
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/mcs', formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while calculating MCS');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#342F49] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <ChatAssistant />
      <div className="w-full bg-[#231E3D] fixed top-0 left-0 z-10 shadow-lg">
        <Enavbar />
      </div>

      <div className="w-full max-w-4xl mx-auto mt-28 bg-[#231E3D] rounded-2xl shadow-lg overflow-hidden border-2 border-[#66C5CC]">
        <div className="p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#66C5CC] mb-8 text-center">
            Advanced Methane Capture System (MCS) Calculator
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="mineName" className="block text-xl font-medium text-[#66C5CC] mb-2">
                  Mine Name
                </label>
                <input
                  type="text"
                  name="mineName"
                  required
                  className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] text-lg bg-[#342F49] text-white"
                  placeholder="Enter the mine name"
                  value={formData.mineName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="annualMethaneEmissions" className="block text-xl font-medium text-[#66C5CC] mb-2">
                  Annual Methane Emissions (tons)
                </label>
                <input
                  type="number"
                  name="annualMethaneEmissions"
                  required
                  className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] text-lg bg-[#342F49] text-white"
                  placeholder="Enter annual methane emissions"
                  value={formData.annualMethaneEmissions}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="mineSize" className="block text-xl font-medium text-[#66C5CC] mb-2">
                  Mine Size
                </label>
                <select
                  name="mineSize"
                  required
                  className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] text-lg bg-[#342F49] text-white"
                  value={formData.mineSize}
                  onChange={handleChange}
                >
                  <option value="">Select mine size</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>

              <div>
                <label htmlFor="mcsTechnology" className="block text-xl font-medium text-[#66C5CC] mb-2">
                  MCS Technology
                </label>
                <select
                  name="mcsTechnology"
                  required
                  className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] text-lg bg-[#342F49] text-white"
                  value={formData.mcsTechnology}
                  onChange={handleChange}
                >
                  <option value="">Select MCS Technology</option>
                  <option value="Flaring">Methane Flaring</option>
                  <option value="CatalyticOxidation">Catalytic Oxidation</option>
                  <option value="MembraneSeparation">Membrane Separation</option>
                </select>
              </div>

              <div>
                <label htmlFor="utilization" className="block text-xl font-medium text-[#66C5CC] mb-2">
                  Utilization Strategy
                </label>
                <select
                  name="utilization"
                  required
                  className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] text-lg bg-[#342F49] text-white"
                  value={formData.utilization}
                  onChange={handleChange}
                >
                  <option value="">Select Utilization Strategy</option>
                  <option value="energy">Energy Generation</option>
                  <option value="hydrogen">Hydrogen Production</option>
                  <option value="liquefied">Liquefied Natural Gas (LNG)</option>
                </select>
              </div>
            </div>

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

          {error && <div className="mt-6 text-center text-red-500 text-lg">{error}</div>}
        </div>
      </div>

      {result && (
        <div className="w-full max-w-4xl bg-[#342F49] rounded-lg p-10 border-2 border-[#66C5CC] mt-10">
          <h2 className="text-3xl font-bold text-[#66C5CC] mb-6">Detailed Results</h2>

          {['projectDetails', 'performanceMetrics', 'quantitativeResults', 'financialSummary', 'performanceAnalysis'].map(
  (section) =>
    result[section] && (
      <div key={section} className="mb-8">
        <h3 className="text-2xl font-semibold text-[#4da5aa] mb-4">
          {section.replace(/([A-Z])/g, ' $1').trim()}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(result[section] || {}).map(([key, value]) => (
            <div key={key} className="bg-[#231E3D] p-4 rounded-lg">
              <span className="text-[#66C5CC] font-bold capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}:
              </span>
              <span className="text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>
    )
)}

        </div>
      )}
    </div>
  );
}
