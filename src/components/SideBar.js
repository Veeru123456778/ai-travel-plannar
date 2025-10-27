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
