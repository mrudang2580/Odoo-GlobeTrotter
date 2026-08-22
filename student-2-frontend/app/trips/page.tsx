'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Calendar, MapPin, DollarSign, ArrowRight } from 'lucide-react';
import { TripCard } from '../../components/TripCard';
import { api } from '../../lib/api';
import { Trip } from '../../lib/types';

export default function TripsListPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.getTrips().then(setTrips);
  }, []);

  const filteredTrips = trips.filter((t) => {
    const matchesTab = activeTab === 'all' || t.status === activeTab;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.stops.some(s => s.city_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">My Trips</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track your multi-destination travel itineraries.</p>
        </div>
        <Link
          href="/trips/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-sm shadow-md shadow-sky-600/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create New Trip
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          {(['all', 'upcoming', 'ongoing', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                activeTab === tab
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search trips or cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Trip Cards Grid */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-4">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No trips found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery ? 'Try adjusting your search criteria or clear filters.' : 'You haven\'t created any trips in this section yet. Start planning one now!'}
          </p>
          <Link
            href="/trips/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-xl font-bold text-xs shadow-sm hover:bg-sky-700 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Plan a Trip
          </Link>
        </div>
      )}
    </div>
  );
}
