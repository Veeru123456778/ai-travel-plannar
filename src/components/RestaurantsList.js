// 'use client';

// import { useEffect, useState } from 'react';
// import { fetchRestaurants } from '@/utils/fetchRestaurants';
// import fetchCityCoordinates from '../utils/fetchCityCoordinates';
// import RestaurantCard from './RestaurantCard';

// const RestaurantsList = ({ city }) => {
//   const [restaurants, setRestaurants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const getRestaurants = async () => {
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

//         const data = await fetchRestaurants(coords.lat, coords.lng);
//         setRestaurants(data);
//       } catch (err) {
//         console.error(err);
//         setError('Failed to fetch restaurants.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     getRestaurants();
//   }, [city]);

//   return (
//     <div className="p-4 text-black">
//       <h2 className="text-2xl font-semibold mb-4">Nearby Restaurants</h2>
//       {loading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {restaurants.length > 0 ? (
//             restaurants.map((restaurant) => (
//               <RestaurantCard key={restaurant.place_id} restaurant={restaurant} />
//             ))
//           ) : (
//             <p>No restaurants found.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RestaurantsList;


'use client';

import { useEffect, useState } from 'react';
import { fetchRestaurants } from '@/utils/fetchRestaurants';
import fetchCityCoordinates from '@/utils/fetchCityCoordinates';
import RestaurantCard from './RestaurantCard';
import { useTheme } from '@/context/ThemeContext';

export default function RestaurantsList({ city }) {
  const [restaurants, setRestaurants] = useState([]);
  const [displayCount, setDisplayCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const {brandColor} = useTheme();

  useEffect(() => {
    const getRestaurants = async () => {
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

        const data = await fetchRestaurants(coords.lat, coords.lng);
        setRestaurants(data);
        setDisplayCount(3); // Reset display count on new fetch
      } catch (err) {
        console.error(err);
        setError('Failed to fetch restaurants.');
      } finally {
        setLoading(false);
      }
    };

    getRestaurants();
  }, [city]);

  const loadMoreRestaurants = () => {
    setDisplayCount(prev => prev + 3);
  };

  const removeRestaurant = (idToRemove) => {
    const updated = restaurants.filter(
      restaurant => restaurant.place_id !== idToRemove
    );
    setRestaurants(updated);
    // Adjust display count if necessary:
    if (displayCount > updated.length) {
      setDisplayCount(updated.length);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white"> */}
      <h1 className={`text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white ${brandColor}`}>
        Nearby Restaurants in {city}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500 text-lg">{error}</p>
      ) : (
        <>
          {restaurants.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.slice(0, displayCount).map((restaurant) => (
                  <div
                    key={restaurant.place_id}
                    className="card bg-base-100 dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transition-transform transform hover:scale-105"
                  >
                    <RestaurantCard 
                      restaurant={restaurant} 
                      removeRestaurant={() => removeRestaurant(restaurant.place_id)}
                    />
                  </div>
                ))}
              </div>

              {displayCount < restaurants.length && (
                <div className="flex justify-center mt-8">
                  <button 
                    onClick={loadMoreRestaurants}
                    className="btn btn-primary"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-700 dark:text-gray-300 text-lg">
              No restaurants found.
            </p>
          )}
        </>
      )}
    </div>
  );
}
