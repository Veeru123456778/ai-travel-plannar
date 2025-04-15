
// // 'use client';

// // import { motion } from 'framer-motion';
// // import { useTheme } from "@/context/ThemeContext";
// // import Image from 'next/image';

// // export default function Home() {
// //   const { theme } = useTheme();

// //   return (
// //     <div data-theme={theme} className="min-h-screen flex flex-col">
// //       <section className="flex-grow flex items-center justify-center px-6 py-16">
// //         <div className="relative w-72 h-72">
// //           {/* Earth */}
// //           <div className="w-full h-full rounded-full bg-blue-400 border-8 border-blue-500 flex items-center justify-center shadow-lg">
// //             <span className="text-white text-xl font-semibold z-10">Get Started</span>
// //           </div>

// //           {/* Plane rotating */}
// //           <motion.div
// //             className="absolute top-0  left-1/3 w-24 h-24"
// //             initial={{ rotate: 0 }}
// //             animate={{ rotate: 360 }}
// //             transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
// //             style={{
// //               originX: 0.5,
// //               originY: 1.5,
// //             }}
// //           >
// //              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                           
// //               <Image
// //               src="/airplane.svg"
// //               alt="AI Travel Planning Illustration"
// //               width={500}
// //               height={500}
// //               className="w-full max-w-md h-auto animate-fade-in-up"
// //               priority
// //             />

// //             </div>
// //           </motion.div>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // }

// 'use client';

// import { motion } from "framer-motion";
// import { useTheme } from "@/context/ThemeContext";
// import Image from "next/image";

// export default function GetStarted() {
//   const { theme } = useTheme();

//   return (
//     <div data-theme={theme} className="min-h-screen flex flex-col">
//       <section className="flex-grow flex items-center justify-center px-6 py-16">
//         <div className="relative w-72 h-72">
//           {/* Earth */}
//           <div className="w-full h-full rounded-full bg-blue-400 border-8 border-blue-500 flex items-center justify-center shadow-lg">
//             <span className="text-white text-xl font-semibold z-10">Get Started</span>
//           </div>

//           {/* Outer container for orbiting animation */}
//           <motion.div
//             className="absolute top-0 left-1/3 w-24 h-24"
//             initial={{ rotate: 0 }}
//             animate={{ rotate: 360 }}
//             transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
//             style={{ originX: 0.5, originY: 1.5 }}
//           >
//             {/* Inner container with shake animation */}
//             <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 shake">
//               <Image
//                 src="/airplane.svg"
//                 alt="Plane"
//                 width={80}
//                 height={80}
//                 className="w-12 h-12"
//                 priority
//               />
//             </div>
//           </motion.div>
//         </div>
//       </section>
//     </div>
//   );
// }

// 'use client';

// import { motion } from "framer-motion";
// import { useTheme } from "@/context/ThemeContext";
// import Image from "next/image";

// export default function Home() {
//   const { theme } = useTheme();

//   return (
//     <div data-theme={theme} className="min-h-screen flex flex-col">
//       <section className="flex-grow flex items-center justify-center px-6 py-16">
//         <div className="relative w-72 h-72">
//           {/* Earth */}
//           <div className="w-full h-full rounded-full bg-blue-400 border-8 border-blue-500 flex items-center justify-center shadow-lg">
//             <span className="text-white text-xl font-semibold z-10">Get Started</span>
//           </div>

//           {/* Outer container for plane orbiting */}
//           <motion.div
//             className="absolute top-0 left-1/3 w-24 h-24"
//             initial={{ rotate: 0 }}
//             animate={{ rotate: 360 }}
//             transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
//             style={{
//               originX: 0.5,
//               originY: 1.5,
//             }}
//           >
//             {/* Inner container for plane shaking */}
//             <motion.div
//               className="absolute -top-10 left-1/2 transform -translate-x-1/2"
//               animate={{rotate: [0,22,45,67,70,90]}}
//               transition={{
//                 duration: 5,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//             >
//               <Image
//                 src="/airplane.svg"
//                 alt="Plane"
//                 width={80}
//                 height={80}
//                 className="w-12 h-12"
//                 priority
//               />
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>
//     </div>
//   );
// }


// 'use client';

// import { motion } from "framer-motion";
// import { useTheme } from "@/context/ThemeContext";
// import Image from "next/image";

// export default function GetStarted() {
//   const { theme } = useTheme();

//   return (
//     <div data-theme={theme} className="flex flex-col">
//       <section className="flex-grow flex items-center justify-center px-6">
//         {/* Using aspect-square on parent container for extra safety */}
//         <div className="relative w-60 h-20 aspect-square">
//           {/* Earth */}
//           <div className="w-full h-full box-border rounded-full bg-blue-400 border-8 border-blue-500 flex items-center justify-center shadow-lg">
//             <span className="text-white text-xl font-semibold z-10">Get Started</span>
//           </div>

//           {/* Outer container for plane orbiting */}
//           <motion.div
//             className="absolute top-0 left-1/3 w-24 h-24"
//             initial={{ rotate: 0 }}
//             animate={{ x:[0,0,] }}
//             // animate={{ rotate: 360 }}
//             transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
//             style={{
//               originX: 0.5,
//               originY: 1.5,
//             }}
//           >
//             {/* Inner container for plane (example without shake here) */}
//             <motion.div
//               className="absolute -top-10 left-1/2 transform -translate-x-1/2"
//               animate={{ rotate: [0, 22, 45, 67, 70, 90] }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//             >
//               <Image
//                 src="/airplane.svg"
//                 alt="Plane"
//                 width={80}
//                 height={80}
//                 className="w-12 h-12"
//                 priority
//               />
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>
//     </div>
//   );
// }


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
