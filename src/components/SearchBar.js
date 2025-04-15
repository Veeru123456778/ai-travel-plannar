  import { useRouter } from "next/navigation"

export default function SearchBar() {
    const router = useRouter();

    const handleClickAI = ()=>{
       router.push('/trip/ai')
    }
    const handleClickManual = ()=>{
       router.push('/trip/manual')
    }

    return (
      <div className="w-[100%] flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search your trips..."
          className="input input-bordered w-[100%] md:w-[70%] border p-1"
        />
        <div className="flex flex-col md:flex-row gap-2 md:w-auto">
          <button className="btn btn-primary" onClick={handleClickManual}>
            Create Trip Manually
          </button>
          <button className="btn btn-secondary" onClick={handleClickAI}>
            Create Trip with AI
          </button>
        </div>
      </div>
    )
  }
  