
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "leaflet/dist/leaflet.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import OverviewSection from "./OverviewSection";
import FinancialAnalysis from "./FinancialAnalysis";
import ReportsAndAlerts from "./ReportsAndAlerts";
import DonutAndEntries from "./DonutAndEntries";
import LineAndBarEmission from "./LineAndBarEmission";
import SinkGraphs from "./SinkGraphs";
import EmissionsPerTon from "./EmissionsPerTon";
import { useEffect,useState } from "react";
import axios from "axios";
import ChatAssistant from "./ChatAssistant";
import NeutralityGraph from "./NeutralityGraph";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);




function DashBoard() {

  const [data, setData] = useState(null);
const [error, setError] = useState(null);
const [fetchWeekData, setWeekData] = useState(null);
const [loading, setLoading] = useState(false);
const [totals, setTotals] = useState(null); // To store calculated totals

useEffect(() => {
  const fetchLastWeekData = async () => {
    try {
      setLoading(true);

      // Get today's date
      const today = new Date();

      // Calculate the start of the current week (this week's Monday)
      const currentWeekMonday = new Date(today);
      currentWeekMonday.setDate(today.getDate() - today.getDay() + 1);
      currentWeekMonday.setHours(0, 0, 0, 0);

      // Calculate the start and end of last week
      const lastWeekMonday = new Date(currentWeekMonday);
      lastWeekMonday.setDate(currentWeekMonday.getDate() - 7);
      const lastWeekSunday = new Date(lastWeekMonday);
      lastWeekSunday.setDate(lastWeekMonday.getDate() + 6);
      lastWeekSunday.setHours(23, 59, 59, 999);

      // Format the dates
      const formattedStartDate = lastWeekMonday.toISOString().split("T")[0];
      const formattedEndDate = lastWeekSunday.toISOString().split("T")[0];

      // Make the API call
      const response = await axios.get(
        `http://localhost:5000/api/data/${formattedStartDate}/${formattedEndDate}`
      );

      console.log("Week data:", response.data); // Log for debugging
      setWeekData(response.data); // Set fetched data
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
      console.error(err);
    }
  };

  fetchLastWeekData(); // Fetch data on component mount
}, []);

// Calculate totals when `fetchWeekData` updates
const [totalEmissions, setTotalEmissions] = useState({
  electricity: 0,
  fuelCombustion: 0,
  shipping: 0,
  explosion: 0
});

useEffect(() => {
  if (!fetchWeekData) return;

  // Calculate total CO2 emissions for each field
  const emissions = {
    electricity: fetchWeekData.electricity.reduce((total, item) => {
      return total + (item.result.CO2?.value || 0);
    }, 0),
    fuelCombustion: fetchWeekData.fuelCombustion.reduce((total, item) => {
      return total + (item.result.CO2?.value || 0);
    }, 0),
    shipping: fetchWeekData.shipping.reduce((total, item) => {
      return total + (parseFloat(item.result.carbonEmissions.kilograms) || 0);
    }, 0),
    explosion: fetchWeekData.explosion.reduce((total, item) => {
      return total + (parseFloat(item.emissions.CO2) || 0);
    }, 0)
  };

  setTotalEmissions(emissions);
}, [fetchWeekData]);
console.log("total emission",totalEmissions);



useEffect(() => {
  const fetchData = async () => {
    try {
      // Get the current timestamp using Date.now()
      const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
      
      // Make the API call with the current timestamp
      const response = await axios.get(`http://localhost:5000/api/data/${formattedDate}`);
      console.log("one day",response.data);
      
      setData(response.data);
      
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    }
  };

  fetchData();
}, []); // Empty dependency array ensures it runs only on page load.

useEffect(() => {
  console.log(data); // Log the data after it is updated
}, [data]);

if (error) {
  return <div>Error: {error}</div>;  // Show error message if data fetch fails
}

if (!data) {
  return <div>Loading...</div>;  // Show loading message if data is still null
}


 
  return (
    <div className="bg-gray-900 text-white min-h-screen w-full overflow-x-hidden">
      <Navbar className="mb-2 pt-4" />
      <ChatAssistant />

      {/* Dashboard Grid Layout */}
      <div className="px-10">
        <OverviewSection />
      <div className="px-10 mt-10 w-full ">  
        <EmissionsPerTon />
      </div>
      </div>
      <div className="grid grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
       <DonutAndEntries data={data}/>



          {/* Tabs */}
          <div className="flex flex-wrap gap-8 p-1 justify-between xl:col-span-3">
          <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 text-center flex-1">
            <h2 className="text-lg font-bold mb-2">Electricity</h2>
            <p className="text-3xl font-semibold mb-2">{totalEmissions.electricity} MWh</p>
            <p className="text-red-500">+17.0% from last week</p>
          </div>

          <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 text-center flex-1">
            <h2 className="text-lg font-bold mb-2">Explosion</h2>
            <p className="text-3xl font-semibold mb-2">{totalEmissions.explosion}  tCO2e</p>
            <p className="text-green-500">-5.8% from last week</p>
          </div>

          <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 text-center flex-1">
            <h2 className="text-lg font-bold mb-2">Fuel</h2>
            <p className="text-3xl font-semibold mb-2">{totalEmissions.fuelCombustion} tCO2e</p>
            <p className="text-red-500">+11.4% from last week</p>
          </div>

          <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 text-center flex-1">
            <h2 className="text-lg font-bold mb-2">Shipping</h2>
            <p className="text-3xl font-semibold mb-2">{totalEmissions.shipping} tCO2e</p>
            <p className="text-green-500">-8.7% from last week</p>
          </div>
        </div>

       
{/* Emission Line and Bar Chart Below Doughnut and Data Entries */}

<LineAndBarEmission data={data}/>
<SinkGraphs />
<div className="flex justify-center w-screen ">
<NeutralityGraph />
</div>

        <div className="flex flex-col xl:flex-row gap-8 xl:col-span-3 p-4">
    <FinancialAnalysis />
    <ReportsAndAlerts />
</div>


      </div>
      <Footer className="w-full bg-gray-800 text-white py-4 text-center" />
    </div>
  );
}

export default DashBoard;
