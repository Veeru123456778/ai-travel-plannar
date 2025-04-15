"use client";
import React from "react";

export default function DayEditor({ dayData, onUpdateDay, onDeleteActivity, onAddActivity }) {
  const updateActivity = (activityIndex, field, value) => {
    const updatedActivities = dayData.activities.map((act, idx) =>
      idx === activityIndex ? { ...act, [field]: value } : act
    );
    onUpdateDay({ ...dayData, activities: updatedActivities });
  };

  return (
    <div className="card bg-base-200 p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Day {dayData.day}</h3>
        <button onClick={() => onAddActivity(dayData.day)} className="btn btn-sm btn-outline">
          Add Activity
        </button>
      </div>
      {dayData.activities.map((activity, index) => (
        <div key={index} className="mt-4 p-3 border rounded bg-base-300 flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <label className="w-full sm:w-1/4 font-medium">Time:</label>
            <input
              type="text"
              value={activity.time}
              onChange={(e) => updateActivity(index, "time", e.target.value)}
              placeholder="e.g., 8:30 AM"
              className="input input-bordered w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <label className="font-medium">Activity Description:</label>
              <button onClick={() => onDeleteActivity(dayData.day, index)} className="btn btn-error btn-xs">
                Remove Activity
              </button>
            </div>
            <textarea
              value={activity.description}
              onChange={(e) => updateActivity(index, "description", e.target.value)}
              placeholder="Describe the activity..."
              className="textarea textarea-bordered w-full"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
