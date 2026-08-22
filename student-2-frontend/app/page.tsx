'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Sparkles, MapPin, Calendar, DollarSign, TrendingUp, Plus, ArrowRight, Star, Globe, CheckCircle2 } from 'lucide-react';
import { TripCard } from '../components/TripCard';
import { CityCard } from '../components/CityCard';
import { api } from '../lib/api';
import { Trip, City } from '../lib/types';

export default function DashboardPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.getTrips().then(setTrips);
    api.getCities().then(setCities);
  }, []);

  const stats = [
    { label: 'Planned Trips', value: trips.length, icon: Calendar, color: 'text-sky-600 bg-sky-50' },
    { label: 'Cities Explored', value: '18+', icon: MapPin, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Total Budget Managed', value: '$9,000', icon: DollarSign, color: 'text-amber-600 bg-amber-50' },
    { label: 'Community Rating', value: '4.95 ★', icon: Star, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950 to-blue-900 text-white p-8 md:p-14 shadow-2xl border border-sky-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-xs font-semibold text-sky-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            AI-Powered Multi-City Itinerary Engine
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Design Your Dream Journey Across the World.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Craft multi-destination itineraries, predict budgets dynamically, schedule activities, and share memorable adventures with fellow travelers.
          </p>

          {/* Quick Search & Action Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch gap-3 max-w-xl">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Where to next? (e.g. Paris, Tokyo, Bali)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              />
            </div>
            <Link
              href={searchQuery ? `/cities?search=${encodeURIComponent(searchQuery)}` : '/trips/create'}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-sky-600/30 text-sm flex items-center justify-center gap-2 transition"
            >
              <Compass className="w-4 h-4" />
              {searchQuery ? 'Search Destinations' : 'Start Planning'}
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <h4 className="text-xl font-bold text-slate-900 mt-0.5">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Active & Upcoming Trips Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Your Travel Itineraries</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage and customize your current and upcoming adventures.</p>
          </div>
          <Link
            href="/trips"
            className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
          >
            View All Trips ({trips.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.slice(0, 3).map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>

      {/* Explore Top Worldwide Destinations */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Trending Destinations</h2>
            <p className="text-xs text-slate-500 mt-0.5">Curated multi-city stops with high community ratings.</p>
          </div>
          <Link
            href="/cities"
            className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
          >
            Explore All Cities <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cities.slice(0, 4).map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </div>
    </div>
  );
}
