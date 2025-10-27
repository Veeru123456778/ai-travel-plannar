"use client";
import React from "react";
import { useRouter } from "next/navigation";

export const Buttons = ({ userId, email }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleCreateTrip = async () => {
    if (!userId || !email) return alert("Please sign in first.");
    setLoading(true);
    try {
      const res = await fetch("/api/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // type removed — keep payload minimal
        body: JSON.stringify({ userId, email }),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Room creation failed");
      }

      const data = await res.json();
      const roomId = data?.roomId;
      if (!roomId) throw new Error("Missing roomId in response");

      // Prefer server-provided route if you add it; else generic
      const target =  `/trip/ai/${roomId}`;
      router.push(target);
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 md:w-auto">
      <button
        className={`btn btn-primary ${loading ? "btn-disabled" : ""}`}
        onClick={handleCreateTrip}
        disabled={loading}
      >
        {loading ? "Creating…" : "Create Trip"}
      </button>
    </div>
  );
};
