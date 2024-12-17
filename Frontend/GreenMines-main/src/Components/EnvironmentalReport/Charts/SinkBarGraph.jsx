import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const SinkBarGraph = ({ data }) => {
    // Calculate total emissions for all sources
    const calculateTotalEmissions = () => {
        const emissionSources = [
            ...(data.electricity || []),
            ...(data.explosion || []),
            ...(data.fuelCombustion || []),
            ...(data.shipping || [])
        ];

        return emissionSources.reduce((sum, item) => {
            let co2Value = 0;
            if (item.result && item.result.CO2) {
                co2Value = parseFloat(item.result.CO2.value) / 1000; // Convert to tons
            } else if (item.emissions && item.emissions.CO2) {
                co2Value = parseFloat(item.emissions.CO2) / 1000;
            } else if (item.result && item.result.carbonEmissions) {
                co2Value = parseFloat(item.result.carbonEmissions.kilograms) / 1000;
            }
            return sum + (isNaN(co2Value) ? 0 : co2Value);
        }, 0);
    };

    // Calculate total absorption from sinks
    const calculateTotalAbsorption = () => {
        return data.sinks.reduce((sum, sink) => {
            const dailyRate = sink.dailySequestrationRate || (sink.carbonSequestrationRate / 365);
            return sum + (dailyRate * sink.areaCovered); // Total absorbed CO2 in tons
        }, 0);
    };

    // Prepare Data for Graph
    const totalEmissions = calculateTotalEmissions(); // Call the function correctly
    const totalAbsorption = calculateTotalAbsorption();

    const barData = {
        labels: ['Total Emissions', 'Total Absorbed Sinks'],
        datasets: [{
            label: 'CO2 (tons)',
            data: [totalEmissions, totalAbsorption],
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)', // Color for total emissions
                'rgba(75, 192, 192, 0.6)'  // Color for total absorption
            ]
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Important for PDF rendering
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14
                    }
                }
            },
            title: {
                display: true,
                text: 'Total Emissions vs. Total Absorbed Sinks',
                font: {
                    size: 16
                }
            }
        }
    };

    return (
        <div style={{ 
            width: '100%', 
            height: '500px', // Ensure sufficient height
            backgroundColor: 'white' 
        }}>
            <Bar data={barData} options={options} />
        </div>
    );
};

export default SinkBarGraph;