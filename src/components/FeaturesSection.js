// 'use client';

// import Image from "next/image";
// import { motion } from "framer-motion";

// // Sample features data: update these with your real images and descriptions.
// const features = [
//   {
//     id: 1,
//     title: "Custom/AI Generated Trip Planning",
//     description:
//       "Get weather conditions, day-wise plan, hotels, restaurants, and more curated just for you.",
//     imageUrl: "/images/ai-trip-planning.svg", // Replace with your asset in /public/images
//   },
//   {
//     id: 2,
//     title: "Collaborate with Others",
//     description:
//       "Work with fellow travelers to create, share, and refine itineraries together.",
//     imageUrl: "/images/collaboration.svg",
//   },
//   {
//     id: 3,
//     title: "Download PDF for Offline Use",
//     description:
//       "Export your itinerary as a PDF to access your travel plans anytime, even without internet.",
//     imageUrl: "/images/download-pdf.svg",
//   },
//   {
//     id: 4,
//     title: "Get Estimated Cost of Trip by AI",
//     description:
//       "Let AI calculate a realistic budget for your trip including accommodations, food, and activities.",
//     imageUrl: "/images/estimated-cost.svg",
//   },
//   {
//     id: 5,
//     title: "Share Your Travel Stories",
//     description:
//       "Publish and share your travel experiences and itineraries with our community.",
//     imageUrl: "/images/share-travel.svg",
//   },
// ];

// export default function FeaturesSection() {
//   return (
//     <section className="py-16 bg-base-100" data-theme="light">
//       <div className="max-w-7xl mx-auto px-4">
//         <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {features.map((feature) => (
//             <motion.div
//               key={feature.id}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="card bg-base-200 shadow-xl cursor-pointer"
//             >
//               <figure className="px-4 pt-4">
//                 <Image
//                   src={feature.imageUrl}
//                   alt={feature.title}
//                   width={80}
//                   height={80}
//                   className="w-20 h-20"
//                   priority
//                 />
//               </figure>
//               <div className="card-body items-center text-center">
//                 <h3 className="card-title">{feature.title}</h3>
//                 <p className="text-sm">{feature.description}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";

import Image from "next/image";

const features = [
  {
    id: 1,
    title: "Striver's DSA Sheet",
    description: "Boost your DSA skills with our handy cheat sheets.",
    color: "#FAAD60", // color of the top block
    icon: "/icons/document.svg", // place a relevant icon in /public/icons
  },
  {
    id: 2,
    title: "Technical Blogs",
    description: "Explore Tech Innovation with Engaging Blogs.",
    color: "#359AD0",
    icon: "/icons/blog.svg",
  },
  {
    id: 3,
    title: "Striver's CP Sheet",
    description: "Level Up Your Coding with Practice Resources.",
    color: "#2FA58F",
    icon: "/icons/cp.svg",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-12 bg-base-100 text-base-content mx-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Top Features</h2>
           {/* <p className="mt-2 text-gray-600 dark:text-gray-300">
             Discover the world’s best destinations curated just for you
           </p> */}
         </div>

        {/* Responsive grid: 1 column on mobile, 2 on medium, 3 on large */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }) {
  const { title, description, color, icon } = feature;

  return (
    <div  className="card w-full bg-white shadow-md border border-gray-200 rounded-lg overflow-hidden">
      {/* Top Colored Section with Centered Icon */}
      <div style={{ backgroundColor: color }} className="w-full h-44 flex items-center justify-center">
        {/* Icon */}
        <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center shadow-md">
          <Image
            src={icon}
            alt={title}
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="card-body p-5">
        <h3 className="card-title text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
}
