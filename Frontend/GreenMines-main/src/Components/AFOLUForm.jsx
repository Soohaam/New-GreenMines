import React, { useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import Enavbar from './Enavbar';
import ChatAssistant from './ChatAssistant';

const AFOLUForm = () => {
  const [landSize, setLandSize] = useState('');
  const [currentLandUse, setCurrentLandUse] = useState('');
  const [customCurrentLandUse, setCustomCurrentLandUse] = useState('');
  const [carbonStock, setCarbonStock] = useState('');
  const [clearingMethod, setClearingMethod] = useState('');
  const [customClearingMethod, setCustomClearingMethod] = useState('');
  const [climateDescription, setClimateDescription] = useState('');
  const [customClimateDescription, setCustomClimateDescription] = useState('');
  const [newLandUse, setNewLandUse] = useState('');
  const [customNewLandUse, setCustomNewLandUse] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const htmlStyles = `
    .parsed-html-content h3 {
      font-size: 1.25rem;
      font-weight: bold;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      color: #66C5CC;
    }
    .parsed-html-content ul {
      list-style-type: disc;
      padding-left: 1.5rem;
      margin-bottom: 1rem;
    }
    .parsed-html-content li {
      margin-bottom: 0.5rem;
      color: #ffffff;
    }
    .parsed-html-content p {
      margin-bottom: 0.75rem;
      color: #ffffff;
    }
  `;

  const renderHTMLContent = (htmlContent) => {
    const cleanHTML = DOMPurify.sanitize(htmlContent);
    return (
      <>
        <style>{htmlStyles}</style>
        <div
          dangerouslySetInnerHTML={{ __html: cleanHTML }}
          className="parsed-html-content"
        />
      </>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponseMessage('');
    setLoading(true);

    const data = {
      landSize: parseFloat(landSize),
      currentLandUse: currentLandUse === 'Custom' ? customCurrentLandUse : currentLandUse,
      carbonStock: parseFloat(carbonStock),
      clearingMethod: clearingMethod === 'Custom' ? customClearingMethod : clearingMethod,
      climateDescription: climateDescription === 'Custom' ? customClimateDescription : climateDescription,
      newLandUse: newLandUse === 'Custom' ? customNewLandUse : newLandUse,
    };

    try {
      console.log('Sending data:', data);
      const response = await axios.post('http://localhost:5000/api/afolu', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response received:', response.data);
      setResponseMessage(response.data.response);
    } catch (error) {
      console.error('Error:', error.response || error);
      setError(error.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#342F49] flex flex-col p-10">
      <ChatAssistant />
    {/* Navbar */}
    <div className="w-full bg-[#231E3D] fixed top-0 left-0 z-10 shadow-lg">
      <Enavbar />
    </div>
      <div className="w-full max-w-4xl mx-auto mt-28 bg-[#231E3D] rounded-2xl shadow-lg overflow-hidden border-2 border-[#66C5CC]">
        <div className="p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#66C5CC] mb-8 text-center">
            AFOLU Environmental Impact Calculator
          </h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Land Size */}
              <div>
                <label htmlFor="landSize" className="block text-xl font-medium text-[#66C5CC] mb-2">
                  Land Size (hectares)
                </label>
                <input
                  type="number"
                  id="landSize"
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
                  required
                />
              </div>
              {/* Current Land Use */}
              <div>
                <label htmlFor="currentLandUse" className="block text-xl font-medium text-[#66C5CC] mb-2">
                  Current Land Use
                </label>
                <select
                  id="currentLandUse"
                  value={currentLandUse}
                  onChange={(e) => setCurrentLandUse(e.target.value)}
                  className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
                  required
                >
                  <option value="">Select Land Use</option>
                  <option value="Forest">Forest</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Grassland">Grassland</option>
                  <option value="Custom">Custom</option>
                </select>
                {currentLandUse === 'Custom' && (
                  <input
                    type="text"
                    placeholder="Enter custom land use"
                    value={customCurrentLandUse}
                    onChange={(e) => setCustomCurrentLandUse(e.target.value)}
                    className="mt-2 w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
                  />
                )}
              </div>
              {/* Carbon Stock */}
              <div>
                <label htmlFor="carbonStock" className="block text-xl font-medium text-[#66C5CC] mb-2">
                  Carbon Stock (tCO2/ha)
                </label>
                <input
                  type="number"
                  id="carbonStock"
                  value={carbonStock}
                  onChange={(e) => setCarbonStock(e.target.value)}
                  className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
                  required
                />
              </div>
              {/* Clearing Method */}
              <div>
                <label htmlFor="clearingMethod" className="block text-xl font-medium text-[#66C5CC] mb-2">
                  Clearing Method
                </label>
                <select
                  id="clearingMethod"
                  value={clearingMethod}
                  onChange={(e) => setClearingMethod(e.target.value)}
                  className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
                  required
                >
                  <option value="">Select Clearing Method</option>
                  <option value="Burning">Burning</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Custom">Custom</option>
                </select>
                {clearingMethod === 'Custom' && (
                  <input
                    type="text"
                    placeholder="Enter custom clearing method"
                    value={customClearingMethod}
                    onChange={(e) => setCustomClearingMethod(e.target.value)}
                    className="mt-2 w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
                  />
                )}
              </div>
              {/* Climate Description */}
              <div>
                <label htmlFor="climateDescription" className="block text-xl font-medium text-[#66C5CC] mb-2">
                  Climate Description
                </label>
                <select
                  id="climateDescription"
                  value={climateDescription}
                  onChange={(e) => setClimateDescription(e.target.value)}
                  className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
                  required
                >
                  <option value="">Select Climate</option>
                  <option value="Tropical">Tropical</option>
                  <option value="Temperate">Temperate</option>
                  <option value="Arid">Arid</option>
                  <option value="Custom">Custom</option>
                </select>
                {climateDescription === 'Custom' && (
                  <input
                    type="text"
                    placeholder="Enter custom climate description"
                    value={customClimateDescription}
                    onChange={(e) => setCustomClimateDescription(e.target.value)}
                    className="mt-2 w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
                  />
                )}
              </div>
              {/* New Land Use */}
              <div>
                <label htmlFor="newLandUse" className="block text-xl font-medium text-[#66C5CC] mb-2">
                  New Land Use
                </label>
                <select
                  id="newLandUse"
                  value={newLandUse}
                  onChange={(e) => setNewLandUse(e.target.value)}
                  className="w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
                  required
                >
                  <option value="">Select New Land Use</option>
                  <option value="Urban Development">Urban Development</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Forest Restoration">Forest Restoration</option>
                  <option value="Custom">Custom</option>
                </select>
                {newLandUse === 'Custom' && (
                  <input
                    type="text"
                    placeholder="Enter custom new land use"
                    value={customNewLandUse}
                    onChange={(e) => setCustomNewLandUse(e.target.value)}
                    className="mt-2 w-full border-2 border-[#4da5aa] rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#66C5CC] focus:border-transparent text-lg bg-[#342F49] text-white"
                  />
                )}
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex justify-center">
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
        </div>
       
        {error && (
          <div className="mt-8 p-6 bg-red-500 text-white rounded-lg text-center">
            {error}
          </div>
        )}
      </div>
      {responseMessage && (
  <div className="mt-10 bg-[#483c8065] rounded-lg p-10 border-2 border-[#66C5CC]">
    <h2 className="text-4xl font-bold text-[#66C5CC] mb-4">Environmental Impact Analysis:</h2>
    <div className="text-xl font-semibold text-white ">
      {renderHTMLContent(responseMessage)}
    </div>
  </div>
)}
    </div>
  );
};

export default AFOLUForm;
