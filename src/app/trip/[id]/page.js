"use client"

import { useParams } from 'next/navigation';
export default function idTrips() {
    const params = useParams();
    const { id } = params;

    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">Create trips with {id} here</h1>
      </div>
    );
  }
  