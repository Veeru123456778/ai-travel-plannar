import MapComponent from "@/components/GoogleMap";

const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Kolkata', 'Chennai'];


export default function manual() {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">Create manual trips here</h1>
        <h1>City Locations</h1>
        {/* <MapComponent cities={cities} /> */}
      </div>
    );
  }
  