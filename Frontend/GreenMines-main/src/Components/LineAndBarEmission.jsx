import React, { useState , useEffect } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LineAndBarEmission = ({data}) => {

  const [fetchWeekData, setWeekData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchLastSevenDaysData = async () => {
    try {
      setLoading(true);
  
      // Get today's date
      const today = new Date();
  
      // Calculate 7 days ago from today
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      
      // Format the dates to YYYY-MM-DD
      const formattedStartDate = sevenDaysAgo.toISOString().split('T')[0];
      const formattedEndDate = today.toISOString().split('T')[0];
  
      // Make the API call with the start and end date for last 7 days
      const response = await axios.get(`http://localhost:5000/api/data/${formattedStartDate}/${formattedEndDate}`);
  
      console.log('Last 7 days data:', response.data);
  
      // Set the fetched data to state
      setWeekData(response.data);
      setLoading(false);
  
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
      console.error(err);
    }
  };
  useEffect(() => {
    fetchLastSevenDaysData();
  }, []);
  

  const calculateEmissionsByDay = (data) => {
    // Initialize emissionsByDay with all the days of the week
    const emissionsByDay = {
      Sunday: { electricity: 0, fuelCombustion: 0, shipping: 0, explosion: 0 ,coalBurn:0 ,methane:0 },
      Monday: { electricity: 0, fuelCombustion: 0, shipping: 0, explosion: 0 ,coalBurn:0,methane:0},
      Tuesday: { electricity: 0, fuelCombustion: 0, shipping: 0, explosion: 0 ,coalBurn:0,methane:0},
      Wednesday: { electricity: 0, fuelCombustion: 0, shipping: 0, explosion: 0 ,coalBurn:0,methane:0},
      Thursday: { electricity: 0, fuelCombustion: 0, shipping: 0, explosion: 0 ,coalBurn:0,methane:0},
      Friday: { electricity: 0, fuelCombustion: 0, shipping: 0, explosion: 0 ,coalBurn:0,methane:0},
      Saturday: { electricity: 0, fuelCombustion: 0, shipping: 0, explosion: 0 ,coalBurn:0,methane:0},
    };
  
    const addEmissionToDay = (date, emission, category) => {
      const day = getDayOfWeek(date); // Get the day of the week
      if (emissionsByDay[day]) {
        emissionsByDay[day][category] += emission; // Add emission to the respective category
      }
    };
  
    // Electricity
    data.electricity.forEach(entry => {
      const co2Emission = entry.result.CO2.value;
      addEmissionToDay(entry.createdAt, co2Emission, 'electricity');
    });
  
    // Fuel Combustion
    data.fuelCombustion.forEach(entry => {
      const co2Emission = entry.result.CO2.value;
      addEmissionToDay(entry.createdAt, co2Emission, 'fuelCombustion');
    });
  
    // Shipping
    data.shipping.forEach(entry => {
      const co2Emission = parseFloat(entry.result.carbonEmissions.kilograms);
      addEmissionToDay(entry.createdAt, co2Emission, 'shipping');
    });
  
    // Explosion
    data.explosion.forEach(entry => {
      const co2Emission = parseFloat(entry.emissions.CO2);
      addEmissionToDay(entry.createdAt, co2Emission, 'explosion');
    });

    data.coalBurn.forEach(entry => {
      const co2Emission = parseFloat(entry.co2Emissions);
      addEmissionToDay(entry.createdAt, co2Emission, 'coalBurn');
    });

    data.methane.forEach(entry => {
      const methaneEmission = parseFloat(entry.totalMethane);
      addEmissionToDay(entry.createdAt, methaneEmission, 'coalBurn');
    });
  
    return emissionsByDay;
  };
  
  // Utility function to get the day of the week
  const getDayOfWeek = (date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = new Date(date).getDay();
    return days[day];
  };
  
  // Ensure fetchWeekData is not null before calling the function
  const totalEmissionsByDay = fetchWeekData ? calculateEmissionsByDay(fetchWeekData) : null;
  
  console.log("weeks total",totalEmissionsByDay);
  
  const weekData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
      {
        label: "Electricity",
        data: [
          (totalEmissionsByDay && totalEmissionsByDay.Monday ? totalEmissionsByDay.Monday.electricity : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Tuesday ? totalEmissionsByDay.Tuesday.electricity : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Wednesday ? totalEmissionsByDay.Wednesday.electricity : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Thursday ? totalEmissionsByDay.Thursday.electricity : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Friday ? totalEmissionsByDay.Friday.electricity : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Saturday ? totalEmissionsByDay.Saturday.electricity : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Sunday ? totalEmissionsByDay.Sunday.electricity : 0),
        ],
        borderColor: "#0046b9",
        backgroundColor: "#0046b9",
        tension: 0.4,
      },
      {
        label: "Explosion",
        data: [
          (totalEmissionsByDay && totalEmissionsByDay.Monday ? totalEmissionsByDay.Monday.explosion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Tuesday ? totalEmissionsByDay.Tuesday.explosion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Wednesday ? totalEmissionsByDay.Wednesday.explosion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Thursday ? totalEmissionsByDay.Thursday.explosion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Friday ? totalEmissionsByDay.Friday.explosion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Saturday ? totalEmissionsByDay.Saturday.explosion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Sunday ? totalEmissionsByDay.Sunday.explosion : 0),
        ],
        borderColor: "#11c610",
        backgroundColor: "#11c610",
        tension: 0.4,
      },
      {
        label: "Fuel",
        data: [
          (totalEmissionsByDay && totalEmissionsByDay.Monday ? totalEmissionsByDay.Monday.fuelCombustion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Tuesday ? totalEmissionsByDay.Tuesday.fuelCombustion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Wednesday ? totalEmissionsByDay.Wednesday.fuelCombustion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Thursday ? totalEmissionsByDay.Thursday.fuelCombustion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Friday ? totalEmissionsByDay.Friday.fuelCombustion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Saturday ? totalEmissionsByDay.Saturday.fuelCombustion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Sunday ? totalEmissionsByDay.Sunday.fuelCombustion : 0),
        ],
        borderColor: "#d5d502",
        backgroundColor: "#d5d502",
        tension: 0.4,
      },
      {
        label: "Shipping",
        data: [
          (totalEmissionsByDay && totalEmissionsByDay.Monday ? totalEmissionsByDay.Monday.shipping : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Tuesday ? totalEmissionsByDay.Tuesday.shipping : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Wednesday ? totalEmissionsByDay.Wednesday.shipping : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Thursday ? totalEmissionsByDay.Thursday.shipping : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Friday ? totalEmissionsByDay.Friday.shipping : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Saturday ? totalEmissionsByDay.Saturday.shipping : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Sunday ? totalEmissionsByDay.Sunday.shipping : 0),
        ],
        borderColor: "#6302d5",
        backgroundColor: "#6302d5",
        tension: 0.4,
      },
      {
        label: "coalBurn",
        data: [
          (totalEmissionsByDay && totalEmissionsByDay.Monday ? totalEmissionsByDay.Monday.coalBurn : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Tuesday ? totalEmissionsByDay.Tuesday.coalBurn : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Wednesday ? totalEmissionsByDay.Wednesday.coalBurn : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Thursday ? totalEmissionsByDay.Thursday.coalBurn : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Friday ? totalEmissionsByDay.Friday.coalBurn : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Saturday ? totalEmissionsByDay.Saturday.coalBurn : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Sunday ? totalEmissionsByDay.Sunday.coalBurn : 0),
        ],
        borderColor: "#FFFFFF",
        backgroundColor: "#FFFFFF",
        tension: 0.4,
      },
      {
        label: "coalBurn",
        data: [
          (totalEmissionsByDay && totalEmissionsByDay.Monday ? totalEmissionsByDay.Monday.methane : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Tuesday ? totalEmissionsByDay.Tuesday.methane : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Wednesday ? totalEmissionsByDay.Wednesday.methane : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Thursday ? totalEmissionsByDay.Thursday.methane : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Friday ? totalEmissionsByDay.Friday.methane : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Saturday ? totalEmissionsByDay.Saturday.methane : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Sunday ? totalEmissionsByDay.Sunday.methane : 0),
        ],
        borderColor: "#FF0000",
        backgroundColor: "#FF0000",
        tension: 0.4,
      },
    ],
  };
  
  
  
  const [MonthData,setMonthData]=useState(null);
  // console.log(weekData);
  const [fetchMonthData, setFetchMonthData] = useState(null);

  // Function to fetch last month's data
  const fetchLastThirtyDaysData = async () => {
    try {
      const today = new Date();

      // Calculate 30 days ago
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      const startDate = thirtyDaysAgo.toISOString().split("T")[0];
      const endDate = today.toISOString().split("T")[0];

      // Fetch data from API
      const response = await axios.get(
        `http://localhost:5000/api/data/${startDate}/${endDate}`
      );

      console.log("Last 30 days data:", response.data);
      setFetchMonthData(response.data);
    } catch (error) {
      console.error("Error fetching last 30 days data:", error);
    }
  };

  useEffect(() => {
    fetchLastThirtyDaysData();
  }, []);

  const parseData = (data) => {
    if (!data || Object.values(data).some((arr) => arr == null)) {
      return {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
          {
            label: "Electricity",
            data: [0, 0, 0, 0],
            borderColor: "#0046b9",
            backgroundColor: "#0046b9",
            tension: 0.4,
          },
          {
            label: "Fuel Combustion",
            data: [0, 0, 0, 0],
            borderColor: "#FF6384",
            backgroundColor: "#FF6384",
            tension: 0.4,
          },
          {
            label: "Shipping",
            data: [0, 0, 0, 0],
            borderColor: "#36A2EB",
            backgroundColor: "#36A2EB",
            tension: 0.4,
          },
          {
            label: "Explosions",
            data: [0, 0, 0, 0],
            borderColor: "#FFCE56",
            backgroundColor: "#FFCE56",
            tension: 0.4,
          },
          {
            label: "coalBurn",
            data: [0, 0, 0, 0],
            borderColor: "#FFFFFF",
            backgroundColor: "#FFFFFF",
            tension: 0.4,
          },
          {
            label: "methane",
            data: [0, 0, 0, 0],
            borderColor: "#FF0000",
            backgroundColor: "#FF0000",
            tension: 0.4,
          },
        ],
      };
    }

    const parseNumeric = (value) => {
      if (typeof value === "string") {
        const matches = value.match(/[-+]?(\d*\.\d+|\d+)/);
        return matches ? parseFloat(matches[0]) : 0;
      }
      return Number(value) || 0;
    };

    const getAllDates = (dataArray, dateKey = "createdAt") =>
      dataArray.map((item) => new Date(item[dateKey]));

    const generateWeeks = (startDate, numWeeks = 4) => {
      const weeks = [];
      let currentWeekStart = new Date(startDate);

      for (let i = 0; i < numWeeks; i++) {
        const currentWeekEnd = new Date(currentWeekStart);
        currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

        weeks.push({
          start: new Date(currentWeekStart),
          end: currentWeekEnd,
        });

        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      }

      return weeks;
    };

    const getWeekSums = (
      dataArray,
      dateKey = "createdAt",
      valueKey = "result.CO2.value"
    ) => {
      if (!dataArray || dataArray.length === 0) return new Array(4).fill(0);

      const allDates = getAllDates(dataArray, dateKey);
      const weeks = generateWeeks(allDates[0], 4);

      return weeks.map((week) =>
        dataArray
          .filter((item) => {
            const itemDate = new Date(item[dateKey]);
            return itemDate >= week.start && itemDate <= week.end;
          })
          .reduce((sum, item) => {
            const value = getNestedValue(item, valueKey);
            return sum + parseNumeric(value);
          }, 0)
      );
    };

    const getNestedValue = (obj, path) => {
      return path
        .split(".")
        .reduce((o, key) => (o && o[key] !== undefined ? o[key] : undefined), obj);
    };

    const monthData = {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Electricity",
          data: getWeekSums(data.electricity, "createdAt", "result.CO2.value"),
          borderColor: "#0046b9",
          backgroundColor: "#0046b9",
          tension: 0.4,
        },
        {
          label: "Fuel Combustion",
          data: getWeekSums(
            data.fuelCombustion,
            "createdAt",
            "result.CO2.value"
          ),
          borderColor: "#FF6384",
          backgroundColor: "#FF6384",
          tension: 0.4,
        },
        {
          label: "Shipping",
          data: getWeekSums(
            data.shipping,
            "createdAt",
            "result.carbonEmissions.kilograms"
          ),
          borderColor: "#36A2EB",
          backgroundColor: "#36A2EB",
          tension: 0.4,
        },
        {
          label: "Explosions",
          data: getWeekSums(data.explosion, "createdAt", "emissions.CO2"),
          borderColor: "#FFCE56",
          backgroundColor: "#FFCE56",
          tension: 0.4,
        },
        {
          label: "coalBurn",
          data: getWeekSums(data.coalBurn, "createdAt", "co2Emissions"),
          borderColor: "#FFFFFF",
          backgroundColor: "#FFFFFF",
          tension: 0.4,
        },
        {
          label: "methane",
          data: getWeekSums(data.methane, "createdAt", "co2Emissions"),
          borderColor: "#FF0000",
          backgroundColor: "#FF0000",
          tension: 0.4,
        },
      ],
    };

    return monthData;
  };

useEffect(() => {
  if (fetchMonthData !== null) {
    console.log("month data", fetchMonthData);
    const monthData = parseData(fetchMonthData); // Call parseData only when fetchMonthData is not null
    console.log("Parsed month data", monthData);
    setMonthData(monthData)
  }
}, [fetchMonthData]);

const [chartData, setChartData] = useState(null);
const [isLoading, setIsLoading] = useState(true);
// const [error, setError] = useState(null);

// Function to fetch and format data
const fetchLastTwelveMonthsData = async () => {
  const today = new Date();
  
  // Calculate 12 months ago from today
  const twelveMonthsAgo = new Date(today);
  twelveMonthsAgo.setFullYear(today.getFullYear() - 1);
  
  // Format dates
  const startDate = twelveMonthsAgo.toISOString().split('T')[0];
  const endDate = today.toISOString().split('T')[0];
  
  try {
    console.log('Fetching data with date range:', {
      startDate,
      endDate
    });

    // Fetch the raw API response
    const response = await axios.get(`http://localhost:5000/api/data/${startDate}/${endDate}`);
    
    // Log raw response
    console.log('Raw API Response:', response.data);
    console.log('Categories in response:', Object.keys(response.data));

    // Log data for each category
    Object.keys(response.data).forEach(category => {
      console.log(`${category} data count:`, response.data[category].length);
      console.log(`First ${category} item:`, response.data[category][0]);
    });
    
    // Format data for chart
    const formattedData = formatDataForChart(response.data);
    
    // Log formatted chart data
    console.log('Formatted Chart Data:', formattedData);
    
    return formattedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    setError(error);
    return null;
  }
};

// Function to format data for chart
const formatDataForChart = (rawData) => {
  const labels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const calculateMonthlyCO2Sums = (categoryData) => {
    const monthlySums = new Array(12).fill(0);
    
    categoryData.forEach(item => {
      const date = new Date(item.createdAt);
      const monthIndex = date.getMonth();
      
      const co2Value = item.result?.CO2?.value || 0;
      monthlySums[monthIndex] += co2Value;

      // Log individual item processing
      console.log(`Processing item: 
        Date: ${date}, 
        Month Index: ${monthIndex}, 
        CO2 Value: ${co2Value}`);
    });
    
    // Log monthly sums for each category
    console.log('Monthly CO2 Sums:', monthlySums);
    
    return monthlySums;
  };

  return {
    labels: labels,
    datasets: [
      {
        label: "Electricity",
        data: calculateMonthlyCO2Sums(rawData.electricity),
        borderColor: "#0046b9",
        backgroundColor: "#0046b9",
        tension: 0.4,
      },
      {
        label: "Explosion",
        data: calculateMonthlyCO2Sums(rawData.explosion),
        borderColor: "#11c610",
        backgroundColor: "#11c610",
        tension: 0.4,
      },
      {
        label: "Fuel",
        data: calculateMonthlyCO2Sums(rawData.fuelCombustion),
        borderColor: "#d5d502",
        backgroundColor: "#d5d502",
        tension: 0.4,
      },
      {
        label: "Shipping",
        data: calculateMonthlyCO2Sums(rawData.shipping),
        borderColor: "#6302d5",
        backgroundColor: "#6302d5",
        tension: 0.4,
      },
      {
        label: "coalBurn",
        data: calculateMonthlyCO2Sums(rawData.coalBurn),
        borderColor: "#FFFFFF",
        backgroundColor: "#FFFFFF",
        tension: 0.4,
      },
      {
        label: "methane",
        data: calculateMonthlyCO2Sums(rawData.methane),
        borderColor: "#FF0000",
        backgroundColor: "#FF0000",
        tension: 0.4,
      },
    ]
  };
};

// useEffect to fetch data when component mounts
useEffect(() => {
  const loadData = async () => {
    console.log('Component mounted. Starting data fetch...');
    setIsLoading(true);
    try {
      const data = await fetchLastTwelveMonthsData();
      setChartData(data);
      console.log('Data successfully fetched and set');
    } catch (error) {
      console.error('Error in data loading:', error);
      setError(error);
    } finally {
      setIsLoading(false);
      console.log('Loading state completed');
    }
  };

  loadData();
}, []); // Empty dependency array means this runs once when component mounts



  

  const [currentData, setCurrentData] = useState(weekData);
  
console.log("one day",data);

  const electricityCO2 = data.electricity.reduce((total, item) => total + item.result.CO2.value, 0);
  const fuelCO2 = data.fuelCombustion.reduce((total, item) => total + item.result.CO2.value, 0);
  const shippingCO2 = data.shipping.reduce((total, item) => total + parseFloat(item.result.carbonEmissions.kilograms), 0);
  const explosionCO2 = data.explosion.reduce((total, item) => total + parseFloat(item.emissions.CO2), 0);
  const coalCO2 = data.coalBurn.reduce((total, item) => total + parseFloat(item.co2Emissions), 0);
  const methane= data.methane.reduce((total, item) => total + parseFloat(item.totalMethane), 0);


  const barData={
    labels: ['Electricity', 'Explosion', 'Fuel', 'Shipping','colaBurn','methane'],
    datasets: [
      {
        label: 'Emission (tons CO2)',
        data: [electricityCO2, explosionCO2, fuelCO2,shippingCO2,coalCO2,methane], // Example data
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 xl:col-span-3 p-2 ml-3">
  {/* Line Chart */}
  <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-4 lg:p-6 w-full lg:max-w-[65%] max-h-[1800px] mt-6">
    <h2 className="text-lg font-bold mb-4">Emission Line Chart</h2>
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => setCurrentData(weekData)}
        className="px-3 py-1 lg:px-4 lg:py-2 bg-gray-700 text-gray-300 rounded-lg text-sm lg:text-base"
      >
        Past Week
      </button>
      <button
        onClick={() => {
          // fetchLastMonthData();
          setCurrentData(MonthData);
        }}
        className="px-3 py-1 lg:px-4 lg:py-2 bg-gray-700 text-gray-300 rounded-lg text-sm lg:text-base"
      >
        Past Month
      </button>
      <button
        onClick={() => setCurrentData(chartData)}
        className="px-3 py-1 lg:px-4 lg:py-2 bg-gray-700 text-gray-300 rounded-lg text-sm lg:text-base"
      >
        Past Year
      </button>
    </div>
    <div className="h-[300px] lg:h-[500px] overflow-hidden">
      <Line data={currentData} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  </div>

  {/* Bar Chart */}
  <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-4 lg:p-6 w-full lg:max-w-[35%] max-h-[1800px] mt-6">
    <h2 className="text-lg font-bold mb-4">Emission Bar Chart</h2>
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
      <span className="text-gray-400 text-sm lg:text-base">Emission Contribution by Source</span>
      <span className="text-2xl lg:text-3xl font-bold mt-2 lg:mt-0">Overview</span>
    </div>

    {/* Bar Chart */}
    <div className="flex-1 h-[300px] lg:h-auto">
      <Bar
        data={barData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Sources',
                font: {
                  size: 12,
                },
                color: '#ffffff',
              },
              ticks: {
                color: '#ffffff',
                font: {
                  size: 10,
                },
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Emissions (tons CO2)',
                font: {
                  size: 12,
                },
                color: '#ffffff',
              },
              ticks: {
                color: '#ffffff',
                font: {
                  size: 10,
                },
              },
            },
          },
        }}
      />
    </div>
  </div>
</div>


  );
};

export default LineAndBarEmission;
