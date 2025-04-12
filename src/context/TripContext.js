"use client";
import { createContext, useContext, useState } from "react";

const TripContext = createContext();

export function TripProvider({ children }) {
  const [selectedTrip, setSelectedTrip] = useState(null);

  return (
    <TripContext.Provider value={{ selectedTrip, setSelectedTrip }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  return useContext(TripContext);
}
