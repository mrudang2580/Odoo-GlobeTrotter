import React, { useState } from 'react';
import { 
  Clock, MapPin, Trash2, ChevronUp, ChevronDown, Check, 
  Edit3, DollarSign, Compass 
} from 'lucide-react';
import { ItineraryActivity, ActivityCategory } from '../../types';
import { formatCurrency } from '../../services/currency';

interface ActivityCardProps {
  activity: ItineraryActivity;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<ItineraryActivity>) => void;
}

const CATEGORY_COLORS: Record<ActivityCategory, { bg: string; text: string; border: string }> = {
  'Sightseeing': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  'Food & Dining': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Culture & Art': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Adventure': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Nature': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'Shopping': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  'Entertainment': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  'Nightlife': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(activity.title);
  const [editTime, setEditTime] = useState(activity.startTime);
  const [editCost, setEditCost] = useState(activity.estimatedCostINR);
  const [editDuration, setEditDuration] = useState(activity.durationMinutes);

  const colors = CATEGORY_COLORS[activity.category] || CATEGORY_COLORS['Sightseeing'];

  const handleSave = () => {
    onUpdate({
      title: editTitle,
      startTime: editTime,
      estimatedCostINR: Number(editCost),
      durationMinutes: Number(editDuration),
    });
    setIsEditing(false);
  };

  return (
    <div className="relative group flex items-start gap-4">
      {/* Timeline Node & Time */}
      <div className="flex flex-col items-center shrink-0 w-16 pt-1">
        <div className="text-xs font-extrabold text-slate-800 tracking-tight">
          {activity.startTime}
        </div>
        <div className="text-[10px] text-slate-400 font-medium">
          {activity.durationMinutes}m
        </div>
      </div>

      {/* Main Card Content */}
      <div className={`flex-1 rounded-2xl border p-4 shadow-sm transition-all duration-200 ${
        activity.isCompleted 
          ? 'bg-slate-50/80 border-slate-200 opacity-70' 
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}>
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className="w-full text-xs font-bold p-1.5 border rounded-lg"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Time</label>
                <input
                  type="time"
                  value={editTime}
                  onChange={e => setEditTime(e.target.value)}
                  className="w-full text-xs p-1 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Duration (m)</label>
                <input
                  type="number"
                  value={editDuration}
                  onChange={e => setEditDuration(Number(e.target.value))}
                  className="w-full text-xs p-1 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Cost (₹)</label>
                <input
                  type="number"
                  value={editCost}
                  onChange={e => setEditCost(Number(e.target.value))}
                  className="w-full text-xs p-1 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setIsEditing(false)}
                className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-coral-500 text-white font-bold text-xs rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              {activity.image && (
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100 shadow-sm"
                />
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                    {activity.category}
                  </span>
                  {activity.isCompleted && (
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Completed
                    </span>
                  )}
                </div>

                <h4 className={`font-bold text-sm text-slate-900 leading-snug ${activity.isCompleted ? 'line-through text-slate-500' : ''}`}>
                  {activity.title}
                </h4>

                {activity.locationName && (
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{activity.locationName}</span>
                  </div>
                )}

                {activity.notes && (
                  <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {activity.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Right side: Cost & Action buttons */}
            <div className="flex flex-col items-end shrink-0 gap-2">
              <div className="font-extrabold text-sm text-slate-900">
                {formatCurrency(activity.estimatedCostINR)}
              </div>

              {/* Action controls (Move, Edit, Delete) */}
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onUpdate({ isCompleted: !activity.isCompleted })}
                  title={activity.isCompleted ? 'Mark uncompleted' : 'Mark completed'}
                  className={`p-1 rounded-lg border transition-colors ${
                    activity.isCompleted ? 'bg-emerald-500 text-white border-emerald-600' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>

                <button
                  disabled={isFirst}
                  onClick={onMoveUp}
                  title="Move Up"
                  className={`p-1 rounded-lg border border-slate-200 text-slate-500 transition-colors ${
                    isFirst ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>

                <button
                  disabled={isLast}
                  onClick={onMoveDown}
                  title="Move Down"
                  className={`p-1 rounded-lg border border-slate-200 text-slate-500 transition-colors ${
                    isLast ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsEditing(true)}
                  title="Quick Edit"
                  className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onDelete}
                  title="Delete Activity"
                  className="p-1 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
