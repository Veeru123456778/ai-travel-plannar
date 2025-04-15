// src/utils/fetchHotelsByCoordinates.js
import axios from 'axios';

const fetchHotelsByCoordinates = async (latitude, longitude,arrival_date,departure_date) => {
    console.log(arrival_date,departure_date,latitude,longitude);
  const options = {
    method: 'GET',
    url: 'https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotelsByCoordinates',
    params: {
      latitude,
      longitude,
      arrival_date,
      departure_date,
      adults:10,
    },
    headers: {
      'x-rapidapi-key':  process.env.RAPID_API_KEY,
      'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    const hotels = response.data.data.result;
    console.log(hotels);
    return hotels || [];
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }
};

export default fetchHotelsByCoordinates;
