import React from 'react';

const NeutralityGraph = () => {
  const data = [
    { label: 'Carbon Credits', value: 69.89 },
    { label: 'Green Energy', value: 47.35 },
    { label: 'Carbon Capture', value: 100 },
    { label: 'Sustainable Products', value: 55.63 },
  ];

  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="w-screen bg-gray-800 rounded-lg justify-center shadow-md p-4 sm:p-6 mb-4 mr-5">
      <div className="w-[99%] bg-gray-900 rounded-lg shadow-md p-1 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 pb-2 border-b border-gray-700">
          Revenue Generation from Neutrality Pathways
        </h3>

        <div className="space-y-4 sm:space-y-6">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-36 text-right text-gray-300 font-medium">{item.label}</div>
              <div className="flex-grow bg-gray-800 rounded-lg h-6 overflow-hidden">
                <div
                  className="h-full bg-green-600 transition-all duration-500 ease-out"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
              <div className="w-12 text-gray-300 font-medium">{item.value}%</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <div className="bg-gray-800 rounded-lg shadow-md p-4 transition duration-300 hover:shadow-xl">
            <h4 className="text-lg sm:text-xl font-bold mb-2 text-white pb-2 border-b border-gray-700">
              Top Revenue Generators
            </h4>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-2">
                <span className="font-medium text-gray-300 min-w-[1.5rem] text-base sm:text-lg">1.</span>
                <div>
                  <span className="bg-green-600 inline-block py-1 px-2 rounded text-white font-medium text-sm sm:text-base mr-1 mb-1">
                    Carbon Capture
                  </span>
                  <span className="text-gray-300 text-sm sm:text-base">
                    Generates <span className="font-medium">80%</span> of neutrality revenue through industrial partnerships.
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium text-gray-300 min-w-[1.5rem] text-base sm:text-lg">2.</span>
                <div>
                  <span className="bg-green-600 inline-block py-1 px-2 rounded text-white font-medium text-sm sm:text-base mr-1 mb-1">
                    Carbon Credits
                  </span>
                  <span className="text-gray-300 text-sm sm:text-base">
                    Contributes <span className="font-medium">65%</span> to revenue through trading and offsetting programs.
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium text-gray-300 min-w-[1.5rem] text-base sm:text-lg">3.</span>
                <div>
                  <span className="bg-green-600 inline-block py-1 px-2 rounded text-white font-medium text-sm sm:text-base mr-1 mb-1">
                    Sustainable Products
                  </span>
                  <span className="text-gray-300 text-sm sm:text-base">
                    Accounts for <span className="font-medium">55%</span> of revenue through eco-friendly product sales.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-md p-4 transition duration-300 hover:shadow-xl">
            <h4 className="text-lg sm:text-xl font-bold mb-2 text-white pb-2 border-b border-gray-700">
              Growth Opportunities
            </h4>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-2">
                <span className="font-medium text-gray-300 min-w-[1.5rem] text-base sm:text-lg">1.</span>
                <div>
                  <span className="bg-green-600 inline-block py-1 px-2 rounded text-white font-medium text-sm sm:text-base mr-1 mb-1">
                    Green Energy
                  </span>
                  <span className="text-gray-300 text-sm sm:text-base">
                    Currently at <span className="font-medium">40%</span>, with high potential for expansion in renewable energy markets.
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium text-gray-300 min-w-[1.5rem] text-base sm:text-lg">2.</span>
                <div>
                  <span className="bg-green-600 inline-block py-1 px-2 rounded text-white font-medium text-sm sm:text-base mr-1 mb-1">
                    Sustainable Products
                  </span>
                  <span className="text-gray-300 text-sm sm:text-base">
                    Potential to increase from <span className="font-medium">55%</span> through product line expansion and marketing.
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium text-gray-300 min-w-[1.5rem] text-base sm:text-lg">3.</span>
                <div>
                  <span className="bg-green-600 inline-block py-1 px-2 rounded text-white font-medium text-sm sm:text-base mr-1 mb-1">
                    Carbon Credits
                  </span>
                  <span className="text-gray-300 text-sm sm:text-base">
                    Room to grow beyond <span className="font-medium">65%</span> by entering new carbon markets and improving efficiency.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeutralityGraph;

