import React, { useState } from 'react';
import { 
  Calendar, MapPin, Plus, Sparkles, Sun, Clock, 
  ChevronLeft, ChevronRight, Edit2, Check 
} from 'lucide-react';
import { PopulatedItineraryDay, PopulatedTrip, ItineraryActivity } from '../../types';
import { ActivityCard } from './ActivityCard';
import { formatCurrency } from '../../services/currency';

interface DayTimelinePaneProps {
  trip: PopulatedTrip;
  selectedDayIndex: number;
  onSelectDayIndex: (index: number) => void;
  onOpenAddActivity: (dayId: string) => void;
  onMoveActivity: (dayId: string, activityId: string, direction: 'up' | 'down') => void;
  onDeleteActivity: (activityId: string) => void;
  onUpdateActivity: (activityId: string, updates: any) => void;
}

export const DayTimelinePane: React.FC<DayTimelinePaneProps> = ({
  trip,
  selectedDayIndex,
  onSelectDayIndex,
  onOpenAddActivity,
  onMoveActivity,
  onDeleteActivity,
  onUpdateActivity,
}) => {
  const currentDay = trip.days[selectedDayIndex] || trip.days[0];

  const dayActivities = currentDay?.activities || [];
  const dayTotalCost = dayActivities.reduce((sum, a) => sum + (Number(a.estimatedCostINR) || 0), 0);

  if (!currentDay) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
        <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <h4 className="font-bold text-slate-700">No days configured</h4>
        <p className="text-xs text-slate-500 mt-1">Add a city stop to generate itinerary days.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Day Selector Tabs Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {trip.days.map((day, idx) => {
            const isSelected = idx === selectedDayIndex;
            return (
              <button
                key={day.id}
                onClick={() => onSelectDayIndex(idx)}
                className={`flex flex-col items-start px-3.5 py-2 rounded-xl text-left transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-black ${isSelected ? 'text-coral-400' : 'text-slate-500'}`}>
                    Day {day.dayNumber}
                  </span>
                  <span className="text-[10px] opacity-75 truncate max-w-[70px]">
                    · {day.city?.name}
                  </span>
                </div>
                <div className="text-[10px] opacity-80 mt-0.5 font-medium">
                  {day.date.substring(5)} · {day.activities.length} acts
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Day Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-coral-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                DAY {currentDay.dayNumber}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {currentDay.date}
              </span>
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-coral-500" />
                {currentDay.city?.name}, {currentDay.city?.country}
              </span>
            </div>

            <h2 className="text-xl font-black text-slate-900 mt-1">
              {currentDay.title}
            </h2>

            {currentDay.city?.weather && (
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Forecast: {currentDay.city.weather.temp}, {currentDay.city.weather.condition}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Day Spend</div>
              <div className="text-base font-extrabold text-slate-900">
                {formatCurrency(dayTotalCost, trip.currency)}
              </div>
            </div>

            <button
              onClick={() => onOpenAddActivity(currentDay.id)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-coral-500 to-orange-500 hover:from-coral-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-md shadow-coral-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Activity</span>
            </button>
          </div>
        </div>

        {/* Activities Timeline */}
        <div className="space-y-4 pt-2">
          {dayActivities.map((activity, actIdx) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              isFirst={actIdx === 0}
              isLast={actIdx === dayActivities.length - 1}
              onMoveUp={() => onMoveActivity(currentDay.id, activity.id, 'up')}
              onMoveDown={() => onMoveActivity(currentDay.id, activity.id, 'down')}
              onDelete={() => onDeleteActivity(activity.id)}
              onUpdate={updates => onUpdateActivity(activity.id, updates)}
            />
          ))}

          {dayActivities.length === 0 && (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-coral-500 mx-auto" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">No activities scheduled for Day {currentDay.dayNumber} yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Discover top-rated sights, restaurants, and tours in {currentDay.city?.name} or create your custom plans.
                </p>
              </div>
              <button
                onClick={() => onOpenAddActivity(currentDay.id)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Browse {currentDay.city?.name} Activities</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
