'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MapPin, Calendar, DollarSign, Clock, Share2, Edit3, PieChart, CalendarDays, ArrowLeft, CheckCircle } from 'lucide-react';
import { api } from '../../../lib/api';
import { Trip } from '../../../lib/types';
import { formatCurrency, formatDate } from '../../../lib/utils';

export default function TripDetailPage() {
  const params = useParams();
  const tripId = (params?.id as string) || 't1';
  const [trip, setTrip] = useState<Trip | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.getTripById(tripId).then((data) => setTrip(data || null));
  }, [tripId]);

  if (!trip) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Loading itinerary details...</p>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/share/${trip.share_slug || trip.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link href="/trips" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to My Trips
      </Link>

      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200">
        <div className="h-64 sm:h-80 w-full relative">
          <img src={trip.cover_photo_url} alt={trip.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold uppercase tracking-wider">
                {trip.status}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur text-xs font-medium">
                {trip.stops.length} Cities / Stops
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md">
              {trip.name}
            </h1>

            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl line-clamp-2">
              {trip.description}
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="bg-white px-6 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-sky-600" />
              {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              {formatCurrency(trip.budget_limit)} Total Budget
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/trips/${trip.id}/build`}
              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Builder
            </Link>
            <Link
              href={`/trips/${trip.id}/budget`}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <PieChart className="w-3.5 h-3.5 text-emerald-600" /> Cost Breakdown
            </Link>
            <Link
              href={`/trips/${trip.id}/calendar`}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <CalendarDays className="w-3.5 h-3.5 text-sky-600" /> Calendar
            </Link>
            <button
              onClick={handleShare}
              className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? 'Link Copied!' : 'Share'}
            </button>
          </div>
        </div>
      </div>

      {/* Multi-City Itinerary Timeline */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Day-by-Day City Schedule</h2>

        <div className="space-y-6">
          {trip.stops.map((stop, sIdx) => (
            <div key={stop.id || sIdx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                    {sIdx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-sky-600" />
                      {stop.city_name}, {stop.country}
                    </h3>
                    <span className="text-xs text-slate-500">
                      {formatDate(stop.start_date)} to {formatDate(stop.end_date)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                    Allocated Budget: {formatCurrency(stop.budget)}
                  </span>
                </div>
              </div>

              {/* Stop Activities */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Scheduled Experiences:</h4>
                {stop.activities && stop.activities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {stop.activities.map((act, aIdx) => (
                      <div key={act.id || aIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900">{act.name || 'Activity'}</p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            {act.scheduled_time && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-sky-600" /> {act.scheduled_time}
                              </span>
                            )}
                            <span>{act.scheduled_date}</span>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-600 text-sm">
                          {act.cost === 0 ? 'Free' : formatCurrency(act.cost)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No activities scheduled yet for this stop.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
