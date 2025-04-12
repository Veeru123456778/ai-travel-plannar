import axios from 'axios';

const API_URL = 'https://search-nearby-places.p.rapidapi.com/api/v1/topfivePlaces';

export const fetchRestaurants = async (latitude, longitude) => {
const options = {
  method: 'GET',
  url: 'https://search-nearby-places.p.rapidapi.com/api/v1/topfivePlaces',
  params: {
    latitude: latitude,
    longitude: longitude,
    keyword: 'RESTAURANTS'
  },
  headers: {
    'x-rapidapi-key': process.env.RAPID_API_KEY,
    'x-rapidapi-host': 'search-nearby-places.p.rapidapi.com'
  }
};

try {
	const response = await axios.request(options);
    console.log(response.data.top5);
    return response.data.top5;
} catch (error) {
    console.error('Error fetching restaurants:', error);
    return [];

}
};