// 'use client'
// import { Button } from "@/components/ui/button";
// import Navbar from "@/components/Navbar";
// import { useTheme } from "@/context/ThemeContext";

// export default function Home() {

//   const {theme,setTheme} = useTheme();
//   return (
//     <section data-theme={theme} className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center bg-white">
//       {/* Hero Text */}
//       <Navbar/>
//       <h1 className="text-5xl font-bold text-gray-900 md:text-6xl">
//         Explore Your <span className="text-blue-500">Dream Destination</span>
//       </h1>
//       <p className="mt-4 text-lg text-gray-600 md:text-xl">
//         Let AI plan the perfect trip for you with real-time recommendations.
//       </p>

//       {/* CTA Button */}
//       <Button  className="mt-6 px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg">
//         Plan Your Trip
//       </Button>
//       {/* Map Section (To be animated later) */}
//       <div className="relative w-full max-w-3xl mt-12 aspect-video">
        
//       </div>
//     </section>
//   );
// }

'use client'
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

export default function Home() {
  const { theme } = useTheme();

  return (
    <section
      data-theme={theme}
      className="relative flex flex-col min-h-screen bg-base-100"
    >
      <Navbar />
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between w-full px-6 md:px-16 py-12 gap-8">
        {/* Left: Text */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Your Personal <span className="text-accent">AI Trip Planner</span>
          </h1>
          <p className="mt-4 text-lg text-base-content">
            Get smart, real-time recommendations and plan the perfect vacation powered by AI.
          </p>
          <Button className="mt-6 px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg">
            Plan Your Trip
          </Button>
        </div>

        {/* Right: Animation or Image */}
        <div className="flex-1 w-full max-w-lg">
          <Image
            src="public/travel.svg"
            alt="AI Travel Illustration"
            width={500}
            height={500}
            className="w-full h-auto object-contain animate-fade-in"
            priority
          />
        </div>
      </div>
    </section>
  );
}
