// import { useState, useEffect } from 'react';
// import fetchCityCoordinates from '../utils/fetchCityCoordinates';
// import fetchHotelsByCoordinates from '../utils/fetchHotelsByCoordinates';

// export default function HotelsPage({ city,arrival_date,departure_date }) {
//   const [hotels, setHotels] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchHotels = async () => {
//       if (!city) return;
//       setLoading(true);
//       setError('');

//       try {
//         const coords = await fetchCityCoordinates(city);
//         if (!coords) {
//           setError('Failed to get coordinates.');
//           setLoading(false);
//           return;
//         }

//         const hotelsData = await fetchHotelsByCoordinates(coords.lat, coords.lng, arrival_date, departure_date);
//         console.log(hotelsData);
//         setHotels(hotelsData);  
//       } catch (err) {
//         console.error(err);
//         setError('Failed to fetch hotels.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHotels();
//   }, [city]);
  


//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6 text-center">Hotels in {city}</h1>
  
//       {/* Loading */}
//       {loading && <p className="text-center">Fetching hotels, please wait...</p>}
  
//       {/* Error */}
//       {error && !loading && <p className="text-red-500 text-center">{error}</p>}
  
//       {/* Hotels Available */}
//       {!loading && hotels && hotels.length > 0 && !error && (
//         <ul className="space-y-4">
//           {hotels.map((hotel, index) => (
//             <li key={index} className="border p-4 rounded shadow flex items-center space-x-4 text-black">
//               <img
//                 src={hotel.main_photo_url ? hotel.main_photo_url.replace("square60", "square500") : '/placeholder.jpg'}
//                 alt={hotel.hotel_name || 'Hotel'}
//                 className="w-28 h-28 object-cover rounded"
//                 onError={(e) => (e.target.src = '/placeholder.jpg')}
//               />
//               <div>
//                 <h2 className="text-xl font-semibold">{hotel.hotel_name || 'Hotel Name Unavailable'}</h2>
//                 <p className="text-gray-600">{hotel.city || 'City Unknown'}</p>
//                 <p className="text-gray-600">
//                   Rating: {hotel.review_score ? hotel.review_score : 'N/A'} ({hotel.review_score_word || 'No Reviews'})
//                 </p>
//                 <p className="mt-2 font-semibold">
//                   ₹ {hotel.composite_price_breakdown?.gross_amount_hotel_currency?.value || 'Price Unavailable'}
//                 </p>
//                 {hotel.badges?.length > 0 &&
//                   hotel.badges.map((badge, idx) => (
//                     <span
//                       key={idx}
//                       className="inline-block bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded mr-2 mt-2"
//                     >
//                       {badge.text}
//                     </span>
//                   ))}
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
  
//       {/* No Hotels Found */}
//       {!loading && hotels.length === 0 && !error && (
//         <p className="text-center">No hotels found for {city}.</p>
//       )}
//     </div>
//   );
  
// }

import { useState, useEffect } from 'react';
import fetchCityCoordinates from '../utils/fetchCityCoordinates';
import fetchHotelsByCoordinates from '../utils/fetchHotelsByCoordinates';

export default function HotelsPage({ city, arrival_date, departure_date }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHotels = async () => {
      if (!city) return;
      setLoading(true);
      setError('');

      try {
        const coords = await fetchCityCoordinates(city);
        if (!coords) {
          setError('Failed to get coordinates.');
          setLoading(false);
          return;
        }

        const hotelsData = await fetchHotelsByCoordinates(coords.lat, coords.lng, arrival_date, departure_date);
        setHotels(hotelsData);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch hotels.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [city, arrival_date, departure_date]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900">
        Hotels in {city}
      </h1>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
        </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <p className="text-center text-red-500 text-lg">{error}</p>
      )}

      {/* Hotels Grid */}
      {!loading && hotels.length > 0 && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl overflow-hidden transform transition hover:scale-105 hover:shadow-xl"
            >
              {/* Hotel Image */}
              <img
                src={hotel.main_photo_url ? hotel.main_photo_url.replace("square60", "square500") : '/placeholder.jpg'}
                alt={hotel.hotel_name || 'Hotel'}
                className="w-full h-56 object-cover"
                onError={(e) => (e.target.src = '/placeholder.jpg')}
              />

              {/* Hotel Info */}
              <div className="p-5">
                <h2 className="text-2xl font-semibold text-gray-900 truncate">
                  {hotel.hotel_name || 'Hotel Name Unavailable'}
                </h2>
                <p className="text-gray-600">{hotel.city || 'City Unknown'}</p>

                {/* Rating */}
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="text-gray-700 font-medium">
                    {hotel.review_score ? `${hotel.review_score} (${hotel.review_score_word || 'No Reviews'})` : 'No Reviews'}
                  </span>
                </div>

                {/* Price */}
                <p className="mt-3 text-lg font-semibold text-blue-600">
                  ₹ {hotel.composite_price_breakdown?.gross_amount_hotel_currency?.value || 'Price Unavailable'}
                </p>

                {/* Badges */}
                {hotel.badges?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {hotel.badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded"
                      >
                        {badge.text}
                      </span>
                    ))}
                  </div>
                )}

                {/* View Details Button */}
                <div className="mt-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Hotels Found */}
      {!loading && hotels.length === 0 && !error && (
        <p className="text-center text-gray-700">No hotels found for {city}.</p>
      )}
    </div>
  );
}
