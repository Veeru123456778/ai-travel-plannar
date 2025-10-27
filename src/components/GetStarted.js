'use client';

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";

export default function GetStarted() {
  const { theme } = useTheme();

  return (
    <div data-theme={theme} className="mt-2.5 flex flex-col items-center justify-center">
      {/* Button Container */}
      <div className="relative w-80 h-20" id="getStarted">
        {/* Rectangular Button */}

        <Link href="/sign-in"  className="w-full h-full rounded-lg bg-orange-400 border-4 border-orange-500 shadow-lg flex items-center justify-center" >
          <span className="text-white text-xl font-bold">Get Started</span>
          {/* <span className="text-white text-xl font-semibold">Get Started</span> */}
        </Link>
        
        <motion.div
          className="absolute left-1/2 top-1/2"
          initial={{ x: 0, y: 0 }}
          animate={{ 
            x: [-150, 0, 150, 150,-150,-150],
            y: [-70, -70, -70,50,50,-70],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ zIndex: 10 }}
        >
          <Image
            src="/airplane.svg"
            alt="Plane"
            width={40}
            height={40}
            className="w-10 h-10"
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}
