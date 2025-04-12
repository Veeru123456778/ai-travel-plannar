// 'use client';

// import React from "react";

// export default function HowItWorks() {
//   return (
//     <section className="py-16 px-4" data-theme="light">
//       <div className="container mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
//         {/* Horizontal layout for larger screens; vertical for mobile */}
//         <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          
//           {/* Step 1 */}
//           <div className="card w-72 bg-base-200 shadow-xl">
//             <div className="card-body">
//               <h3 className="card-title text-lg">Step 1: Enter Details</h3>
//               <p>
//                 Enter your travel dates, preferences, and destination ideas.
//               </p>
//             </div>
//           </div>
          
//           {/* Arrow for Desktop */}
//           <div className="hidden lg:block">
//             <svg width="100" height="100" viewBox="0 0 100 100" className="text-blue-500">
//               <defs>
//                 <marker 
//                   id="arrowhead" 
//                   markerWidth="10" 
//                   markerHeight="7" 
//                   refX="10" 
//                   refY="3.5" 
//                   orient="auto">
//                   <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
//                 </marker>
//               </defs>
//               {/* A curved arrow from left to right */}
//               <path 
//                 d="M0,50 Q50,0 100,50" 
//                 stroke="currentColor" 
//                 strokeWidth="4" 
//                 fill="none" 
//                 markerEnd="url(#arrowhead)" />
//             </svg>
//           </div>
          
//           {/* Step 2 */}
//           <div className="card w-72 bg-base-200 shadow-xl">
//             <div className="card-body">
//               <h3 className="card-title text-lg">Step 2: AI Analysis</h3>
//               <p>
//                 Our AI processes your details and computes the best travel plan.
//               </p>
//             </div>
//           </div>
          
//           {/* Arrow for Desktop */}
//           <div className="hidden lg:block">
//             <svg width="100" height="100" viewBox="0 0 100 100" className="text-blue-500">
//               <defs>
//                 <marker 
//                   id="arrowhead2" 
//                   markerWidth="10" 
//                   markerHeight="7" 
//                   refX="10" 
//                   refY="3.5" 
//                   orient="auto">
//                   <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
//                 </marker>
//               </defs>
//               <path 
//                 d="M0,50 Q50,100 100,50" 
//                 stroke="currentColor" 
//                 strokeWidth="4" 
//                 fill="none" 
//                 markerEnd="url(#arrowhead2)" />
//             </svg>
//           </div>
          
//           {/* Step 3 */}
//           <div className="card w-72 bg-base-200 shadow-xl">
//             <div className="card-body">
//               <h3 className="card-title text-lg">Step 3: Custom Itinerary</h3>
//               <p>
//                 Get a personalized itinerary with all your travel recommendations.
//               </p>
//             </div>
//           </div>
//         </div>
        
//         {/* For Mobile: Display vertical arrow icons */}
//         <div className="flex flex-col lg:hidden items-center gap-4 mt-8">
//           {/* Mobile Step 1 */}
//           <div className="card w-full max-w-sm bg-base-200 shadow-xl">
//             <div className="card-body">
//               <h3 className="card-title text-lg">Step 1: Enter Details</h3>
//               <p>Enter your travel dates, preferences, and destination ideas.</p>
//             </div>
//           </div>
          
//           <svg width="50" height="50" viewBox="0 0 24 24" className="text-blue-500">
//             <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
//           </svg>
          
//           {/* Mobile Step 2 */}
//           <div className="card w-full max-w-sm bg-base-200 shadow-xl">
//             <div className="card-body">
//               <h3 className="card-title text-lg">Step 2: AI Analysis</h3>
//               <p>Our AI processes your details and computes the best travel plan.</p>
//             </div>
//           </div>
          
//           <svg width="50" height="50" viewBox="0 0 24 24" className="text-blue-500">
//             <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
//           </svg>
          
//           {/* Mobile Step 3 */}
//           <div className="card w-full max-w-sm bg-base-200 shadow-xl">
//             <div className="card-body">
//               <h3 className="card-title text-lg">Step 3: Custom Itinerary</h3>
//               <p>Get a personalized itinerary with all your travel recommendations.</p>
//             </div>
//           </div>
//         </div>
        
//       </div>
//     </section>
//   );
// }


'use client';

import React from "react";

export default function HowItWorks() {
  return (
    <section id="howitworks" className="py-16 px-4" data-theme="light">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

        {/* Desktop Layout: Horizontal steps with curved, dotted arrows */}
        <div className="hidden sm:flex items-center justify-center gap-8">
          {/* Step 1 */}
          <div className="card w-72 bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">Step 1: Enter Details</h3>
              <p>Enter your travel dates, preferences, and destination ideas.</p>
            </div>
          </div>

          {/* Curved Arrow */}
          <div>
            <svg width="120" height="120" viewBox="0 0 120 120" className="text-blue-500">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="10"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                </marker>
              </defs>
              {/* Curved, dashed path: adjust Q curve control point as needed */}
              <path 
                d="M10,60 Q60,10 110,60" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeDasharray="4" 
                fill="none" 
                markerEnd="url(#arrowhead)"
              />
            </svg>
          </div>

          {/* Step 2 */}
          <div className="card w-72 bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">Step 2: AI Analysis</h3>
              <p>Our AI processes your details and computes the best travel plan.</p>
            </div>
          </div>

          {/* Curved Arrow going downward */}
          <div>
            <svg width="120" height="120" viewBox="0 0 120 120" className="text-blue-500">
              <defs>
                <marker
                  id="arrowhead2"
                  markerWidth="10"
                  markerHeight="7"
                  refX="10"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                </marker>
              </defs>
              {/* Curved path downward */}
              <path 
                d="M10,60 Q60,110 110,60" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeDasharray="4" 
                fill="none" 
                markerEnd="url(#arrowhead2)"
              />
            </svg>
          </div>

          {/* Step 3 */}
          <div className="card w-72 bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">Step 3: Custom Itinerary</h3>
              <p>Get a personalized itinerary with all your travel recommendations.</p>
            </div>
          </div>
        </div>

        {/* Mobile Layout: Vertical stack with vertical dashed arrows */}
        <div className="flex flex-col sm:hidden items-center gap-6 mt-8">
          {/* Step 1 */}
          <div className="card w-full max-w-sm bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">Step 1: Enter Details</h3>
              <p>Enter your travel dates, preferences, and destination ideas.</p>
            </div>
          </div>

          {/* Vertical Arrow */}
          <svg width="50" height="50" viewBox="0 0 24 24" className="text-blue-500">
            <defs>
              <marker
                id="marker-mobile"
                markerWidth="6"
                markerHeight="6"
                refX="3"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 6 3, 0 6" fill="currentColor" />
              </marker>
            </defs>
            <line
              x1="12"
              y1="0"
              x2="12"
              y2="24"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4"
              markerEnd="url(#marker-mobile)"
            />
          </svg>

          {/* Step 2 */}
          <div className="card w-full max-w-sm bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">Step 2: AI Analysis</h3>
              <p>Our AI processes your details and computes the best travel plan.</p>
            </div>
          </div>

          <svg width="50" height="50" viewBox="0 0 24 24" className="text-blue-500">
            <defs>
              <marker
                id="marker-mobile2"
                markerWidth="6"
                markerHeight="6"
                refX="3"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 6 3, 0 6" fill="currentColor" />
              </marker>
            </defs>
            <line
              x1="12"
              y1="0"
              x2="12"
              y2="24"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4"
              markerEnd="url(#marker-mobile2)"
            />
          </svg>

          {/* Step 3 */}
          <div className="card w-full max-w-sm bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">Step 3: Custom Itinerary</h3>
              <p>Get a personalized itinerary with all your travel recommendations.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
