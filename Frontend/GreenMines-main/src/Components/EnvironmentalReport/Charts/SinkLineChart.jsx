import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const SinkLineChart = ({ period = "week" }) => { // Default period is "week"
  const periodLabels = {
    week: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    month: ["Week 1", "Week 2", "Week 3", "Week 4"],
    year: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
  };

  const colorSchemes = {
    week: { backgroundColor: "#4CAF50", borderColor: "#388E3C" },
    month: { backgroundColor: "#FF9800", borderColor: "#F57C00" },
    year: { backgroundColor: "#E91E63", borderColor: "#C2185B" }
  };

  const staticData = {
    week: [50, 75, 60, 90, 80, 70, 85],
    month: [300, 400, 350, 450],
    year: [3500, 4000, 3700, 4200, 3900, 4100, 4300, 3900, 3800, 4000, 4100, 4200]
  };

  // Validate period and fallback to "week"
  const validPeriod = ["week", "month", "year"].includes(period) ? period : "week";

  const data = {
    labels: periodLabels[validPeriod],
    datasets: [
      {
        label: `Carbon Sequestration (${validPeriod.charAt(0).toUpperCase() + validPeriod.slice(1)})`,
        data: staticData[validPeriod],
        backgroundColor: colorSchemes[validPeriod].backgroundColor,
        borderColor: colorSchemes[validPeriod].borderColor,
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Sink Line Chart for ${validPeriod.charAt(0).toUpperCase() + validPeriod.slice(1)} Report`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Carbon Sequestration (tons)",
        },
      },
      x: {
        title: {
          display: true,
          text: validPeriod === "week" ? "Days" : validPeriod === "month" ? "Weeks" : "Months",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default SinkLineChart;
