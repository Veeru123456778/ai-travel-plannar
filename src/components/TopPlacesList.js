// import React, { useEffect, useState } from 'react';
// import fetchTopPlacesToVisit from '../utils/fetchTopPlacesToVisit';
// import { Card, CardContent } from '@/components/ui/card';
// import { Loader2 } from 'lucide-react';

// const TopPlacesList = ({ city }) => {
//   const [places, setPlaces] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const getPlaces = async () => {
//       setLoading(true);
//       const data = await fetchTopPlacesToVisit(city);
//       setPlaces(data);
//       setLoading(false);
//     };

//     if (city) {
//       getPlaces();
//     }
//   }, [city]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center p-4">
//         <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading Top Places...
//       </div>
//     );
//   }

//   if (places.length === 0) {
//     return (
//       <div className="p-4 text-center text-gray-500">
//         No top places found for {city}.
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
//       {places.map((place, index) => (
//         <Card key={index} className="rounded-2xl shadow-md hover:shadow-lg transition">
//           <CardContent className="p-4">
//             <h2 className="text-lg font-semibold mb-2">{place.name}</h2>
//             <p className="text-gray-700 mb-2">{place.description}</p>
//             <p className="text-sm text-blue-500 capitalize">{place.type}</p>
//             <p className="text-xs text-gray-500 mt-1">{place.comments}</p>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default TopPlacesList;


import React, { useEffect, useState } from "react";
import fetchTopPlacesToVisit from "../utils/fetchTopPlacesToVisit";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const TopPlacesList = ({ city }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPlaces = async () => {
      setLoading(true);
      const data = await fetchTopPlacesToVisit(city);
      setPlaces(data);
      setLoading(false);
    };

    if (city) {
      getPlaces();
    }
  }, [city]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500 mr-2" /> 
        <span className="text-lg font-medium text-gray-700">Loading Top Places...</span>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 text-lg">
        No top places found for {city}.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {places.map((place, index) => (
        <Card
          key={index}
          className="rounded-xl overflow-hidden shadow-lg transition transform hover:scale-105 hover:shadow-2xl"
        >
          <div className="relative h-52">
            {/* <img
              src={place.image || "/placeholder.jpg"}
              alt={place.name}
              className="w-full h-full object-cover"
            /> */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>
          <CardContent className="p-5">
            <h2 className="text-xl font-bold text-gray-900">{place.name}</h2>
            <p className="text-gray-700 text-sm mt-2 line-clamp-2">{place.description}</p>
            <div className="flex justify-between items-center mt-3">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded-full">
                {place.type}
              </span>
              <span className="text-gray-500 text-sm">{place.comments}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TopPlacesList;
