import React from 'react';
import { 
  Wallet, TrendingUp, AlertTriangle, CheckCircle2, Share2, 
  Copy, Calendar, ArrowUpRight, Sparkles, MapPin, Layers 
} from 'lucide-react';
import { PopulatedTrip } from '../../types';
import { formatCurrency } from '../../services/currency';

interface TripSummaryPaneProps {
  trip: PopulatedTrip;
  onOpenBudget: () => void;
  onOpenCalendar: () => void;
  onShare: () => void;
  onCopyTrip: () => void;
}

export const TripSummaryPane: React.FC<TripSummaryPaneProps> = ({
  trip,
  onOpenBudget,
  onOpenCalendar,
  onShare,
  onCopyTrip,
}) => {
  const { stats } = trip;
  const budgetLimit = trip.totalBudgetINR || 120000;
  const spent = stats.totalEstimatedCostINR;
  const isOver = stats.isOverBudget;
  const diff = stats.budgetDifferenceINR;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-5">
      {/* Pane Header */}
      <div>
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
          <Wallet className="w-4 h-4 text-coral-500" />
          <span>Live Financial Barometer</span>
        </h3>
        <p className="text-[11px] text-slate-500">Real-time expenditure vs. planned budget</p>
      </div>

      {/* Spend Highlight */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Estimated Total</span>
          <span>Target Budget</span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-black tracking-tight text-white font-sans">
            {formatCurrency(spent, trip.currency)}
          </div>
          <div className="text-xs text-slate-400 font-semibold">
            {formatCurrency(budgetLimit, trip.currency)}
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isOver ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-400 to-coral-400'
              }`}
              style={{ width: `${Math.min(100, stats.budgetUtilizationPct)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
            <span>{stats.budgetUtilizationPct}% utilized</span>
            <span>{trip.days.length} days total</span>
          </div>
        </div>
      </div>

      {/* Dynamic Health Feedback Alert */}
      <div className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 ${
        isOver 
          ? 'bg-rose-50 border-rose-200 text-rose-900' 
          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
      }`}>
        {isOver ? (
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        )}
        <div>
          <div className="font-bold">
            {isOver ? 'Over Target Budget' : 'Within Target Budget'}
          </div>
          <div className="text-[11px] mt-0.5 opacity-90">
            {isOver
              ? `You are ${formatCurrency(diff, trip.currency)} over budget. Consider optimizing dining or activities.`
              : `You have ${formatCurrency(diff, trip.currency)} buffer remaining for spontaneous experiences.`}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Avg Cost / Day</div>
          <div className="text-sm font-extrabold text-slate-900 mt-0.5">
            {formatCurrency(Math.round(spent / Math.max(1, trip.days.length)), trip.currency)}
          </div>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Experiences</div>
          <div className="text-sm font-extrabold text-slate-900 mt-0.5">
            {stats.activityCount} Sights
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <button
          onClick={onOpenBudget}
          className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-coral-500" />
            <span>Full Financial Breakdown</span>
          </span>
          <ArrowUpRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={onOpenCalendar}
          className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-500" />
            <span>Trip Calendar & Timeline</span>
          </span>
          <ArrowUpRight className="w-4 h-4 text-slate-400" />
        </button>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onShare}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Trip</span>
          </button>

          <button
            onClick={onCopyTrip}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs rounded-xl shadow-md shadow-coral-500/20 transition-all cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Clone Trip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
