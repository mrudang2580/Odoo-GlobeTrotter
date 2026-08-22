import React, { useState, useMemo } from 'react';
import { 
  Map, Plus, Search, Calendar, Wallet, Trash2, 
  Copy, Share2, ArrowRight, Sparkles, Filter 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { db } from '../services/db';
import { formatCurrency } from '../services/currency';

interface MyTripsViewProps {
  onNavigate: (tab: string, tripId?: string) => void;
  onOpenCreateTrip: () => void;
  onOpenShareModal: () => void;
}

export const MyTripsView: React.FC<MyTripsViewProps> = ({
  onNavigate,
  onOpenCreateTrip,
  onOpenShareModal,
}) => {
  const { trips, setActiveTripId, deleteTrip, copyTrip } = useTrip();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'planning' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'budget' | 'title'>('date');

  const filteredTrips = useMemo(() => {
    let list = [...trips];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }

    if (statusFilter !== 'all') {
      list = list.filter(t => t.status === statusFilter);
    }

    if (sortBy === 'date') {
      list.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    } else if (sortBy === 'budget') {
      list.sort((a, b) => (b.totalBudgetINR || 0) - (a.totalBudgetINR || 0));
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [trips, searchQuery, statusFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-coral-600 bg-coral-50 px-2.5 py-0.5 rounded-full border border-coral-200">
              Trip Hub
            </span>
            <span className="text-xs text-slate-500 font-semibold">{trips.length} Total Itineraries</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 font-serif">
            My Travel Itineraries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your past adventures, upcoming journeys, and customized day-by-day plans.
          </p>
        </div>

        <button
          onClick={onOpenCreateTrip}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-coral-500 to-orange-500 hover:from-coral-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-coral-500/25 active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Plan New Trip</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search trips..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 outline-none font-medium"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(['all', 'upcoming', 'planning', 'completed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-400 font-semibold">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 outline-none"
          >
            <option value="date">Date</option>
            <option value="budget">Budget</option>
            <option value="title">Name</option>
          </select>
        </div>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map(trip => {
          const populated = db.getPopulatedTrip(trip.id) || trip;
          const stopsCount = (populated as any).stops?.length || 1;
          const daysCount = (populated as any).days?.length || 1;
          const routeStr = (populated as any).stops?.map((s: any) => s.city.name).join(' ➔ ') || 'Destinations';

          return (
            <div
              key={trip.id}
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full">
                    {stopsCount} Stops · {daysCount} Days
                  </div>
                  <div className="absolute top-3 right-3 bg-coral-500 text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    {trip.status}
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-coral-500" />
                    <span>{trip.startDate} — {trip.endDate}</span>
                  </div>

                  <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-coral-600 transition-colors">
                    {trip.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-medium line-clamp-2">
                    {routeStr}
                  </p>
                </div>
              </div>

              {/* Trip Actions & Budget */}
              <div className="p-5 pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Target Budget</span>
                    <span className="font-extrabold text-slate-900">
                      {formatCurrency(trip.totalBudgetINR, trip.currency)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTripId(trip.id);
                      onNavigate('itinerary', trip.id);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    <span>Open Planner</span>
                    <ArrowRight className="w-3.5 h-3.5 text-coral-400" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                  <button
                    onClick={() => copyTrip(trip.id)}
                    className="hover:text-slate-700 flex items-center gap-1 transition-colors"
                    title="Duplicate Itinerary"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Clone</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTripId(trip.id);
                      onOpenShareModal();
                    }}
                    className="hover:text-slate-700 flex items-center gap-1 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>

                  <button
                    onClick={() => deleteTrip(trip.id)}
                    className="hover:text-rose-600 flex items-center gap-1 transition-colors"
                    title="Delete Trip"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTrips.length === 0 && (
          <div className="col-span-full py-16 text-center space-y-3 bg-white rounded-3xl border border-dashed border-slate-200">
            <Map className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-extrabold text-slate-800 text-base">No trips match your filters</h4>
            <p className="text-xs text-slate-500">Create a new journey or clear your search.</p>
            <button
              onClick={onOpenCreateTrip}
              className="px-5 py-2.5 bg-coral-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              + Plan New Trip
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
