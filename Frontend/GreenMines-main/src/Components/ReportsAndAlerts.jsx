import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ReportsAndAlerts() {
  const navigate = useNavigate();

  const alerts = [
    { id: 1, type: 'warning', message: 'Emissions exceeded threshold in Sector A' },
    { id: 2, type: 'info', message: 'Quarterly report due in 5 days' },
    { id: 3, type: 'success', message: 'Carbon offset target achieved for Q2' },
  ]

  // Navigation handlers for different report types
  const handleReportNavigation = (reportType) => {
    navigate('/environmental-reports', { 
      state: { 
        reportType: reportType 
      } 
    });
  }

  return (
    <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-4 lg:p-6 w-full lg:max-w-[50%] max-h-[1800px] mb-4">
    <div className="flex-1 min-w-[300px] bg-gray-800 rounded-lg shadow-lg p-4 lg:p-8">
      <h2 className="text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6">Reports and Alerts</h2>
      <div className="space-y-6 lg:space-y-8">
        {/* Recent Alerts Section */}
        <div>
          <h3 className="text-lg lg:text-xl font-semibold text-gray-300 mb-3 lg:mb-4">Recent Alerts</h3>
          <ul className="space-y-3 lg:space-y-4">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className={`p-3 lg:p-4 rounded-lg text-base lg:text-lg font-medium ${
                  alert.type === "warning"
                    ? "bg-yellow-100 text-yellow-700 border-l-4 border-yellow-600"
                    : alert.type === "info"
                    ? "bg-blue-100 text-blue-700 border-l-4 border-blue-600"
                    : "bg-green-100 text-green-700 border-l-4 border-green-600"
                }`}
              >
                {alert.message}
              </li>
            ))}
          </ul>
        </div>
  
        {/* Generated Reports Section */}
        <div>
          <h3 className="text-lg lg:text-xl font-semibold text-gray-300 mb-3 lg:mb-4">Generate Reports</h3>
          <ul className="space-y-3 lg:space-y-4">
            <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 lg:p-4 bg-gray-900 rounded-lg shadow-sm">
              <span className="text-base lg:text-lg font-medium text-gray-300 mb-2 sm:mb-0">Generate Daily Report</span>
              <button 
                onClick={() => handleReportNavigation('daily')}
                className="w-full sm:w-auto px-4 py-2 text-sm lg:text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Generate
              </button>
            </li>
            <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 lg:p-4 bg-gray-900 rounded-lg shadow-sm">
              <span className="text-base lg:text-lg font-medium text-gray-300 mb-2 sm:mb-0">Generate Weekly Report</span>
              <button 
                onClick={() => handleReportNavigation('weekly')}
                className="w-full sm:w-auto px-4 py-2 text-sm lg:text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Generate
              </button>
            </li>
            <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 lg:p-4 bg-gray-900 rounded-lg shadow-sm">
              <span className="text-base lg:text-lg font-medium text-gray-300 mb-2 sm:mb-0">Generate Monthly Report</span>
              <button 
                onClick={() => handleReportNavigation('monthly')}
                className="w-full sm:w-auto px-4 py-2 text-sm lg:text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Generate
              </button>
            </li>
            <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 lg:p-4 bg-gray-900 rounded-lg shadow-sm">
              <span className="text-base lg:text-lg font-medium text-gray-300 mb-2 sm:mb-0">Generate Yearly Report</span>
              <button 
                onClick={() => handleReportNavigation('yearly')}
                className="w-full sm:w-auto px-4 py-2 text-sm lg:text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Generate
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  
  
  )
}