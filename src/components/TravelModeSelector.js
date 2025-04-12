export default function TravelModeSelector({ selectedModes, setSelectedModes }) {
    const modes = ["Flight", "Train", "Cab", "Other"];
  
    const toggleMode = (mode) => {
      setSelectedModes((prev) =>
        prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
      );
    };
  
    return (
      <div className="flex gap-2">
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => toggleMode(mode)}
            className={`px-4 py-2 rounded border ${
              selectedModes.includes(mode) ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
    );
  }
  