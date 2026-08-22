import "/ODOO Hackathon/CSS Files/Style.css"

"use client";
import { useState } from "react";

export default function Itinerary() {
  const [cities, setCities] = useState<string[]>([]);

  const addCity = () => {
    const city = prompt("Enter city name");
    if (city) setCities([...cities, city]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Itinerary</h1>

      <button
        onClick={addCity}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        + Add City
      </button>

      {cities.map((c, i) => (
        <div key={i} className="mt-3 border p-3 rounded">
          {c}
        </div>
      ))}
    </div>
  );
}