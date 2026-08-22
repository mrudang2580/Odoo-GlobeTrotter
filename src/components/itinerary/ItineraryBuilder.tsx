import React, { useState } from 'react';
import { 
  Compass, Map, Calendar, Wallet, Share2, Plus, 
  Sparkles, Layers, List, MapPin, Eye, CheckCircle2 
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { StopSequencePane } from './StopSequencePane';
import { DayTimelinePane } from './DayTimelinePane';
import { TripSummaryPane } from './TripSummaryPane';
import { AddActivityModal } from './AddActivityModal';
import { RouteMap } from '../map/RouteMap';

interface ItineraryBuilderProps {
  onNavigate: (tab: string, tripId?: string) => void;
  onOpenShareModal: () => void;
  onOpenCreateTrip: () => void;
}

export const ItineraryBuilder: React.FC<ItineraryBuilderProps> = ({
  onNavigate,
  onOpenShareModal,
  onOpenCreateTrip,
}) => {
  const { 
    activeTrip, 
    addCityStopToActiveTrip, 
    removeStopFromActiveTrip, 
    addActivityToDay, 
    updateItineraryActivity, 
    deleteItineraryActivity, 
    reorderActivities, 
    copyTrip 
  } = useTrip();

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [activeStopId, setActiveStopId] = useState<string>('');
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [targetDayId, setTargetDayId] = useState<string>('');
  const [showMapRoute, setShowMapRoute] = useState(false);

  if (!activeTrip) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-coral-50 flex items-center justify-center mx-auto text-coral-500">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">No Trip Selected</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Select an existing journey or start planning a new multi-city itinerary from scratch.
        </p>
        <button
          onClick={onOpenCreateTrip}
          className="px-6 py-3 bg-gradient-to-r from-coral-500 to-orange-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-coral-500/25 cursor-pointer"
        >
          + Plan New Trip
        </button>
      </div>
    );
  }

  const currentDay = activeTrip.days[selectedDayIndex] || activeTrip.days[0];

  const handleOpenAddActivity = (dayId: string) => {
    setTargetDayId(dayId);
    setIsAddActivityOpen(true);
  };

  const handleMoveActivity = (dayId: string, activityId: string, direction: 'up' | 'down') => {
    const day = activeTrip.days.find(d => d.id === dayId);
    if (!day) return;
    const activities = [...day.activities];
    const index = activities.findIndex(a => a.id === activityId);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const temp = activities[index];
      activities[index] = activities[index - 1];
      activities[index - 1] = temp;
    } else if (direction === 'down' && index < activities.length - 1) {
      const temp = activities[index];
      activities[index] = activities[index + 1];
      activities[index + 1] = temp;
    }

    reorderActivities(dayId, activities.map(a => a.id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Trip Hero Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200">
        <div className="h-44 sm:h-52 w-full relative">
          <img
            src={activeTrip.coverImage}
            alt={activeTrip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-coral-500 text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                {activeTrip.status}
              </span>
              <span className="text-xs font-semibold text-slate-300">
                {activeTrip.startDate} — {activeTrip.endDate} ({activeTrip.days.length} Days)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-serif">
              {activeTrip.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl line-clamp-1">
              {activeTrip.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowMapRoute(!showMapRoute)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                showMapRoute
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                  : 'bg-white/20 hover:bg-white/30 backdrop-blur-md text-white'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>{showMapRoute ? 'Hide Map Route' : 'Show Map Route'}</span>
            </button>

            <button
              onClick={onOpenShareModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map View Toggle */}
      {showMapRoute && (
        <div className="h-80 rounded-3xl overflow-hidden shadow-lg border border-slate-200 animate-in fade-in">
          <RouteMap trip={activeTrip} />
        </div>
      )}

      {/* 3-Pane Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE (Route & Stops Sequence): 3 cols */}
        <div className="lg:col-span-3">
          <StopSequencePane
            trip={activeTrip}
            activeStopId={activeStopId || currentDay?.tripStopId || activeTrip.stops[0]?.id}
            onSelectStop={stopId => {
              setActiveStopId(stopId);
              const firstDayIdx = activeTrip.days.findIndex(d => d.tripStopId === stopId);
              if (firstDayIdx !== -1) setSelectedDayIndex(firstDayIdx);
            }}
            onAddStop={(cityId, nights) => addCityStopToActiveTrip(cityId, nights)}
            onRemoveStop={stopId => removeStopFromActiveTrip(stopId)}
          />
        </div>

        {/* CENTER PANE (Day-by-Day Workspace): 6 cols */}
        <div className="lg:col-span-6">
          <DayTimelinePane
            trip={activeTrip}
            selectedDayIndex={selectedDayIndex}
            onSelectDayIndex={idx => {
              setSelectedDayIndex(idx);
              const d = activeTrip.days[idx];
              if (d) setActiveStopId(d.tripStopId);
            }}
            onOpenAddActivity={handleOpenAddActivity}
            onMoveActivity={handleMoveActivity}
            onDeleteActivity={deleteItineraryActivity}
            onUpdateActivity={updateItineraryActivity}
          />
        </div>

        {/* RIGHT PANE (Live Summary & Financial Barometer): 3 cols */}
        <div className="lg:col-span-3">
          <TripSummaryPane
            trip={activeTrip}
            onOpenBudget={() => onNavigate('budget')}
            onOpenCalendar={() => onNavigate('calendar')}
            onShare={onOpenShareModal}
            onCopyTrip={() => copyTrip(activeTrip.id)}
          />
        </div>
      </div>

      {/* Add Activity Modal */}
      {currentDay && (
        <AddActivityModal
          isOpen={isAddActivityOpen}
          onClose={() => setIsAddActivityOpen(false)}
          dayId={targetDayId || currentDay.id}
          dayNumber={currentDay.dayNumber}
          city={currentDay.city}
          onAddActivity={actData => addActivityToDay(targetDayId || currentDay.id, actData)}
        />
      )}
    </div>
  );
};
