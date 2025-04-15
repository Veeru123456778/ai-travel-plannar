// "use client";
// import { useState } from "react";
// import Navbar from "@/components/Navbar";
// import CityDropdown from "@/components/CityDropdown";
// import citiesData from "@/lib/cities.json";
// import DatePicker from "@/components/DatePicker";
// import BudgetSelector from "@/components/BudgetSelector";
// import TravelModeSelector from "@/components/TravelModeSelector";
// import FoodPreferences from "@/components/FoodPreference";
// import AccommodationPreferences from "@/components/AccomodationSelector";
// import ActivitiesSelector from "@/components/ActivitiesSelector";
// import HotelsPage from "@/components/HotelList";
// import WeatherInfo from "@/components/WeatherComponent";
// import TopPlacesList from "@/components/TopPlacesList";
// import RestaurantsList from "@/components/RestaurantsList";
// import GoogleMapComponent from "@/components/GoogleMap";
// import PDFExport from "@/components/PDFExport";
// import Sidebar from "@/components/SideBar";


// // Component for editing a single day (list of activities)
// function DayEditor({ dayData, onUpdateDay, onDeleteActivity, onAddActivity }) {
//   // Updates a field for a given activity (time or description)
//   const updateActivity = (activityIndex, field, value) => {
//     const updatedActivities = dayData.activities.map((act, idx) =>
//       idx === activityIndex ? { ...act, [field]: value } : act
//     );
//     onUpdateDay({ ...dayData, activities: updatedActivities });
//   };

//   return (
//     <div className="card bg-base-200 p-4 rounded-lg shadow-sm">
//       <div className="flex justify-between items-center">
//         <h3 className="text-xl font-semibold">Day {dayData.day}</h3>
//         <button
//           onClick={() => onAddActivity(dayData.day)}
//           className="btn btn-sm btn-outline"
//         >
//           Add Activity
//         </button>
//       </div>
//       {dayData.activities.map((activity, index) => (
//         <div
//           key={index}
//           className="mt-4 p-3 border rounded bg-base-300 flex flex-col gap-2"
//         >
//           <div className="flex flex-col sm:flex-row gap-2">
//             <label className="w-full sm:w-1/4 font-medium">Time:</label>
//             <input
//               type="text"
//               value={activity.time}
//               onChange={(e) =>
//                 updateActivity(index, "time", e.target.value)
//               }
//               placeholder="e.g., 8:30 AM"
//               className="input input-bordered w-full"
//             />
//           </div>
//           <div className="flex flex-col gap-2">

//           <div className="flex justify-between">
//             <label className="font-medium">Activity Description:</label>
//             <button
//               onClick={() => onDeleteActivity(dayData.day, index)}
//               className="btn btn-error btn-xs"
//             >
//               Remove Activity
//             </button>
//           </div>

//             <textarea
//               value={activity.description}
//               onChange={(e) =>
//                 updateActivity(index, "description", e.target.value)
//               }
//               placeholder="Describe the activity..."
//               className="textarea textarea-bordered w-full"
//             />
//           </div>
          
//         </div>
//       ))}
//     </div>
//   );
// }

// // Component for editing the whole itinerary
// function ItineraryEditor({ itinerary, setItinerary }) {
//   // Update a whole day's data
//   const updateDay = (updatedDay) => {
//     const updatedDays = itinerary.dayWisePlan.map((day) =>
//       day.day === updatedDay.day ? updatedDay : day
//     );
//     setItinerary({ ...itinerary, dayWisePlan: updatedDays });
//   };

//   // Add an activity to a specific day
//   const addActivity = (dayNum) => {
//     const updatedDays = itinerary.dayWisePlan.map((day) => {
//       if (day.day === dayNum) {
//         return {
//           ...day,
//           activities: [
//             ...day.activities,
//             { time: "", description: "" },
//           ],
//         };
//       }
//       return day;
//     });
//     setItinerary({ ...itinerary, dayWisePlan: updatedDays });
//   };

//   // Remove an activity from a day
//   const deleteActivity = (dayNum, activityIndex) => {
//     const updatedDays = itinerary.dayWisePlan.map((day) => {
//       if (day.day === dayNum) {
//         const updatedActivities = day.activities.filter(
//           (_, idx) => idx !== activityIndex
//         );
//         return { ...day, activities: updatedActivities };
//       }
//       return day;
//     });
//     setItinerary({ ...itinerary, dayWisePlan: updatedDays });
//   };

//   // Add a new day to the itinerary
//   const addDay = () => {
//     const newDay = {
//       day: itinerary.dayWisePlan.length + 1,
//       activities: [
//         { time: "", description: "" },
//         { time: "", description: "" },
//         { time: "", description: "" },
//       ],
//     };
//     setItinerary({
//       ...itinerary,
//       dayWisePlan: [...itinerary.dayWisePlan, newDay],
//     });
//   };

//   // Remove the last day from the itinerary (if more than one)
//   const removeDay = () => {
//     if (itinerary.dayWisePlan.length > 1) {
//       const updatedDays = itinerary.dayWisePlan.slice(0, -1);
//       setItinerary({ ...itinerary, dayWisePlan: updatedDays });
//     }
//   };

//   // Allow editing of the trip description (placeDescription)
//   const updateDescription = (value) => {
//     setItinerary({ ...itinerary, placeDescription: value });
//   };

//   return (
//     <div className="card bg-base-100 p-6 rounded-lg shadow-md space-y-6">
//       <div>
//         <h2 className="text-3xl font-bold">Trip Overview</h2>
//         <textarea
//           className="textarea textarea-bordered w-full mt-2"
//           value={itinerary.placeDescription}
//           onChange={(e) => updateDescription(e.target.value)}
//           placeholder="Edit destination description..."
//         />
//       </div>
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold">Itinerary</h2>
//         <div className="flex gap-2">
//           <button onClick={addDay} className="btn btn-outline btn-sm">
//             Add Day
//           </button>
//           <button onClick={removeDay} className="btn btn-outline btn-sm">
//             Remove Day
//           </button>
//         </div>
//       </div>
//       <div className="grid gap-6 mt-4">
//         {itinerary.dayWisePlan.map((day) => (
//           <DayEditor
//             key={day.day}
//             dayData={day}
//             onUpdateDay={updateDay}
//             onAddActivity={addActivity}
//             onDeleteActivity={deleteActivity}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }


// export default function AiTripGeneration() {
//   // Form state
//   const [source, setSource] = useState(null);
//   const [destination, setDestination] = useState(null);
//   const [dates, setDates] = useState({ startDate: "", endDate: "" });
//   const [budget, setBudget] = useState(null);
//   const [numOfTravellers, setNumOfTravellers] = useState(1);
//   const [selectedModes, setSelectedModes] = useState([]);
//   const [accommodation, setAccommodation] = useState([]);
//   const [foodPreference, setFoodPreference] = useState(null);
//   const [selectedActivities, setSelectedActivities] = useState([]);
//   const [additionalRequirement, setAdditionalRequirement] = useState("");

//   // Generated itinerary state and loading/error flags
//   const [itinerary, setItinerary] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Generate itinerary handler (calls backend API with robust structured prompt)
//   const handleGenerateTrip = async () => {
//     if (numOfTravellers <= 0) {
//       alert("Number of travellers must be greater than 0");
//       return;
//     }
//     if (!source?.name || !destination?.name || !dates.startDate || !dates.endDate || !budget) {
//       alert("Please fill all required fields.");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     const prompt = `
// You are a highly skilled AI travel planner. Based on the user-provided input, generate a high-quality, reliable travel itinerary in **valid JSON format** following the structure below.

// ⚠️ RULES:
// - Only return the JSON — no markdown, no explanation, no extra text.
// - Follow the exact format and keys provided.
// - Ensure no repeated or generic activities (avoid "visit local market" or "explore city").
// - Include at least 3 unique, high-value activities per day with proper timing.
// - All suggestion fields must be detailed objects.
// - Prioritize realism and local richness in recommendations.
// - No activity should be repeated; each day’s suggestions must be unique.

// 🎯 REQUIRED OUTPUT FORMAT:
// {
//   "placeDescription": string,
//   "dayWisePlan": [
//     {
//       "day": number,
//       "activities": [
//         {
//           "time": string,
//           "description": string
//         }
//       ]
//     }
//   ],
//   "estimatedCost": {
//     "travel": string,
//     "accommodation": string,
//     "food": string,
//     "activities": string,
//     "total": string
//   },
//   "travelSuggestions": {
//     "toDestination": string,
//     "localTravel": string
//   },
//   "accommodationOptions": {
//     "areaSuggestions": string,
//     "hotelSuggestions": [string]
//   },
//   "foodRecommendations": {
//     "localDishes": [string],
//     "restaurantSuggestions": [string]
//   }
// }

// 📌 TRIP DETAILS:
// - Source City: ${source.name}
// - Destination City: ${destination.name}
// - Start Date: ${dates.startDate}
// - End Date: ${dates.endDate}
// - Budget: ${budget}
// - Number of Travellers: ${numOfTravellers}
// - Preferred Travel Modes: ${selectedModes.join(", ") || "Not Provided"}
// - Accommodation Preferences: ${accommodation.join(", ") || "Not Provided"}
// - Food Preference: ${foodPreference || "Not Provided"}
// - Selected Activities: ${selectedActivities.join(", ") || "Not Provided"}
// - Additional Requirements: ${additionalRequirement || "None"}

// Only output a valid JSON object matching the structure above.
//     `;

//     try {
//       const response = await fetch("/api/generateItinerary", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt }),
//       });
//       if (!response.ok)
//         throw new Error("Failed to generate itinerary.");
//       const data = await response.json();
//       const cleaned = data.itinerary.replace(/```json|```/g, "").trim();
//       const parsed = JSON.parse(cleaned);
//       // Ensure there is an editable dayWisePlan
//       if (!parsed.dayWisePlan || parsed.dayWisePlan.length === 0) {
//         parsed.dayWisePlan = [
//           {
//             day: 1,
//             activities: [
//               { time: "", description: "" },
//               { time: "", description: "" },
//               { time: "", description: "" },
//             ],
//           },
//         ];
//       }
//       setItinerary(parsed);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-base-200 text-base-content">
//       <Navbar />
//       <div className="container mx-auto p-6 space-y-8">
//         <h1 className="text-4xl font-bold text-center">AI Trip Planner</h1>
//         {/* Trip Details Input Form */}
//         <div className="card bg-base-100 shadow-md p-6 rounded-lg">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block font-semibold">Source City</label>
//               <CityDropdown cities={citiesData} onSelect={setSource} />
//             </div>
//             <div>
//               <label className="block font-semibold">Destination City</label>
//               <CityDropdown cities={citiesData} onSelect={setDestination} />
//             </div>
//           </div>
//           <div className="mt-4">
//             <DatePicker onDateSelect={setDates} />
//           </div>
//           <div className="mt-4">
//             <BudgetSelector onSelect={setBudget} />
//           </div>
//           <div className="mt-4">
//             <label className="block font-semibold">Number of Travellers</label>
//             <input
//               type="number"
//               min="1"
//               className="input input-bordered w-full"
//               value={numOfTravellers}
//               onChange={(e) => setNumOfTravellers(parseInt(e.target.value))}
//             />
//           </div>
//           <div className="mt-4">
//             <TravelModeSelector
//               selectedModes={selectedModes}
//               setSelectedModes={setSelectedModes}
//             />
//           </div>
//           <div className="mt-4">
//             <FoodPreferences
//               foodPreference={foodPreference}
//               setFoodPreference={setFoodPreference}
//             />
//           </div>
//           <div className="mt-4">
//             <AccommodationPreferences
//               accommodation={accommodation}
//               setAccommodation={setAccommodation}
//             />
//           </div>
//           <div className="mt-4">
//             <ActivitiesSelector
//               selectedActivities={selectedActivities}
//               setSelectedActivities={setSelectedActivities}
//             />
//           </div>
//           <div className="mt-4">
//             <label className="block font-semibold">Special Requirements</label>
//             <textarea
//               value={additionalRequirement}
//               onChange={(e) => setAdditionalRequirement(e.target.value)}
//               placeholder="Enter any special requests..."
//               className="textarea textarea-bordered w-full"
//             />
//           </div>
//           <div className="mt-6">
//             <button
//               onClick={handleGenerateTrip}
//               disabled={loading}
//               className={`btn btn-primary w-full ${loading && "btn-disabled"}`}
//             >
//               {loading ? "Generating..." : "Generate Trip"}
//             </button>
//           </div>
//           {error && <p className="mt-4 text-error">{error}</p>}
//         </div>

//         {/* Render Generated & Editable Itinerary */}
//         {itinerary && (
//           <>

//             <ItineraryEditor itinerary={itinerary} setItinerary={setItinerary} />

//             {/* Additional Info Sections */}
//             <div className="space-y-6">
//               <div className="card bg-base-100 shadow-md p-4 rounded-lg">
//                 {/* <h3 className="text-2xl font-bold mb-4">Weather Info</h3> */}
//                 <WeatherInfo city={destination?.name} />
//               </div>
//               {/* <div className="card bg-base-100 shadow-md p-4 rounded-lg">
//                 <h3 className="text-2xl font-bold mb-4">Map</h3>
//                 <GoogleMapComponent city={destination?.name} />
//               </div> */}
//               <div className="card bg-base-100 shadow-md p-4 rounded-lg">
//                 <h3 className="text-2xl font-bold mb-4">Hotels</h3>
//                 <HotelsPage
//                   city={destination?.name}
//                   arrival_date={dates.startDate}
//                   departure_date={dates.endDate}
//                 />
//               </div>
//               <div className="card bg-base-100 shadow-md p-4 rounded-lg">
//                 <h3 className="text-2xl font-bold mb-4">Restaurants</h3>
//                 <RestaurantsList city={destination?.name} />
//               </div>
//               <div className="card bg-base-100 shadow-md p-4 rounded-lg">
//                 <h3 className="text-2xl font-bold mb-4">Top Places</h3>
//                 <TopPlacesList city={destination?.name} />
//               </div>
//               <div className="card bg-base-100 shadow-md p-4 rounded-lg">
//                 <h3 className="text-2xl font-bold mb-4">Estimated Cost</h3>
//                 <div className="flex justify-between items-center">
//                   <span className="font-medium text-lg">Total Cost:</span>
//                   <span className="text-2xl font-bold">
//                     ₹ {itinerary.estimatedCost.total}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useState } from "react";
// import Navbar from "@/components/Navbar";
// import CityDropdown from "@/components/CityDropdown";
// import citiesData from "@/lib/cities.json";
// import DatePicker from "@/components/DatePicker";
// import BudgetSelector from "@/components/BudgetSelector";
// import TravelModeSelector from "@/components/TravelModeSelector";
// import FoodPreferences from "@/components/FoodPreference";
// import AccommodationPreferences from "@/components/AccomodationSelector";
// import ActivitiesSelector from "@/components/ActivitiesSelector";
// import HotelsPage from "@/components/HotelList";
// import WeatherInfo from "@/components/WeatherComponent";
// import TopPlacesList from "@/components/TopPlacesList";
// import RestaurantsList from "@/components/RestaurantsList";
// import GoogleMapComponent from "@/components/GoogleMap";
// // import PDFExport from "@/components/PDFExport";
// import Sidebar from "@/components/SideBar";

// // Component for editing a single day (list of activities)
// function DayEditor({ dayData, onUpdateDay, onDeleteActivity, onAddActivity }) {
//   // Updates a field for a given activity (time or description)
//   const updateActivity = (activityIndex, field, value) => {
//     const updatedActivities = dayData.activities.map((act, idx) =>
//       idx === activityIndex ? { ...act, [field]: value } : act
//     );
//     onUpdateDay({ ...dayData, activities: updatedActivities });
//   };

//   return (
//     <div className="card bg-base-200 p-4 rounded-lg shadow-sm">
//       <div className="flex justify-between items-center">
//         <h3 className="text-xl font-semibold">Day {dayData.day}</h3>
//         <button
//           onClick={() => onAddActivity(dayData.day)}
//           className="btn btn-sm btn-outline"
//         >
//           Add Activity
//         </button>
//       </div>
//       {dayData.activities.map((activity, index) => (
//         <div
//           key={index}
//           className="mt-4 p-3 border rounded bg-base-300 flex flex-col gap-2"
//         >
//           <div className="flex flex-col sm:flex-row gap-2">
//             <label className="w-full sm:w-1/4 font-medium">Time:</label>
//             <input
//               type="text"
//               value={activity.time}
//               onChange={(e) =>
//                 updateActivity(index, "time", e.target.value)
//               }
//               placeholder="e.g., 8:30 AM"
//               className="input input-bordered w-full"
//             />
//           </div>
//           <div className="flex flex-col gap-2">
//             <div className="flex justify-between">
//               <label className="font-medium">Activity Description:</label>
//               <button
//                 onClick={() => onDeleteActivity(dayData.day, index)}
//                 className="btn btn-error btn-xs"
//               >
//                 Remove Activity
//               </button>
//             </div>
//             <textarea
//               value={activity.description}
//               onChange={(e) =>
//                 updateActivity(index, "description", e.target.value)
//               }
//               placeholder="Describe the activity..."
//               className="textarea textarea-bordered w-full"
//             />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// // Component for editing the whole itinerary
// function ItineraryEditor({ itinerary, setItinerary }) {
//   // Update a whole day's data
//   const updateDay = (updatedDay) => {
//     const updatedDays = itinerary.dayWisePlan.map((day) =>
//       day.day === updatedDay.day ? updatedDay : day
//     );
//     setItinerary({ ...itinerary, dayWisePlan: updatedDays });
//   };

//   // Add an activity to a specific day
//   const addActivity = (dayNum) => {
//     const updatedDays = itinerary.dayWisePlan.map((day) => {
//       if (day.day === dayNum) {
//         return {
//           ...day,
//           activities: [
//             ...day.activities,
//             { time: "", description: "" },
//           ],
//         };
//       }
//       return day;
//     });
//     setItinerary({ ...itinerary, dayWisePlan: updatedDays });
//   };

//   // Remove an activity from a day
//   const deleteActivity = (dayNum, activityIndex) => {
//     const updatedDays = itinerary.dayWisePlan.map((day) => {
//       if (day.day === dayNum) {
//         const updatedActivities = day.activities.filter(
//           (_, idx) => idx !== activityIndex
//         );
//         return { ...day, activities: updatedActivities };
//       }
//       return day;
//     });
//     setItinerary({ ...itinerary, dayWisePlan: updatedDays });
//   };

//   // Add a new day to the itinerary
//   const addDay = () => {
//     const newDay = {
//       day: itinerary.dayWisePlan.length + 1,
//       activities: [
//         { time: "", description: "" },
//         { time: "", description: "" },
//         { time: "", description: "" },
//       ],
//     };
//     setItinerary({
//       ...itinerary,
//       dayWisePlan: [...itinerary.dayWisePlan, newDay],
//     });
//   };

//   // Remove the last day from the itinerary (if more than one)
//   const removeDay = () => {
//     if (itinerary.dayWisePlan.length > 1) {
//       const updatedDays = itinerary.dayWisePlan.slice(0, -1);
//       setItinerary({ ...itinerary, dayWisePlan: updatedDays });
//     }
//   };

//   // Allow editing of the trip description (placeDescription)
//   const updateDescription = (value) => {
//     setItinerary({ ...itinerary, placeDescription: value });
//   };

//   return (
//     <div className="card bg-base-100 p-6 rounded-lg shadow-md space-y-6" id="description">
//       <div>
//         <h2 className="text-3xl font-bold">Trip Overview</h2>
//         <textarea
//           className="textarea textarea-bordered w-full mt-2"
//           value={itinerary.placeDescription}
//           onChange={(e) => updateDescription(e.target.value)}
//           placeholder="Edit destination description..."
//         />
//       </div>
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold">Itinerary</h2>
//         <div className="flex gap-2">
//           <button onClick={addDay} className="btn btn-outline btn-sm">
//             Add Day
//           </button>
//           <button onClick={removeDay} className="btn btn-outline btn-sm">
//             Remove Day
//           </button>
//         </div>
//       </div>
//       <div className="grid gap-6 mt-4">
//         {itinerary.dayWisePlan.map((day) => (
//           <DayEditor
//             key={day.day}
//             dayData={day}
//             onUpdateDay={updateDay}
//             onAddActivity={addActivity}
//             onDeleteActivity={deleteActivity}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function AiTripGeneration() {
//   // Form state
//   const [source, setSource] = useState(null);
//   const [destination, setDestination] = useState(null);
//   const [dates, setDates] = useState({ startDate: "", endDate: "" });
//   const [budget, setBudget] = useState(null);
//   const [numOfTravellers, setNumOfTravellers] = useState(1);
//   const [selectedModes, setSelectedModes] = useState([]);
//   const [accommodation, setAccommodation] = useState([]);
//   const [foodPreference, setFoodPreference] = useState(null);
//   const [selectedActivities, setSelectedActivities] = useState([]);
//   const [additionalRequirement, setAdditionalRequirement] = useState("");

//   // Generated itinerary state and loading/error flags
//   const [itinerary, setItinerary] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Generate itinerary handler (calls backend API with robust structured prompt)
//   const handleGenerateTrip = async () => {
//     if (numOfTravellers <= 0) {
//       alert("Number of travellers must be greater than 0");
//       return;
//     }
//     if (!source?.name || !destination?.name || !dates.startDate || !dates.endDate || !budget) {
//       alert("Please fill all required fields.");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     const prompt = `
// You are a highly skilled AI travel planner. Based on the user-provided input, generate a high-quality, reliable travel itinerary in **valid JSON format** following the structure below.

// ⚠️ RULES:
// - Only return the JSON — no markdown, no explanation, no extra text.
// - Follow the exact format and keys provided.
// - Ensure no repeated or generic activities (avoid "visit local market" or "explore city").
// - Include at least 3 unique, high-value activities per day with proper timing.
// - All suggestion fields must be detailed objects.
// - Prioritize realism and local richness in recommendations.
// - No activity should be repeated; each day’s suggestions must be unique.

// 🎯 REQUIRED OUTPUT FORMAT:
// {
//   "placeDescription": string,
//   "dayWisePlan": [
//     {
//       "day": number,
//       "activities": [
//         {
//           "time": string,
//           "description": string
//         }
//       ]
//     }
//   ],
//   "estimatedCost": {
//     "travel": string,
//     "accommodation": string,
//     "food": string,
//     "activities": string,
//     "total": string
//   },
//   "travelSuggestions": {
//     "toDestination": string,
//     "localTravel": string
//   },
//   "accommodationOptions": {
//     "areaSuggestions": string,
//     "hotelSuggestions": [string]
//   },
//   "foodRecommendations": {
//     "localDishes": [string],
//     "restaurantSuggestions": [string]
//   }
// }

// 📌 TRIP DETAILS:
// - Source City: ${source.name}
// - Destination City: ${destination.name}
// - Start Date: ${dates.startDate}
// - End Date: ${dates.endDate}
// - Budget: ${budget}
// - Number of Travellers: ${numOfTravellers}
// - Preferred Travel Modes: ${selectedModes.join(", ") || "Not Provided"}
// - Accommodation Preferences: ${accommodation.join(", ") || "Not Provided"}
// - Food Preference: ${foodPreference || "Not Provided"}
// - Selected Activities: ${selectedActivities.join(", ") || "Not Provided"}
// - Additional Requirements: ${additionalRequirement || "None"}

// Only output a valid JSON object matching the structure above.
//     `;

//     try {
//       const response = await fetch("/api/generateItinerary", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt }),
//       });
//       if (!response.ok)
//         throw new Error("Failed to generate itinerary.");
//       const data = await response.json();
//       const cleaned = data.itinerary.replace(/```json|```/g, "").trim();
//       const parsed = JSON.parse(cleaned);
//       // Ensure there is an editable dayWisePlan
//       if (!parsed.dayWisePlan || parsed.dayWisePlan.length === 0) {
//         parsed.dayWisePlan = [
//           {
//             day: 1,
//             activities: [
//               { time: "", description: "" },
//               { time: "", description: "" },
//               { time: "", description: "" },
//             ],
//           },
//         ];
//       }
//       setItinerary(parsed);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handlers for sidebar actions
//   const handleDownloadPdf = () => {
//     // Example: Trigger PDFExport functionality
//     console.log("Download PDF triggered");
//   };

//   const handleEstimateCost = () => {
//     document.getElementById("estimate")?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleCollaborationClick = () => {
//     console.log("Collaboration clicked");
//   };

//   return (
//     <div className="min-h-screen bg-base-200 text-base-content">
//       {/* Full width Navbar */}
//       <Navbar />

//       {/* Main Layout: Sidebar + Content */}
//       <div className="flex">
//         {/* Sidebar with fixed width */}
//         <div className="w-64 hidden lg:block">
//           <Sidebar
//             itinerary={itinerary}
//             onDownloadPdf={handleDownloadPdf}
//             onEstimateCost={handleEstimateCost}
//             onCollaborationClick={handleCollaborationClick}
//           />
//         </div>

//         {/* Main Content Container (fixed width, centered) */}
//         <div className="flex-1">
//           <div className="container mx-auto p-6 max-w-4xl">
//             <h1 className="text-4xl font-bold text-center mb-6">AI Trip Planner</h1>

//             {/* Trip Details Input Form */}
//             <div className="card bg-base-100 shadow-md p-6 rounded-lg mb-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block font-semibold">Source City</label>
//                   <CityDropdown cities={citiesData} onSelect={setSource} />
//                 </div>
//                 <div>
//                   <label className="block font-semibold">Destination City</label>
//                   <CityDropdown cities={citiesData} onSelect={setDestination} />
//                 </div>
//               </div>
//               <div className="mt-4">
//                 <DatePicker onDateSelect={setDates} />
//               </div>
//               <div className="mt-4">
//                 <BudgetSelector onSelect={setBudget} />
//               </div>
//               <div className="mt-4">
//                 <label className="block font-semibold">Number of Travellers</label>
//                 <input
//                   type="number"
//                   min="1"
//                   className="input input-bordered w-full"
//                   value={numOfTravellers}
//                   onChange={(e) => setNumOfTravellers(parseInt(e.target.value))}
//                 />
//               </div>
//               <div className="mt-4">
//                 <TravelModeSelector
//                   selectedModes={selectedModes}
//                   setSelectedModes={setSelectedModes}
//                 />
//               </div>
//               <div className="mt-4">
//                 <FoodPreferences
//                   foodPreference={foodPreference}
//                   setFoodPreference={setFoodPreference}
//                 />
//               </div>
//               <div className="mt-4">
//                 <AccommodationPreferences
//                   accommodation={accommodation}
//                   setAccommodation={setAccommodation}
//                 />
//               </div>
//               <div className="mt-4">
//                 <ActivitiesSelector
//                   selectedActivities={selectedActivities}
//                   setSelectedActivities={setSelectedActivities}
//                 />
//               </div>
//               <div className="mt-4">
//                 <label className="block font-semibold">Special Requirements</label>
//                 <textarea
//                   value={additionalRequirement}
//                   onChange={(e) => setAdditionalRequirement(e.target.value)}
//                   placeholder="Enter any special requests..."
//                   className="textarea textarea-bordered w-full"
//                 />
//               </div>
//               <div className="mt-6">
//                 <button
//                   onClick={handleGenerateTrip}
//                   disabled={loading}
//                   className={`btn btn-primary w-full ${loading && "btn-disabled"}`}
//                 >
//                   {loading ? "Generating..." : "Generate Trip"}
//                 </button>
//               </div>
//               {error && <p className="mt-4 text-error">{error}</p>}
//             </div>

//             {/* Render Generated & Editable Itinerary & Additional Sections */}
//             {itinerary && (
//               <>
//                 {/* Itinerary/Description Section */}
//                 <ItineraryEditor itinerary={itinerary} setItinerary={setItinerary} />

//                 {/* Weather Section */}
//                 <div id="weather" className="space-y-6 mt-6">
//                   <div className="card bg-base-100 shadow-md p-4 rounded-lg">
//                     <WeatherInfo city={destination?.name} />
//                   </div>
//                 </div>

//                 {/* Hotels Section */}
//                 <div id="hotels" className="space-y-6 mt-6">
//                   <div className="card bg-base-100 shadow-md p-4 rounded-lg">
//                     <h3 className="text-2xl font-bold mb-4">Hotels</h3>
//                     <HotelsPage
//                       city={destination?.name}
//                       arrival_date={dates.startDate}
//                       departure_date={dates.endDate}
//                     />
//                   </div>
//                 </div>

//                 {/* Restaurants Section */}
//                 <div id="restaurants" className="space-y-6 mt-6">
//                   <div className="card bg-base-100 shadow-md p-4 rounded-lg">
//                     <h3 className="text-2xl font-bold mb-4">Restaurants</h3>
//                     <RestaurantsList city={destination?.name} />
//                   </div>
//                 </div>

//                 {/* Itinerary Overview Section */}
//                 <div id="itinerary" className="space-y-6 mt-6">
//                   <div className="card bg-base-100 shadow-md p-4 rounded-lg">
//                     <h3 className="text-2xl font-bold mb-4">Itinerary Overview</h3>
//                     {/* Additional itinerary details can go here */}
//                   </div>
//                 </div>

//                 {/* Estimate Trip Cost Section */}
//                 <div id="estimate" className="space-y-6 mt-6">
//                   <div className="card bg-base-100 shadow-md p-4 rounded-lg">
//                     <h3 className="text-2xl font-bold mb-4">Estimated Cost</h3>
//                     <div className="flex justify-between items-center">
//                       <span className="font-medium text-lg">Total Cost:</span>
//                       <span className="text-2xl font-bold">
//                         ₹ {itinerary.estimatedCost.total}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* PDFExport Component */}
//                 {/* <div className="mt-6">
//                   <PDFExport itinerary={itinerary} />
//                 </div> */}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useState } from "react";
// import Navbar from "@/components/Navbar";
// import CityDropdown from "@/components/CityDropdown";
// import citiesData from "@/lib/cities.json";
// import DatePicker from "@/components/DatePicker";
// import BudgetSelector from "@/components/BudgetSelector";
// import TravelModeSelector from "@/components/TravelModeSelector";
// import FoodPreferences from "@/components/FoodPreference";
// import AccommodationPreferences from "@/components/AccomodationSelector";
// import ActivitiesSelector from "@/components/ActivitiesSelector";
// import HotelsPage from "@/components/HotelList";
// import WeatherInfo from "@/components/WeatherComponent";
// import TopPlacesList from "@/components/TopPlacesList";
// import RestaurantsList from "@/components/RestaurantsList";
// import GoogleMapComponent from "@/components/GoogleMap";
// // import PDFExport from "@/components/PDFExport";
// // import  from "@/components/SideBar";
// import Layout from "@/components/AIPageLayout";

// export default function AiTripGeneration() {
//   // Form State
//   const [source, setSource] = useState(null);
//   const [destination, setDestination] = useState(null);
//   const [dates, setDates] = useState({ startDate: "", endDate: "" });
//   const [budget, setBudget] = useState(null);
//   const [numOfTravellers, setNumOfTravellers] = useState(1);
//   const [selectedModes, setSelectedModes] = useState([]);
//   const [accommodation, setAccommodation] = useState([]);
//   const [foodPreference, setFoodPreference] = useState(null);
//   const [selectedActivities, setSelectedActivities] = useState([]);
//   const [additionalRequirement, setAdditionalRequirement] = useState("");

//   // Itinerary State
//   const [itinerary, setItinerary] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Generate Itinerary Handler
//   const handleGenerateTrip = async () => {
//     if (numOfTravellers <= 0) {
//       alert("Number of travellers must be greater than 0");
//       return;
//     }
//     if (!source?.name || !destination?.name || !dates.startDate || !dates.endDate || !budget) {
//       alert("Please fill all required fields.");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     // Create your prompt here (omit lengthy prompt for brevity)
//     const prompt = `Your prompt goes here...`;

//     try {
//       const response = await fetch("/api/generateItinerary", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt }),
//       });
//       if (!response.ok) throw new Error("Failed to generate itinerary.");
//       const data = await response.json();
//       const cleaned = data.itinerary.replace(/```json|```/g, "").trim();
//       const parsed = JSON.parse(cleaned);
//       // Ensure a non-empty dayWisePlan
//       if (!parsed.dayWisePlan || parsed.dayWisePlan.length === 0) {
//         parsed.dayWisePlan = [{
//           day: 1,
//           activities: [
//             { time: "", description: "" },
//             { time: "", description: "" },
//             { time: "", description: "" }
//           ]
//         }];
//       }
//       setItinerary(parsed);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handlers for Sidebar actions
//   const handleDownloadPdf = () => {
//     console.log("Download PDF triggered");
//   };
//   const handleEstimateCost = () => {
//     document.getElementById("estimate")?.scrollIntoView({ behavior: "smooth" });
//   };
//   const handleCollaborationClick = () => {
//     console.log("Collaboration clicked");
//   };

//   return (
//     <Layout
//       itinerary={itinerary}
//       onDownloadPdf={handleDownloadPdf}
//       onEstimateCost={handleEstimateCost}
//       onCollaborationClick={handleCollaborationClick}
//     >
//       <div className="container mx-auto p-6 max-w-4xl">
//         <h1 className="text-4xl font-bold text-center mb-6">AI Trip Planner</h1>
//         <div className="card bg-base-100 shadow-md p-6 rounded-lg mb-6">
//           {/* Trip Details Input Form */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block font-semibold">Source City</label>
//               <CityDropdown cities={citiesData} onSelect={setSource} />
//             </div>
//             <div>
//               <label className="block font-semibold">Destination City</label>
//               <CityDropdown cities={citiesData} onSelect={setDestination} />
//             </div>
//           </div>
//           <div className="mt-4">
//             <DatePicker onDateSelect={setDates} />
//           </div>
//           <div className="mt-4">
//             <BudgetSelector onSelect={setBudget} />
//           </div>
//           <div className="mt-4">
//             <label className="block font-semibold">Number of Travellers</label>
//             <input
//               type="number"
//               min="1"
//               className="input input-bordered w-full"
//               value={numOfTravellers}
//               onChange={(e) => setNumOfTravellers(parseInt(e.target.value))}
//             />
//           </div>
//           <div className="mt-4">
//             <TravelModeSelector
//               selectedModes={selectedModes}
//               setSelectedModes={setSelectedModes}
//             />
//           </div>
//           <div className="mt-4">
//             <FoodPreferences foodPreference={foodPreference} setFoodPreference={setFoodPreference} />
//           </div>
//           <div className="mt-4">
//             <AccommodationPreferences
//               accommodation={accommodation}
//               setAccommodation={setAccommodation}
//             />
//           </div>
//           <div className="mt-4">
//             <ActivitiesSelector
//               selectedActivities={selectedActivities}
//               setSelectedActivities={setSelectedActivities}
//             />
//           </div>
//           <div className="mt-4">
//             <label className="block font-semibold">Special Requirements</label>
//             <textarea
//               value={additionalRequirement}
//               onChange={(e) => setAdditionalRequirement(e.target.value)}
//               placeholder="Enter any special requests..."
//               className="textarea textarea-bordered w-full"
//             />
//           </div>
//           <div className="mt-6">
//             <button
//               onClick={handleGenerateTrip}
//               disabled={loading}
//               className={`btn btn-primary w-full ${loading && "btn-disabled"}`}
//             >
//               {loading ? "Generating..." : "Generate Trip"}
//             </button>
//           </div>
//           {error && <p className="mt-4 text-error">{error}</p>}
//         </div>

//         {/* Render Itinerary, Weather, Hotels, Restaurants, etc. if itinerary exists */}
//         {itinerary && (
//           <>
//             <ItineraryEditor itinerary={itinerary} setItinerary={setItinerary} />

//             <div id="weather" className="space-y-6 mt-6">
//               <div className="card bg-base-100 shadow-md p-4 rounded-lg">
//                 <WeatherInfo city={destination?.name} />
//               </div>
//             </div>

//             <div id="hotels" className="space-y-6 mt-6">
//               <div className="card bg-base-100 shadow-md p-4 rounded-lg">
//                 <h3 className="text-2xl font-bold mb-4">Hotels</h3>
//                 <HotelsPage
//                   city={destination?.name}
//                   arrival_date={dates.startDate}
//                   departure_date={dates.endDate}
//                 />
//               </div>
//             </div>

//             <div id="restaurants" className="space-y-6 mt-6">
//               <div className="card bg-base-100 shadow-md p-4 rounded-lg">
//                 <h3 className="text-2xl font-bold mb-4">Restaurants</h3>
//                 <RestaurantsList city={destination?.name} />
//               </div>
//             </div>

//             <div id="itinerary" className="space-y-6 mt-6">
//               <div className="card bg-base-100 shadow-md p-4 rounded-lg">
//                 <h3 className="text-2xl font-bold mb-4">Itinerary Overview</h3>
//               </div>
//             </div>

//             <div id="estimate" className="space-y-6 mt-6">
//               <div className="card bg-base-100 shadow-md p-4 rounded-lg">
//                 <h3 className="text-2xl font-bold mb-4">Estimated Cost</h3>
//                 <div className="flex justify-between items-center">
//                   <span className="font-medium text-lg">Total Cost:</span>
//                   <span className="text-2xl font-bold">₹ {itinerary.estimatedCost.total}</span>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </Layout>
//   );
// }


"use client";


// "use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import CityDropdown from "@/components/CityDropdown";
import citiesData from "@/lib/cities.json";
import DatePicker from "@/components/DatePicker";
import BudgetSelector from "@/components/BudgetSelector";
import TravelModeSelector from "@/components/TravelModeSelector";
import FoodPreferences from "@/components/FoodPreference";
import AccommodationPreferences from "@/components/AccomodationSelector";
import ActivitiesSelector from "@/components/ActivitiesSelector";
import HotelsPage from "@/components/HotelList";
import WeatherInfo from "@/components/WeatherComponent";
import TopPlacesList from "@/components/TopPlacesList";
import RestaurantsList from "@/components/RestaurantsList";
import GoogleMapComponent from "@/components/GoogleMap";
import Layout from "@/components/AIPageLayout";
import ItineraryEditor from "@/components/ItineraryEditor";


export default function AiTripGeneration() {
  // Form state for trip details
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [budget, setBudget] = useState(null);
  const [numOfTravellers, setNumOfTravellers] = useState(1);
  const [selectedModes, setSelectedModes] = useState([]);
  const [accommodation, setAccommodation] = useState([]);
  const [foodPreference, setFoodPreference] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [additionalRequirement, setAdditionalRequirement] = useState("");

  // Itinerary state and flags
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate itinerary handler
  const handleGenerateTrip = async () => {
    if (numOfTravellers <= 0) {
      alert("Number of travellers must be greater than 0");
      return;
    }
    if (!source?.name || !destination?.name || !dates.startDate || !dates.endDate || !budget) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    const prompt = `
You are a highly skilled AI travel planner. Based on the user-provided input, generate a high-quality, reliable travel itinerary in **valid JSON format** following the structure below.

⚠️ RULES:
- Only return the JSON — no markdown, no explanation, no extra text.
- Follow the exact format and keys provided.
- Ensure no repeated or generic activities.
- Include at least 3 unique, high-value activities per day.
- All suggestion fields must be detailed objects.

🎯 REQUIRED OUTPUT FORMAT:
{
  "placeDescription": string,
  "dayWisePlan": [
    {
      "day": number,
      "activities": [
        {
          "time": string,
          "description": string
        }
      ]
    }
  ],
  "estimatedCost": {
    "travel": string,
    "accommodation": string,
    "food": string,
    "activities": string,
    "total": string
  },
  "travelSuggestions": {
    "toDestination": string,
    "localTravel": string
  },
  "accommodationOptions": {
    "areaSuggestions": string,
    "hotelSuggestions": [string]
  },
  "foodRecommendations": {
    "localDishes": [string],
    "restaurantSuggestions": [string]
  }
}

📌 TRIP DETAILS:
- Source City: ${source.name}
- Destination City: ${destination.name}
- Start Date: ${dates.startDate}
- End Date: ${dates.endDate}
- Budget: ${budget}
- Number of Travellers: ${numOfTravellers}
- Preferred Travel Modes: ${selectedModes.join(", ") || "Not Provided"}
- Accommodation Preferences: ${accommodation.join(", ") || "Not Provided"}
- Food Preference: ${foodPreference || "Not Provided"}
- Selected Activities: ${selectedActivities.join(", ") || "Not Provided"}
- Additional Requirements: ${additionalRequirement || "None"}

Only output a valid JSON object matching the structure above.
    `;

    try {
      const response = await fetch("/api/generateItinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error("Failed to generate itinerary.");
      const data = await response.json();
      const cleaned = data.itinerary.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (!parsed.dayWisePlan || parsed.dayWisePlan.length === 0) {
        parsed.dayWisePlan = [
          {
            day: 1,
            activities: [
              { time: "", description: "" },
              { time: "", description: "" },
              { time: "", description: "" },
            ],
          },
        ];
      }
      setItinerary(parsed);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handlers for Sidebar actions
  const handleDownloadPdf = () => {
    console.log("Download PDF triggered");
  };
  const handleEstimateCost = () => {
    document.getElementById("estimate")?.scrollIntoView({ behavior: "smooth" });
  };
  const handleCollaborationClick = () => {
    console.log("Collaboration clicked");
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <Layout
        itinerary={itinerary}
        onDownloadPdf={handleDownloadPdf}
        onEstimateCost={handleEstimateCost}
        onCollaborationClick={handleCollaborationClick}
      >
        <div className="container mx-auto p-6 max-w-4xl">
          <h1 className="text-4xl font-bold text-center mb-6">AI Trip Planner</h1>

          {/* Trip Details Form */}
          <div className="card bg-base-100 shadow-md p-6 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold">Source City</label>
                <CityDropdown cities={citiesData} onSelect={setSource} />
              </div>
              <div>
                <label className="block font-semibold">Destination City</label>
                <CityDropdown cities={citiesData} onSelect={setDestination} />
              </div>
            </div>
            <div className="mt-4">
              <DatePicker onDateSelect={setDates} />
            </div>
            <div className="mt-4">
              <BudgetSelector onSelect={setBudget} />
            </div>
            <div className="mt-4">
              <label className="block font-semibold">Number of Travellers</label>
              <input
                type="number"
                min="1"
                className="input input-bordered w-full"
                value={numOfTravellers}
                onChange={(e) => setNumOfTravellers(parseInt(e.target.value))}
              />
            </div>
            <div className="mt-4">
              <TravelModeSelector selectedModes={selectedModes} setSelectedModes={setSelectedModes} />
            </div>
            <div className="mt-4">
              <FoodPreferences foodPreference={foodPreference} setFoodPreference={setFoodPreference} />
            </div>
            <div className="mt-4">
              <AccommodationPreferences accommodation={accommodation} setAccommodation={setAccommodation} />
            </div>
            <div className="mt-4">
              <ActivitiesSelector selectedActivities={selectedActivities} setSelectedActivities={setSelectedActivities} />
            </div>
            <div className="mt-4">
              <label className="block font-semibold">Special Requirements</label>
              <textarea
                value={additionalRequirement}
                onChange={(e) => setAdditionalRequirement(e.target.value)}
                placeholder="Enter any special requests..."
                className="textarea textarea-bordered w-full"
              />
            </div>
            <div className="mt-6">
              <button
                onClick={handleGenerateTrip}
                disabled={loading}
                className={`btn btn-primary w-full ${loading && "btn-disabled"}`}
              >
                {loading ? "Generating..." : "Generate Trip"}
              </button>
            </div>
            {error && <p className="mt-4 text-error">{error}</p>}
          </div>

          {/* Render generated itinerary and additional sections */}
          {itinerary && (
            <>
              <ItineraryEditor itinerary={itinerary} setItinerary={setItinerary} />

              <div id="weather" className="space-y-6 mt-6">
                <div className="card bg-base-100 shadow-md p-4 rounded-lg">
                  <WeatherInfo city={destination?.name} />
                </div>
              </div>

              <div id="hotels" className="space-y-6 mt-6">
                <div className="card bg-base-100 shadow-md p-4 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">Hotels</h3>
                  <HotelsPage city={destination?.name} arrival_date={dates.startDate} departure_date={dates.endDate} />
                </div>
              </div>

              <div id="restaurants" className="space-y-6 mt-6">
                <div className="card bg-base-100 shadow-md p-4 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">Restaurants</h3>
                  <RestaurantsList city={destination?.name} />
                </div>
              </div>

              <div id="itinerary" className="space-y-6 mt-6">
                <div className="card bg-base-100 shadow-md p-4 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">Itinerary Overview</h3>
                  {/* Additional itinerary details */}
                </div>
              </div>

              <div id="estimate" className="space-y-6 mt-6">
                <div className="card bg-base-100 shadow-md p-4 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">Estimated Cost</h3>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-lg">Total Cost:</span>
                    <span className="text-2xl font-bold">₹ {itinerary.estimatedCost.total}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Layout>
    </div>
  );
}
