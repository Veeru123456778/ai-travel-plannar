'use client';

const RestaurantCard = ({ restaurant, removeRestaurant }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-xl">
      {/* Image */}
      <img
        src={restaurant.imageUrl || '/placeholder.jpg'}
        alt={restaurant.name}
        className="w-full h-48 object-cover"
        onError={(e) => (e.target.src = '/placeholder.jpg')}
      />

      {/* Restaurant Info */}
      <div className="p-5">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
          {restaurant.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {restaurant.address}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {restaurant.openingHours}
        </p>

        {/* Rating & Price */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-yellow-500 text-lg">⭐ {restaurant.rating || 'N/A'}</span>
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            💰 {restaurant.priceRange || 'N/A'}
          </span>
        </div>

        {/* Distance & Phone */}
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          📍 {restaurant.distance || 'Unknown'} away
        </p>
        {restaurant.phoneNumber && (
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            📞 {restaurant.phoneNumber}
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          {restaurant.phoneNumber && (
            <a
              href={`tel:${restaurant.phoneNumber}`}
              className="flex-1 text-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Call Now
            </a>
          )}
          {restaurant.website && (
            <a
              href={restaurant.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              View Details
            </a>
          )}
        </div>

        {/* Remove Button */}
        <div className="mt-4">
          <button
            onClick={removeRestaurant}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
