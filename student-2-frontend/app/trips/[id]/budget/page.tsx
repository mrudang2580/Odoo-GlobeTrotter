'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PieChart, DollarSign, TrendingUp, AlertTriangle, ArrowLeft, Plus, Wallet, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { api } from '../../../../lib/api';
import { Trip, BudgetBreakdown } from '../../../../lib/types';
import { formatCurrency } from '../../../../lib/utils';

export default function TripBudgetPage() {
  const params = useParams();
  const tripId = (params?.id as string) || 't1';
  const [trip, setTrip] = useState<Trip | null>(null);
  const [budget, setBudget] = useState<BudgetBreakdown | null>(null);
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    api.getTripById(tripId).then(setTrip);
    api.getTripBudget(tripId).then(setBudget);
  }, [tripId]);

  if (!budget) {
    return <div className="text-center py-20 text-slate-500">Calculating financial estimates...</div>;
  }

  const categories = [
    { name: 'Transport & Flights', amount: budget.by_category.transport, color: 'bg-blue-500', bar: 'bg-blue-500' },
    { name: 'Stays & Hotels', amount: budget.by_category.stay, color: 'bg-purple-500', bar: 'bg-purple-500' },
    { name: 'Activities & Tours', amount: budget.by_category.activities, color: 'bg-emerald-500', bar: 'bg-emerald-500' },
    { name: 'Meals & Dining', amount: budget.by_category.meals, color: 'bg-amber-500', bar: 'bg-amber-500' },
  ];

  const percentUsed = Math.min(100, Math.round((budget.total_cost / budget.budget_limit) * 100));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href={`/trips/${tripId}`} className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Itinerary Detail
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Trip Budget & Cost Breakdown</h1>
            <p className="text-xs text-slate-500 mt-0.5">Real-time spend analysis and category cost tracking for {trip?.name || 'your trip'}.</p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600">Currency:</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold focus:ring-2 focus:ring-sky-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (?)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Scheduled Spend</span>
          <h3 className="text-3xl font-black text-slate-900">{formatCurrency(budget.total_cost, currency)}</h3>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${budget.is_over_budget ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">{percentUsed}% of total budget allocated</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Budget Limit</span>
          <h3 className="text-3xl font-black text-slate-900">{formatCurrency(budget.budget_limit, currency)}</h3>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {formatCurrency(Math.max(0, budget.budget_limit - budget.total_cost), currency)} Remaining Reserve
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Average Estimate</span>
          <h3 className="text-3xl font-black text-slate-900">{formatCurrency(budget.average_cost_per_day, currency)}</h3>
          <p className="text-xs text-slate-500">Based on 10 scheduled itinerary days</p>
        </div>
      </div>

      {/* Category Breakdown & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-sky-600" />
            Spend by Category
          </h3>

          <div className="space-y-4">
            {categories.map((cat, idx) => {
              const catPercent = budget.total_cost > 0 ? Math.round((cat.amount / budget.total_cost) * 100) : 0;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">{cat.name}</span>
                    <span className="font-bold text-slate-900">{formatCurrency(cat.amount, currency)} ({catPercent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.bar}`} style={{ width: `${catPercent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Expenses Schedule */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Daily Expense Timeline
          </h3>

          <div className="space-y-3">
            {budget.by_day.map((d, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-semibold text-slate-700">{d.date}</span>
                <span className="font-black text-slate-900">{formatCurrency(d.cost, currency)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
