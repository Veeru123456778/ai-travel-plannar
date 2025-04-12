'use client'
import { useRouter } from 'next/navigation';

export default function DashBoard(){
    const router = useRouter();

    const handleClickAI = ()=>{
       router.push('/trip/ai')
    }
    const handleClickManual = ()=>{
       router.push('/trip/manual')
    }
    return(
        <div>
            <div className="flex gap-2 mt-3 justify-center w-[100vw]">
            <input className="p-2 border-2 rounded-2xl w-[70vw]" placeholder="Search for your Trips here.."/>
            <button className='bg-blue-700 p-1 rounded-xl font-bold' onClick={handleClickManual}>Create Manual Trip</button>
            <button className='bg-blue-700 p-1 rounded-xl font-bold' onClick={handleClickAI}>Create Trip With AI</button>
            </div>
        </div>
    )
}