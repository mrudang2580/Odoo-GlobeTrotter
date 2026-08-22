'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTripPage() {
  const router = useRouter();
  const [name, setName] = useState('Mediterranean Summer Escape');
  const [start, setStart] = useState('2026-07-01');
  const [end, setEnd] = useState('2026-07-14');
  const [budget, setBudget] = useState('3500');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/trips/1/build');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Create a New Trip</h1>
      <p className="text-gray-500 text-sm mb-6">Set up your voyage timeline and estimated budget target.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trip Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required className="w-full p-2.5 border rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date" value={start} onChange={e => setStart(e.target.value)} required className="w-full p-2.5 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input type="date" value={end} onChange={e => setEnd(e.target.value)} required className="w-full p-2.5 border rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Target Budget ($)</label>
          <input type="number" value={budget} onChange={e => setBudget(e.target.value)} className="w-full p-2.5 border rounded-lg" />
        </div>
        <button type="submit" className="w-full py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition mt-4">
          Proceed to Itinerary Builder →
        </button>
      </form>
    </div>
  );
}
