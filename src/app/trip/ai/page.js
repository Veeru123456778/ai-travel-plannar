

// "use client"
// import { useState } from "react";
// import CityDropdown from "@/components/CityDropdown";
// import citiesData from "@/lib/cities.json";
// import DatePicker from "@/components/DatePicker";
// import BudgetSelector from "@/components/BudgetSelector";
// import TravelModeSelector from "@/components/TravelModeSelector";
// import FoodPreferences from "@/components/FoodPreference";
// import AccommodationPreferences from "@/components/AccomodationSelector";
// import ActivitiesSelector from "@/components/ActivitiesSelector";
// import HotelsPage from "@/components/HotelList";
// import Itinerary from "@/components/ItineraryForm";
// import WeatherInfo from "@/components/WeatherComponent";
// import TopPlacesList from "@/components/TopPlacesList";
// import RestaurantsList from "@/components/RestaurantsList";
// import GoogleMapComponent from "@/components/GoogleMap";

// export default function AiTripGeneration() {
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
//   const [hotels, setHotels] = useState([]);
//   const [itinerary, setItinerary] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleGenerateTrip = async () => {
//     if (numOfTravellers <= 0) {
//       alert("Select number of travellers as a positive number greater than 0");
//       return;
//     }
//     if (!source?.name || !destination?.name || !dates.startDate || !dates.endDate || !budget) {
//       alert("Please select source, destination, dates, and budget.");
//       return;
//     }

//     const prompt = `
// Generating a detailed trip itinerary based on the following details:

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

// Please generate a day-wise itinerary including travel suggestions, accommodation options, places to visit, food recommendations, and estimated cost breakdown.

// Provide response in pure JSON format with no string format dont give output as a string always give output in pure json format:
// {
//   "placeDescription":"",
//   "dayWisePlan": [ { "day": 1, "activities": [{time:"",description:""}] }, { "day": 2, "activities": [{time:"",description:""}] } ],
//   "estimatedCost": "",
//   "travelSuggestions": "",
//   "accommodationOptions": "",
//   "foodRecommendations": ""
// }
//     `;

//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch('/api/generateItinerary', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to generate itinerary.');
//       }

//       const data = await response.json();
//       console.log("Generated Itinerary:", data.itinerary);

//       const cleaned = data.itinerary.replace(/```json|```/g, '').trim();
//       const parsed = JSON.parse(cleaned);

//       setItinerary(parsed);
//       // setItinerary(data.itinerary);
//       console.log("Type of itinerary:", typeof data.itinerary);

//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-6">
//       <h1 className="text-3xl font-bold">Create Trips with AI</h1>

//       <div className="w-80">
//         <label className="block mb-2 font-semibold">Source City</label>
//         <CityDropdown cities={citiesData} onSelect={setSource} />
//       </div>

//       <div className="w-80">
//         <label className="block mb-2 font-semibold">Destination City</label>
//         <CityDropdown cities={citiesData} onSelect={setDestination} />
//       </div>

//       <div className="w-80">
//         <DatePicker onDateSelect={setDates} />
//       </div>

//       <BudgetSelector onSelect={setBudget} />

//       <div className="flex flex-col w-80">
//         <label className="font-semibold">Select Number of Travellers:</label>
//         <input
//           type="number"
//           min="1"
//           className="border p-2 rounded-md"
//           value={numOfTravellers}
//           onChange={e => setNumOfTravellers(parseInt(e.target.value))}
//         />
//       </div>

//       <TravelModeSelector selectedModes={selectedModes} setSelectedModes={setSelectedModes} />
//       <FoodPreferences foodPreference={foodPreference} setFoodPreference={setFoodPreference} />
//       <AccommodationPreferences accommodation={accommodation} setAccommodation={setAccommodation} />
//       <ActivitiesSelector selectedActivities={selectedActivities} setSelectedActivities={setSelectedActivities} />
      
//       <div className="p-4 border rounded-lg w-80">
//         <h3 className="text-lg font-semibold">Special Requirements ✨</h3>
//         <textarea
//           value={additionalRequirement}
//           onChange={(e) => setAdditionalRequirement(e.target.value)}
//           placeholder="Enter any special requests (e.g., wheelchair access, pet-friendly, etc.)"
//           className="w-full p-2 mt-2 border rounded-md"
//         />
//       </div>

//       {error && <p className="text-red-600">{error}</p>}

//       <button
//         onClick={handleGenerateTrip}
//         disabled={loading}
//         className={`bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//       >
//         {loading ? "Generating..." : "Generate Trip"}
//       </button>

      
//       {itinerary && <div className="text-white p-4 space-y-8">
//   <div>
//     <h2>Place Description</h2>
//     <p>{itinerary.placeDescription}</p>
//     <WeatherInfo city={destination.name}/>
//     <HotelsPage city={destination.name} arrival_date={dates.startDate} departure_date={dates.endDate}/>
//     <TopPlacesList city={destination.name}/>
//     <RestaurantsList city={destination.name}/>

//     <div className="map-container">
//         <h2>Route from {source.name} to {destination.name}</h2>
//         <GoogleMapComponent origin={source.name} destination={destination.name} />
//       </div>

//     <h2 className="text-2xl font-bold mb-4">📅 Day Wise Plan</h2>
//     {itinerary.dayWisePlan.map((day) => (
//       <div key={day.day} className="mb-6 bg-gray-800 p-4 rounded-xl shadow-lg">
//         <h3 className="text-xl font-semibold mb-2">Day {day.day}</h3>
//         <ul className="space-y-2">
//           {day.activities.map((activity, index) => (
//             <li key={index} className="bg-gray-700 p-2 rounded">
//               <strong>{activity.time}:</strong> {activity.description}
//             </li>
//           ))}
//         </ul>
//       </div>
//     ))}
//   </div>


//       {/* Estimated Cost */}
//       <div>
//         <h2 className="text-2xl font-bold mb-4">💰 Estimated Cost</h2>
//         <ul className="space-y-2 bg-gray-800 p-4 rounded-xl shadow-lg">
//           <li>Train Tickets: ₹{itinerary.estimatedCost.trainTickets}</li>
//           <li>Accommodation: ₹{itinerary.estimatedCost.accommodation}</li>
//           <li>Food: ₹{itinerary.estimatedCost.food}</li>
//           <li>Activities & Shopping: ₹{itinerary.estimatedCost.activitiesAndShopping}</li>
//           <li className="font-bold text-lg mt-2">Total: ₹{itinerary.estimatedCost.total}</li>
//         </ul>
//       </div>

//       {/* Travel Suggestions */}
//       <div>
//         <h2 className="text-2xl font-bold mb-4">🚆 Travel Suggestions</h2>
//         <p className="bg-gray-800 p-4 rounded-xl shadow-lg">{itinerary.travelSuggestions}</p>
//       </div>

//       {/* Accommodation Options */}
//       <div>
//         <h2 className="text-2xl font-bold mb-4">🏨 Accommodation Options</h2>
//         <p className="bg-gray-800 p-4 rounded-xl shadow-lg">{itinerary.accommodationOptions}</p>
//       </div>

//       {/* Food Recommendations */}
//       <div>
//         <h2 className="text-2xl font-bold mb-4">🍽️ Food Recommendations</h2>
//         <p className="bg-gray-800 p-4 rounded-xl shadow-lg">{itinerary.foodRecommendations}</p>
//       </div>
//     </div>}

//        {/* <Itinerary/> */}
//       {/* <HotelsPage /> */}
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import CityDropdown from "@/components/CityDropdown";
import citiesData from "@/lib/cities.json";
import DatePicker from "@/components/DatePicker";
import BudgetSelector from "@/components/BudgetSelector";
import TravelModeSelector from "@/components/TravelModeSelector";
import FoodPreferences from "@/components/FoodPreference";
import AccommodationPreferences from "@/components/AccomodationSelector";
import ActivitiesSelector from "@/components/ActivitiesSelector";
import HotelsPage from "@/components/HotelList";
import Itinerary from "@/components/ItineraryForm";
import WeatherInfo from "@/components/WeatherComponent";
import TopPlacesList from "@/components/TopPlacesList";
import RestaurantsList from "@/components/RestaurantsList";
import GoogleMapComponent from "@/components/GoogleMap";

export default function AiTripGeneration() {
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
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
Generating a detailed trip itinerary based on the following details:

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

Please generate a day-wise itinerary including travel suggestions, accommodation options, places to visit, food recommendations, and estimated cost breakdown.

Provide response in pure JSON format with no string format dont give output as a string always give output in pure json format:
{
  "placeDescription":"",
  "dayWisePlan": [ { "day": 1, "activities": [{time:"",description:""}] }, { "day": 2, "activities": [{time:"",description:""}] } ],
  "estimatedCost": "",
  "travelSuggestions": "",
  "accommodationOptions": "",
  "foodRecommendations": ""
}
    `;

    try {
      const response = await fetch('/api/generateItinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({prompt}),
        // body: JSON.stringify({ source, destination, dates, budget, numOfTravellers, selectedModes, accommodation, foodPreference, selectedActivities, additionalRequirement }),
      });

      if (!response.ok) throw new Error('Failed to generate itinerary.');

      const data = await response.json();
      
      const cleaned = data.itinerary.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      setItinerary(parsed);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">AI Trip Planner</h1>

      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-xl shadow-lg mt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold">Source City</label>
            <CityDropdown cities={citiesData} onSelect={setSource} />
          </div>
          <div>
            <label className="block text-lg font-semibold">Destination City</label>
            <CityDropdown cities={citiesData} onSelect={setDestination} />
          </div>
        </div>

        <DatePicker onDateSelect={setDates} />

        <BudgetSelector onSelect={setBudget} />

        <div>
          <label className="block text-lg font-semibold">Number of Travellers</label>
          <input
            type="number"
            min="1"
            className="w-full border p-2 rounded-md bg-gray-700"
            value={numOfTravellers}
            onChange={e => setNumOfTravellers(parseInt(e.target.value))}
          />
        </div>

        <TravelModeSelector selectedModes={selectedModes} setSelectedModes={setSelectedModes} />
        <FoodPreferences foodPreference={foodPreference} setFoodPreference={setFoodPreference} />
        <AccommodationPreferences accommodation={accommodation} setAccommodation={setAccommodation} />
        <ActivitiesSelector selectedActivities={selectedActivities} setSelectedActivities={setSelectedActivities} />

        <div className="bg-gray-700 p-4 rounded-lg">
          <label className="text-lg font-semibold">Special Requirements</label>
          <textarea
            value={additionalRequirement}
            onChange={(e) => setAdditionalRequirement(e.target.value)}
            placeholder="Enter any special requests (e.g., wheelchair access, pet-friendly, etc.)"
            className="w-full p-2 mt-2 border rounded-md bg-gray-800"
          />
        </div>

        {error && <p className="text-red-400">{error}</p>}

        <button
          onClick={handleGenerateTrip}
          disabled={loading}
          className={`w-full py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          }`}
        >
          {loading ? "Generating..." : "Generate Trip"}
        </button>
      </div>

      {itinerary && (
        <div className="mt-10 w-full max-w-4xl bg-gray-800 p-6 rounded-xl shadow-lg space-y-8">
          <h2 className="text-2xl font-bold">📍 Trip Overview</h2>
          <p>{itinerary.placeDescription}</p>

          <WeatherInfo city={destination.name} />
          <HotelsPage city={destination.name} arrival_date={dates.startDate} departure_date={dates.endDate} />
          <TopPlacesList city={destination.name} />
          <RestaurantsList city={destination.name} />

          {/* <div className="map-container">
            <h2>Route from {source.name} to {destination.name}</h2>
            <GoogleMapComponent origin={source.name} destination={destination.name} />
          </div> */}

          {/* <h2 className="text-2xl font-bold">📅 Itinerary</h2>
          {itinerary.dayWisePlan.map((day) => (
            <div key={day.day} className="bg-gray-700 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">Day {day.day}</h3>
              <ul>
                {day.activities.map((activity, index) => (
                  <li key={index} className="mt-2">{activity.time}: {activity.description}</li>
                ))}
              </ul>
            </div>
          ))}

          <h2 className="text-2xl font-bold">💰 Estimated Cost</h2>
          <p className="bg-gray-700 p-4 rounded-lg">{itinerary.estimatedCost.total}</p> */}

          <h2 className="text-3xl font-bold flex items-center gap-2">📅 Itinerary</h2>

<div className="grid gap-6 mt-4">
  {itinerary.dayWisePlan.map((day) => (
    <div key={day.day} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900">Day {day.day}</h3>
      <ul className="mt-3 space-y-2">
        {day.activities.map((activity, index) => (
          <li
            key={index}
            className="bg-gray-100 p-3 rounded-lg flex justify-between items-center shadow-sm"
          >
            <span className="font-medium text-gray-700">{activity.time}</span>
            <span className="text-gray-900">{activity.description}</span>
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>

{/* Estimated Cost Section */}
<h2 className="text-3xl font-bold flex items-center gap-2 mt-8">💰 Estimated Cost</h2>
<div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex justify-between items-center mt-3">
  <span className="text-gray-700 font-medium text-lg">Total Cost:</span>
  <span className="text-2xl font-bold text-gray-900">₹ {itinerary.estimatedCost.total}</span>
</div>


        </div>
      )}
    </div>
  );
}
