"use client"
import SearchForm from "@/components/TrainTickets";

export default function TrainTickets() {


    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">Search Trains here</h1>
        <SearchForm/>
      </div>
    );
  }
  