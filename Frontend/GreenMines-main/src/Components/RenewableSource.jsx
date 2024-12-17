import React, { useState } from 'react';
import axios from 'axios';
import Enavbar from './Enavbar';
import ChatAssistant from './ChatAssistant';

const RenewableEnergyForm = () => {
  const [solutionName, setSolutionName] = useState('');
  const [co2EmissionsPerDay, setCo2EmissionsPerDay] = useState('');
  const [desiredReductionPercentage, setDesiredReductionPercentage] = useState('');
  const [selectedRenewable, setSelectedRenewable] = useState('Solar');
  const [availableLand, setAvailableLand] = useState('1');
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure that values are converted to numbers before sending
    const formData = {
      solutionName,
      co2EmissionsPerDay: Number(co2EmissionsPerDay),
      selectedRenewable,
      desiredReductionPercentage: Number(desiredReductionPercentage),
      availableLand: Number(availableLand),
    };

    // Validate data
    if (isNaN(formData.co2EmissionsPerDay) || isNaN(formData.desiredReductionPercentage) || isNaN(formData.availableLand)) {
      setErrorMessage('Please enter valid numbers for all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/renewable', formData);
      setResult(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Error calculating renewable impact. Please try again later.');
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
      <h2 className="text-3xl md:text-4xl font-bold text-[#66C5CC] mb-8 text-center">
        Renewable Energy Calculator
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Solution Name */}
        <div>
          <label className="block text-xl font-medium text-[#66C5CC] mb-2" htmlFor="solutionName">
            Solution Name
          </label>
          <input
            id="solutionName"
            type="text"
            placeholder="Enter solution name"
            value={solutionName}
            onChange={(e) => setSolutionName(e.target.value)}
            className="w-full p-3 border-2 border-[#4da5aa] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#66C5CC] bg-[#342F49] text-white"
            required
          />
        </div>

        {/* CO₂ Emissions Per Day */}
        <div>
          <label className="block text-xl font-medium text-[#66C5CC] mb-2" htmlFor="co2EmissionsPerDay">
            CO₂ Emissions Per Day (tonnes)
          </label>
          <input
            id="co2EmissionsPerDay"
            type="number"
            placeholder="Enter CO₂ emissions per day"
            value={co2EmissionsPerDay}
            onChange={(e) => setCo2EmissionsPerDay(e.target.value)}
            className="w-full p-3 border-2 border-[#4da5aa] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#66C5CC] bg-[#342F49] text-white"
            required
          />
        </div>

        {/* Desired CO₂ Reduction Percentage */}
        <div>
          <label className="block text-xl font-medium text-[#66C5CC] mb-2" htmlFor="desiredReductionPercentage">
            Desired CO₂ Reduction (%)
          </label>
          <input
            id="desiredReductionPercentage"
            type="number"
            placeholder="Enter reduction percentage"
            value={desiredReductionPercentage}
            onChange={(e) => setDesiredReductionPercentage(e.target.value)}
            className="w-full p-3 border-2 border-[#4da5aa] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#66C5CC] bg-[#342F49] text-white"
            required
          />
        </div>

        {/* Select Renewable Energy */}
        <div>
          <label className="block text-xl font-medium text-[#66C5CC] mb-2" htmlFor="selectedRenewable">
            Select Renewable Energy
          </label>
          <select
            id="selectedRenewable"
            value={selectedRenewable}
            onChange={(e) => setSelectedRenewable(e.target.value)}
            className="w-full p-3 border-2 border-[#4da5aa] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#66C5CC] bg-[#342F49] text-white"
          >
            <option value="Solar">Solar</option>
            <option value="Wind">Wind</option>
            <option value="Hydropower">Hydropower</option>
            <option value="HydrogenElectric">Hydrogen Electric</option>
          </select>
        </div>

        {/* Available Land */}
        <div>
          <label className="block text-xl font-medium text-[#66C5CC] mb-2" htmlFor="availableLand">
            Available Land (hectares)
          </label>
          <input
            id="availableLand"
            type="number"
            placeholder="Enter available land in hectares"
            value={availableLand}
            onChange={(e) => setAvailableLand(e.target.value)}
            className="w-full p-3 border-2 border-[#4da5aa] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#66C5CC] bg-[#342F49] text-white"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            type="submit"
            className="w-full max-w-xs py-3 px-4 text-lg font-semibold text-black rounded-lg shadow-lg bg-[#66C5CC] hover:bg-[#5eb6b7]"
          >
            Calculate Impact
          </button>
        </div>
      </form>

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-6 text-center text-red-500 text-lg">{errorMessage}</div>
      )}

      {/* Result Display */}
      {result && (
        <div className="mt-10 p-8 bg-[#342F49] rounded-lg border-2 border-[#66C5CC]">
          <h3 className="text-3xl font-bold text-[#66C5CC] mb-4">Calculation Results</h3>
          <ul className="space-y-4 text-lg font-semibold text-white">
            <li><strong>Solution Name:</strong> {result.solutionName}</li>
            <li><strong>Renewable Energy Source:</strong> {result.selectedRenewable}</li>
            <li><strong>Implementation Cost:</strong> {result.implementationCost}</li>
            <li><strong>Target CO₂ Reduction:</strong> {result.targetCo2Reduction} tonnes per day</li>
            <li><strong>Total CO₂ Reduction:</strong> {result.totalCo2ReductionPerDay} tonnes per day</li>
            <li><strong>Land Provided:</strong> {result.landProvided} hectares</li>
            <li><strong>Time to Achieve Neutrality:</strong> {result.timeToAchieveNeutrality}</li>
          </ul>
          <hr className="my-8 border-t-2 border-[#66C5CC]" />

          <h3 className="text-2xl font-bold text-[#66C5CC] mb-4">Cost Savings After Achieving Neutrality</h3>
          <ul className="space-y-4 text-lg font-semibold text-white">
            <li><strong>Carbon Credits Saved Per Day:</strong> {result.carbonCreditsSavedPerDay} credits</li>
            <li><strong>Carbon Credits Saved in a Year:</strong> {result.carbonCreditsSavedPerYear} credits</li>
            <li><strong>Cost of Carbon Credits Saved in a Year:</strong> {result.costOfCarbonCreditsSavedPerYear}</li>
          </ul>
        </div>
      )}
    </div>
  </div>
</div>

  );
};

export default RenewableEnergyForm;
