import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const EmissionMultiLineGraph = ({ data }) => {
    // Sort data by date
    const sortedData = {
        electricity: data.electricity.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
        explosion: data.explosion.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
        fuelCombustion: data.fuelCombustion.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
        shipping: data.shipping.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    };

    const lineData = {
        labels: sortedData.electricity.map(item => new Date(item.createdAt).toLocaleDateString()),
        datasets: [
            {
                label: 'Electricity Emissions',
                data: sortedData.electricity.map(item => item.result?.CO2?.value || 0),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Explosion Emissions',
                data: sortedData.explosion.map(item => item.emissions?.CO2 || 0),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
                label: 'Fuel Combustion Emissions',
                data: sortedData.fuelCombustion.map(item => item.result?.CO2?.value || 0),
                borderColor: 'rgb(255, 206, 86)',
                backgroundColor: 'rgba(255, 206, 86, 0.5)',
            },
            {
                label: 'Shipping Emissions',
                data: sortedData.shipping.map(item => item.result?.carbonEmissions?.kilograms || 0),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Emissions Over Time'
            }
        }
    };

    return <Line data={lineData} options={options} />;
};

export default EmissionMultiLineGraph;