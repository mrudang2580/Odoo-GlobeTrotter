'use client';
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Globe, Compass, Star } from 'lucide-react';
import { CityCard } from '../../components/CityCard';
import { api } from '../../lib/api';
import { City } from '../../lib/types';

export default function CitiesExplorerPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  useEffect(() => {
    api.getCities({ region: selectedRegion, search }).then(setCities);
  }, [selectedRegion, search]);

  const regions = ['All', 'Europe', 'Asia', 'North America', 'Africa', 'Oceania'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">City Directory & Explorer</h1>
          <p className="text-slate-500 text-xs mt-0.5">Discover top travel destinations with cost indices and popularity ratings.</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search city or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Region Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {regions.map((reg) => (
          <button
            key={reg}
            onClick={() => setSelectedRegion(reg)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedRegion === reg
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {reg}
          </button>
        ))}
      </div>

      {/* City Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cities.map((city) => (
          <CityCard
            key={city.id}
            city={city}
            onSelect={(c) => setSelectedCity(c)}
          />
        ))}
      </div>

      {/* City Detail Modal */}
      {selectedCity && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-6">
            <div className="relative h-48 w-full">
              <img src={selectedCity.image_url} alt={selectedCity.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-2xl font-black">{selectedCity.name}</h3>
                <p className="text-xs text-sky-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {selectedCity.country} • {selectedCity.region}
                </p>
              </div>
            </div>

            <div className="px-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">{selectedCity.description}</p>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Popularity:</span>
                  <p className="font-extrabold text-slate-900 flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {selectedCity.popularity_score} / 100
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Cost Index:</span>
                  <p className="font-extrabold text-emerald-600 mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < selectedCity.cost_index ? 'text-emerald-600' : 'text-slate-200'}>$</span>
                    ))}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedCity(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`City "${selectedCity.name}" added to your next travel planning session!`);
                  setSelectedCity(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 shadow-md shadow-sky-600/30"
              >
                Add to Trip Itinerary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
