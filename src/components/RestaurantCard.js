// const RestaurantCard = ({ restaurant }) => {
//     return (
//       <div className="border rounded-lg p-4 shadow-lg text-black">
//         <img
//           src={restaurant.imageUrl}
//           alt={restaurant.name}
//           className="w-full h-40 object-cover rounded-md"
//         />
//         <h3 className="text-lg font-semibold mt-2">{restaurant.name}</h3>
//         <p className="text-gray-600">{restaurant.address}</p>
//         <p className="text-gray-500">{restaurant.openingHours}</p>
//         <p className="text-gray-700 font-semibold">Rating: ⭐ {restaurant.rating}</p>
//         <p className="text-gray-500">Distance: {restaurant.distance}</p>
//         <p className="text-gray-500">Price: {restaurant.priceRange}</p>
//         <p className="text-gray-500">Phone: {restaurant.phoneNumber || 'N/A'}</p>
//         {restaurant.website && (
//           <a
//             href={restaurant.website}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-500 underline"
//           >
//             Visit Website
//           </a>
//         )}
//       </div>
//     );
//   };
  
//   export default RestaurantCard;
  

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-xl">
      {/* Image */}
      <img
        src={restaurant.imageUrl || '/placeholder.jpg'}
        alt={restaurant.name}
        className="w-full h-48 object-cover"
        onError={(e) => (e.target.src = '/placeholder.jpg')}
      />

      {/* Restaurant Info */}
      <div className="p-5">
        <h3 className="text-2xl font-bold text-gray-900 truncate">{restaurant.name}</h3>
        <p className="text-gray-600 text-sm">{restaurant.address}</p>
        <p className="text-gray-500 text-sm">{restaurant.openingHours}</p>

        {/* Rating & Price */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-yellow-500 text-lg">⭐ {restaurant.rating || 'N/A'}</span>
          <span className="text-gray-700 font-medium">
            💰 {restaurant.priceRange || 'N/A'}
          </span>
        </div>

        {/* Distance & Phone */}
        <p className="text-gray-500 mt-2">📍 {restaurant.distance || 'Unknown'} away</p>
        {restaurant.phoneNumber && (
          <p className="text-gray-500 mt-1">📞 {restaurant.phoneNumber}</p>
        )}

        {/* Buttons */}
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
      </div>
    </div>
  );
};

export default RestaurantCard;
