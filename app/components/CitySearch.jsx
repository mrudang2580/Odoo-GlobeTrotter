"use client";

import { useState } from "react";

export default function CitySearch() {
  const [city, setCity] = useState("");

  return (
    <div>
      <h2>City Search</h2>

      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
      />

      <button onClick={() => alert(city)}>Search</button>
    </div>
  );
}