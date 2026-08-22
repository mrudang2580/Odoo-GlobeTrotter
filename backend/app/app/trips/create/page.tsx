"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ItineraryItem {
  day: number;
  activity: string;
}

export default function CreateTrip() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([
    { day: 1, activity: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleItineraryChange = (index: number, value: string) => {
    const updated = [...itinerary];
    updated[index].activity = value;
    setItinerary(updated);
  };

  const addDay = () => {
    setItinerary([...itinerary, { day: itinerary.length + 1, activity: "" }]);
  };

  const removeDay = (index: number) => {
    const updated = itinerary
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, day: i + 1 }));
    setItinerary(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !destination || !startDate || !endDate) {
      setError("Please fill in all trip details.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          destination,
          startDate,
          endDate,
          itinerary,
        }),
      });

      if (!res.ok) throw new Error("Failed to create trip");

      const data = await res.json();
      router.push(`/trips/${data.id}`);
    } catch (err) {
      setError("Something went wrong while creating the trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Create Trip</h1>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          className="border p-2 w-full rounded"
          placeholder="Trip Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <div className="flex gap-4">
          <input
            type="date"
            className="border p-2 w-full rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 w-full rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mt-4 mb-2">Itinerary</h2>
          {itinerary.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <span className="w-16 text-sm text-gray-600">
                Day {item.day}
              </span>
              <input
                className="border p-2 flex-1 rounded"
                placeholder="Activity / plan for this day"
                value={item.activity}
                onChange={(e) =>
                  handleItineraryChange(index, e.target.value)
                }
              />
              {itinerary.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDay(index)}
                  className="text-red-500 px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addDay}
            className="text-blue-600 text-sm mt-1"
          >
            + Add Day
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}