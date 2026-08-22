import React from 'react';
import { Map, Navigation, ArrowRight, Compass, Plus, Layers } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { RouteMap } from '../components/map/RouteMap';
import { formatCurrency } from '../services/currency';

interface MapRouteViewProps {
  onNavigateToBuilder: (tripId: string) => void;
  onOpenCreateTrip: () => void;
}

export const MapRouteView: React.FC<MapRouteViewProps> = ({
  onNavigateToBuilder,
  onOpenCreateTrip,
}) => {
  const { activeTrip } = useTrip();

  if (!activeTrip) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Map className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-xl font-bold text-slate-700">No active journey selected</h3>
        <p className="text-xs text-slate-500">Select or create a trip to view its interactive geographical map.</p>
        <button
          onClick={onOpenCreateTrip}
          className="px-5 py-2.5 bg-coral-500 text-white font-bold text-xs rounded-xl shadow-md"
        >
          + Plan New Trip
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              Interactive Route Map
            </span>
            <span className="text-xs text-slate-500 font-semibold">{activeTrip.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 font-serif">
            Geographical Route & Waypoints
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Connecting {activeTrip.stops.length} destinations with transit vectors across {activeTrip.days.length} days.
          </p>
        </div>

        <button
          onClick={() => onNavigateToBuilder(activeTrip.id)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all self-start sm:self-auto cursor-pointer"
        >
          <span>Open Day-by-Day Workspace</span>
          <ArrowRight className="w-3.5 h-3.5 text-coral-400" />
        </button>
      </div>

      {/* Map Container */}
      <div className="h-[520px] rounded-3xl overflow-hidden border border-slate-200 shadow-xl relative">
        <RouteMap trip={activeTrip} />
      </div>

      {/* Stops Route Flow Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-extrabold text-slate-900 text-base mb-4">Itinerary Waypoint Sequence</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTrip.stops.map((stop, idx) => (
            <div
              key={stop.id}
              className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100"
            >
              <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <img src={stop.city.image} alt={stop.city.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
              <div className="min-w-0">
                <div className="font-extrabold text-sm text-slate-900 truncate">{stop.city.name}</div>
                <div className="text-xs text-slate-500">{stop.city.country} · {stop.nights} nights</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{stop.arrivalDate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
