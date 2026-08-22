import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Compass, Calendar, ArrowRight, X } from 'lucide-react';
import { db } from '../../services/db';
import { useTrip } from '../../context/TripContext';
import { formatCurrency } from '../../services/currency';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, tripId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const { trips, setActiveTripId, addCityStopToActiveTrip, activeTrip } = useTrip();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle search
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const cities = useMemo(() => db.getCities(), []);
  const activities = useMemo(() => db.getActivities(), []);

  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return {
        cities: cities.slice(0, 4),
        activities: activities.slice(0, 4),
        trips: trips.slice(0, 3),
      };
    }
    const q = query.toLowerCase();
    return {
      cities: cities.filter(c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.region.toLowerCase().includes(q)),
      activities: activities.filter(a => a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.locationName.toLowerCase().includes(q)),
      trips: trips.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)),
    };
  }, [query, cities, activities, trips]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden transform transition-all">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search cities, activities, landmarks, or your trips (e.g., Paris, Colosseum, Europe)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="flex-1 text-slate-900 placeholder-slate-400 bg-transparent border-none outline-none text-base font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 rounded">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {/* Trips */}
          {filteredResults.trips.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-coral-500" />
                <span>My Trips</span>
              </div>
              <div className="space-y-1">
                {filteredResults.trips.map(trip => (
                  <button
                    key={trip.id}
                    onClick={() => {
                      setActiveTripId(trip.id);
                      onNavigate('itinerary', trip.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={trip.coverImage} alt={trip.title} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="font-semibold text-slate-800 text-sm group-hover:text-coral-600 transition-colors">
                          {trip.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {trip.startDate} · Budget: {formatCurrency(trip.totalBudgetINR, trip.currency)}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-coral-500 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cities */}
          {filteredResults.cities.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-500" />
                <span>Destinations</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredResults.cities.map(city => (
                  <div
                    key={city.id}
                    className="flex items-center justify-between p-2 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={city.image} alt={city.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div className="truncate">
                        <div className="font-semibold text-slate-800 text-sm truncate">{city.name}</div>
                        <div className="text-xs text-slate-500 truncate">{city.country} · {city.costIndex}</div>
                      </div>
                    </div>
                    {activeTrip && (
                      <button
                        onClick={() => {
                          addCityStopToActiveTrip(city.id, 2);
                          onClose();
                        }}
                        className="text-xs font-medium text-coral-600 bg-coral-50 hover:bg-coral-100 px-2 py-1 rounded-lg shrink-0 transition-colors"
                      >
                        + Add Stop
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities */}
          {filteredResults.activities.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-500" />
                <span>Things to Do</span>
              </div>
              <div className="space-y-1">
                {filteredResults.activities.map(act => (
                  <div
                    key={act.id}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={act.image} alt={act.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div className="truncate">
                        <div className="font-semibold text-slate-800 text-sm truncate">{act.name}</div>
                        <div className="text-xs text-slate-500">
                          {act.category} · {act.durationMinutes} min · {formatCurrency(act.estimatedCostINR)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onNavigate('explore');
                        onClose();
                      }}
                      className="text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg shrink-0 transition-colors"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredResults.cities.length === 0 && filteredResults.activities.length === 0 && filteredResults.trips.length === 0 && (
            <div className="text-center py-10">
              <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-600 font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for &ldquo;Paris&rdquo;, &ldquo;Rome&rdquo;, or &ldquo;Cruise&rdquo;</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Tip: Use <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-semibold text-slate-700">Cmd</kbd> + <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-semibold text-slate-700">K</kbd> anywhere</span>
          <span>GlobeTrotter Search</span>
        </div>
      </div>
    </div>
  );
};
