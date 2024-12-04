const axios = require('axios');
const apiKey = process.env.VITE_GOOGLE_API;

const getDistance = async (origin: { lat: number; lng: number; }, destination: { lat: number; lng: number; }) => {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${apiKey}`;
  try {
    const response = await axios.get(url);
    console.log('API Response:', response.data);
    const distanceInMeters = response.data.rows[0].elements[0].distance.value; 
    console.log(distanceInMeters,'Distance in meters');// Distance in meters
    return distanceInMeters / 1000; // Convert to kilometers
  } catch (error) {
    console.error('Error fetching distance from Google Maps API:', error);
    throw error;
  }
};

export default getDistance;
