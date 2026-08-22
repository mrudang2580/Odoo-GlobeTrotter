import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, DollarSign, ArrowRight } from 'lucide-react';

export default function TripCard({ trip }: { trip: any }) {
  const statusColors: Record<string, string> = {
    upcoming: 'bg-blue-100 text-blue-800',
    ongoing: 'bg-emerald-100 text-emerald-800',
    completed: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      <div className="h-44 w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${trip.cover_photo_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'})` }}>
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${statusColors[trip.status] || statusColors.upcoming}`}>
          {trip.status}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-1">{trip.name}</h3>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{trip.description || 'Custom multi-city travel itinerary.'}</p>
        <div className="space-y-1.5 text-xs text-gray-600 mb-4">
          <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-sky-600" /> {trip.start_date} → {trip.end_date}</div>
          <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-sky-600" /> {trip.stops ? `${trip.stops.length} Cities` : '3 Cities'}</div>
          <div className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-sky-600" /> ${trip.budget_limit || '2,500'} Budget</div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Link href={`/trips/${trip.id}/build`} className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1">
            Build Itinerary <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <div className="flex items-center gap-2">
            <Link href={`/trips/${trip.id}/budget`} className="text-xs text-gray-500 hover:text-gray-900">Budget</Link>
            <Link href={`/trips/${trip.id}/view`} className="text-xs text-gray-500 hover:text-gray-900">View</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
