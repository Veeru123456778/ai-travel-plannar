export default function SortingFilters({ sortOption, setSortOption }) {
    return (
      <div className="flex items-center justify-end">
        <label htmlFor="sort" className="mr-2 text-sm font-medium">
          Sort By:
        </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="select select-bordered w-full max-w-xs"
        >
          <option value="date">Date</option>
          <option value="price">Price</option>
          <option value="duration">Duration</option>
        </select>
      </div>
    )
  }
  