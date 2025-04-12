import { useState } from "react";

export default function BudgetSelector({ onSelect }) {
  const [selectedBudget, setSelectedBudget] = useState(null);

  const handleSelect = (budget) => {
    setSelectedBudget(budget);
    onSelect(budget);
  };

  return (
    <div className="flex gap-4">
      {["Cheap", "Normal", "Luxury"].map((budget) => (
        <button
          key={budget}
          className={`px-4 py-2 border rounded transition-colors ${
            selectedBudget === budget ? "bg-blue-600 text-white" : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
          onClick={() => handleSelect(budget)}
        >
          {budget}
        </button>
      ))}
    </div>
  );
}
