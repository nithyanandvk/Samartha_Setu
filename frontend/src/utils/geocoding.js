/**
 * Geocoding utilities using OpenStreetMap Nominatim API
 */

// Geocode address to coordinates
export const geocodeAddress = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'User-Agent': 'Samartha-Setu-Food-Sharing-Platform'
        }
      }
    );
    
    const data = await response.json();
    
    if (data && data[0]) {
      return {
        coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)],
        address: data[0].display_name,
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    
    throw new Error('Address not found. Please try a more specific address.');
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

// Reverse geocode coordinates to address
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'Samartha-Setu-Food-Sharing-Platform'
        }
      }
    );
    
    const data = await response.json();
    
    if (data && data.display_name) {
      return data.display_name;
    }
    
    throw new Error('Address not found for these coordinates');
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
};

// Get current location
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          coordinates: [position.coords.longitude, position.coords.latitude]
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// Calculate distance between two coordinates (in km)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

// Validate coordinates
export const validateCoordinates = (coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return false;
  }
  
  const [lng, lat] = coordinates;
  
  if (typeof lng !== 'number' || typeof lat !== 'number') {
    return false;
  }
  
  if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
    return false;
  }
  
  return true;
};

const geocodingUtils = {
  geocodeAddress,
  reverseGeocode,
  getCurrentLocation,
  calculateDistance,
  validateCoordinates
};

export default geocodingUtils;
