import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RequiredLand from './RequiredLand';


function NeutralityForm() {

  const MOCK_LOCATIONS = [
    { 
      id: 1,
      region: 'Western Ghats, Maharashtra', 
      coordinates: [19.0760, 72.8777], 
      soilType: 'laterite', 
      vegetationType: 'tropical_rainforest', 
      treeSpecies: ['Teak', 'Sal', 'Banyan'], 
      seedingTime: { 
        startDate: '2024-06-15', 
        expectedMaturityPeriod: 25,
        carbonSequestrationRateAtMaturity: 8.5
      }
    },
    { 
      id: 2,
      region: 'Kerala Forests', 
      coordinates: [10.8505, 76.2711], 
      soilType: 'alluvial', 
      vegetationType: 'tropical_rainforest', 
      treeSpecies: ['Rosewood', 'Kerala Pine', 'Wild Mango'], 
      seedingTime: { 
        startDate: '2024-07-01', 
        expectedMaturityPeriod: 30,
        carbonSequestrationRateAtMaturity: 9.2
      }
    },
    { 
      id: 3,
      region: 'Himalayan Foothills, Uttarakhand', 
      coordinates: [30.0668, 79.0193], 
      soilType: 'mountain_podozolic', 
      vegetationType: 'temperate_forest', 
      treeSpecies: ['Himalayan Oak', 'Cedar', 'Rhododendron'], 
      seedingTime: { 
        startDate: '2024-05-20', 
        expectedMaturityPeriod: 40,
        carbonSequestrationRateAtMaturity: 5.5
      }
    },
    { 
      id: 4,
      region: 'Sundarbans, West Bengal', 
      coordinates: [21.9497, 88.9068], 
      soilType: 'deltaic', 
      vegetationType: 'mangrove', 
      treeSpecies: ['Sundari', 'Gewa', 'Keora'], 
      seedingTime: { 
        startDate: '2024-08-10', 
        expectedMaturityPeriod: 20,
        carbonSequestrationRateAtMaturity: 6.8
      }
    },
    { 
      id: 5,
      region: 'Deccan Plateau, Karnataka', 
      coordinates: [15.3173, 75.7139], 
      soilType: 'black_cotton', 
      vegetationType: 'savanna', 
      treeSpecies: ['Neem', 'Tamarind', 'Acacia'], 
      seedingTime: { 
        startDate: '2024-06-30', 
        expectedMaturityPeriod: 15,
        carbonSequestrationRateAtMaturity: 3.5
      }
    }
  ];

  const VEGETATION_RATES = {
    forest: 5.0,
    grassland: 1.5,
    wetland: 3.5,
    agricultural: 1.0,
    mangrove: 4.0,
    tropical_rainforest: 6.5,
    temperate_forest: 4.5,
    boreal_forest: 3.0,
    savanna: 0.8,
    desert_vegetation: 0.1,
    other: 0
  };

  const [formType, setFormType] = useState('existing');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sinkData, setSinkData] = useState({
    name: '',
    vegetationType: 'forest',
    otherVegetationType: '',
    areaCovered: '',
    carbonSequestrationRate: VEGETATION_RATES.forest,
    additionalDetails: '',
  });

  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  // Effect to ensure carbonSequestrationRate is always set
  useEffect(() => {
    if (!sinkData.carbonSequestrationRate && sinkData.vegetationType !== 'other') {
      setSinkData(prevData => ({
        ...prevData,
        carbonSequestrationRate: VEGETATION_RATES[sinkData.vegetationType] || VEGETATION_RATES.forest
      }));
    }
  }, [sinkData.vegetationType, sinkData.carbonSequestrationRate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'vegetationType') {
      const newRate = VEGETATION_RATES[value];
      
      setSinkData(prevData => ({
        ...prevData,
        vegetationType: value,
        carbonSequestrationRate: value === 'other' ? '' : newRate,
        otherVegetationType: value === 'other' ? '' : prevData.otherVegetationType
      }));
    } else {
      setSinkData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleLocationChange = (e) => {
    const locationId = parseInt(e.target.value);
    const location = MOCK_LOCATIONS.find(loc => loc.id === locationId);
    setSelectedLocation(location);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure carbonSequestrationRate is set before submission
    const payload = {
      ...sinkData,
      carbonSequestrationRate: sinkData.carbonSequestrationRate === '' 
        ? 0 
        : parseFloat(sinkData.carbonSequestrationRate),
      areaCovered: parseFloat(sinkData.areaCovered),
      timeframe: 1
    };

    try {
      const apiEndpoint = formType === 'sink' ? 'http://localhost:5000/api/sinks' : 'http://localhost:5000/api/existing-sinks';
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response:', data);
        setResult({
          ...data.data,
          mockLocation: selectedLocation
        });
        
        // Reset form with default values
        setSinkData({
          name: '',
          vegetationType: 'forest',
          otherVegetationType: '',
          areaCovered: '',
          carbonSequestrationRate: VEGETATION_RATES.forest,
          additionalDetails: '',
        });
        setSelectedLocation(null);
      } else {
        // Handle error response
        const errorData = await response.json();
        console.error('Failed to submit form', errorData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleFormTypeChange = (e) => {
    const newFormType = e.target.value;
    setFormType(newFormType);
    
    // Reset form with default values
    setSinkData({
      name: '',
      vegetationType: 'forest',
      otherVegetationType: '',
      areaCovered: '',
      carbonSequestrationRate: VEGETATION_RATES.forest,
      additionalDetails: '',
    });
    setResult(null);
    setSelectedLocation(null);
  };

  const sectionStyle = "bg-[#342F49] p-6 rounded-lg shadow-lg border border-[#66C5CC]";
  const titleStyle = "text-2xl font-semibold text-[#66C5CC] mb-4";
  const inputStyle = "p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66C5CC] text-lg placeholder-black";
  const buttonStyle = "px-6 py-3 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105 bg-[#66C5CC] hover:bg-[#55B2B6] focus:outline-none focus:ring-2 focus:ring-[#55B2B6]";
  const radioStyle = "mr-4 text-white font-bold";

  return (
    <>
    <div className="p-6 md:p-10 mt-24 lg:p-20 min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#342F49] to-[#2B263F] relative overflow-hidden">
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-r from-[#66C5CC] to-[#55B2B6] opacity-30 animate-gradient overflow-hidden"></div>
    </div>
    
    <h1 className="text-4xl font-bold text-[#cad9ed] mb-10 text-center">Carbon Sink</h1>
  
    {/* Radio Buttons for Toggle */}
    <div className="flex space-x-6 mb-8">
      <label className={`cursor-pointer text-lg font-medium text-[#cad9ed]`}>
        <input
          type="radio"
          name="formType"
          value="sink"
          checked={formType === 'sink'}
          onChange={handleFormTypeChange}
          className="mr-2 accent-[#66C5CC]"
        />
        Carbon Sink
      </label>
      <label className={`cursor-pointer text-lg font-medium text-[#cad9ed]`}>
        <input
          type="radio"
          name="formType"
          value="existing"
          checked={formType === 'existing'}
          onChange={handleFormTypeChange}
          className="mr-2 accent-[#66C5CC]"
        />
        Existing Sink
      </label>
    </div>

    <div className="mb-6 w-full max-w-4xl">
      <h2 className="text-2xl text-[#cad9ed] font-semibold mb-2">Select Location</h2>
      <select
        onChange={handleLocationChange}
        value={selectedLocation ? selectedLocation.id : ''}
        className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
      >
        <option value="">Select a Location</option>
        {MOCK_LOCATIONS.map((location) => (
          <option key={location.id} value={location.id}>
            {location.region}
          </option>
        ))}
      </select>
    </div>
  
    <form className="space-y-8 w-full max-w-4xl bg-[#2B263F] p-8 rounded-lg shadow-lg" onSubmit={handleSubmit}>
      {/* Name */}
      <div className="mb-6">
        <h2 className="text-2xl text-[#cad9ed] font-semibold mb-2">Name</h2>
        <input
          type="text"
          name="name"
          value={sinkData.name}
          onChange={handleChange}
          placeholder="Name or identifier for the carbon sink"
          className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
        />
      </div>
  
{/* Vegetation Type */}
<div className="mb-6">
  <div className="flex items-center">
    <h2 className="text-2xl text-[#cad9ed] font-semibold mb-2 mr-2">Vegetation Type</h2>
    <div 
      className="group relative cursor-pointer"
      title="Carbon sequestration rates are approximate and can vary based on specific conditions"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6 text-[#66C5CC] opacity-50 hover:opacity-100" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
    </div>
  </div>
  <select
    name="vegetationType"
    value={sinkData.vegetationType}
    onChange={handleChange}
    className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
  >
    <optgroup label="Forests">
      <option value="tropical_rainforest">Tropical Rainforest (6.5 tons CO2/ha/year)</option>
      <option value="temperate_forest">Temperate Forest (4.5 tons CO2/ha/year)</option>
      <option value="boreal_forest">Boreal Forest (3.0 tons CO2/ha/year)</option>
    </optgroup>
    <optgroup label="Other Vegetation">
      <option value="grassland">Grassland (1.5 tons CO2/ha/year)</option>
      <option value="wetland">Wetland (3.5 tons CO2/ha/year)</option>
      <option value="agricultural">Agricultural Land (1.0 tons CO2/ha/year)</option>
      <option value="mangrove">Mangrove (4.0 tons CO2/ha/year)</option>
      <option value="savanna">Savanna (0.8 tons CO2/ha/year)</option>
      <option value="desert_vegetation">Desert Vegetation (0.1 tons CO2/ha/year)</option>
    </optgroup>
    <option value="other">Other (Manual Input)</option>
  </select>

  {/* Conditional rendering for Other Vegetation Type */}
  {sinkData.vegetationType === 'other' && (
    <div className="mt-4 space-y-4">
      <input
        type="text"
        name="otherVegetationType"
        value={sinkData.otherVegetationType}
        onChange={handleChange}
        placeholder="Specify vegetation type"
        className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
      />
      <input
        type="number"
        name="carbonSequestrationRate"
        value={sinkData.carbonSequestrationRate}
        onChange={handleChange}
        placeholder="Carbon Sequestration Rate (tons CO2/hectare/year)"
        className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
      />
      <p className="text-sm text-[#66C5CC] italic">
        Note: Please provide a scientifically backed rate or consult local environmental experts.
      </p>
    </div>
  )}
</div>
  
      {/* Area Covered */}
      <div className="mb-6">
        <h2 className="text-2xl text-[#cad9ed] font-semibold mb-2">Area Covered (hectares)</h2>
        <input
          type="number"
          name="areaCovered"
          value={sinkData.areaCovered}
          onChange={handleChange}
          placeholder="Total area covered by the sink"
          className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
        />
      </div>
  

  
      {/* Additional Details */}
      <div className="mb-6">
        <h2 className="text-2xl text-[#cad9ed] font-semibold mb-2">Additional Details</h2>
        <textarea
          name="additionalDetails"
          value={sinkData.additionalDetails}
          onChange={handleChange}
          placeholder="Any additional details"
          className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
        />
      </div>
  
      <div className="text-center">
        <button
          type="submit"
          className="py-3 px-6 bg-[#66C5CC] hover:bg-[#55B2B6] text-[#2B263F] font-bold rounded-md transition duration-300"
        >
          Submit
        </button>
      </div>
    </form>
  
    {/* Display Result */}
 {result && (
  <div className="mt-10 p-8 bg-[#342F49] text-[#cad9ed] rounded-lg shadow-lg border border-[#66C5CC] w-full max-w-4xl mx-auto">
    <h2 className="text-4xl font-semibold text-[#66C5CC] mb-6 text-center">Carbon Sink Analysis Result</h2>
    
    <div className="grid md:grid-cols-2 gap-6">
      {/* Sequestration Details */}
      <div className="bg-[#2B263F] p-6 rounded-lg">
        <h3 className="text-2xl text-[#66C5CC] mb-4">Sequestration Metrics</h3>
        <p className="mb-2"><strong>Daily Sequestration Rate:</strong> {result.dailySequestrationRate} tons CO2</p>
        <p><strong>Total Sequestration:</strong> {result.totalSequestration} tons CO2</p>
      </div>

      {/* Location Details */}
      {result.mockLocation && (
        <div className="bg-[#2B263F] p-6 rounded-lg">
          <h3 className="text-2xl text-[#66C5CC] mb-4">Location Information</h3>
          <p><strong>Region:</strong> {result.mockLocation.region}</p>
          <p><strong>Coordinates:</strong> {result.mockLocation.coordinates.join(', ')}</p>
          <p><strong>Soil Type:</strong> {result.mockLocation.soilType}</p>
          <p><strong>Vegetation Type:</strong> {result.mockLocation.vegetationType}</p>
          <p><strong>Tree Species:</strong> {result.mockLocation.treeSpecies.join(', ')}</p>
        </div>
      )}
    </div>

    {/* Seeding Time Details */}
    {result.mockLocation?.seedingTime && (
      <div className="mt-6 bg-[#2B263F] p-6 rounded-lg">
        <h3 className="text-2xl text-[#66C5CC] mb-4">Seeding and Growth Information</h3>
        <p><strong>Seeding Start Date:</strong> {result.mockLocation.seedingTime.startDate}</p>
        <p><strong>Expected Maturity Period:</strong> {result.mockLocation.seedingTime.expectedMaturityPeriod} years</p>
        <p><strong>Carbon Sequestration Rate at Maturity:</strong> {result.mockLocation.seedingTime.carbonSequestrationRateAtMaturity} tons CO2/ha/year</p>
      </div>
    )}
  </div>
)}
</div>
  <div>
  <RequiredLand/>
  </div>
  </>
  );
}

export default NeutralityForm;
