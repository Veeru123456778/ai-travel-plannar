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
