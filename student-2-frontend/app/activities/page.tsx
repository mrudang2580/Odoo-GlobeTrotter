'use client';
import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, DollarSign, Star, Tag, Check } from 'lucide-react';
import { ActivityCard } from '../../components/ActivityCard';
import { api } from '../../lib/api';
import { Activity } from '../../lib/types';

export default function ActivitiesExplorerPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [addedToast, setAddedToast] = useState<string | null>(null);

  useEffect(() => {
    api.getActivities({ category, search }).then(setActivities);
  }, [category, search]);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'sightseeing', label: 'Sightseeing' },
    { id: 'culture', label: 'Art & Culture' },
    { id: 'food', label: 'Food & Wine' },
    { id: 'adventure', label: 'Outdoor Adventure' },
  ];

  const handleAddActivity = (act: Activity) => {
    setAddedToast(act.name);
    setTimeout(() => setAddedToast(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Activity & Tour Catalog</h1>
          <p className="text-slate-500 text-xs mt-0.5">Explore curated experiences, guided museum visits, culinary walks, and tickets.</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Toast */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          Added "{addedToast}" to your active trip draft!
        </div>
      )}

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              category === c.id
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Activity Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onAdd={handleAddActivity}
          />
        ))}
      </div>
    </div>
  );
}
