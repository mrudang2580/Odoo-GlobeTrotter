import React from 'react';
import { 
  Compass, Plus, Sparkles, MapPin, Calendar, Wallet, 
  ArrowRight, TrendingUp, Star, ShieldCheck, Heart, 
  Clock, Award, Layers, CheckCircle2 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { formatCurrency } from '../services/currency';
import { City } from '../types';

interface DashboardViewProps {
  onNavigate: (tab: string, tripId?: string) => void;
  onOpenCreateTrip: () => void;
  onOpenSearch: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenCreateTrip,
  onOpenSearch,
}) => {
  const { user, toggleBookmark } = useAuth();
  const { trips, activeTrip, setActiveTripId, addCityStopToActiveTrip, copyTrip } = useTrip();

  const allCities = db.getCities();
  const recommendedCities = allCities.slice(0, 4);

  const upcomingTrips = trips.filter(t => t.status === 'upcoming' || t.status === 'planning');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800 text-white p-8 sm:p-12">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1800&auto=format&fit=crop&q=80"
            alt="Travel Hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral-500/20 border border-coral-500/30 text-coral-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome, {user?.name || 'Explorer'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-serif">
            Where will you <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-coral-400 via-orange-300 to-amber-300 bg-clip-text text-transparent">
              explore next?
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            Design multi-city itineraries, customize daily schedules, optimize budgets, and experience more of the world with ease.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenCreateTrip}
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-coral-500 to-orange-500 hover:from-coral-600 hover:to-orange-600 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-coral-500/30 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Plan New Trip</span>
            </button>

            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-5 py-3.5 bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm rounded-2xl border border-slate-700 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-coral-400" />
              <span>Explore Destinations</span>
            </button>
          </div>
        </div>

        {/* Floating Quick Stats on Desktop */}
        <div className="hidden lg:grid grid-cols-3 gap-4 absolute right-10 bottom-10 max-w-md w-full">
          <div className="bg-slate-800/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/80 text-center">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Planned Trips</div>
            <div className="text-xl font-black text-white mt-0.5">{trips.length}</div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/80 text-center">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Destinations</div>
            <div className="text-xl font-black text-white mt-0.5">{allCities.length}</div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/80 text-center">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Style</div>
            <div className="text-xl font-black text-coral-400 mt-0.5">{user?.travelStyle || 'Balanced'}</div>
          </div>
        </div>
      </div>

      {/* Active Trip Hero Barometer (if activeTrip is loaded) */}
      {activeTrip && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 min-w-0">
            <img
              src={activeTrip.coverImage}
              alt={activeTrip.title}
              className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-md"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-coral-50 text-coral-600 border border-coral-200">
                  Active Workspace
                </span>
                <span className="text-xs text-slate-500 font-semibold">{activeTrip.startDate}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 truncate mt-0.5">
                {activeTrip.title}
              </h3>
              <p className="text-xs text-slate-500 truncate">
                {activeTrip.stops.map(s => s.city.name).join(' ➔ ')} ({activeTrip.days.length} Days)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 self-end md:self-center">
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Estimated Budget</div>
              <div className="text-lg font-black text-slate-900">
                {formatCurrency(activeTrip.stats.totalEstimatedCostINR, activeTrip.currency)}
                <span className="text-xs font-semibold text-slate-400 ml-1">
                  / {formatCurrency(activeTrip.totalBudgetINR, activeTrip.currency)}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('itinerary', activeTrip.id)}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              <span>Open Itinerary</span>
              <ArrowRight className="w-4 h-4 text-coral-400" />
            </button>
          </div>
        </div>
      )}

      {/* Upcoming Trips Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 font-serif">Upcoming Journeys</h2>
            <p className="text-xs text-slate-500">Your planned itineraries and multi-city adventures</p>
          </div>

          <button
            onClick={() => onNavigate('my-trips')}
            className="text-xs font-bold text-coral-600 hover:text-coral-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Trips ({trips.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingTrips.map(trip => {
            const populated = db.getPopulatedTrip(trip.id) || trip;
            const stopsCount = (populated as any).stops?.length || 2;
            const routeStr = (populated as any).stops?.map((s: any) => s.city.name).join(' ➔ ') || 'Multi-City';

            return (
              <div
                key={trip.id}
                onClick={() => {
                  setActiveTripId(trip.id);
                  onNavigate('itinerary', trip.id);
                }}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-coral-400/50 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={trip.coverImage}
                      alt={trip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full">
                      {stopsCount} Cities
                    </div>
                    <div className="absolute top-3 right-3 bg-coral-500 text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full">
                      {trip.status}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-coral-500" />
                      <span>{trip.startDate} — {trip.endDate}</span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-coral-600 transition-colors">
                      {trip.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-1 font-medium">
                      {routeStr}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Budget</span>
                    <span className="font-extrabold text-slate-900">
                      {formatCurrency(trip.totalBudgetINR, trip.currency)}
                    </span>
                  </div>

                  <span className="text-coral-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Manage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Destinations */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 font-serif">Recommended Destinations</h2>
            <p className="text-xs text-slate-500">Popular global destinations ready to add to your journey</p>
          </div>

          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-bold text-coral-600 hover:text-coral-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All Cities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedCities.map(city => {
            const isBookmarked = user?.savedDestinationIds?.includes(city.id) || false;

            return (
              <div
                key={city.id}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => toggleBookmark(city.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                        isBookmarked ? 'bg-rose-500 text-white' : 'bg-slate-900/60 text-white hover:bg-slate-900'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
                    </button>

                    <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-lg">
                      {city.costIndex}
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-base text-slate-900">{city.name}</h3>
                      <span className="text-xs text-slate-500 font-medium">{city.country}</span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {city.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-[10px] text-slate-400 block font-semibold">Avg / Day</span>
                    <span className="font-extrabold text-slate-900">
                      {formatCurrency(city.avgDailyCostINR)}
                    </span>
                  </div>

                  {activeTrip && (
                    <button
                      onClick={() => addCityStopToActiveTrip(city.id, 2)}
                      className="px-3 py-1.5 bg-coral-50 hover:bg-coral-100 text-coral-600 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      + Add Stop
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
