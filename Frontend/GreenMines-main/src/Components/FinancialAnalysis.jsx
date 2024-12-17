import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function FinancialAnalysis() {
  const barData = {
    labels: ['Clean Tech', 'Renewable Energy', 'Afforestation'],
    datasets: [
      {
        label: 'Cost (Million INR)',
        data: [500, 750, 250],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Savings (Million INR)',
        data: [600, 900, 300],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const barOptions = {
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    
    <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 w-full lg:max-w-[50%] max-h-[1800px] mb-4">
    <div className="flex flex-col bg-gray-900 rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Financial Analysis</h2>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-medium text-gray-300 mb-2">Cost vs Savings Analysis</h3>
          <div className="h-[300px] sm:h-[400px] w-full"> {/* Adjust container size for the Bar Chart */}
            <Bar 
              data={barData} 
              options={{
                ...barOptions,
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  ...barOptions.plugins,
                  legend: {
                    ...barOptions.plugins?.legend,
                    labels: {
                      ...barOptions.plugins?.legend?.labels,
                      font: {
                        size: 10,
                        ...barOptions.plugins?.legend?.labels?.font
                      }
                    }
                  }
                },
                scales: {
                  ...barOptions.scales,
                  x: {
                    ...barOptions.scales?.x,
                    ticks: {
                      ...barOptions.scales?.x?.ticks,
                      font: {
                        size: 10,
                        ...barOptions.scales?.x?.ticks?.font
                      }
                    }
                  },
                  y: {
                    ...barOptions.scales?.y,
                    ticks: {
                      ...barOptions.scales?.y?.ticks,
                      font: {
                        size: 10,
                        ...barOptions.scales?.y?.ticks?.font
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-medium text-gray-300 mb-2">ROI Potential</h3>
          <p className="text-3xl sm:text-4xl font-bold text-green-600">22%</p>
          <p className="text-xs sm:text-sm text-gray-400">Estimated ROI over 5 years</p>
        </div>
      </div>
    </div>
  </div>
  
  
  
  );
}
