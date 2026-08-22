import React, { useState, useMemo } from 'react';
import { X, Search, Plus, Compass, Clock, Star, MapPin } from 'lucide-react';
import { db } from '../../services/db';
import { formatCurrency } from '../../services/currency';
import { ActivityCategory, City } from '../../types';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayId: string;
  dayNumber: number;
  city: City;
  onAddActivity: (activityData: any) => void;
}

const CATEGORIES: ('All' | ActivityCategory)[] = [
  'All',
  'Sightseeing',
  'Food & Dining',
  'Culture & Art',
  'Adventure',
  'Nature',
  'Entertainment',
  'Nightlife',
];

export const AddActivityModal: React.FC<AddActivityModalProps> = ({
  isOpen,
  onClose,
  dayId,
  dayNumber,
  city,
  onAddActivity,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | ActivityCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'catalog' | 'custom'>('catalog');

  // Custom activity state
  const [customTitle, setCustomTitle] = useState('');
  const [customStartTime, setCustomStartTime] = useState('11:00');
  const [customDuration, setCustomDuration] = useState(90);
  const [customCost, setCustomCost] = useState(1500);
  const [customCategory, setCustomCategory] = useState<ActivityCategory>('Sightseeing');
  const [customLocation, setCustomLocation] = useState(city?.name || '');
  const [customNotes, setCustomNotes] = useState('');

  const cityActivities = useMemo(() => {
    return db.getActivities({
      cityId: city?.id,
      category: selectedCategory === 'All' ? undefined : selectedCategory,
      query: searchQuery,
    });
  }, [city?.id, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const handleSelectPredefined = (act: any) => {
    onAddActivity({
      activityId: act.id,
      title: act.name,
      startTime: act.bestTimeOfDay === 'Morning' ? '09:30' : act.bestTimeOfDay === 'Afternoon' ? '14:00' : '19:30',
      durationMinutes: act.durationMinutes,
      estimatedCostINR: act.estimatedCostINR,
      category: act.category,
      locationName: act.locationName,
      image: act.image,
      notes: act.description,
    });
    onClose();
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    onAddActivity({
      title: customTitle,
      startTime: customStartTime,
      durationMinutes: Number(customDuration),
      estimatedCostINR: Number(customCost),
      category: customCategory,
      locationName: customLocation,
      notes: customNotes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <Compass className="w-5 h-5 text-coral-400" />
              <span>Add Activity to Day {dayNumber} ({city?.name})</span>
            </h3>
            <p className="text-xs text-slate-400">Discover curated local experiences or create a custom plan</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === 'catalog'
                ? 'border-coral-500 text-coral-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Curated Experiences in {city?.name}
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === 'custom'
                ? 'border-coral-500 text-coral-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            + Create Custom Activity
          </button>
        </div>

        {/* Content */}
        {activeTab === 'catalog' ? (
          <div className="p-6 space-y-4">
            {/* Search & Categories */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder={`Search activities in ${city?.name}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none"
              />
            </div>

            {/* Category pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Activities List */}
            <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
              {cityActivities.map(act => (
                <div
                  key={act.id}
                  className="flex items-start justify-between p-3 rounded-2xl border border-slate-200 hover:border-coral-400 hover:shadow-md transition-all gap-3 bg-white"
                >
                  <img src={act.image} alt={act.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-coral-50 text-coral-600 border border-coral-200">
                        {act.category}
                      </span>
                      <div className="flex items-center text-xs text-amber-500 font-bold gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{act.rating}</span>
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mt-1 truncate">{act.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{act.description}</p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {act.durationMinutes} mins
                      </span>
                      <span className="font-bold text-slate-800">
                        {formatCurrency(act.estimatedCostINR)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectPredefined(act)}
                    className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              ))}

              {cityActivities.length === 0 && (
                <div className="text-center py-8">
                  <Compass className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-600 font-medium text-sm">No activities matched your search</p>
                  <button
                    onClick={() => setActiveTab('custom')}
                    className="mt-2 text-xs text-coral-600 font-bold underline"
                  >
                    Create a custom activity instead
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateCustom} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Activity Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Sunset Drinks at Rooftop Lounge, Bike Rental"
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-semibold text-sm outline-none focus:border-coral-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={customStartTime}
                  onChange={e => setCustomStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={customDuration}
                  onChange={e => setCustomDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Category
                </label>
                <select
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value as ActivityCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm outline-none bg-white"
                >
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Estimated Cost (INR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={customCost}
                  onChange={e => setCustomCost(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Location or Notes
              </label>
              <input
                type="text"
                placeholder="Address, meeting point, or voucher details..."
                value={customLocation}
                onChange={e => setCustomLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-md transition-colors"
              >
                Add Custom Activity
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
