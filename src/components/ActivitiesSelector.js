import { useState } from "react";

const activitiesList = [
  "Adventure (Trekking, Scuba Diving, etc.)",
  "Sightseeing (Historical, Cultural, Beaches, etc.)",
  "Shopping",
  "Nightlife",
  "Relaxation & Spa",
];

export default function ActivitiesSelector({ selectedActivities,setSelectedActivities }) {

  const handleChange = (activity) => {
    setSelectedActivities((prev) => {
      const newSelection = prev.includes(activity)
        ? prev.filter((item) => item !== activity)
        : [...prev, activity];
      return newSelection;
    });
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Select Activities & Interests 🎭</h3>
      <div className="mt-2 space-y-2">
        {activitiesList.map((activity) => (
          <label key={activity} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedActivities.includes(activity)}
              onChange={() => handleChange(activity)}
              className="accent-blue-500"
            />
            <span>{activity}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
