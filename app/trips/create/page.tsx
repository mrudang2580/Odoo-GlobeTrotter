"use client";

import { useState } from "react";
import CitySearch from "../../components/CitySearch"; // safer path
import ActivitySearch from "@/app/components/ActivitySearch";

export default function CreateTrip() {
  const [name, setName] = useState("");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Create Trip</h1>

      <input
        className="border p-2 mt-4 w-full"
        placeholder="Trip Name"
        onChange={(e) => setName(e.target.value)}
      />

      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Create
      </button>

      {/* ✅ THIS WAS MISSING */}
      <CitySearch />
      <ActivitySearch />
    </div>
  );
}