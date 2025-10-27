"use client";
import React, { useEffect, useState } from "react";
import DayEditor from "./DayEditor";
import { useRoomSocket } from "@/hooks/useRoomSocket";
import { useUser } from "@clerk/nextjs";

export default function ItineraryEditor({ itinerary, setItinerary }) {
  const [locks, setLocks] = useState({});
  const { user } = useUser();
  const { socketRef, lockField, unlockField } = useRoomSocket(itinerary.roomId);

  useEffect(() => {
    if (!socketRef.current) return;

    const onLocked = ({ key, lockedBy, userName }) => {
      setLocks(prev => ({ ...prev, [key]: { lockedBy, userName } }));
    };
    const onUnlocked = ({ key }) => {
      setLocks(prev => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    };

    socketRef.current.on('field-locked', onLocked);
    socketRef.current.on('field-unlocked', onUnlocked);

    return () => {
      socketRef.current.off('field-locked', onLocked);
      socketRef.current.off('field-unlocked', onUnlocked);
    };
  }, [socketRef]);

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

  const updateDescription = (value) => {
    setItinerary({ ...itinerary, placeDescription: value });
  };

  return (
    <div className="card bg-base-100 p-6 rounded-lg shadow-md space-y-6" id="description">
      <div className="no-print">
        <h2 className="text-3xl font-bold">Trip Overview</h2>
        <textarea
          className="textarea textarea-bordered w-full mt-2"
          value={itinerary.placeDescription}
          onChange={(e) => updateDescription(e.target.value)}
          placeholder="Edit destination description..."
        />
      </div>

      {/* Print-friendly static overview */}
      <div className="print:block hidden">
        <h2 className="text-2xl font-bold mb-2">Trip Overview</h2>
        <p className="whitespace-pre-wrap">{itinerary.placeDescription}</p>
      </div>

      <div className="flex justify-between items-center no-print">
        <h2 className="text-3xl font-bold">Itinerary</h2>
      </div>

      <div className="grid gap-6 mt-4">
        {itinerary.dayWisePlan.map((day) => (
          <div key={day.day} className="day-card">
            <DayEditor
              dayData={day}
              onUpdateDay={updateDay}
              onAddActivity={addActivity}
              onDeleteActivity={deleteActivity}
              lockField={lockField}
              unlockField={unlockField}
              locks={locks}
              currentUser={user}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
