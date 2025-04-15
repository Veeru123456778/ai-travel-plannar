// 'use client'
// import { useRouter } from 'next/navigation';

// export default function DashBoard(){
//     const router = useRouter();

//     const handleClickAI = ()=>{
//        router.push('/trip/ai')
//     }
//     const handleClickManual = ()=>{
//        router.push('/trip/manual')
//     }
//     return(
//         <div>
//             <div className="flex gap-2 mt-3 justify-center w-[100vw]">
//             <input className="p-2 border-2 rounded-2xl w-[70vw]" placeholder="Search for your Trips here.."/>
//             <button className='bg-blue-700 p-1 rounded-xl font-bold' onClick={handleClickManual}>Create Manual Trip</button>
//             <button className='bg-blue-700 p-1 rounded-xl font-bold' onClick={handleClickAI}>Create Trip With AI</button>
//             </div>
//         </div>
//     )
// }



// 'use client'

// import Navbar from '@/components/Navbar'
// import SearchBar from '@/components/SearchBar'
// import TabSwitcher from '@/components/TabSwitcher'
// import TripCard from '@/components/TripCard'
// import { useState } from 'react'

// export default function DashboardPage() {
//   const [activeTab, setActiveTab] = useState('your')

//   return (
//     <div className="min-h-screen bg-base-200 text-base-content">
//       <Navbar />
//       <div className=" mx-10 p-4 space-y-6">
//         <SearchBar />
//         <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
//           {[1, 2, 3].map((i) => (
//             <TripCard key={i} title={`Trip ${i}`} />
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }


'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import SearchBar from '@/components/SearchBar'
import TabSwitcher from '@/components/TabSwitcher'
import SortingFilters from '@/components/SortingFiltersForTrip'
import TripCard from '@/components/TripCard'


export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('your')
  const [sortOption, setSortOption] = useState('date')

  // Dummy data for demonstration (you would replace this with your actual data).
  const trips = [
    { id: 1, title: 'Trip 1', date: '2023-10-01', price: 300, duration: 7 },
    { id: 2, title: 'Trip 2', date: '2023-09-15', price: 250, duration: 5 },
    { id: 3, title: 'Trip 3', date: '2023-11-05', price: 400, duration: 10 },
  ]

  // Sorting logic based on the sortOption
  const sortedTrips = trips.sort((a, b) => {
    if (sortOption === 'date') {
      return new Date(a.date) - new Date(b.date)
    } else if (sortOption === 'price') {
      return a.price - b.price
    } else if (sortOption === 'duration') {
      return a.duration - b.duration
    }
  })

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <Navbar />
      <div className="mx-10 p-4 space-y-6">
        <SearchBar />
        <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* Sorting Filters Component */}
        <SortingFilters sortOption={sortOption} setSortOption={setSortOption} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {sortedTrips.map((trip) => (
            <TripCard key={trip.id} title={trip.title} />
          ))}
        </div>
      </div>
    </div>
  )
}
