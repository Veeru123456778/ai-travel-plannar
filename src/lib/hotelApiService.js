

import axios from 'axios';


const hotelApiService = {
  async getHotelsByCity(city, country = 'India') {
    try {
      const response = await axios.get(`https://api.makcorps.com/mapping`, {
        params: {
          api_key: process.env.HOTEL_API_KEY,
          name: city,
        },
      });
      console.log(response.data);
      if (response.data) {
        return response.data; // returns hotel list
      } else {
        throw new Error('No hotels found or invalid city name.');
      }
    } catch (error) {
      console.error('Error fetching hotel data:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default hotelApiService;
