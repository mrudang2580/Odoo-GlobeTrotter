import React from 'react';
import Link from 'next/link';
import { Calendar, DollarSign, MapPin, Share2, ArrowRight } from 'lucide-react';
import { Trip } from '../lib/types';
import { formatCurrency, formatDate } from '../lib/utils';

export function TripCard({ trip }: { trip: Trip }) {
  const statusStyles = {
    upcoming: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ongoing: 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse',
    completed: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={trip.cover_photo_url}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Status Badge */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${statusStyles[trip.status]}`}>
          {trip.status}
        </span>

        {/* Public Share Badge */}
        {trip.is_public && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/40 text-white backdrop-blur text-xs flex items-center gap-1">
            <Share2 className="w-3 h-3 text-sky-400" /> Public
          </span>
        )}

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-bold text-lg leading-tight drop-shadow-sm line-clamp-1">{trip.name}</h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
          {trip.description}
        </p>

        {/* Stops pill list */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Route & Stops:</span>
          <div className="flex flex-wrap gap-1.5">
            {trip.stops && trip.stops.length > 0 ? (
              trip.stops.map((stop, idx) => (
                <span key={stop.id || idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                  <MapPin className="w-2.5 h-2.5 text-sky-600" />
                  {stop.city_name}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">No stops configured</span>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
            <span>{formatDate(trip.start_date)}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-bold text-slate-800">{formatCurrency(trip.budget_limit)} Limit</span>
          </div>
        </div>

        {/* Actions Button */}
        <div className="pt-2 flex items-center gap-2">
          <Link
            href={`/trips/${trip.id}`}
            className="flex-1 text-center py-2 px-3 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            View Itinerary <ArrowRight className="w-3 h-3" />
          </Link>
          <Link
            href={`/trips/${trip.id}/build`}
            className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
          >
            Builder
          </Link>
        </div>
      </div>
    </div>
  );
}
