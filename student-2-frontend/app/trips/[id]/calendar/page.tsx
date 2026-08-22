'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Calendar, ChevronLeft, ChevronRight, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { api } from '../../../../lib/api';
import { Trip } from '../../../../lib/types';
import { formatCurrency } from '../../../../lib/utils';

export default function TripCalendarPage() {
  const params = useParams();
  const tripId = (params?.id as string) || 't1';
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    api.getTripById(tripId).then(setTrip);
  }, [tripId]);

  const days = [
    { day: 10, month: 'Sep', city: 'Paris', activity: 'Eiffel Tower Summit', time: '18:00', cost: 45 },
    { day: 11, month: 'Sep', city: 'Paris', activity: 'Louvre Museum Tour', time: '10:00', cost: 65 },
    { day: 12, month: 'Sep', city: 'Paris', activity: 'Montmartre Pastry Walk', time: '15:00', cost: 55 },
    { day: 13, month: 'Sep', city: 'Transit', activity: 'High-speed TGV to Rome', time: '08:30', cost: 120 },
    { day: 14, month: 'Sep', city: 'Rome', activity: 'Colosseum Underground VIP', time: '09:30', cost: 75 },
    { day: 15, month: 'Sep', city: 'Rome', activity: 'Vatican Museums & Sistine Chapel', time: '14:00', cost: 60 },
    { day: 16, month: 'Sep', city: 'Rome', activity: 'Trastevere Food Tasting', time: '19:00', cost: 50 },
    { day: 17, month: 'Sep', city: 'Transit', activity: 'Flight to Barcelona', time: '11:00', cost: 95 },
    { day: 18, month: 'Sep', city: 'Barcelona', activity: 'Sagrada Familia Towers', time: '11:00', cost: 38 },
    { day: 19, month: 'Sep', city: 'Barcelona', activity: 'Park Güell & Tapas Night', time: '16:00', cost: 45 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Link href={`/trips/${tripId}`} className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Itinerary Detail
        </Link>
        <h1 className="text-3xl font-black text-slate-900">Trip Calendar & Timeline</h1>
        <p className="text-xs text-slate-500 mt-0.5">Chronological flow of scheduled activities and city transitions.</p>
      </div>

      {/* Calendar Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {days.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 hover:border-sky-400 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                {item.month} {item.day}
              </span>
              <span className="text-[11px] font-bold text-slate-400">Day {idx + 1}</span>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-sky-500" /> {item.city}
              </p>
              <h4 className="font-extrabold text-sm text-slate-900 mt-1">{item.activity}</h4>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-sky-600" /> {item.time}
              </span>
              <span className="font-bold text-emerald-600">{formatCurrency(item.cost)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
