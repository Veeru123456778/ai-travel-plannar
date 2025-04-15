// // components/PDFExport.jsx
// "use client";
// import { useRef } from "react";
// import html2pdf from "html2pdf.js";

// export default function PDFExport({ children }) {
//   const printRef = useRef();

//   const handleDownload = () => {
//     const element = printRef.current;
//     // Configuration for html2pdf
//     const options = {
//       margin:       0.5,
//       filename:     'itinerary.pdf',
//       image:        { type: 'jpeg', quality: 0.98 },
//       html2canvas:  { scale: 2 },
//       jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
//     };

//     html2pdf().set(options).from(element).save();
//   };

//   return (
//     <div>
//       {/* You wrap your printable content inside this container */}
//       <div ref={printRef} className="pdf-content">
//         {children}
//       </div>
//       {/* This button starts the PDF download but it can be styled or placed outside the printable area */}
//       <button onClick={handleDownload} className="btn btn-primary no-print">
//         Download PDF
//       </button>
//     </div>
//   );
// }

"use client";

import { useRef } from "react";
import html2pdf from "html2pdf.js";

export default function PDFExport({ itinerary }) {
  const pdfRef = useRef();

  const handleDownload = () => {
    const element = pdfRef.current;
    if (!element) return;

    const opt = {
      margin:       0.5,
      filename:     'trip-itinerary.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="my-4">
      <button onClick={handleDownload} className="btn btn-primary mb-4">Download PDF</button>

      {/* Hidden or visible content to export */}
      <div ref={pdfRef} className="bg-white p-4 rounded shadow max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Trip Overview</h2>
        <p className="mb-4">{itinerary?.placeDescription}</p>

        {itinerary?.dayWisePlan?.map((day) => (
          <div key={day.day} className="mb-4 border-t pt-4">
            <h3 className="text-lg font-semibold">Day {day.day}</h3>
            <ul className="list-disc pl-5 mt-2">
              {day.activities.map((act, index) => (
                <li key={index}>
                  <strong>{act.time}:</strong> {act.description}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
