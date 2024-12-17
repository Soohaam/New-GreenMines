import React from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import EmissionEntries from './EmissionEntries';

const DonutAndEntries = ({ data }) => {
  console.log(data);
  

  const electricityCO2 = data.electricity.reduce((total, item) => total + item.result.CO2.value, 0);
  const fuelCO2 = data.fuelCombustion.reduce((total, item) => total + item.result.CO2.value, 0);
  const shippingCO2 = data.shipping.reduce((total, item) => total + parseFloat(item.result.carbonEmissions.kilograms), 0);
  const explosionCO2 = data.explosion.reduce((total, item) => total + parseFloat(item.emissions.CO2), 0);
  const coalCO2 = data.coalBurn.reduce((total, item) => total + parseFloat(item.co2Emissions), 0);
  const methane= data.methane.reduce((total, item) => total + parseFloat(item.totalMethane), 0);


  // Data for the Doughnut Chart
  const doughnutData = {
    labels: ["Electricity", "Explosion", "Fuel", "Shipping","coalBurn","methane"],
    datasets: [
      {
        data: [ electricityCO2 ,explosionCO2 ,fuelCO2, shippingCO2, coalCO2 ,methane],
        backgroundColor: ["#0046b9", "#11c610", "#d5d502", "#6302d5","#FFFFFF","#FF0000"],
        hoverBackgroundColor: ["#0046b9", "#11c610", "#d5d502", "#6302d5","#FFFFFF","#FF0000"],
      },
    ],
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 xl:col-span-3 p-4">
      {/* Total Emission Card */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mt-6 w-full sm:w-[40%] md:w-[40%] lg:w-[40%] xl:w-[40%] max-w-full mx-auto">
        <h2 className="text-lg font-bold mb-4">Total Emission</h2>
        <div className="flex justify-between items-center mb-6"></div>
        <div className="flex justify-center p-4">
          <div className="w-full max-w-[400px] sm:max-w-[400px]">
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>

      {/* Data Entries Table */}
      <EmissionEntries data={data} />
    </div>
  );
};

export default DonutAndEntries;
