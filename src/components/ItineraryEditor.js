"use client";
import React from "react";
import DayEditor from "./DayEditor";

export default function ItineraryEditor({ itinerary, setItinerary }) {
  const updateDay = (updatedDay) => {
    const updatedDays = itinerary.dayWisePlan.map((day) =>
      day.day === updatedDay.day ? updatedDay : day
    );
    setItinerary({ ...itinerary, dayWisePlan: updatedDays });
  };

  const addActivity = (dayNum) => {
    const updatedDays = itinerary.dayWisePlan.map((day) => {
      if (day.day === dayNum) {
        return { ...day, activities: [...day.activities, { time: "", description: "" }] };
      }
      return day;
    });
    setItinerary({ ...itinerary, dayWisePlan: updatedDays });
  };

  const deleteActivity = (dayNum, activityIndex) => {
    const updatedDays = itinerary.dayWisePlan.map((day) => {
      if (day.day === dayNum) {
        const updatedActivities = day.activities.filter((_, idx) => idx !== activityIndex);
        return { ...day, activities: updatedActivities };
      }
      return day;
    });
    setItinerary({ ...itinerary, dayWisePlan: updatedDays });
  };

  const addDay = () => {
    const newDay = {
      day: itinerary.dayWisePlan.length + 1,
      activities: [
        { time: "", description: "" },
        { time: "", description: "" },
        { time: "", description: "" },
      ],
    };
    setItinerary({ ...itinerary, dayWisePlan: [...itinerary.dayWisePlan, newDay] });
  };

  const removeDay = () => {
    if (itinerary.dayWisePlan.length > 1) {
      const updatedDays = itinerary.dayWisePlan.slice(0, -1);
      setItinerary({ ...itinerary, dayWisePlan: updatedDays });
    }
  };

  const updateDescription = (value) => {
    setItinerary({ ...itinerary, placeDescription: value });
  };

  return (
    <div className="card bg-base-100 p-6 rounded-lg shadow-md space-y-6" id="description">
      <div>
        <h2 className="text-3xl font-bold">Trip Overview</h2>
        <textarea
          className="textarea textarea-bordered w-full mt-2"
          value={itinerary.placeDescription}
          onChange={(e) => updateDescription(e.target.value)}
          placeholder="Edit destination description..."
        />
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Itinerary</h2>
        <div className="flex gap-2">
          <button onClick={addDay} className="btn btn-outline btn-sm">
            Add Day
          </button>
          <button onClick={removeDay} className="btn btn-outline btn-sm">
            Remove Day
          </button>
        </div>
      </div>
      <div className="grid gap-6 mt-4">
        {itinerary.dayWisePlan.map((day) => (
          <DayEditor
            key={day.day}
            dayData={day}
            onUpdateDay={updateDay}
            onAddActivity={addActivity}
            onDeleteActivity={deleteActivity}
          />
        ))}
      </div>
    </div>
  );
}
