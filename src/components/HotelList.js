// import { useState, useEffect } from 'react';
// import fetchCityCoordinates from '../utils/fetchCityCoordinates';
// import fetchHotelsByCoordinates from '../utils/fetchHotelsByCoordinates';

// export default function HotelsPage({ city, arrival_date, departure_date }) {
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
//         setHotels(hotelsData);
//       } catch (err) {
//         console.error(err);
//         setError('Failed to fetch hotels.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHotels();
//   }, [city, arrival_date, departure_date]);

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900">
//         Hotels in {city}
//       </h1>

//       {/* Loading Indicator */}
//       {loading && (
//         <div className="flex justify-center items-center">
//           <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
//         </div>
//       )}

//       {/* Error Message */}
//       {error && !loading && (
//         <p className="text-center text-red-500 text-lg">{error}</p>
//       )}

//       {/* Hotels Grid */}
//       {!loading && hotels.length > 0 && !error && (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {hotels.map((hotel, index) => (
//             <div
//               key={index}
//               className="bg-white shadow-lg rounded-xl overflow-hidden transform transition hover:scale-105 hover:shadow-xl"
//             >
//               {/* Hotel Image */}
//               <img
//                 src={hotel.main_photo_url ? hotel.main_photo_url.replace("square60", "square500") : '/placeholder.jpg'}
//                 alt={hotel.hotel_name || 'Hotel'}
//                 className="w-full h-56 object-cover"
//                 onError={(e) => (e.target.src = '/placeholder.jpg')}
//               />

//               {/* Hotel Info */}
//               <div className="p-5">
//                 <h2 className="text-2xl font-semibold text-gray-900 truncate">
//                   {hotel.hotel_name || 'Hotel Name Unavailable'}
//                 </h2>
//                 <p className="text-gray-600">{hotel.city || 'City Unknown'}</p>

//                 {/* Rating */}
//                 <div className="mt-2 flex items-center space-x-2">
//                   <span className="text-yellow-500 text-lg">★</span>
//                   <span className="text-gray-700 font-medium">
//                     {hotel.review_score ? `${hotel.review_score} (${hotel.review_score_word || 'No Reviews'})` : 'No Reviews'}
//                   </span>
//                 </div>

//                 {/* Price */}
//                 <p className="mt-3 text-lg font-semibold text-blue-600">
//                   ₹ {hotel.composite_price_breakdown?.gross_amount_hotel_currency?.value || 'Price Unavailable'}
//                 </p>

//                 {/* Badges */}
//                 {hotel.badges?.length > 0 && (
//                   <div className="mt-3 flex flex-wrap gap-2">
//                     {hotel.badges.map((badge, idx) => (
//                       <span
//                         key={idx}
//                         className="inline-block bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded"
//                       >
//                         {badge.text}
//                       </span>
//                     ))}
//                   </div>
//                 )}

//                 {/* View Details Button */}
//                 <div className="mt-4">
//                   <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* No Hotels Found */}
//       {!loading && hotels.length === 0 && !error && (
//         <p className="text-center text-gray-700">No hotels found for {city}.</p>
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import fetchCityCoordinates from '../utils/fetchCityCoordinates';
import fetchHotelsByCoordinates from '../utils/fetchHotelsByCoordinates';
import { useTheme } from '@/context/ThemeContext';

export default function HotelsPage({ city, arrival_date, departure_date }) {
  const [hotels, setHotels] = useState([]);
  const [displayCount, setDisplayCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {brandColor} = useTheme();

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
        const hotelsData = await fetchHotelsByCoordinates(
          coords.lat,
          coords.lng,
          arrival_date,
          departure_date
        );
        setHotels(hotelsData);
        // Reset display count when new city or dates are provided
        setDisplayCount(3);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch hotels.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [city, arrival_date, departure_date]);

  const loadMoreHotels = () => {
    setDisplayCount((prev) => prev + 3);
  };

  const handleRemoveHotel = (indexToRemove) => {
    const filteredHotels = hotels.filter((_, index) => index !== indexToRemove);
    setHotels(filteredHotels);
    // Adjust displayCount if necessary
    if (displayCount > filteredHotels.length) {
      setDisplayCount(filteredHotels.length);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white"> */}
      <h1 className={`text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white ${brandColor}`}>
        Hotels in {city}
      </h1>

      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
        </div>
      )}

      {error && !loading && (
        <p className="text-center text-red-500 text-lg">{error}</p>
      )}

      {/* Display Hotels */}
      {!loading && hotels.length > 0 && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.slice(0, displayCount).map((hotel, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transform transition hover:scale-105 hover:shadow-xl flex flex-col"
              >
                {/* Hotel Image */}
                <img
                  src={hotel.main_photo_url
                    ? hotel.main_photo_url.replace("square60", "square500")
                    : '/placeholder.jpg'}
                  alt={hotel.hotel_name || 'Hotel'}
                  className="w-full h-56 object-cover"
                  onError={(e) => (e.target.src = '/placeholder.jpg')}
                />

                {/* Hotel Info */}
                <div className="p-5 flex-grow flex flex-col">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white truncate">
                    {hotel.hotel_name || 'Hotel Name Unavailable'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">{hotel.city || 'City Unknown'}</p>

                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      {hotel.review_score
                        ? `${hotel.review_score} (${hotel.review_score_word || 'No Reviews'})`
                        : 'No Reviews'}
                    </span>
                  </div>

                  <p className="mt-3 text-lg font-semibold text-blue-600">
                    ₹ {hotel.composite_price_breakdown?.gross_amount_hotel_currency?.value || 'Price Unavailable'}
                  </p>

                  {hotel.badges?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {hotel.badges.map((badge, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-yellow-200 dark:bg-yellow-700 text-yellow-800 text-xs px-2 py-1 rounded"
                        >
                          {badge.text}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Buttons */}
                  <div className="mt-4 flex flex-col gap-2">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                      View Details
                    </button>
                    <button
                      onClick={() => handleRemoveHotel(index)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {displayCount < hotels.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMoreHotels}
                className="btn btn-primary"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}

      {/* No Hotels Found */}
      {!loading && hotels.length === 0 && !error && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          No hotels found for {city}.
        </p>
      )}
    </div>
  );
}
