import axios from 'axios';

const fetchTopPlacesToVisit = async (city) => {
//   const options = {
//     method: 'POST',
//     url: 'https://travel-guide-api-city-guide-top-places.p.rapidapi.com/check',
//     params: { noqueue: '1' },
//     headers: {
//       'x-rapidapi-key': process.env.RAPID_API_KEY,
//       'x-rapidapi-host': 'travel-guide-api-city-guide-top-places.p.rapidapi.com',
//       'Content-Type': 'application/json',
//     },
//     data: {
//       region: city,
//       language: 'en',
//       interests: ['historical', 'cultural', 'food'],
//     },
//   };

  try {
    // const response = await axios.request(options);
    // const topPlaces = response.data.result; // Array of places
    // console.log(topPlaces); // To verify
    return [];
    // return topPlaces || []; // <-- Return it here
  } catch (error) {
    console.error(error);
    return []; // Return empty array on error
  }
};

export default fetchTopPlacesToVisit;
