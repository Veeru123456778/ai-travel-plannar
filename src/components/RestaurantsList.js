'use client';

import { useEffect, useState } from 'react';
import { fetchRestaurants } from '@/utils/fetchRestaurants';
import fetchCityCoordinates from '../utils/fetchCityCoordinates';
import RestaurantCard from './RestaurantCard';

const RestaurantsList = ({ city }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      } catch (err) {
        console.error(err);
        setError('Failed to fetch restaurants.');
      } finally {
        setLoading(false);
      }
    };

    getRestaurants();
  }, [city]);

  return (
    <div className="p-4 text-black">
      <h2 className="text-2xl font-semibold mb-4">Nearby Restaurants</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.place_id} restaurant={restaurant} />
            ))
          ) : (
            <p>No restaurants found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantsList;
