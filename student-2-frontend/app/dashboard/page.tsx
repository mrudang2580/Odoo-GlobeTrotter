import React from 'react';
import Link from 'next/link';
import { PlusCircle, Search, Compass, Globe, Sparkles } from 'lucide-react';
import TripCard from '@/components/TripCard';

const SAMPLE_TRIPS = [
  { id: '1', name: 'European Grand Heritage', status: 'upcoming', start_date: '2026-09-10', end_date: '2026-09-20', budget_limit: 3200, cover_photo_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800' },
  { id: '2', name: 'Japan Cherry Blossom Odyssey', status: 'ongoing', start_date: '2026-04-01', end_date: '2026-04-12', budget_limit: 4500, cover_photo_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-sky-600 to-indigo-700 text-white rounded-2xl p-8 shadow-sm flex items-center justify-between">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI Travel Assistant
          </span>
          <h1 className="text-3xl font-extrabold mb-2">Dream, Design, and Explore</h1>
          <p className="text-sky-100 text-sm mb-6">Build day-by-day itineraries, discover curated city stops, and automate your travel budget in real time.</p>
          <div className="flex items-center gap-3">
            <Link href="/trips/new" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-lg text-sm shadow transition">
              Plan New Trip
            </Link>
            <Link href="/search/cities" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg text-sm transition">
              Explore Destinations
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Your Recent Itineraries</h2>
          <Link href="/trips" className="text-sm font-semibold text-sky-600 hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_TRIPS.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    </div>
  );
}
