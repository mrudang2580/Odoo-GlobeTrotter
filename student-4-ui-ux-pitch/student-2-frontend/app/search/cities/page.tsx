'use client';
import React, { useState } from 'react';
import { Search, MapPin, Star } from 'lucide-react';

const CITIES = [
  { name: 'Paris', country: 'France', region: 'Europe', cost: '$$$$', popularity: 98, img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
  { name: 'Tokyo', country: 'Japan', region: 'Asia', cost: '$$$$', popularity: 96, img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600' },
  { name: 'Rome', country: 'Italy', region: 'Europe', cost: '$$$', popularity: 94, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600' },
  { name: 'Barcelona', country: 'Spain', region: 'Europe', cost: '$$$', popularity: 92, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600' },
];

export default function CitySearchPage() {
  const [query, setQuery] = useState('');
  const filtered = CITIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.country.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Discover Destinations</h1>
        <p className="text-gray-500 text-sm">Find global travel hubs, cost indexes, and popular tourist spots.</p>
      </div>
      <div className="relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by city, country or region..." className="w-full pl-11 pr-4 py-3 border rounded-xl shadow-sm text-sm" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(city => (
          <div key={city.name} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${city.img})` }} />
            <div className="p-4">
              <h3 className="font-bold text-base text-gray-900">{city.name}</h3>
              <p className="text-xs text-gray-500 mb-3">{city.country} • {city.region}</p>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                <span className="font-semibold text-amber-600">{city.cost} Cost</span>
                <span className="flex items-center gap-1 text-gray-600"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {city.popularity}/100</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
