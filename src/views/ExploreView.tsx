import React, { useState, useMemo } from 'react';
import { 
  Globe, Compass, Search, MapPin, Heart, Plus, 
  Star, Clock, Sun, Check, Filter, ArrowRight 
} from 'lucide-react';
import { db } from '../services/db';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../services/currency';
import { ActivityCategory } from '../types';

const REGIONS = ['All', 'Europe', 'Asia', 'North America', 'Middle East'];
const COST_LEVELS = ['All', 'Budget ($)', 'Moderate ($$)', 'Premium ($$$)', 'Luxury ($$$$)'];
const ACTIVITY_CATEGORIES: ('All' | ActivityCategory)[] = [
  'All',
  'Sightseeing',
  'Food & Dining',
  'Culture & Art',
  'Adventure',
  'Nature',
  'Entertainment',
  'Nightlife',
];

export const ExploreView: React.FC = () => {
  const { user, toggleBookmark } = useAuth();
  const { activeTrip, addCityStopToActiveTrip, addActivityToDay } = useTrip();

  const [activeTab, setActiveTab] = useState<'cities' | 'activities'>('cities');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCost, setSelectedCost] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ActivityCategory>('All');
  const [selectedActivityCity, setSelectedActivityCity] = useState('All');

  const allCities = useMemo(() => db.getCities(), []);
  const allActivities = useMemo(() => db.getActivities(), []);

  // Filtered Cities
  const filteredCities = useMemo(() => {
    let list = [...allCities];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }

    if (selectedRegion !== 'All') {
      list = list.filter(c => c.region === selectedRegion);
    }

    if (selectedCost !== 'All') {
      list = list.filter(c => c.costIndex === selectedCost);
    }

    return list;
  }, [allCities, searchQuery, selectedRegion, selectedCost]);

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    let list = [...allActivities];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.locationName.toLowerCase().includes(q));
    }

    if (selectedCategory !== 'All') {
      list = list.filter(a => a.category === selectedCategory);
    }

    if (selectedActivityCity !== 'All') {
      list = list.filter(a => a.cityId === selectedActivityCity);
    }

    return list;
  }, [allActivities, searchQuery, selectedCategory, selectedActivityCity]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Global Discovery Hub
            </span>
            <span className="text-xs text-slate-500 font-semibold">{allCities.length} Cities · {allActivities.length}+ Experiences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 font-serif">
            Explore Destinations & Experiences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Discover curated cities, iconic landmarks, culinary masterclasses, and adventure activities.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('cities')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cities'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Destinations ({allCities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('activities')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'activities'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Things to Do ({allActivities.length})</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder={activeTab === 'cities' ? 'Search cities, countries, or regions...' : 'Search tours, food, monuments...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none font-medium"
            />
          </div>

          {/* City / Category secondary filter */}
          {activeTab === 'cities' ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedRegion}
                onChange={e => setSelectedRegion(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none"
              >
                {REGIONS.map(r => (
                  <option key={r} value={r}>Region: {r}</option>
                ))}
              </select>

              <select
                value={selectedCost}
                onChange={e => setSelectedCost(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none"
              >
                {COST_LEVELS.map(c => (
                  <option key={c} value={c}>Cost: {c}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedActivityCity}
                onChange={e => setSelectedActivityCity(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none"
              >
                <option value="All">All Cities</option>
                {allCities.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Category Pills (for Activities) */}
        {activeTab === 'activities' && (
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {ACTIVITY_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results View: Cities */}
      {activeTab === 'cities' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCities.map(city => {
            const isBookmarked = user?.savedDestinationIds?.includes(city.id) || false;

            return (
              <div
                key={city.id}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-coral-400/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden">
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

                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber-500" />
                      <span>{city.weather.temp}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-lg text-slate-900">{city.name}</h3>
                      <span className="text-xs text-slate-500 font-semibold">{city.country}</span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {city.description}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-1">
                      {city.topHighlights.slice(0, 3).map((h, i) => (
                        <span key={i} className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Avg Daily Spend</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {formatCurrency(city.avgDailyCostINR)}
                    </span>
                  </div>

                  {activeTrip && (
                    <button
                      onClick={() => addCityStopToActiveTrip(city.id, 2)}
                      className="px-3.5 py-1.5 bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Stop</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Results View: Activities */}
      {activeTab === 'activities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map(act => {
            const city = allCities.find(c => c.id === act.cityId);

            return (
              <div
                key={act.id}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={act.image}
                      alt={act.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {city?.name}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{act.rating}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-coral-50 text-coral-600 border border-coral-200">
                      {act.category}
                    </span>

                    <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                      {act.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {act.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {act.durationMinutes} mins
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[120px]">{act.locationName}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Estimated Cost</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {formatCurrency(act.estimatedCostINR)}
                    </span>
                  </div>

                  {activeTrip && activeTrip.days[0] && (
                    <button
                      onClick={() => addActivityToDay(activeTrip.days[0].id, {
                        activityId: act.id,
                        title: act.name,
                        startTime: '11:00',
                        durationMinutes: act.durationMinutes,
                        estimatedCostINR: act.estimatedCostINR,
                        category: act.category,
                        locationName: act.locationName,
                        image: act.image,
                      })}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Trip</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
