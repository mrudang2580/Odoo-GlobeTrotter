import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Clock, MapPin, Plus, 
  ChevronLeft, ChevronRight, Check, Compass, Layers, Sparkles 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { formatCurrency } from '../services/currency';
import { AddActivityModal } from '../components/itinerary/AddActivityModal';

export const CalendarView: React.FC = () => {
  const { activeTrip, addActivityToDay, deleteItineraryActivity, updateItineraryActivity } = useTrip();

  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar');
  const [selectedDayId, setSelectedDayId] = useState<string>('');
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);

  if (!activeTrip) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
        <h3 className="text-xl font-bold text-slate-700">No active trip selected</h3>
        <p className="text-xs text-slate-500 mt-1">Select a trip to view its calendar timeline.</p>
      </div>
    );
  }

  const days = activeTrip.days;

  const handleOpenAddForDay = (dayId: string) => {
    setSelectedDayId(dayId);
    setIsAddActivityOpen(true);
  };

  const activeDayForModal = days.find(d => d.id === selectedDayId) || days[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              Trip Schedule
            </span>
            <span className="text-xs text-slate-500 font-semibold">{activeTrip.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 font-serif">
            Interactive Calendar & Timeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Visualize your multi-city journey across {activeTrip.days.length} days ({activeTrip.startDate} to {activeTrip.endDate}).
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'calendar'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Day Cards Grid</span>
          </button>

          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'timeline'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Vertical Gantt Timeline</span>
          </button>
        </div>
      </div>

      {/* View Mode 1: Day Cards Grid */}
      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {days.map((day) => {
            const dayCost = day.activities.reduce((s, a) => s + Number(a.estimatedCostINR || 0), 0);

            return (
              <div
                key={day.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Card Top */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center">
                        {day.dayNumber}
                      </span>
                      <div>
                        <div className="font-extrabold text-sm text-slate-900">{day.city?.name}</div>
                        <div className="text-[11px] text-slate-500">{day.date}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenAddForDay(day.id)}
                      className="p-1.5 rounded-xl bg-coral-50 hover:bg-coral-100 text-coral-600 transition-colors"
                      title="Add Activity to this Day"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Day Activities List */}
                  <div className="space-y-2 mt-3 max-h-56 overflow-y-auto pr-1">
                    {day.activities.map((act) => (
                      <div
                        key={act.id}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all text-xs"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-extrabold text-slate-800 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{act.startTime}</span>
                          </span>
                          <span className="font-bold text-slate-700">
                            {formatCurrency(act.estimatedCostINR, activeTrip.currency)}
                          </span>
                        </div>
                        <div className="font-semibold text-slate-900 mt-1 truncate">{act.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <span className="px-1.5 py-0.2 rounded bg-slate-200/60 text-slate-600 font-medium">
                            {act.category}
                          </span>
                          <span>· {act.durationMinutes}m</span>
                        </div>
                      </div>
                    ))}

                    {day.activities.length === 0 && (
                      <div className="py-6 text-center text-xs text-slate-400 border border-dashed rounded-2xl">
                        Free day / No activities
                      </div>
                    )}
                  </div>
                </div>

                {/* Day Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">{day.activities.length} activities</span>
                  <span className="font-extrabold text-slate-900">
                    {formatCurrency(dayCost, activeTrip.currency)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* View Mode 2: Vertical Continuous Timeline */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
          {days.map((day, dayIndex) => (
            <div key={day.id} className="relative pl-8 border-l-2 border-slate-200 pb-8 last:pb-0">
              {/* Timeline Circle Node */}
              <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-slate-900 border-4 border-white text-white font-extrabold text-xs flex items-center justify-center shadow">
                {day.dayNumber}
              </div>

              {/* Day Section Header */}
              <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-slate-900">
                      Day {day.dayNumber} — {day.title}
                    </h3>
                    <span className="text-xs font-bold text-coral-600 bg-coral-50 px-2 py-0.5 rounded-full border border-coral-200">
                      {day.city?.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{day.date} · {day.notes}</p>
                </div>

                <button
                  onClick={() => handleOpenAddForDay(day.id)}
                  className="text-xs font-bold text-coral-600 bg-coral-50 hover:bg-coral-100 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Activity</span>
                </button>
              </div>

              {/* Day Activities */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {day.activities.map(act => (
                  <div
                    key={act.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-coral-400 hover:shadow-md transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-800 flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {act.startTime}
                      </span>
                      <span className="font-black text-slate-900">
                        {formatCurrency(act.estimatedCostINR, activeTrip.currency)}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-slate-900 line-clamp-1">{act.title}</div>
                    {act.locationName && (
                      <div className="text-xs text-slate-500 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{act.locationName}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Activity Modal */}
      {activeDayForModal && (
        <AddActivityModal
          isOpen={isAddActivityOpen}
          onClose={() => setIsAddActivityOpen(false)}
          dayId={activeDayForModal.id}
          dayNumber={activeDayForModal.dayNumber}
          city={activeDayForModal.city}
          onAddActivity={actData => addActivityToDay(activeDayForModal.id, actData)}
        />
      )}
    </div>
  );
};
