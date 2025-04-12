// "use client";

// import TravelCard from "./TravelCard";

// // Example data; replace with your real places/itineraries
// const placesData = [
//   {
//     id: 1,
//     name: "Paris, France",
//     image: "/images/paris.jpg",
//     desc: "Romantic city known for art, fashion, gastronomy & culture.",
//   },
//   {
//     id: 2,
//     name: "Venice, Italy",
//     image: "/images/venice.jpg",
//     desc: "Famous for its canals, gondolas, & beautiful architecture.",
//   },
//   {
//     id: 3,
//     name: "Tokyo, Japan",
//     image: "/images/tokyo.jpg",
//     desc: "A bustling metropolis blending tradition & cutting-edge tech.",
//   },
//   {
//     id: 4,
//     name: "New York, USA",
//     image: "/images/newyork.jpg",
//     desc: "The city that never sleeps, with iconic skyline & landmarks.",
//   },
// ];

// export default function TopTravelPlaces() {
//   return (
//     <section className="py-16 px-4 bg-base-200">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-10">
//           <h2 className="text-3xl font-bold">Top Travel Places Itineraries</h2>
//           <p className="mt-2 text-gray-600 dark:text-gray-300">
//             Discover the world’s best destinations curated just for you
//           </p>
//         </div>

//         {/* Responsive Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {placesData.map((place, index) => (
//             <TravelCard
//               key={place.id}
//               name={place.name}
//               image={place.image}
//               desc={place.desc}
//               delay={index * 0.2} // optional stagger
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { motion,useAnimation } from "framer-motion";
import Image from "next/image";


// Example data: Replace with your real itineraries
const travelPlaces = [
  {
    id: 1,
    title: "Paris",
    imageUrl: "/images/paris.jpg",
    description: "City of lights and love.",
  },
  {
    id: 2,
    title: "New York",
    imageUrl: "/images/newyork.jpg",
    description: "The city that never sleeps.",
  },
  {
    id: 3,
    title: "Sydney",
    imageUrl: "/images/sydney.jpg",
    description: "Home to the Opera House.",
  },
  {
    id: 4,
    title: "Taj Mahal",
    imageUrl: "/images/tajmahal.jpg",
    description: "A wonder of the modern world.",
  },
  {
    id: 5,
    title: "Tokyo",
    imageUrl: "/images/tokyo.jpg",
    description: "Vibrant culture & modern marvels.",
  },
];

const marqueeVariants = {
  animate: {
    x: ["0%", "-100%"], // Move from 0% to -100% horizontally
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 20, // Adjust scroll speed
        ease: "linear",
      },
    },
  },
};

export default function TopTravelPlaces() {
    const controls = useAnimation();

  return (
    <section className="w-full py-12 px-4 bg-base-100 text-base-content bg-orange-50">
      <div className="max-w-7xl mx-auto">
      <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Top Travel Places Itineraries</h2>
           <p className="mt-2 text-gray-600 dark:text-gray-300">
             Discover the world’s best destinations curated just for you
           </p>
         </div>
        
        {/* Outer container hides overflow so cards only visible in center */}
        <div className="relative overflow-hidden">
          {/* Marquee wrapper (two copies of our cards in one big row) */}
          <motion.div
            className="flex gap-6 whitespace-nowrap hover:paused"
            variants={marqueeVariants}
            animate={controls}
            onMouseEnter={()=>controls.stop()}
            onMouseLeave={()=>controls.start(marqueeVariants.animate)}
          >
            {/* First copy of cards */}
            {travelPlaces.map((place) => (
              <TravelPlaceCard key={place.id} place={place} />
            ))}
            {/* Second copy for continuous loop */}
            {travelPlaces.map((place) => (
              <TravelPlaceCard key={`dup-${place.id}`} place={place} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* A simple DaisyUI card for each travel place */
function TravelPlaceCard({ place }) {
  return (
    <div className="card w-60 bg-base-200 shadow-xl inline-block mr-2">
      <figure>
        {/* Next.js Image from public/images */}
        <Image
          src={place.imageUrl}
          alt={place.title}
          width={240}
          height={160}
          className="h-40 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h3 className="card-title">{place.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {place.description}
        </p>
      </div>
    </div>
  );
}
