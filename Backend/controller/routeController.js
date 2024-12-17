const axios = require('axios');

exports.optimizeRoute = async (req, res) => {
  try {
    // Extract vehicle and services information from the request body
    const { vehicle, services } = req.body;

    // Validate incoming data
    if (!vehicle || !services || !Array.isArray(services)) {
      return res.status(400).json({ error: 'Invalid payload. Ensure vehicle and services are provided.' });
    }

    if (!vehicle.coordinates || !vehicle.coordinates.lat || !vehicle.coordinates.lon) {
      return res.status(400).json({ error: 'Invalid vehicle coordinates.' });
    }

    if (services.length === 0) {
      return res.status(400).json({ error: 'At least one service is required.' });
    }

    // Validate that all services have valid coordinates
    for (let service of services) {
      if (!service.coordinates || !service.coordinates.lat || !service.coordinates.lon) {
        return res.status(400).json({ error: `Invalid coordinates for service ${service.name}.` });
      }
    }

    // Construct the list of coordinates for the vehicle and services
    const coordinates = [
      `${vehicle.coordinates.lon},${vehicle.coordinates.lat}`, // Vehicle start point (lon, lat)
      ...services.map(service => `${service.coordinates.lon},${service.coordinates.lat}`), // Service points
    ];

    // OSRM API URL (free route optimization API)
    const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${coordinates.join(';')}?overview=full&geometries=polyline`;

    // Request route optimization from OSRM
    const response = await axios.get(osrmUrl);

    if (response.data.routes && response.data.routes[0].geometry) {
      const optimizedRoute = response.data.routes[0].geometry;
      const route = decodePolyline(optimizedRoute);

      return res.json({ route });
    } else {
      return res.status(500).json({ error: 'Failed to retrieve route from OSRM.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error occurred during route optimization.' });
  }
};

// Decode polyline from OSRM
function decodePolyline(polyline) {
  let index = 0, lat = 0, lon = 0;
  const path = [];
  while (index < polyline.length) {
    let byte, shift = 0, result = 0;
    do {
      byte = polyline.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const deltaLat = (result & 1) ? ~(result >> 1) : (result >> 1);
    lat += deltaLat;

    shift = 0;
    result = 0;
    do {
      byte = polyline.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const deltaLon = (result & 1) ? ~(result >> 1) : (result >> 1);
    lon += deltaLon;

    path.push([lat / 1e5, lon / 1e5]);
  }
  return path;
}
