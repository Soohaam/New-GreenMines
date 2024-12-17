import { useState } from "react";
import { Tooltip } from "react-tooltip";  // Updated import

const MethaneMonitoring = () => {
  const [formData, setFormData] = useState({
    miningType: 'Surface',
    surfaceCoalProduction: 0,
    undergroundCoalProduction: 0,
    surfaceEmissionFactor: 0,
    undergroundEmissionFactor: 0,
    ventilationEmissions: 0,
    degasificationEmissions: 0,
    atmosphericConditions: {
        temperature: 0,
        humidity: 0,
        pressure: 0,
    },
  });

  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.atmosphericConditions) {
        setFormData((prevData) => ({
            ...prevData,
            atmosphericConditions: {
                ...prevData.atmosphericConditions,
                [name]: parseFloat(value) || 0, // Accept fractional values
            },
        }));
    } else {
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "miningType" ? value : parseFloat(value) || 0, // Accept fractional values
        }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/methane-emission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
    }
  };

  const { miningType } = formData;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      

          <form onSubmit={handleSubmit} className="space-y-8 w-full">
            <div>
              <label className="block text-xl font-medium text-[#66C5CC] mb-2" htmlFor="miningType">
                Mining Type
              </label>
              <select
                id="miningType"
                name="miningType"
                onChange={handleChange}
                className="w-full p-3 border-2 border-[#4da5aa] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#66C5CC] bg-[#342F49] text-white"
                value={miningType}
              >
                <option value="Surface">Surface</option>
                <option value="Underground">Underground</option>
              </select>
            </div>

            {miningType === "Surface" && (
              <>
                <div>
                  <label className="block text-xl font-medium text-[#66C5CC] mb-2" htmlFor="surfaceCoalProduction">
                    Surface Coal Production (tons)
                  </label>
                  <input
                    id="surfaceCoalProduction"
                    type="number"
                    name="surfaceCoalProduction"
                    onChange={handleChange}
                    step="0.01" // Accept fractional values
                    className="w-full p-3 border-2 border-[#4da5aa] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#66C5CC] bg-[#342F49] text-white"
                  />
                </div>
                <div>
                  <label className="block text-xl font-medium text-[#66C5CC] mb-2" htmlFor="surfaceEmissionFactor">
                    Surface Emission Factor (CH4/ton)
                  </label>
                  <input
                    id="surfaceEmissionFactor"
                    type="number"
                    name="surfaceEmissionFactor"
                    onChange={handleChange}
                    step="0.01" // Accept fractional values
                    className="w-full p-3 border-2 border-[#4da5aa] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#66C5CC] bg-[#342F49] text-white"
                  />
                </div>
              </>
            )}

            {miningType === "Underground" && (
              <>
                <div>
                  <label className="block text-xl font-medium text-[#66C5CC] mb-2" htmlFor="undergroundCoalProduction">
                    Underground Coal Production (tons)
                  </label>
                  <input
                    id="undergroundCoalProduction"
                    type="number"
                    name="undergroundCoalProduction"
                    onChange={handleChange}
                    step="0.01" // Accept fractional values
                    className="w-full p-3 border-2 border-[#4da5aa] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#66C5CC] bg-[#342F49] text-white"
                  />
                </div>
                <div>
                  <label className="block text-xl font-medium text-[#66C5CC] mb-2" htmlFor="undergroundEmissionFactor">
                    Underground Emission Factor (CH4/ton)
                  </label>
                  <input
                    id="undergroundEmissionFactor"
                    type="number"
                    name="undergroundEmissionFactor"
                    onChange={handleChange}
                    step="0.01" // Accept fractional values
                    className="w-full p-3 border-2 border-[#4da5aa] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#66C5CC] bg-[#342F49] text-white"
                  />
                </div>
                <div>
                  <label className="block text-xl font-medium text-[#66C5CC] mb-2" htmlFor="ventilationEmissions">
                    Ventilation Emissions (Mcf)
                    <span
                      data-tip="This refers to the methane emissions released during the ventilation process in underground mines. Please enter the amount of methane released from the ventilation system."
                      className="text-[#66C5CC] cursor-pointer ml-2"
                    >
                      <i className="fas fa-info-circle"></i>
                    </span>
                    <Tooltip />
                  </label>
                  <input
                    id="ventilationEmissions"
                    type="number"
                    name="ventilationEmissions"
                    onChange={handleChange}
                    step="0.01" // Accept fractional values
                    className="w-full p-3 border-2 border-[#4da5aa] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#66C5CC] bg-[#342F49] text-white"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xl font-medium text-[#66C5CC] mb-2" htmlFor="temperature">
                Atmospheric Temperature (°C)
              </label>
              <input
                id="temperature"
                type="number"
                name="temperature"
                onChange={handleChange}
                step="0.01" // Accept fractional values
                className="w-full p-3 border-2 border-[#4da5aa] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#66C5CC] bg-[#342F49] text-white"
              />
            </div>

            <div>
              <label className="block text-xl font-medium text-[#66C5CC] mb-2" htmlFor="humidity">
                Atmospheric Humidity (%)
              </label>
              <input
                id="humidity"
                type="number"
                name="humidity"
                onChange={handleChange}
                step="0.01" // Accept fractional values
                className="w-full p-3 border-2 border-[#4da5aa] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#66C5CC] bg-[#342F49] text-white"
              />
            </div>

            <div>
              <label className="block text-xl font-medium text-[#66C5CC] mb-2" htmlFor="pressure">
                Atmospheric Pressure (Pa)
              </label>
              <input
                id="pressure"
                type="number"
                name="pressure"
                onChange={handleChange}
                step="0.01" // Accept fractional values
                className="w-full p-3 border-2 border-[#4da5aa] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#66C5CC] bg-[#342F49] text-white"
              />
            </div>

            <div className="mt-8 text-center">
              <button
                type="submit"
                className="w-full max-w-xs py-3 px-4 text-lg font-semibold text-black rounded-lg shadow-lg bg-[#66C5CC] hover:bg-[#5eb6b7]"
              >
                Submit
              </button>
            </div>
          </form>

          {response && (
            <div className="mt-10 p-8 bg-[#342F49] rounded-lg border-2 border-[#66C5CC]">
              <h3 className="text-3xl font-bold text-[#66C5CC] mb-4">Results</h3>
              <ul className="space-y-4 text-lg font-semibold text-white">
                <li>Total Methane Emissions: {response.data.totalMethane} Mcf</li>
              </ul>
            </div>
          )}
        
    </div>
  );
};

export default MethaneMonitoring;
