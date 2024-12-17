import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Polygon, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Map Controls Component for handling map interactions
const MapControls = ({ isSelectionMode }) => {
  const map = useMap();
  
  useEffect(() => {
    if (isSelectionMode) {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
    } else {
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
    }
  }, [isSelectionMode, map]);

  return null;
};

// Hardcoded zone information
const ZONE_TEMPLATES = [
  {
    id: 1,
    name: "Northern Forest Reserve",
    description: "Extensive woodland area with high biodiversity potential",
    location: "Himalayan Foothills, Uttarakhand",
    area: "1,245 sq km",
    degradationLevel: 6,
    carbonSinkPotential: 250000,
    recommendedActions: [
      "Selective Reforestation",
      "Wildlife Corridor Preservation",
      "Sustainable Forest Management"
    ],
    environmentalImpact: {
      biodiversityScore: 8.5,
      waterRetentionCapacity: "High",
      soilHealth: "Moderate"
    },
    color: "green"
  },
  {
    id: 2,
    name: "Coastal Ecosystem Restoration Zone",
    description: "Critical marine and coastal habitat rehabilitation area",
    location: "Coastal Region, Tamil Nadu",
    area: "782 sq km",
    degradationLevel: 8,
    carbonSinkPotential: 125000,
    recommendedActions: [
      "Mangrove Replantation",
      "Coastal Erosion Control",
      "Marine Biodiversity Protection"
    ],
    environmentalImpact: {
      biodiversityScore: 7.2,
      waterRetentionCapacity: "Very High",
      soilHealth: "Low"
    },
    color: "blue"
  },
  {
    id: 3,
    name: "Agricultural Regeneration Zone",
    description: "Sustainable farming and soil restoration area",
    location: "Deccan Plateau, Maharashtra",
    area: "956 sq km",
    degradationLevel: 7,
    carbonSinkPotential: 175000,
    recommendedActions: [
      "Crop Diversity Introduction",
      "Organic Farming Techniques",
      "Water Conservation"
    ],
    environmentalImpact: {
      biodiversityScore: 6.5,
      waterRetentionCapacity: "Moderate",
      soilHealth: "Improving"
    },
    color: "brown"
  }
];

const RegenerativeZoneMap = () => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [drawnZones, setDrawnZones] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const featureGroupRef = useRef(null);

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (selectedZone) {
      setSelectedZone(null);
    }
  };

  const generateZoneData = (layer) => {
    const zoneTemplate = ZONE_TEMPLATES[
      Math.floor(Math.random() * ZONE_TEMPLATES.length)
    ];

    return {
      id: Date.now().toString(),
      coordinates: layer.toGeoJSON().geometry.coordinates,
      ...zoneTemplate
    };
  };

  const handleCreate = (e) => {
    const layer = e.layer;
    const newZone = generateZoneData(layer);
    
    setDrawnZones(prevZones => [...prevZones, newZone]);
    
    if (featureGroupRef.current) {
      featureGroupRef.current.addLayer(layer);
    }
  };

  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
  };

  return (
    <div className="flex h-screen">
      {/* Mode Toggle Button */}
      <button
        onClick={toggleSelectionMode}
        className={`absolute top-4 left-4 z-[1000] px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
          isSelectionMode 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {isSelectionMode ? 'Exit Selection Mode' : 'Enter Selection Mode'}
      </button>

      {/* Map Container */}
      <div className="w-3/4 relative">
        <MapContainer 
          center={[20.5937, 78.9629]} 
          zoom={5} 
          className="h-full w-full"
        >
          <MapControls isSelectionMode={isSelectionMode} />
          
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          
          <FeatureGroup ref={featureGroupRef}>
            <EditControl
              position="topright"
              onCreated={handleCreate}
              draw={{
                polygon: true,
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false
              }}
            />
            
            {drawnZones.map((zone) => (
              <Polygon
                key={zone.id}
                positions={zone.coordinates[0]}
                pathOptions={{
                  color: zone.color,
                  fillOpacity: 0.5
                }}
                eventHandlers={{
                  click: () => handleZoneClick(zone)
                }}
              />
            ))}
          </FeatureGroup>
        </MapContainer>
      </div>

      {/* Zone Details Sidebar */}
      <div className="w-1/4 p-4 bg-white shadow-lg overflow-y-auto">
        {selectedZone ? (
          <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
            <h2 className="text-2xl font-bold text-green-800">
              {selectedZone.name}
            </h2>
            
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="mb-3">
                <h3 className="font-semibold text-gray-700">Location</h3>
                <p>{selectedZone.location}</p>
              </div>

              <div className="mb-3">
                <h3 className="font-semibold text-gray-700">Description</h3>
                <p>{selectedZone.description}</p>
              </div>

              <div className="mb-3">
                <h3 className="font-semibold text-gray-700">Area</h3>
                <p>{selectedZone.area}</p>
              </div>
              
              <div className="mb-3">
                <h3 className="font-semibold text-gray-700">Degradation Level</h3>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div 
                      className="bg-red-500 h-2.5 rounded-full" 
                      style={{width: `${selectedZone.degradationLevel * 10}%`}}
                    ></div>
                  </div>
                  <span>{selectedZone.degradationLevel}/10</span>
                </div>
              </div>
              
              <div className="mb-3">
                <h3 className="font-semibold text-gray-700">Recommended Actions</h3>
                <ul className="list-disc pl-5">
                  {selectedZone.recommendedActions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-3">
                <h3 className="font-semibold text-gray-700">Carbon Sink Potential</h3>
                <p>{selectedZone.carbonSinkPotential.toLocaleString()} tons CO₂/year</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700">Environmental Impact</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm">Biodiversity Score</p>
                    <p>{selectedZone.environmentalImpact.biodiversityScore}/10</p>
                  </div>
                  <div>
                    <p className="text-sm">Water Retention</p>
                    <p>{selectedZone.environmentalImpact.waterRetentionCapacity}</p>
                  </div>
                  <div>
                    <p className="text-sm">Soil Health</p>
                    <p>{selectedZone.environmentalImpact.soilHealth}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                onClick={() => setSelectedZone(null)}
              >
                Close Details
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>Draw a polygon on the map</p>
            <p>Click to reveal zone details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegenerativeZoneMap;