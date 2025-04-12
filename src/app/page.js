

'use client';

import Navbar from "@/components/Navbar";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import GetStarted from "@/components/GetStarted";
import HowItWorks from "@/components/HowItWorks";
import TopTravelPlaces from "@/components/TopTravelPlaces";
import FeaturesSection from "@/components/FeaturesSection";
export default function Home() {
  const { theme,brandColor } = useTheme();

  return (
    <div data-theme={theme} className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center px-6 py-16">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Plan Your <span className={`${brandColor}`}>Dream Trip</span> with AI
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Our smart planner helps you discover, customize, and book unforgettable experiences in seconds.
            </p>
            <div className="mt-6 flex justify-center lg:justify-start">
              {/* <Button className="px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md">
                Get Started
              </Button> */}
              <GetStarted/>
            </div>
          </div>

          {/* Animated Image / SVG */}
          <div className="flex justify-center">
            <Image
              src="/travel.svg"
              alt="AI Travel Planning Illustration"
              width={500}
              height={500}
              className="w-full max-w-md h-auto animate-fade-in-up"
              priority
            />
          </div>
        </div>
      </section>
      <HowItWorks/>
      <TopTravelPlaces/>
      <FeaturesSection/>
    </div>
  );
}


// 'use client';

// import { motion } from 'framer-motion';
// import { useTheme } from "@/context/ThemeContext";
// import Navbar from '@/components/Navbar';
// import Image from 'next/image';
// import GetStarted from '@/components/GetStarted';

// export default function Home() {
//   const { theme } = useTheme();

//   return (
//     <div data-theme={theme} className="min-h-screen flex flex-col">
//       <Navbar />
//       <section className="flex-grow flex items-center justify-center px-6 py-16">
//         <div className="relative w-72 h-72">
//           {/* Plane rotating */}
//          <GetStarted/>
//         </div>
//       </section>
//     </div>
//   );
// }


  //   {/* Earth */}
  //   <div className="w-full h-full rounded-full bg-blue-400 border-8 border-blue-500 flex items-center justify-center shadow-lg">
  //   <span className="text-white text-xl font-semibold z-10">Get Started</span>
  // </div>