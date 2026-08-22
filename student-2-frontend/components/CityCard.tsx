import React from 'react';
import { MapPin, DollarSign, Star, Compass } from 'lucide-react';
import { City } from '../lib/types';

export function CityCard({ city, onSelect }: { city: City; onSelect?: (city: City) => void }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={city.image_url}
          alt={city.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Popularity Badge */}
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-slate-900 text-xs font-bold flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          {city.popularity_score}
        </span>

        {/* Region */}
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur text-white text-[11px] font-medium uppercase tracking-wider">
          {city.region}
        </span>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-bold text-lg leading-tight drop-shadow-sm">{city.name}</h3>
          <p className="text-xs text-slate-200 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-sky-400" /> {city.country}
          </p>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {city.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center text-xs text-slate-500">
            <span className="font-medium mr-1.5">Cost:</span>
            <div className="flex text-emerald-600 font-bold">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < city.cost_index ? 'text-emerald-600' : 'text-slate-200'}>$</span>
              ))}
            </div>
          </div>

          <button
            onClick={() => onSelect?.(city)}
            className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white font-semibold text-xs transition-colors flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5" /> Explore
          </button>
        </div>
      </div>
    </div>
  );
}
