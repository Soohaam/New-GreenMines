import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from 'date-fns';

const EmissionEntries = () => {
    // State declarations
    const [data, setData] = useState({
      electricity: [],
      explosion: [],
      fuelCombustion: [],
      shipping: []
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState([]);
    const [dateRange, setDateRange] = useState({ 
      startDate: new Date().toISOString().split('T')[0], 
      endDate: new Date().toISOString().split('T')[0] 
    });
    const [filters, setFilters] = useState({ type: 'all', impact: 'all' });
    const entriesPerPage = 4;
  
    // Fetch data based on date range
    const fetchDataForDateRange = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/data/${dateRange.startDate}/${dateRange.endDate}`
        );
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    // Use effect to fetch data when date range changes
    useEffect(() => {
      fetchDataForDateRange();
    }, [dateRange]);
  
    // Function to format and combine all emission data
    const formatEmissionData = (data) => {
      const formattedData = [];
      
      // Format Electricity data
      data.electricity.forEach(item => {
        formattedData.push({
          type: 'Electricity',
          amount: (item.result.CO2.value / 1000).toFixed(2),
          impact: calculateImpact(item.result.CO2.value / 1000),
          time: item.createdAt,
          id: item._id,
          model: 'Electricity'
        });
      });
  
      // Format Explosion data
      data.explosion.forEach(item => {
        formattedData.push({
          type: 'Explosion',
          amount: (parseFloat(item.emissions.CO2) / 1000).toFixed(2),
          impact: calculateImpact(parseFloat(item.emissions.CO2) / 1000),
          time: item.createdAt,
          id: item._id,
          model: 'Explosion'
        });
      });
  
      // Format Fuel Combustion data
      data.fuelCombustion.forEach(item => {
        formattedData.push({
          type: 'Fuel',
          amount: (item.result.CO2.value / 1000).toFixed(2),
          impact: calculateImpact(item.result.CO2.value / 1000),
          time: item.createdAt,
          id: item._id,
          model: 'FuelCombustion'
        });
      });
  
      // Format Shipping data
      data.shipping.forEach(item => {
        formattedData.push({
          type: 'Shipping',
          amount: (parseFloat(item.result.carbonEmissions.kilograms) / 1000).toFixed(2),
          impact: calculateImpact(parseFloat(item.result.carbonEmissions.kilograms) / 1000),
          time: item.createdAt,
          id: item._id,
          model: 'Shipping'
        });
      });
  
      return formattedData;
    };
  
    // Calculate impact based on CO2 value (in tons)
    const calculateImpact = (co2Value) => {
      if (co2Value >= 100) return 'Critical';
      if (co2Value >= 50) return 'High';
      if (co2Value >= 25) return 'Medium';
      return 'Low';
    };
  
    // Check if date is today
    const isToday = (dateString) => {
      const today = new Date();
      const entryDate = new Date(dateString);
      return (
        entryDate.getDate() === today.getDate() &&
        entryDate.getMonth() === today.getMonth() &&
        entryDate.getFullYear() === today.getFullYear()
      );
    };
  
    // Handle delete
    const handleDelete = async (id, model) => {
      try {
        await axios.delete(`http://localhost:5000/api/delete/${id}`);
        // Refresh data after deletion
        fetchDataForDateRange();
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    };
  
    // Apply filters
    const applyFilters = () => {
      let filtered = formatEmissionData(data);
  
      if (filters.type !== 'all') {
        filtered = filtered.filter(item => item.type === filters.type);
      }
  
      if (filters.impact !== 'all') {
        filtered = filtered.filter(item => item.impact === filters.impact);
      }
  
      setFilteredData(filtered);
    };
  
    // Use effect to apply filters when data or filters change
    useEffect(() => {
      applyFilters();
    }, [data, filters]);
  
    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);
    const currentEntries = filteredData.slice(
      (currentPage - 1) * entriesPerPage,
      currentPage * entriesPerPage
    );

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mt-6 w-full max-w-full xl:max-w-none xl:flex-1 overflow-auto">
  <h2 className="text-lg font-bold mb-4">Emission Data Entries</h2>
  
  {/* Filters */}
  <div className="flex flex-col sm:flex-row gap-4 mb-4">
    <input
      type="date"
      value={dateRange.startDate}
      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
      className="bg-gray-700 rounded px-2 py-1 w-full sm:w-auto"
    />
    <input
      type="date"
      value={dateRange.endDate}
      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
      className="bg-gray-700 rounded px-2 py-1 w-full sm:w-auto"
    />
    <select
      value={filters.type}
      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
      className="bg-gray-700 rounded px-2 py-1 w-full sm:w-auto"
    >
      <option value="all">All Types</option>
      <option value="Electricity">Electricity</option>
      <option value="Explosion">Explosion</option>
      <option value="Fuel">Fuel</option>
      <option value="Shipping">Shipping</option>
    </select>
    <select
      value={filters.impact}
      onChange={(e) => setFilters(prev => ({ ...prev, impact: e.target.value }))}
      className="bg-gray-700 rounded px-2 py-1 w-full sm:w-auto"
    >
      <option value="all">All Impacts</option>
      <option value="Critical">Critical</option>
      <option value="High">High</option>
      <option value="Medium">Medium</option>
      <option value="Low">Low</option>
    </select>
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="table-auto w-full text-left">
      <thead>
        <tr className="text-gray-400 border-b border-gray-700">
          <th className="py-4 px-2">Type</th>
          <th className="py-4 px-2">Amount (tons CO₂)</th>
          <th className="py-4 px-2">Impact</th>
          <th className="py-4 px-2">Time</th>
          <th className="py-4 px-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentEntries.map((entry, index) => (
          <tr key={index} className="border-b border-gray-700 hover:bg-gray-700 transition">
            <td className="py-4 px-2">{entry.type}</td>
            <td className="py-4 px-2">{entry.amount}</td>
            <td className="py-4 px-2">
              <span className={`px-2 py-1 rounded-full text-xs sm:text-sm text-white ${
                entry.impact === "Critical" ? "bg-red-500" :
                entry.impact === "High" ? "bg-yellow-500" :
                entry.impact === "Medium" ? "bg-green-500" : "bg-blue-500"
              }`}>
                {entry.impact}
              </span>
            </td>
            <td className="py-4 px-2">{format(new Date(entry.time), 'yyyy-MM-dd HH:mm')}</td>
            <td className="py-4 px-2">
              {isToday(entry.time) && (
                <button 
                  onClick={() => handleDelete(entry.id, entry.model)}
                  className="bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 transition text-xs sm:text-sm"
                >
                  Delete
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
    <button
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-600 w-full sm:w-auto"
    >
      Previous
    </button>
    <span className="text-sm sm:text-base">Page {currentPage} of {totalPages}</span>
    <button
      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-600 w-full sm:w-auto"
    >
      Next
    </button>
  </div>
</div>


  );
};

export default EmissionEntries;