import { useState, useEffect } from "react";
import { format } from "date-fns";

export default function DatePicker({
  onDateSelect,
  value,
  disabled = false,
  onFocus,
  onBlur,
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // hydrate from parent (snapshot, reloads)
  useEffect(() => {
    if (value) {
      setStartDate(value.startDate || "");
      setEndDate(value.endDate || "");
    }
  }, [value]);

  const handleStartDateChange = (e) => {
    const s = e.target.value; // "yyyy-MM-dd"
    setStartDate(s);
    setEndDate(""); // reset end when start changes
    onDateSelect?.({ startDate: s, endDate: "" }); // emit immediately
  };

  const handleEndDateChange = (e) => {
    const eDate = e.target.value; // "yyyy-MM-dd"
    setEndDate(eDate);
    onDateSelect?.({ startDate, endDate: eDate }); // emit on end change too
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-gray-700">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          onFocus={onFocus}
          onBlur={onBlur}
          min={format(new Date(), "yyyy-MM-dd")}
          disabled={disabled}
          className="border p-2 rounded w-full disabled:opacity-60"
        />
      </div>

      <div>
        <label className="block text-gray-700">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          onFocus={onFocus}
          onBlur={onBlur}
          min={startDate || format(new Date(), "yyyy-MM-dd")}
          disabled={disabled || !startDate}
          className="border p-2 rounded w-full disabled:opacity-60"
        />
      </div>
    </div>
  );
}
