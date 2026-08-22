'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Compass, Calendar, DollarSign, MapPin, Copy, Share2, Heart, Check, Clock, UserCheck } from 'lucide-react';
import { api } from '../../../lib/api';
import { Trip } from '../../../lib/types';
import { formatCurrency, formatDate } from '../../../lib/utils';

export default function PublicSharedTripPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || 'euro-grand-2026';
  const [trip, setTrip] = useState<Trip | null>(null);
  const [cloned, setCloned] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    api.getTripById(slug).then((data) => setTrip(data || null));
  }, [slug]);

  const handleCloneTrip = async () => {
    setCloned(true);
    setTimeout(() => {
      router.push('/trips');
    }, 1200);
  };

  if (!trip) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Loading public itinerary...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Public Banner */}
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">Public Shared Travel Guide</span>
            <p className="text-xs text-slate-600">Created by <span className="font-bold text-slate-900">Alex Wanderer</span> on GlobeTrotter</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLiked(!liked)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
              liked ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
            {liked ? 'Saved' : 'Save / Like'}
          </button>

          <button
            onClick={handleCloneTrip}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/30 flex items-center gap-1.5 transition"
          >
            {cloned ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {cloned ? 'Cloned to Account!' : 'Fork / Copy This Trip'}
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl">
        <img src={trip.cover_photo_url} alt={trip.name} className="w-full h-80 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black">{trip.name}</h1>
          <p className="text-xs sm:text-sm text-slate-200">{trip.description}</p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-sky-400" /> {formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
            <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {formatCurrency(trip.budget_limit)} Estimated Cost</span>
          </div>
        </div>
      </div>

      {/* Itinerary Steps */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Itinerary Highlights</h2>
        <div className="space-y-4">
          {trip.stops.map((stop, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-700 font-bold text-xs">Stop {idx + 1}</span>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-sky-600" /> {stop.city_name}, {stop.country}
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">{formatDate(stop.start_date)} - {formatDate(stop.end_date)}</span>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase text-slate-400">Featured Activities:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stop.activities && stop.activities.map((act, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{act.name}</span>
                      <span className="font-bold text-emerald-600">{act.cost === 0 ? 'Free' : formatCurrency(act.cost)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
