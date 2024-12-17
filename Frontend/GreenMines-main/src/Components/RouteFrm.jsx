import React, { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Enavbar from './Enavbar';
import ChatAssistant from './ChatAssistant';

const RouteForm = () => {
  const [vehicle, setVehicle] = useState({
    vehicle_id: '',
    start_address: '',
  });

  const [services, setServices] = useState([
    { id: '', name: '', address: '' },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const [vehicleCoords, setVehicleCoords] = useState(null);
  const [serviceCoords, setServiceCoords] = useState([]);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [activeAddressType, setActiveAddressType] = useState('');

  const mapRef = useRef(null);

  // Custom icons
  const truckIcon = new L.Icon({
    iconUrl: 'https://cdn.iconscout.com/icon/free/png-512/free-truck-icon-download-in-svg-png-gif-file-formats--front-city-basic-icons-pack-industry-449929.png?f=webp&w=256',
    iconSize: [55, 55],
    iconAnchor: [17.5, 35],
    popupAnchor: [1, -34],
  });

  const storeIcon = new L.Icon({
    iconUrl: 'https://cdn.iconscout.com/icon/premium/png-512-thumb/factory-659-775144.png?f=webp&w=256',
    iconSize: [55, 55],
    iconAnchor: [15, 30],
    popupAnchor: [1, -34],
  });

  const handleVehicleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (index, e) => {
    const updatedServices = [...services];
    updatedServices[index][e.target.name] = e.target.value;
    setServices(updatedServices);
  };

  const addService = () => {
    setServices([...services, { id: '', name: '', address: '' }]);
  };

  const removeService = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  const geocodeAddress = async (address, type = 'vehicle') => {
    setActiveAddressType(type);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
    try {
      const response = await axios.get(url);
      if (response.data && response.data.length > 0) {
        const suggestions = response.data.slice(0, 5);
        setAddressSuggestions(suggestions);
        if (suggestions.length > 0) {
          const { lat, lon } = suggestions[0];
          if (type === 'vehicle') {
            setVehicleCoords({ lat, lon });
          } else {
            const updatedServiceCoords = [...serviceCoords];
            updatedServiceCoords.push({ lat, lon });
            setServiceCoords(updatedServiceCoords);
          }
        }
      } else {
        setError('Unable to geocode address');
      }
    } catch (err) {
      setError('Error during geocoding');
      console.error('Geocoding error:', err);
    }
  };

  const debouncedGeocodeAddress = useCallback(
    debounce((address, type) => geocodeAddress(address, type), 500),
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicle.vehicle_id || !vehicle.start_address) {
      setError('Please fill out all required fields for the vehicle.');
      return;
    }
  
    for (let service of services) {
      if (!service.name || !service.address) {
        setError('Please fill out all required fields for each service.');
        return;
      }
    }
  
    const payload = {
      vehicle: {
        ...vehicle,
        coordinates: vehicleCoords,
      },
      services: services.map((service, index) => ({
        ...service,
        coordinates: serviceCoords[index],
      })),
    };
  
    setLoading(true);
    setError('');
    setResult(null);
  
    try {
      const response = await axios.post('http://localhost:5000/api/optimize-route', payload);
  
      if (!response.data.route) {
        setError('We cannot travel between these locations via road.');
        setResult(null);
      } else {
        const route = response.data.route;
        setResult(response.data);
  
        // Ensure the map ref is available before calling fitBounds
        if (mapRef.current && route && route.length > 0) {
          const bounds = L.latLngBounds(route.map(([lat, lon]) => [lat, lon]));
          mapRef.current.fitBounds(bounds);
        }
      }
    } catch (err) {
      console.error('Error optimizing route:', err.response?.data || err.message);
      setError('Failed to optimize route.');
    } finally {
      setLoading(false);
    }
  };
  
  

  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  }

  return (
    <div className="min-h-screen bg-gray-900 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <Enavbar />
    <div className="max-w-full mx-auto mt-2">
      <ChatAssistant />
      <div className="flex flex-col lg:flex-row gap-6 mt-16">
        <div className="w-full lg:w-[60%]">
          <div className="bg-gray-800 rounded-lg shadow-md p-4 lg:p-6">
            <h2 className="text-2xl text-teal-300 font-semibold mb-4 text-center">Map View</h2>
            <div className="w-full aspect-square">
              <MapContainer
                center={[vehicleCoords?.lat || 19.0760, vehicleCoords?.lon || 72.8777]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {vehicleCoords && (
                  <Marker position={[vehicleCoords.lat, vehicleCoords.lon]} icon={truckIcon}>
                    <Popup>Vehicle located at {vehicleCoords.lat}, {vehicleCoords.lon}</Popup>
                  </Marker>
                )}
                {serviceCoords.map((coords, index) => (
                  <Marker key={index} position={[coords.lat, coords.lon]} icon={storeIcon}>
                    <Popup>Service at {coords.lat}, {coords.lon}</Popup>
                  </Marker>
                ))}
                {result && result.route && (
                  <Polyline positions={result.route} color="blue" weight={4} />
                )}
              </MapContainer>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[40%]">
          <div className="bg-gray-800 rounded-lg shadow-md p-4 lg:p-6">
            <h1 className="text-2xl sm:text-3xl text-teal-400 font-bold mb-6 text-center">Route Optimization</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-teal-300 mb-4">Vehicle Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="vehicle_id" className="block text-teal-400 font-medium mb-2">Vehicle Name</label>
                    <input 
                      type="text" 
                      name="vehicle_id" 
                      id="vehicle_id" 
                      placeholder="Enter vehicle ID" 
                      value={vehicle.vehicle_id} 
                      onChange={handleVehicleChange} 
                      className="w-full bg-gray-700 text-white border border-teal-500 rounded-lg p-3 focus:ring-2 focus:ring-teal-400 focus:outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="start_address" className="block text-teal-400 font-medium mb-2">Start Address</label>
                    <input
                      type="text"
                      name="start_address"
                      id="start_address"
                      placeholder="Enter start address"
                      value={vehicle.start_address}
                      onChange={(e) => {
                        handleVehicleChange(e);
                        debouncedGeocodeAddress(e.target.value, 'vehicle');
                      }}
                      className="w-full bg-gray-700 text-white border border-teal-500 rounded-lg p-3 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    />
                    {addressSuggestions.length > 0 && activeAddressType === 'vehicle' && (
                      <ul className="bg-gray-700 mt-2 border border-teal-500 rounded-lg max-h-40 overflow-auto">
                        {addressSuggestions.map((suggestion, index) => (
                          <li 
                            key={index} 
                            className="p-2 text-teal-300 cursor-pointer hover:bg-teal-700" 
                            onClick={() => {
                              setVehicle({ ...vehicle, start_address: suggestion.display_name });
                              setVehicleCoords({ lat: suggestion.lat, lon: suggestion.lon });
                              setAddressSuggestions([]);
                            }}
                          >
                            {suggestion.display_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
  
              <div>
                <h2 className="text-xl font-semibold text-teal-300 mb-4">Services</h2>
                <div className="space-y-4">
                  {services.map((service, index) => (
                    <div key={index} className="border border-teal-500 p-4 rounded-lg">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor={`service_name_${index}`} className="block text-teal-400 font-medium mb-2">Service Name</label>
                          <input 
                            type="text" 
                            name="name" 
                            id={`service_name_${index}`} 
                            placeholder="Enter service name" 
                            value={service.name} 
                            onChange={(e) => handleServiceChange(index, e)} 
                            className="w-full bg-gray-700 text-white border border-teal-500 rounded-lg p-3 focus:ring-2 focus:ring-teal-400 focus:outline-none" 
                            required 
                          />
                        </div>
                        <div>
                          <label htmlFor={`service_address_${index}`} className="block text-teal-400 font-medium mb-2">Service Address</label>
                          <input 
                            type="text" 
                            name="address" 
                            id={`service_address_${index}`} 
                            placeholder="Enter service address" 
                            value={service.address} 
                            onChange={(e) => {
                              handleServiceChange(index, e);
                              debouncedGeocodeAddress(e.target.value, 'service');
                            }} 
                            className="w-full bg-gray-700 text-white border border-teal-500 rounded-lg p-3 focus:ring-2 focus:ring-teal-400 focus:outline-none" 
                            required 
                          />
                          {addressSuggestions.length > 0 && activeAddressType === 'service' && (
                            <ul className="bg-gray-700 mt-2 border border-teal-500 rounded-lg max-h-40 overflow-auto">
                              {addressSuggestions.map((suggestion, suggestionIndex) => (
                                <li 
                                  key={suggestionIndex} 
                                  className="p-2 text-teal-300 cursor-pointer hover:bg-teal-700" 
                                  onClick={() => {
                                    const updatedServices = [...services];
                                    updatedServices[index].address = suggestion.display_name;
                                    setServices(updatedServices);
                                    const updatedCoords = [...serviceCoords];
                                    updatedCoords[index] = { lat: suggestion.lat, lon: suggestion.lon };
                                    setServiceCoords(updatedCoords);
                                    setAddressSuggestions([]);
                                  }}
                                >
                                  {suggestion.display_name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      {services.length > 1 && (
                        <button 
                          type="button" 
                          className="text-red-400 mt-4 hover:text-red-300 transition-colors" 
                          onClick={() => removeService(index)}
                        >
                          Remove Service
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button 
                  type="button" 
                  className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition-colors" 
                  onClick={addService}
                >
                  Add Service
                </button>
              </div>
  
              {error && <p className="text-red-500 font-medium">{error}</p>}
  
              <div className="text-center">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  
  );
};

export default RouteForm;
