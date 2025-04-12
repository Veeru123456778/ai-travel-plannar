import { useState } from "react";
import { format } from "date-fns";

export default function DatePicker({ onDateSelect }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setEndDate(""); // Reset end date when start date changes
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    onDateSelect({ startDate, endDate: e.target.value });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-gray-700">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          min={format(new Date(), "yyyy-MM-dd")}
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block text-gray-700">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          min={startDate} // Ensures end date is after start date
          disabled={!startDate}
          className="border p-2 rounded w-full"
        />
      </div>
    </div>
  );
}
