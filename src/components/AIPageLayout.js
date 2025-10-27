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
