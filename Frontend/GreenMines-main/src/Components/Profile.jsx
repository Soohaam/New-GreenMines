import React, { useState, useEffect } from 'react';
import Enavbar from './Enavbar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Make sure this CSS is imported

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [emissionGoal, setEmissionGoal] = useState(800);
  const [newGoal, setNewGoal] = useState('');
  const [editableFields, setEditableFields] = useState({
    position: false,
    team: false,
    joinDate: false,
  });

  const [updatedUserData, setUpdatedUserData] = useState({
    position: '',
    team: '',
    joinDate: '',
  });

  // User ID to be used when sending requests
  const [userId, setUserId] = useState('');
  const [CO2Goal, setCO2Goal] = useState('');
  const [todaysEmissions, setTodaysEmissions] = useState(0); // New state for today's emissions
  
 

  
  useEffect(() => {
    const fetchUserData = async () => {
      const storedEmail = JSON.parse(localStorage.getItem('email'));
      if (storedEmail) {
        try {
          const token = localStorage.getItem('token'); // Use token for authenticated requests
          const response = await axios.get(`http://localhost:5000/api/user/${storedEmail}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data); // Update user state with API response
          setUserId(response.data.id); // Set the user ID
          setCO2Goal(response.data.CO2Goal); // Set the user ID
          setUpdatedUserData({
            position: response.data.position || '',
            team: response.data.team || '',
            joinDate: new Date(response.data.createdAt).toLocaleDateString(),
          });
          setEditableFields({
            ...editableFields,
            joinDate: !response.data.createdAt, // Join date is editable only if not provided
          });
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      } else {
        console.error('No email found in localStorage');
      }
    };

    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const emissionsResponse = await axios.get(`http://localhost:5000/api/data/${today}/${today}`);
        const todaysEmissionCO2 = calculateCO2Sum(emissionsResponse.data);
            

        setTodaysEmissions(todaysEmissionCO2); // Update today's emissions state
        checkEmissionsRisk(todaysEmissionCO2); // Check emissions risk
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const calculateCO2Sum = (data) => {
      let sum = 0;
      if (data && typeof data === 'object') {
        // Handle electricity category
        if (Array.isArray(data.electricity)) {
          data.electricity.forEach((item) => {
            if (item.result && item.result.CO2) {
              const co2Value = parseFloat(item.result.CO2.value); // Keep in kilograms
              sum += !isNaN(co2Value) ? co2Value : 0;
            }
          });
        }
    
        // Handle explosion category
        if (Array.isArray(data.explosion)) {
          data.explosion.forEach((item) => {
            if (item.emissions) {
              const co2Value = parseFloat(item.emissions.CO2); // CO2 in kilograms
              const coValue = parseFloat(item.emissions.CO); // CO in kilograms
              sum += !isNaN(co2Value) ? co2Value : 0;
              sum += !isNaN(coValue) ? coValue : 0;
            }
          });
        }
    
        // Handle fuelCombustion category
        if (Array.isArray(data.fuelCombustion)) {
          data.fuelCombustion.forEach((item) => {
            if (item.result && item.result.CO2) {
              const co2Value = parseFloat(item.result.CO2.value); // Keep in kilograms
              sum += !isNaN(co2Value) ? co2Value : 0;
            }
          });
        }
    
        
        // Handle shipping category
        if (Array.isArray(data.shipping)) {
          data.shipping.forEach((item) => {
            if (item.result && item.result.carbonEmissions) {
              const co2Value = parseFloat(item.result.carbonEmissions.kilograms); // Keep in kilograms
              sum += !isNaN(co2Value) ? co2Value : 0;
            }
          });
        }

          if (Array.isArray(data.coalBurn)) {
            data.coalBurn.forEach((item) => {
              if (item.co2Emissions) {
                const co2Value = parseFloat(item.co2Emissions);
                sum += !isNaN(co2Value) ? co2Value : 0;
              }
            });
          }
        }
    
      // Handle existingSinkData for sequestration
      if (data && data.existingSinkData && Array.isArray(data.existingSinkData)) {
        data.existingSinkData.forEach((sink) => {
          const sinkValue = parseFloat(sink.dailySequestrationRate); // Assume already in kilograms
          sum += !isNaN(sinkValue) ? sinkValue : 0;
        });
      }
    
      return sum; // Final CO2 sum in kilograms
    };
    
    fetchUserData();
    fetchData();
  }, []);


  useEffect(() => {
    // Call emissions risk check whenever CO2Goal or today's emissions change
    
      checkEmissionsRisk(todaysEmissions);  // Check emissions risk when CO2Goal or emissions change
    
  }, [CO2Goal, todaysEmissions]);  // Dependency array ensures this effect runs when CO2Goal or emissions change

  const checkEmissionsRisk = (todaysEmissionCO2) => {
    console.log("Checking emissions risk...");

    const goal = CO2Goal;
    console.log("Today's Emissions:", todaysEmissionCO2); // Log today's emissions

    if (!goal || todaysEmissionCO2 <= 0) {
      console.log("Invalid goal or zero emissions, exiting function.");
      return;  // Exit if goal is missing or emissions are zero
    }

    // Use switch statement for clarity and avoid multiple conditions being triggered
    switch (true) {
      case (todaysEmissionCO2 >= goal * 2.0):
        console.log('Severe risk: Emissions are more than twice the target');
        toast.error("Severe risk! Today's CO2 emissions are more than twice the target!", {
          position: "top-right", // Use string directly instead of toast.POSITION.TOP_RIGHT
          autoClose: 5000,
          hideProgressBar: true,
          style: {
            color: 'red', // Customize text color here
          }
        });
        break;
  
      case (todaysEmissionCO2 >= goal * 1.4):
        console.log('High risk: Emissions are 1.4 times the target');
        toast.warn("High risk! Today's CO2 emissions are 1.4 times the target!", {
          position: "top-right", // Use string directly instead of toast.POSITION.TOP_RIGHT
          autoClose: 5000,
          hideProgressBar: true,
          style: {
            color: 'orange', // Customize text color here
          }
        });
        break;
  
      case (todaysEmissionCO2 >= goal ):
        console.log('Moderate risk: Emissions are 1.2 times the target');
        toast.info("Moderate risk! Today's CO2 emissions are more than the daily target!", {
          position: "top-right", // Use string directly instead of toast.POSITION.TOP_RIGHT
          autoClose: 5000,
          hideProgressBar: true,
          style: {
            color: 'purple', // Customize text color here
          }
        });
        break;
  
      default:
        console.log('Emissions are within target');
        toast.info("Today's CO2 Emissions are within the Goal Range", {
          position: "top-right", // Use string directly instead of toast.POSITION.TOP_RIGHT
          autoClose: 5000,
          hideProgressBar: true,
          style: {
            color: 'green', // Customize text color here
          }
        });
        break;
    }
  
    console.log("Completed switch");
  };



  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePicture(file);
      const formData = new FormData();
      formData.append('profilePicture', file);
      formData.append('userId', userId); // Add the userId to the formData

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:5000/api/user/update-profile-picture',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setUser({ ...user, profilePicture: response.data.profilePicture });
      } catch (error) {
        console.error('Failed to update profile picture:', error);
      }
    }
  };

  const handleGoalChange = (e) => {
    setNewGoal(e.target.value);
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    const goal = parseFloat(newGoal);
    if (!isNaN(goal) && goal > 0) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
          `http://localhost:5000/api/user/update-co2-goal/${userId}`,
          { CO2Goal: goal },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCO2Goal(response.data.CO2Goal);
        setNewGoal('');
      } catch (error) {
        console.error('Failed to update CO2 goal:', error);
      }
    }
  };

  const toggleEditableField = (field) => {
    setEditableFields({ ...editableFields, [field]: !editableFields[field] });
  };

  const handleFieldChange = (e, field) => {
    setUpdatedUserData({ ...updatedUserData, [field]: e.target.value });
  };

  const handleFieldSave = async (field) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/update-user-data/${user.id}`,
        { [field]: updatedUserData[field] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser({ ...user, [field]: updatedUserData[field] });
      toggleEditableField(field);
    } catch (error) {
      console.error('Failed to update user data:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen w-full mt-24 overflow-x-hidden">
      <Enavbar />
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">User Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* User Info Section */}
          <div className="bg-gray-800 rounded-lg shadow-md p-8">
            <div className="relative mb-6">
              <img
                src={user.profilePicture || 'https://cdn-icons-png.freepik.com/128/3135/3135715.png'}
                alt={user.name || 'USER'}
                className="w-40 h-40 rounded-full mx-auto mb-6"
              />
              <label htmlFor="profilePicture" className="absolute bottom-2 right-2 text-white cursor-pointer">
                <input
                  type="file"
                  id="profilePicture"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
                Edit
              </label>
            </div>

            <h2 className="text-3xl font-bold text-center mb-3">{user?.name || 'Name not available'}</h2>
            <p className="text-center text-gray-400 text-lg mb-5">{user?.email || 'Email not available'}</p>

            {/* Editable Position */}
            <div className="mb-4">
              <label className="block text-gray-400 text-base font-bold mb-2" htmlFor="position">
                Position
              </label>
              {editableFields.position ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={updatedUserData.position}
                    onChange={(e) => handleFieldChange(e, 'position')}
                    className="text-gray-200 w-full bg-gray-700 border-b border-gray-500 py-2 px-3"
                  />
                  <button onClick={() => handleFieldSave('position')} className="ml-2 text-green-500">Save</button>
                </div>
              ) : (
                <p onClick={() => toggleEditableField('position')} className="text-gray-200 text-lg cursor-pointer">
                  {user.position || 'Position not set'}
                </p>
              )}
            </div>

            {/* Editable Team */}
            <div className="mb-4">
              <label className="block text-gray-400 text-base font-bold mb-2" htmlFor="team">
                Team
              </label>
              {editableFields.team ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={updatedUserData.team}
                    onChange={(e) => handleFieldChange(e, 'team')}
                    className="text-gray-200 w-full bg-gray-700 border-b border-gray-500 py-2 px-3"
                  />
                  <button onClick={() => handleFieldSave('team')} className="ml-2 text-green-500">Save</button>
                </div>
              ) : (
                <p onClick={() => toggleEditableField('team')} className="text-gray-200 text-lg cursor-pointer">
                  {user.team || 'Team not set'}
                </p>
              )}
            </div>

            {/* Editable Join Date */}
            {/* Join Date */}
            <div className="mb-4">
              <label className="block text-gray-400 text-base font-bold mb-2" htmlFor="joinDate">
                Join Date
              </label>
              <p className="text-gray-200 text-lg">{updatedUserData.joinDate || 'Join Date not available'}</p>
            </div>
          </div>
          
          {/* Emission Goal Section */}
          <div className="bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold mb-4">Emission Goal</h2>
            <div className="mb-4">
              <label className="block text-gray-400 text-base font-bold mb-2" htmlFor="currentGoal">
                Current CO2 Emission Goal (kg/day)
              </label>
              <p className="text-gray-200 text-2xl font-bold" id="currentGoal">
                {CO2Goal}
              </p>
            </div>
            <form onSubmit={handleGoalSubmit} className="mb-4">
              <div className="mb-4">
                <label className="block text-gray-400 text-base font-bold mb-2" htmlFor="newGoal">
                  Set New Goal (kg/year)
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 bg-gray-700"
                  id="newGoal"
                  type="number"
                  value={newGoal}
                  onChange={handleGoalChange}
                  placeholder="Enter new emission goal"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Update Goal
              </button>
            </form>
          </div>
          {/* Today's Emissions */}
          <div className="bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold mb-4">Today's Emissions</h2>
            <p className="text-gray-200 text-6xl font-bold pt-7">
              {todaysEmissions.toFixed(2)} kg CO2
            </p>
            <ToastContainer />
          </div>
          </div>
          {/* YOUR CARBON CREDIT Section */}
          <div className="bg-gray-800 rounded-lg shadow-md p-8 mt-10 w-full">
  <h2 className="text-3xl font-bold mb-6 text-center">YOUR CARBON CREDIT</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 w-full">
    <div className="bg-gray-700 rounded-lg p-6 w-full">
      <h3 className="text-xl font-semibold text-gray-300 mb-4">CARBON CREDIT ALLOTTED</h3>
      <p className="text-2xl font-bold text-gray-200">
        { '100'}
      </p>
    </div>

    <div className="bg-gray-700 rounded-lg p-6 w-full">
      <h3 className="text-xl font-semibold text-gray-300 mb-4">CARBON CREDIT SAVED</h3>
      <p className="text-2xl font-bold text-gray-200">
        { '20'}
      </p>
    </div>
  </div>
</div>

  
</div>
</div>
  );
};

export default Profile;
