// src/utils/fetchCityCoordinates.js
import axios from 'axios';

const fetchCityCoordinates = async (city) => {
  const options = {
    method: 'GET',
    url: 'https://booking-com15.p.rapidapi.com/api/v1/meta/locationToLatLong',
    params: { query: city },
    headers: {
      'x-rapidapi-key': process.env.RAPID_API_KEY,
      'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    const { lat, lng } = response.data.data[0].geometry.location;
    // console.log(lat,lng);
    return { lat, lng };
  } catch (error) {
    console.error('Error fetching city coordinates:', error);
    return null;
  }
};

export default fetchCityCoordinates;
