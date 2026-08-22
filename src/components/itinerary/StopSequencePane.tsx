import React, { useState } from 'react';
import { 
  MapPin, Plus, Trash2, ChevronRight, Train, Plane, Car, 
  Clock, ArrowRight, Sparkles, Navigation, Calendar, X 
} from 'lucide-react';
import { PopulatedTrip, City } from '../../types';
import { db } from '../../services/db';
import { formatCurrency } from '../../services/currency';

interface StopSequencePaneProps {
  trip: PopulatedTrip;
  activeStopId: string;
  onSelectStop: (stopId: string) => void;
  onAddStop: (cityId: string, nights: number) => void;
  onRemoveStop: (stopId: string) => void;
}

export const StopSequencePane: React.FC<StopSequencePaneProps> = ({
  trip,
  activeStopId,
  onSelectStop,
  onAddStop,
  onRemoveStop,
}) => {
  const [isAddingStop, setIsAddingStop] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState('');
  const [nights, setNights] = useState(2);

  const allCities = db.getCities();
  const availableCities = allCities.filter(c => !trip.stops.some(s => s.cityId === c.id));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCityId) return;
    onAddStop(selectedCityId, nights);
    setIsAddingStop(false);
    setSelectedCityId('');
  };

  const getTransportIcon = (mode?: string) => {
    switch (mode) {
      case 'flight':
        return <Plane className="w-3.5 h-3.5 text-sky-500" />;
      case 'train':
        return <Train className="w-3.5 h-3.5 text-emerald-500" />;
      case 'drive':
        return <Car className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <ArrowRight className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Pane Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-coral-500" />
            <span>Route & Stops Sequence</span>
          </h3>
          <p className="text-[11px] text-slate-500">
            {trip.stops.length} Cities · {trip.days.length} Days Itinerary
          </p>
        </div>

        <button
          onClick={() => setIsAddingStop(!isAddingStop)}
          className="text-xs font-bold text-coral-600 bg-coral-50 hover:bg-coral-100 px-2.5 py-1 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Stop</span>
        </button>
      </div>

      {/* Add Stop Inline Form */}
      {isAddingStop && (
        <form onSubmit={handleAdd} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Choose Next Destination</span>
            <button type="button" onClick={() => setIsAddingStop(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <select
              value={selectedCityId}
              onChange={e => setSelectedCityId(e.target.value)}
              required
              className="w-full text-xs font-semibold p-2 rounded-xl border border-slate-200 bg-white text-slate-800 outline-none"
            >
              <option value="">Select a city...</option>
              {(availableCities.length > 0 ? availableCities : allCities).map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}, {c.country} ({c.costIndex})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span>Duration:</span>
              <input
                type="number"
                min="1"
                max="14"
                value={nights}
                onChange={e => setNights(Number(e.target.value))}
                className="w-12 text-center p-1 rounded-lg border border-slate-200 bg-white font-bold"
              />
              <span>nights</span>
            </div>

            <button
              type="submit"
              className="px-3 py-1.5 bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
            >
              Confirm Stop
            </button>
          </div>
        </form>
      )}

      {/* Stops Sequence Timeline */}
      <div className="space-y-3">
        {trip.stops.map((stop, index) => {
          const isSelected = stop.id === activeStopId;
          const stopDays = trip.days.filter(d => d.tripStopId === stop.id);
          const stopActivitiesCount = stopDays.reduce((acc, d) => acc + d.activities.length, 0);

          return (
            <div key={stop.id} className="space-y-2">
              {/* City Stop Card */}
              <div
                onClick={() => onSelectStop(stop.id)}
                className={`relative flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-coral-500/30'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                    isSelected ? 'bg-coral-500 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {index + 1}
                  </div>

                  <img
                    src={stop.city.image}
                    alt={stop.city.name}
                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-black/10"
                  />

                  <div className="min-w-0">
                    <div className="font-extrabold text-sm truncate flex items-center gap-1.5">
                      <span>{stop.city.name}</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded-md ${
                        isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {stop.nights}N
                      </span>
                    </div>
                    <div className={`text-[11px] truncate ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                      {stop.arrivalDate} · {stopActivitiesCount} activities
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {trip.stops.length > 1 && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onRemoveStop(stop.id);
                      }}
                      title="Remove Stop"
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSelected ? 'text-slate-400 hover:text-rose-400' : 'text-slate-400 hover:text-rose-600'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-coral-400' : 'text-slate-400'}`} />
                </div>
              </div>

              {/* Transit Leg to Next Stop */}
              {stop.transportToNext && index < trip.stops.length - 1 && (
                <div className="flex items-center gap-2 px-4 py-1.5 text-xs text-slate-500 bg-slate-50/80 rounded-xl border border-dashed border-slate-200">
                  {getTransportIcon(stop.transportToNext.mode)}
                  <span className="font-medium truncate">
                    {stop.transportToNext.carrier || 'Transit'} · {stop.transportToNext.duration}
                  </span>
                  <span className="font-bold text-slate-700 ml-auto">
                    {formatCurrency(stop.transportToNext.estimatedCostINR)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
