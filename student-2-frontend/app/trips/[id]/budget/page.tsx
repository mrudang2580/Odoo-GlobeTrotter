'use client';
import React from 'react';
import BudgetCharts from '@/components/BudgetCharts';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TripBudgetPage() {
  const mockBudget = {
    total_cost: 2950,
    budget_limit: 3200,
    is_over_budget: false,
    by_category: { transport: 620, stay: 1200, activities: 650, meals: 480 },
    by_day: [
      { date: 'Sep 10', cost: 350 },
      { date: 'Sep 11', cost: 280 },
      { date: 'Sep 12', cost: 420 },
      { date: 'Sep 13', cost: 190 },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trip Budget & Cost Breakdown</h1>
          <p className="text-gray-500 text-sm">Real-time expenditure tracking against your trip limit.</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500 uppercase font-semibold">Total Projected</span>
          <p className="text-2xl font-black text-sky-600">${mockBudget.total_cost} <span className="text-sm font-normal text-gray-500">/ ${mockBudget.budget_limit}</span></p>
        </div>
      </div>
      <BudgetCharts budget={mockBudget} />
    </div>
  );
}
