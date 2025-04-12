import { useState } from "react";

export default function AccommodationPreferences({accommodation, setAccommodation}) {
//   const [accommodation, setAccommodation] = useState([]);

  const accommodations = ["Hotel", "Hostel", "Airbnb", "Resort", "No Stay Needed"];

   const handleAddOption = (option)=>{
       setAccommodation((prev)=>
        prev.includes(option)?prev.filter((acc)=>acc!==option):[...prev,option]);
   };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Accommodation Type Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Select Accommodation Type 🏨</h2>
        <div className="flex gap-2">
          {accommodations.map((option) => (
            <button
              key={option}
              className={`px-4 py-2 rounded border ${
                accommodation === option ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
              }`}
              onClick={()=>handleAddOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
