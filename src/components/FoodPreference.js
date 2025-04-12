import { useState } from "react";

export default function FoodPreferences({foodPreference, setFoodPreference}) {

  const foodOptions = ["Pure Veg","No Preference","Don't include food"];

  return (
    <div className="flex flex-col gap-6 p-4">

      {/* Food Preferences Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Select Food Preference 🍽️</h2>
        <div className="flex gap-2">
          {foodOptions.map((option) => (
            <button
              key={option}
              className={`px-4 py-2 rounded border ${
                foodPreference === option ? "bg-green-500 text-white" : "bg-gray-200 text-black"
              }`}
              onClick={() => setFoodPreference(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
