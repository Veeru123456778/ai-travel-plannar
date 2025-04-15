// "use client";
// import Navbar from "./Navbar";
// import Sidebar from "./SideBar";

// export default function Layout({ children, itinerary, onDownloadPdf, onEstimateCost, onCollaborationClick }) {
//   return (
//     <div className="min-h-screen bg-base-200 text-base-content flex flex-col">
//       {/* Navbar is sticky via its own internal styles */}
//       <Navbar />

//       {/* Main Container: Sidebar and Content */}
//       <div className="flex flex-1">
//         {/* Sidebar will only be visible on large screens */}
//         <div className="hidden lg:block">
//           <Sidebar
//             itinerary={itinerary}
//             onDownloadPdf={onDownloadPdf}
//             onEstimateCost={onEstimateCost}
//             onCollaborationClick={onCollaborationClick}
//           />
//         </div>

//         {/* Main Content Area */}
//         <main className="flex-1 overflow-y-auto p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }


// // components/Layout.js
// "use client";
// import Navbar from "./Navbar";
// import Sidebar from "./SideBar";

// export default function Layout({ children, itinerary, onDownloadPdf, onEstimateCost, onCollaborationClick }) {
//   return (
//     <div className="min-h-screen bg-base-200 text-base-content flex flex-col">
//       <Navbar />

//       <div className="flex flex-1">
//         <div className="fixed hidden lg:block">
//           <Sidebar
//             itinerary={itinerary}
//             onDownloadPdf={onDownloadPdf}
//             onEstimateCost={onEstimateCost}
//             onCollaborationClick={onCollaborationClick}
//           />
//         </div>

//         {/* Main content area which scrolls independently */}
//         <main className="flex-1 overflow-y-auto p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// // }

// "use client";
// import { useState } from "react";
// import Navbar from "./Navbar";
// import Sidebar from "./SideBar";

// export default function Layout({
//   children,
//   itinerary,
//   onDownloadPdf,
//   onEstimateCost,
//   onCollaborationClick,
// }) {
//   // Moved collapse state here so that main content can adjust margin accordingly
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

//   return (
//     <div className="min-h-screen bg-base-200 text-base-content flex flex-col">
//       <Navbar />

//       <div className="flex flex-1">
//         {/* Fixed sidebar on large screens */}
//         <div className="fixed top-0 left-0 h-full hidden lg:block">
//           <Sidebar
//             itinerary={itinerary}
//             onDownloadPdf={onDownloadPdf}
//             onEstimateCost={onEstimateCost}
//             onCollaborationClick={onCollaborationClick}
//             isCollapsed={isSidebarCollapsed}
//             onToggle={() => setIsSidebarCollapsed(prev => !prev)}
//           />
//         </div>

//         {/* Main content area adjusts left margin based on sidebar state */}
//         <main
//           className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${
//             isSidebarCollapsed ? "ml-16" : "ml-64"
//           }`}
//         >
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useState, useEffect } from "react";
// import Navbar from "./Navbar";
// import Sidebar from "./SideBar";

// export default function Layout({ children, itinerary, onDownloadPdf, onEstimateCost, onCollaborationClick }) {
//   // Manage collapsed state here
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

//   // On small screens (below 768px), collapse the sidebar by default.
//   useEffect(() => {
//     function handleResize() {
//       if (window.innerWidth < 768) {
//         setIsSidebarCollapsed(true);
//       } else {
//         setIsSidebarCollapsed(false);
//       }
//     }
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Determine left margin for main content based on sidebar width
//   const mainMarginClass = isSidebarCollapsed ? "ml-16" : "ml-64";

//   return (
//     <div className="min-h-screen bg-base-200 text-base-content flex flex-col">
//       <Navbar />

//       <div className="flex flex-1">
//         {/* Fixed Sidebar */}
//         <div className="fixed top-0 left-0 h-full">
//           <Sidebar
//             isCollapsed={isSidebarCollapsed}
//             setIsCollapsed={setIsSidebarCollapsed}
//             itinerary={itinerary}
//             onDownloadPdf={onDownloadPdf}
//             onEstimateCost={onEstimateCost}
//             onCollaborationClick={onCollaborationClick}
//           />
//         </div>

//         {/* Main content area; add left margin equal to sidebar's open width */}
//         <main className={`flex-1 overflow-y-auto p-6 ${mainMarginClass}`}>
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./SideBar";

export default function Layout({ children, itinerary, onDownloadPdf, onEstimateCost, onCollaborationClick }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Listen to window resize events to update mobile state.
  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth < 768; // below md breakpoint
      setIsMobile(mobile);
      if (mobile) {
        // On mobile, force the sidebar to be collapsed initially.
        setIsSidebarCollapsed(true);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // On desktops, shift the main content to the right by the width of the sidebar.
  // When expanded: width ~ w-64 (16rem), when collapsed: w-16 (4rem).
  const mainMarginClass = !isMobile ? (isSidebarCollapsed ? "ml-16" : "ml-64") : "";

  // For the sidebar container:
  // • On desktops, position it fixed with full height.
  // • On mobile, position it fixed as overlay with a high z-index.
  const sidebarContainerClass = isMobile
    ? "fixed top-0 left-0 z-50"
    : "fixed top-0 left-0 h-full";

  return (
    <div className="min-h-screen bg-base-200 text-base-content flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar container */}
        <div className={sidebarContainerClass}>
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            itinerary={itinerary}
            onDownloadPdf={onDownloadPdf}
            onEstimateCost={onEstimateCost}
            onCollaborationClick={onCollaborationClick}
          />
        </div>

        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto p-6 ${mainMarginClass}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
