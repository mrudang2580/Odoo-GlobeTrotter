import React from 'react';
import { Clock, DollarSign, Star, Tag, Plus } from 'lucide-react';
import { Activity } from '../lib/types';
import { formatCurrency } from '../lib/utils';

export function ActivityCard({ activity, onAdd }: { activity: Activity; onAdd?: (act: Activity) => void }) {
  const categoryColors = {
    sightseeing: 'bg-blue-50 text-blue-700 border-blue-200',
    food: 'bg-orange-50 text-orange-700 border-orange-200',
    adventure: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    culture: 'bg-purple-50 text-purple-700 border-purple-200',
    nightlife: 'bg-pink-50 text-pink-700 border-pink-200'
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={activity.image_url}
          alt={activity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border backdrop-blur-md ${categoryColors[activity.category] || 'bg-slate-100 text-slate-700'}`}>
          {activity.category}
        </span>

        {activity.rating && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-slate-900 text-xs font-bold flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            {activity.rating}
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h4 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-sky-600 transition-colors">
            {activity.name}
          </h4>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {activity.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3 text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              {activity.duration_minutes}m
            </span>
            <span className="font-bold text-emerald-600">
              {activity.cost === 0 ? 'Free' : formatCurrency(activity.cost)}
            </span>
          </div>

          <button
            onClick={() => onAdd?.(activity)}
            className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
