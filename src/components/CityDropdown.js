import { useState, useEffect } from "react";

export default function CityDropdown({
  cities = [],
  onSelect,
  selected,
  disabled = false,
  onFocus,
  onBlur,
}) {
  const [search, setSearch] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // hydrate input from parent-selected
  useEffect(() => {
    if (selected?.name) setSearch(selected.name);
  }, [selected]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length > 0) {
      const filtered = cities.filter((c) =>
        c.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handlePick = (city) => {
    setSearch(city.name);
    setShowDropdown(false);
    onSelect?.({ name: city.name }); // parent emits socket update
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        placeholder="Enter city name..."
        className="w-full p-2 border border-gray-300 rounded disabled:opacity-60"
      />
      {showDropdown && !disabled && (
        <ul className="absolute w-full bg-white border border-gray-300 mt-1 max-h-40 overflow-y-auto shadow-lg rounded">
          {filteredCities.map((city) => (
            <li
              key={city.id ?? city.name}
              onClick={() => handlePick(city)}
              className="p-2 cursor-pointer text-black hover:bg-gray-200"
            >
              {city.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
