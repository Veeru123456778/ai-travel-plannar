// 'use client'
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function WeatherInfo({ city }) {
//   const [weather, setWeather] = useState(null);
//   const [weatherSuggestions, setWeatherSuggestions] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchWeather() {
//       try {
//         const response = await axios.get('https://weatherapi-com.p.rapidapi.com/current.json', {
//           params: { q: city },
//           headers: {
//             'x-rapidapi-key': '517bac9255msh9d5fd9d6ef052a6p18442ajsn43525c76f28c',
//             'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
//           }
//         });

//         setWeather(response.data);
//         console.log("Weather Data:", response.data);

//         // Generate AI suggestions after weather is fetched
//         generateWeatherSuggestions(response.data);

//       } catch (error) {
//         console.error('Weather fetch error:', error);
//       }
//     }

//     const generateWeatherSuggestions = async (weatherData) => {
//       const prompt = `
// You are a travel assistant. Based on the following weather data, suggest:

// 1. Weather Summary
// 2. Recommended Clothing
// 3. Must Carry Items
// 4. Any Precautions

// Weather Data:
// City: ${city}
// Temperature: ${weatherData.current.temp_c}°C
// Condition: ${weatherData.current.condition.text}
// Humidity: ${weatherData.current.humidity}%
// Wind: ${weatherData.current.wind_kph} kph

// Return the result strictly in this JSON format:

// {
//   "weather_summary": "Short summary of weather condition",
//   "recommended_clothing": ["list of clothing items"],
//   "must_carry_items": ["list of important items to carry"],
//   "precautions": ["list of precautions"]
// }
// `;

//       try {
//         setLoading(true);
//         setError(null);

//         const response = await fetch('/api/generateItinerary', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ prompt }),
//         });

//         if (!response.ok) {
//           throw new Error('Failed to generate suggestions.');
//         }

//         const data = await response.json();

//         const cleaned = data.itinerary.replace(/```json|```/g, '').trim();
//         const parsed = JSON.parse(cleaned);

//         setWeatherSuggestions(parsed);
//         console.log("AI Suggestions:", parsed);

//       } catch (err) {
//         console.error(err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWeather();

//   }, [city]);

//   if (!weather) return <div>Loading Weather...</div>;

// return (
//   <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
//     <h2>Weather in {city}</h2>

//     {!weather ? (
//       <p>Loading weather data...</p>
//     ) : (
//       <div className='text-black'>
//         <p><strong>Temperature:</strong> {weather.current.temp_c}°C</p>
//         <p><strong>Condition:</strong> {weather.current.condition.text}</p>
//         <p><strong>Humidity:</strong> {weather.current.humidity}%</p>
//         <p><strong>Wind Speed:</strong> {weather.current.wind_kph} kph</p>
//         <img src={`https:${weather.current.condition.icon}`} alt="Weather Icon" />
//       </div>
//     )}

//     <hr style={{ margin: '1rem 0' }} />

//     {loading && <p>Loading AI Suggestions...</p>}
//     {error && <p style={{ color: 'red' }}>{error}</p>}

//     {weatherSuggestions && (
//       <div className='text-black'>
//         <h3>Travel Suggestions</h3>
//         <p><strong>Weather Summary:</strong> {weatherSuggestions.weather_summary}</p>

//         <p><strong>Recommended Clothing:</strong></p>
//         <ul>
//           {weatherSuggestions.recommended_clothing.map((item, index) => (
//             <li key={index}>{item}</li>
//           ))}
//         </ul>

//         <p><strong>Must Carry Items:</strong></p>
//         <ul>
//           {weatherSuggestions.must_carry_items.map((item, index) => (
//             <li key={index}>{item}</li>
//           ))}
//         </ul>

//         <p><strong>Precautions:</strong></p>
//         <ul>
//           {weatherSuggestions.precautions.map((item, index) => (
//             <li key={index}>{item}</li>
//           ))}
//         </ul>
//       </div>
//     )}
//   </div>
// );

// }


// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Loader2, Wind, Thermometer, Umbrella } from "lucide-react";

// export default function WeatherInfo({ city }) {
//   const [weather, setWeather] = useState(null);
//   const [weatherSuggestions, setWeatherSuggestions] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchWeather() {
//       try {
//         const response = await axios.get("https://weatherapi-com.p.rapidapi.com/current.json", {
//           params: { q: city },
//           headers: {
//             "x-rapidapi-key": "517bac9255msh9d5fd9d6ef052a6p18442ajsn43525c76f28c ",
//             "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
//           },
//         });

//         setWeather(response.data);
//         generateWeatherSuggestions(response.data);
//       } catch (error) {
//         console.error("Weather fetch error:", error);
//       }
//     }

//     const generateWeatherSuggestions = async (weatherData) => {
//       const prompt = `
// You are a travel assistant. Based on the following weather data, suggest:

// 1. Weather Summary
// 2. Recommended Clothing
// 3. Must Carry Items
// 4. Any Precautions

// Weather Data:
// City: ${city}
// Temperature: ${weatherData.current.temp_c}°C
// Condition: ${weatherData.current.condition.text}
// Humidity: ${weatherData.current.humidity}%
// Wind: ${weatherData.current.wind_kph} kph

// Return the result strictly in this JSON format:

// {
//   "weather_summary": "Short summary of weather condition",
//   "recommended_clothing": ["list of clothing items"],
//   "must_carry_items": ["list of important items to carry"],
//   "precautions": ["list of precautions"]
// }
// `;

//       try {
//         setLoading(true);
//         setError(null);

//         const response = await fetch("/api/generateItinerary", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ prompt }),
//         });

//         if (!response.ok) {
//           throw new Error("Failed to generate suggestions.");
//         }

//         const data = await response.json();
//         const cleaned = data.itinerary.replace(/```json|```/g, "").trim();
//         const parsed = JSON.parse(cleaned);
//         setWeatherSuggestions(parsed);
//       } catch (err) {
//         console.error(err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWeather();
//   }, [city]);

//   if (!weather) return <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;

//   return (
//     <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-6 rounded-lg shadow-lg text-white max-w-md mx-auto mt-8">
//       <h2 className="text-xl font-bold mb-4">Weather in {city}</h2>
//       <div className="flex items-center gap-4">
//         <Thermometer size={32} className="text-yellow-300" />
//         <p className="text-lg">{weather.current.temp_c}°C</p>
//       </div>
//       <div className="flex items-center gap-4 mt-2">
//         <img src={`https:${weather.current.condition.icon}`} alt="Weather Icon" className="w-12 h-12" />
//         <p>{weather.current.condition.text}</p>
//       </div>
//       <div className="flex items-center gap-4 mt-2">
//         <Wind size={32} className="text-white" />
//         <p>{weather.current.wind_kph} kph</p>
//       </div>
//       <div className="flex items-center gap-4 mt-2">
//         <Umbrella size={32} className="text-blue-200" />
//         <p>{weather.current.humidity}% Humidity</p>
//       </div>

//       <hr className="my-4 border-white/30" />

//       {loading && <p>Loading AI Suggestions...</p>}
//       {error && <p className="text-red-400">{error}</p>}

//       {weatherSuggestions && (
//         <div>
//           <h3 className="text-lg font-bold">Travel Suggestions</h3>
//           <p><strong>Weather Summary:</strong> {weatherSuggestions.weather_summary}</p>
//           <p><strong>Recommended Clothing:</strong></p>
//           <ul className="list-disc ml-5">
//             {weatherSuggestions.recommended_clothing.map((item, index) => (
//               <li key={index}>{item}</li>
//             ))}
//           </ul>
//           <p><strong>Must Carry Items:</strong></p>
//           <ul className="list-disc ml-5">
//             {weatherSuggestions.must_carry_items.map((item, index) => (
//               <li key={index}>{item}</li>
//             ))}
//           </ul>
//           <p><strong>Precautions:</strong></p>
//           <ul className="list-disc ml-5">
//             {weatherSuggestions.precautions.map((item, index) => (
//               <li key={index}>{item}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Loader2,
  Wind,
  Thermometer,
  Umbrella,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function WeatherInfo({ city }) {
  const [weather, setWeather] = useState(null);
  const [weatherSuggestions, setWeatherSuggestions] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editableSuggestions, setEditableSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {brandColor} = useTheme();

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await axios.get("https://weatherapi-com.p.rapidapi.com/current.json", {
          params: { q: city },
          headers: {
            "x-rapidapi-key": "517bac9255msh9d5fd9d6ef052a6p18442ajsn43525c76f28c",
            "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
          },
        });

        setWeather(response.data);
        generateWeatherSuggestions(response.data);
      } catch (error) {
        console.error("Weather fetch error:", error);
        setError("Unable to fetch weather data.");
      }
    }

    const generateWeatherSuggestions = async (weatherData) => {
      const prompt = `
You are a specialized travel assistant. Analyze the weather data below for the given city and provide tailored, actionable advice. Focus on concrete, city-specific recommendations—not generic advice—based solely on the provided data.

Weather Data:
- City: ${city}
- Temperature: ${weatherData.current.temp_c}°C
- Condition: ${weatherData.current.condition.text}
- Humidity: ${weatherData.current.humidity}%
- Wind Speed: ${weatherData.current.wind_kph} kph

Based on this data, generate output in EXACTLY the following JSON format (with no extra text):

{
  "weather_summary": "A concise, city-specific description of the current weather.",
  "recommended_clothing": ["List of specific clothing items suited for this weather (e.g., 'light jacket', 'raincoat')"],
  "must_carry_items": ["List essential items to carry (e.g., 'umbrella', 'sunscreen')"],
  "precautions": ["List any necessary precautions based on the weather (e.g., 'avoid outdoor activities during high winds')"]
}
`;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/generateItinerary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate suggestions.");
        }

        const data = await response.json();
        const cleaned = data.itinerary.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        setWeatherSuggestions(parsed);
        setEditableSuggestions(parsed);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch AI suggestions.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  const handleEditChange = (field, index, value) => {
    setEditableSuggestions((prev) => {
      const updated = { ...prev };
      if (Array.isArray(updated[field])) {
        updated[field][index] = value;
      } else {
        updated[field] = value;
      }
      return updated;
    });
  };

  const handleSave = () => {
    setWeatherSuggestions(editableSuggestions);
    setEditMode(false);
  };

  if (!weather) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    // <div className="card shadow-xl bg-base-100 border border-base-300 max-w-2xl mx-auto my-8">
      <div className="card-body">
        {/* <h2 className="card-title text-3xl justify-between items-center"> */}
        <h1 className={`card-title text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white ${brandColor}`}>
          Weather in {city}
        </h1>

        {/* Weather Info Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <Thermometer className="text-warning" />
            <span>{weather.current.temp_c}°C</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              src={`https:${weather.current.condition.icon}`}
              alt="Weather"
              className="w-6 h-6"
            />
            <span>{weather.current.condition.text}</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="text-info" />
            <span>{weather.current.wind_kph} kph</span>
          </div>
          <div className="flex items-center gap-2">
            <Umbrella className="text-blue-400" />
            <span>{weather.current.humidity}% Humidity</span>
          </div>
        </div>

        <hr className="my-4" />

        {/* AI Suggestions */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Travel Suggestions</h3>
            {weatherSuggestions && !editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="btn btn-sm btn-outline btn-info"
              >
                <Pencil size={16} /> Edit
              </button>
            )}
          </div>

          {loading && <p>Loading AI suggestions...</p>}
          {error && <p className="text-error">{error}</p>}

          {weatherSuggestions && (
            <div className="space-y-2 text-sm">
              {/* Weather Summary */}
              <div>
                <strong>Summary:</strong>{" "}
                {editMode ? (
                  <input
                    type="text"
                    className="input input-bordered input-sm w-full mt-1"
                    value={editableSuggestions.weather_summary}
                    onChange={(e) =>
                      handleEditChange("weather_summary", null, e.target.value)
                    }
                  />
                ) : (
                  <span>{weatherSuggestions.weather_summary}</span>
                )}
              </div>

              {/* Lists */}
              {["recommended_clothing", "must_carry_items", "precautions"].map(
                (key) => (
                  <div key={key}>
                    <strong className="capitalize">
                      {key.replace(/_/g, " ")}:
                    </strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1">
                      {weatherSuggestions[key].map((item, index) => (
                        <li key={index}>
                          {editMode ? (
                            <input
                              type="text"
                              className="input input-bordered input-sm w-full"
                              value={editableSuggestions[key][index]}
                              onChange={(e) =>
                                handleEditChange(key, index, e.target.value)
                              }
                            />
                          ) : (
                            item
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}

              {/* Save/Cancel Buttons */}
              {editMode && (
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={handleSave}
                  >
                    <Save size={16} /> Save
                  </button>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => {
                      setEditableSuggestions(weatherSuggestions);
                      setEditMode(false);
                    }}
                  >
                    <X size={16} /> Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    // </div>
  );
}
