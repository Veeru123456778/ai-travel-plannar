"use client"


export default function SearchBar() {
  
  return (
    <div className="w-[100%] flex flex-col md:flex-row gap-4">
      <input
        type="text"
        placeholder="Search your trips..."
        className="input input-bordered w-[100%] md:w-[70%] border p-1"
      />
    </div>
  )
}
