import React from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import TripCard from '@/components/TripCard';

export default function TripsListPage() {
  const trips = [
    { id: '1', name: 'European Grand Heritage', status: 'upcoming', start_date: '2026-09-10', end_date: '2026-09-20', budget_limit: 3200 },
    { id: '2', name: 'Japan Cherry Blossom Odyssey', status: 'ongoing', start_date: '2026-04-01', end_date: '2026-04-12', budget_limit: 4500 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
          <p className="text-gray-500 text-sm">Manage ongoing, upcoming, and past multi-city travel.</p>
        </div>
        <Link href="/trips/new" className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm font-medium flex items-center gap-1.5">
          <PlusCircle className="w-4 h-4" /> Create Trip
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map(t => <TripCard key={t.id} trip={t} />)}
      </div>
    </div>
  );
}
