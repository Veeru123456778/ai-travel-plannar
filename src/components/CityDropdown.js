import { useState } from "react";

export default function CityDropdown({ cities, onSelect }) {
  const [search, setSearch] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length > 0) {
      const filtered = cities.filter((city) =>
        city.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelect = (city) => {
    setSearch(city.name);
    setShowDropdown(false);
    onSelect(city);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Enter city name..."
        className="w-full p-2 border border-gray-300 rounded"
      />
      {showDropdown && (
        <ul className="absolute w-full bg-white border border-gray-300 mt-1 max-h-40 overflow-y-auto shadow-lg rounded">
          {filteredCities.map((city) => (
            <li
              key={city.id}
              onClick={() => handleSelect(city)}
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
