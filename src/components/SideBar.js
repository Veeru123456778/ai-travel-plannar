// "use client";
// import { useRouter } from "next/navigation";

// // Sidebar receives props from the parent to know if the itinerary is generated,
// // and to get the functions for handling PDF download and collaboration.
// export default function Sidebar({
//   itineraryGenerated = false,
// //   onDownloadPDF,
// //   onEstimateCost,
// //   onCollaborationClick,
// }) {
//   // Optional: Using router can help scroll to sections programmatically if needed.
//   const router = useRouter();

//   return (
//     <aside className="sticky top-0 z-10 h-screen w-64 p-4 bg-base-200 shadow-lg">
//       <div className="flex flex-col gap-6">
//         {/* Always Accessible Section */}
//         <div>
//           <h3 className="text-lg font-bold">Advanced Features</h3>
//           <button
//             // onClick={onCollaborationClick}
//             className="btn btn-info btn-sm w-full"
//           >
//             Collaboration
//           </button>
//         </div>

//         {/* These options appear only if itinerary has been generated */}
//         {itineraryGenerated && (
//           <div>
//             <h3 className="mt-4 text-lg font-bold">Itinerary Options</h3>
//             <ul className="menu menu-compact p-0">
//               <li>
//                 <a href="#description" className="link link-hover">
//                   Description
//                 </a>
//               </li>
//               <li>
//                 <a href="#weather" className="link link-hover">
//                   Weather Analysis
//                 </a>
//               </li>
//               <li>
//                 <a href="#hotels" className="link link-hover">
//                   Top Hotels
//                 </a>
//               </li>
//               <li>
//                 <a href="#restaurants" className="link link-hover">
//                   Top Restaurants
//                 </a>
//               </li>
//               <li>
//                 <a href="#itinerary" className="link link-hover">
//                   Itinerary
//                 </a>
//               </li>
//               <li>
//                 <a href="#estimate" className="link link-hover">
//                   Estimate Trip Cost
//                 </a>
//               </li>
//             </ul>

//             <div className="mt-4">
//               <button
//                 // onClick={onDownloadPDF}
//                 className="btn btn-primary btn-sm w-full"
//               >
//                 Download PDF
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// }

// "use client";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// // Sidebar receives props to know if itinerary is generated.
// export default function Sidebar({
//   itineraryGenerated = false,
//   // onDownloadPDF,
//   // onEstimateCost,
//   // onCollaborationClick,
// }) {
//   const router = useRouter();

//   useEffect(()=>{
//      console.log("Iternary updated!!")
//   },[itineraryGenerated])

//   return (
//     <aside className="fixed mt-15 top-0 left-0 z-10 h-screen w-64 p-4 bg-base-200 shadow-lg overflow-y-auto">
//       <div className="flex flex-col gap-6">
//         {/* Always Accessible Section */}
//         <div>
//           <h3 className="text-lg font-bold mb-3">Advanced Features</h3>
//           <button
//             // onClick={onCollaborationClick}
//             className="btn btn-info btn-sm w-full"
//           >
//             #Collaboration
//           </button>
//         </div>

//         {/* These options appear only if itinerary has been generated */}
//         {/* {itineraryGenerated ? ( */}
//           <div>
//             <h3 className="mt-4 text-lg font-bold">Itinerary Options</h3>
//             <ul className="menu menu-compact p-0">
//               <li>
//                 <a href="#description" className="link link-hover">
//                   Description
//                 </a>
//               </li>
//               <li>
//                 <a href="#weather" className="link link-hover">
//                   Weather Analysis
//                 </a>
//               </li>
//               <li>
//                 <a href="#hotels" className="link link-hover">
//                   Top Hotels
//                 </a>
//               </li>
//               <li>
//                 <a href="#restaurants" className="link link-hover">
//                   Top Restaurants
//                 </a>
//               </li>
//               <li>
//                 <a href="#itinerary" className="link link-hover">
//                   Itinerary
//                 </a>
//               </li>
//               <li>
//                 <a href="#estimate" className="link link-hover">
//                   Estimate Trip Cost
//                 </a>
//               </li>
//             </ul>

//             <div className="mt-4">
//               <button
//                 // onClick={onDownloadPDF}
//                 className="btn btn-primary btn-sm w-full"
//               >
//                 Download PDF
//               </button>
//             </div>
//           </div>
//         {/* ):''} */}
//       </div>
//     </aside>
//   );
// }


// "use client";
// import { useState } from "react";

// export default function SideBar({ itinerary, onDownloadPdf, onEstimateCost, onCollaborationClick }) {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   return (
//     <div
//       className={`h-full flex flex-col border-r border-base-300 bg-base-200 transition-all duration-300 ${
//         isCollapsed ? "w-16" : "w-64"
//       }`}
//     >
//       {/* Collapse Toggle */}
//       <div className="flex justify-end p-2">
//         <button
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           className="btn btn-xs btn-ghost"
//         >
//           <span className="block transform rotate-90 text-xs">
//             {isCollapsed ? "Open" : "Close"}
//           </span>
//         </button>
//       </div>

//       {/* Sidebar Content */}
//       <div className="flex-1 overflow-y-auto p-2">
//         {!isCollapsed ? (
//           <>
//             <h2 className="text-lg font-semibold">Sidebar</h2>
//             {itinerary ? (
//               <div className="space-y-3 mt-4">
//                 <button onClick={onDownloadPdf} className="btn btn-outline w-full">
//                   Download PDF
//                 </button>
//                 <button onClick={onEstimateCost} className="btn btn-outline w-full">
//                   Estimate Cost
//                 </button>
//                 <button onClick={onCollaborationClick} className="btn btn-outline w-full">
//                   Collaborate
//                 </button>
//               </div>
//             ) : (
//               <p className="mt-4 text-sm text-gray-500 italic">
//                 Generate your itinerary to access full features.
//               </p>
//             )}
//           </>
//         ) : (
//           // Minimal view: replace with icons if needed
//           <div className="flex flex-col items-center space-y-4 mt-4">
//             <button className="btn btn-square btn-ghost">📄</button>
//             <button className="btn btn-square btn-ghost">💰</button>
//             <button className="btn btn-square btn-ghost">🤝</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useState } from "react";

// export default function Sidebar({ itinerary, onDownloadPdf, onEstimateCost, onCollaborationClick }) {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   return (
//     <div
//       className={`
//         relative 
//         h-screen 
//         pt-6  /* gives some gap from the top (below navbar) */
//         bg-base-200 
//         transition-all duration-300 
//         ${isCollapsed ? "w-16" : "w-64"}
//         border-2

//       `}
//     >
//       {/* Sidebar content container with its own vertical scrolling and right padding to accommodate the toggle */}
//       <div className="h-full overflow-y-auto pr-8 p-2">
//         {!isCollapsed ? (
//           <div>
//             <h2 className="text-lg font-semibold mb-4">Sidebar</h2>
//             {itinerary ? (
//               <div className="space-y-3">
//                 <button onClick={onDownloadPdf} className="btn btn-outline w-full">
//                   Download PDF
//                 </button>
//                 <button onClick={onEstimateCost} className="btn btn-outline w-full">
//                   Estimate Cost
//                 </button>
//                 <button onClick={onCollaborationClick} className="btn btn-outline w-full">
//                   Collaborate
//                 </button>
//                 {/* You can render additional itinerary details here */}
//               </div>
//             ) : (
//               <p className="text-sm text-gray-500 italic">
//                 Generate your itinerary to access full features.
//               </p>
//             )}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center space-y-4 mt-4">
//             {/* Minimal collapsed view: show only icons */}
//             <button className="btn btn-square btn-ghost">📄</button>
//             <button className="btn btn-square btn-ghost">💰</button>
//             <button className="btn btn-square btn-ghost">🤝</button>
//           </div>
//         )}
//       </div>

//       {/* Toggle button placed on the right border */}
//       <div className="absolute top-1/2 right-0 -translate-y-1/2">
//         <div className="w-8 h-full flex items-center justify-center border-l border-base-300">
//           <button 
//             onClick={() => setIsCollapsed(!isCollapsed)} 
//             className="btn btn-xs btn-ghost"
//           >
//             <span style={{ writingMode: "vertical-rl" }}>
//               {isCollapsed ? "Open" : "Close"}
//             </span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";
// export default function Sidebar({
//   itinerary,
//   onDownloadPdf,
//   onEstimateCost,
//   onCollaborationClick,
//   isCollapsed,
//   onToggle,
// }) {
//   return (
//     <div
//       className={`h-screen border-r border-base-300 bg-base-200 transition-all duration-300 ${
//         isCollapsed ? "w-16" : "w-64"
//       }`}
//     >
//       {/* Sidebar header with collapse toggle */}
//       <div className="flex justify-end p-2">
//         <button onClick={onToggle} className="btn btn-xs btn-ghost">
//           {isCollapsed ? (
//             // If collapsed, show "Open" (or an icon) horizontally
//             <span className="block">Open</span>
//           ) : (
//             // When open, display vertical text for close; using CSS writing-mode for vertical
//             <span className="block" style={{ writingMode: "vertical-rl" }}>Close</span>
//           )}
//         </button>
//       </div>

//       {/* Sidebar content that scrolls independently */}
//       <div className="h-full overflow-y-auto pr-8 p-2">
//         {!isCollapsed ? (
//           <div>
//             <h2 className="text-lg font-semibold mb-4 ">Sidebar</h2>
//             {itinerary ? (
//               <div className="space-y-3">
//                 <button onClick={onDownloadPdf} className="btn btn-outline w-full">
//                   Download PDF
//                 </button>
//                 <button onClick={onEstimateCost} className="btn btn-outline w-full">
//                   Estimate Cost
//                 </button>
//                 <button onClick={onCollaborationClick} className="btn btn-outline w-full">
//                   Collaborate
//                 </button>
//                 {/* Additional itinerary info can be rendered here */}
//               </div>
//             ) : (
//               <p className="text-sm text-gray-500 italic">
//                 Generate your itinerary to access full features.
//               </p>
//             )}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center space-y-4 mt-4">
//             {/* Minimal collapsed view: show only icons */}
//             <button className="btn btn-square btn-ghost">📄</button>
//             <button className="btn btn-square btn-ghost">💰</button>
//             <button className="btn btn-square btn-ghost">🤝</button>
//           </div>
//         )}
//       </div>

//       {/* Toggle button placed on the right border */}
//       <div className="absolute top-1/2 right-0 -translate-y-1/2">
//         <div className="w-8 h-full flex items-center justify-center border-l border-base-300">
//           <button onClick={onToggle} className="btn btn-xs btn-ghost">
//             <span style={{ writingMode: "vertical-rl" }}>
//               {isCollapsed ? "Open" : "Close"}
//             </span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
export default function SideBar({ itinerary, onDownloadPdf, onEstimateCost, onCollaborationClick, isCollapsed, setIsCollapsed }) {
  return (
    <div
      className={`
        relative 
        h-screen 
        pt-6  /* gap below navbar */
        bg-base-200 
        transition-all duration-300 
        ${isCollapsed ? "w-16" : "w-64"}
        border-2
        mt-10
      `}
    >
      {/* Main sidebar content with independent scrolling */}
      <div className="h-full overflow-y-auto pr-8 p-2">
        {!isCollapsed ? (
          <div>
            <h2 className="text-lg font-semibold mb-4">Sidebar</h2>
            {/* {itinerary ? ( */}
              <div className="space-y-3">
                <button onClick={onDownloadPdf} className="btn btn-outline w-full">
                  Download PDF
                </button>
                <button onClick={onEstimateCost} className="btn btn-outline w-full">
                  Estimate Cost
                </button>
                <button onClick={onCollaborationClick} className="btn btn-outline w-full">
                  Collaborate
                </button>
                {/* Additional itinerary details can be rendered here */}
              </div>
            {/* ) : (
              <p className="text-sm text-gray-500 italic">
                Generate your itinerary to access full features.
              </p>
            )} */}
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4 mt-4">
            {/* Minimal collapsed view: show only icons */}
            <button className="btn btn-square btn-ghost">📄</button>
            <button className="btn btn-square btn-ghost">💰</button>
            <button className="btn btn-square btn-ghost">🤝</button>
          </div>
        )}
      </div>

      {/* Toggle button: placed on the right border with vertical text */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2">
        <div className="w-8 h-full flex items-center justify-center border-l border-base-300">
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="btn btn-xs btn-ghost">
            <span style={{ writingMode: "vertical-rl" }}>
              {isCollapsed ? "Open" : "Close"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
