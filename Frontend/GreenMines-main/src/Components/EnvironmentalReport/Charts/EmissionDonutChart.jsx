import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const EmissionDonutChart = ({ data }) => {

      // Calculate totals for each category
      // Calculate totals for each category
      const calculateTotalEmissions = (items) => {
        return items.reduce((sum, item) => {
            let co2Value = 0;
            if (item.result && item.result.CO2) {
                co2Value = parseFloat(item.result.CO2.value) / 1000; // Convert to tons
            } else if (item.emissions && item.emissions.CO2) {
                co2Value = parseFloat(item.emissions.CO2) / 1000;
            } else if (item.result && item.result.carbonEmissions) {
                co2Value = parseFloat(item.result.carbonEmissions.kilograms) / 1000;
            } else if (item.co2Emissions) {
                co2Value = parseFloat(item.co2Emissions) / 1000;
            }
            return sum + (isNaN(co2Value) ? 0 : co2Value);
        }, 0);
    };

    const donutData = {
        labels: ['Electricity', 'Explosion', 'Fuel Combustion', 'Shipping', 'Coal'],
        datasets: [{
            data: [
                calculateTotalEmissions(data.electricity),
                calculateTotalEmissions(data.explosion),
                calculateTotalEmissions(data.fuelCombustion),
                calculateTotalEmissions(data.shipping),
                calculateTotalEmissions(data.coal)
            ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',   // Bright Pink
                'rgba(54, 162, 235, 0.8)',  // Bright Blue
                'rgba(255, 159, 64, 0.8)',  // Vibrant Orange
                'rgba(75, 192, 192, 0.8)',  // Teal
                'rgba(153, 102, 255, 0.8)'  // Lavender
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    };
    

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14, // Increase legend text size
                        weight: 'bold', // Make legend text bold
                    },
                },
            },
            title: {
                display: true,
                text: 'Emissions Distribution',
                font: {
                    size: 16, // Increase title text size
                    weight: 'bold', // Make title text bold
                },
            },
        },
    };
    

    return <Doughnut data={donutData} options={options} />;
};

export default EmissionDonutChart;