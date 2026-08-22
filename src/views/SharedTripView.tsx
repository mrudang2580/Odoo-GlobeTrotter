import React, { useState } from 'react';
import { 
  Copy, Share2, MapPin, Calendar, Clock, Wallet, 
  Check, ArrowRight, Compass, Sparkles, Map as MapIcon, 
  QrCode, Layers, ShieldCheck, Heart 
} from 'lucide-react';
import { PopulatedTrip } from '../types';
import { db } from '../services/db';
import { formatCurrency } from '../services/currency';
import { useTrip } from '../context/TripContext';
import { useToast } from '../context/ToastContext';
import { RouteMap } from '../components/map/RouteMap';

interface SharedTripViewProps {
  tripId?: string;
  onNavigateToBuilder: (tripId: string) => void;
}

export const SharedTripView: React.FC<SharedTripViewProps> = ({
  tripId,
  onNavigateToBuilder,
}) => {
  const { copyTrip, activeTrip } = useTrip();
  const { success } = useToast();

  const [copiedLink, setCopiedLink] = useState(false);
  const [showMap, setShowMap] = useState(true);

  // Load populated trip
  const currentTripId = tripId || activeTrip?.id || 'trip-europe-explorer';
  const trip = db.getPopulatedTrip(currentTripId) || activeTrip;

  if (!trip) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <Compass className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Trip not found</h2>
        <p className="text-xs text-slate-500">The public itinerary you are looking for does not exist.</p>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/#trip/${trip.shareSlug || trip.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    success('Link Copied!', 'Public itinerary URL copied to clipboard.');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCloneTrip = () => {
    const cloned = copyTrip(trip.id);
    if (cloned) {
      onNavigateToBuilder(cloned.id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Public Share Action Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-coral-500 flex items-center justify-center text-white shadow-md shadow-coral-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-coral-400 uppercase tracking-wider">Public Itinerary Preview</div>
            <div className="font-extrabold text-sm text-white">Like this travel plan? Clone it to your workspace!</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Copied' : 'Share Link'}</span>
          </button>

          <button
            onClick={handleCloneTrip}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-coral-500 to-orange-500 hover:from-coral-600 hover:to-orange-600 text-white rounded-xl text-xs font-black shadow-lg shadow-coral-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Copy className="w-4 h-4" />
            <span>Copy This Trip</span>
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
        <div className="h-64 sm:h-80 w-full relative">
          <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-coral-500 text-white text-xs font-black uppercase px-3 py-1 rounded-full">
              {trip.stops.length} Cities · {trip.days.length} Days
            </span>
            <span className="text-xs font-semibold text-slate-300">
              {trip.startDate} to {trip.endDate}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white font-serif">
            {trip.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            {trip.description}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <img src={trip.user.avatar} alt={trip.user.name} className="w-8 h-8 rounded-full border border-white/40" />
            <span className="text-xs text-slate-300 font-medium">Curated by <strong className="text-white">{trip.user.name}</strong></span>
          </div>
        </div>
      </div>

      {/* Route & Map Overview */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-coral-500" />
              <span>Multi-City Route Sequence</span>
            </h3>
            <p className="text-xs text-slate-500">
              {trip.stops.map(s => `${s.city.name} (${s.nights}N)`).join(' ➔ ')}
            </p>
          </div>

          <button
            onClick={() => setShowMap(!showMap)}
            className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>

        {showMap && (
          <div className="h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
            <RouteMap trip={trip} />
          </div>
        )}
      </div>

      {/* Day-by-Day Full Itinerary */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 font-serif">Day-by-Day Master Itinerary</h2>
          <p className="text-xs text-slate-500">Detailed schedule of experiences and attractions</p>
        </div>

        <div className="space-y-6">
          {trip.days.map((day) => (
            <div key={day.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                    {day.dayNumber}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">{day.title}</h4>
                    <span className="text-xs text-slate-500 font-semibold">{day.city?.name}, {day.city?.country} · {day.date}</span>
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
                  {day.activities.length} Sights
                </div>
              </div>

              {/* Day activities */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {day.activities.map(act => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 text-xs"
                  >
                    {act.image && (
                      <img src={act.image} alt={act.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-extrabold text-slate-800">{act.startTime}</span>
                        <span className="font-bold text-slate-900">{formatCurrency(act.estimatedCostINR, trip.currency)}</span>
                      </div>
                      <div className="font-bold text-slate-900 line-clamp-1">{act.title}</div>
                      <div className="text-[11px] text-slate-500 truncate">{act.locationName || act.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
