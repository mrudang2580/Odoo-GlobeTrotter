import React, { useState, useMemo } from 'react';
import { 
  Wallet, Plus, Trash2, AlertTriangle, CheckCircle2, 
  TrendingUp, PieChart, BarChart3, ArrowRight, DollarSign, 
  Calendar, Layers, ShieldCheck, X 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { formatCurrency } from '../services/currency';
import { ExpenseCategory, Expense } from '../types';

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Accommodation',
  'Transportation',
  'Activities',
  'Food & Dining',
  'Shopping',
  'Insurance & Visa',
  'Miscellaneous',
];

const CATEGORY_COLORS: Record<string, { bg: string; fill: string; border: string }> = {
  'Accommodation': { bg: 'bg-indigo-50 text-indigo-700', fill: '#6366F1', border: 'border-indigo-200' },
  'Transportation': { bg: 'bg-sky-50 text-sky-700', fill: '#0EA5E9', border: 'border-sky-200' },
  'Activities': { bg: 'bg-coral-50 text-coral-700', fill: '#FF5A36', border: 'border-coral-200' },
  'Food & Dining': { bg: 'bg-amber-50 text-amber-700', fill: '#F59E0B', border: 'border-amber-200' },
  'Shopping': { bg: 'bg-pink-50 text-pink-700', fill: '#EC4899', border: 'border-pink-200' },
  'Insurance & Visa': { bg: 'bg-emerald-50 text-emerald-700', fill: '#10B981', border: 'border-emerald-200' },
  'Miscellaneous': { bg: 'bg-slate-50 text-slate-700', fill: '#64748B', border: 'border-slate-200' },
};

export const BudgetView: React.FC = () => {
  const { activeTrip, updateTripDetails, addCustomExpense, deleteCustomExpense } = useTrip();

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(5000);
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('Accommodation');
  const [expenseDate, setExpenseDate] = useState(activeTrip?.startDate || '2026-06-12');
  const [expenseNotes, setExpenseNotes] = useState('');

  const [isEditingBudgetGoal, setIsEditingBudgetGoal] = useState(false);
  const [budgetGoalInput, setBudgetGoalInput] = useState(activeTrip?.totalBudgetINR || 150000);

  if (!activeTrip) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-2" />
        <h3 className="text-xl font-bold text-slate-700">No active trip selected</h3>
        <p className="text-xs text-slate-500 mt-1">Select or create a trip to view financial insights.</p>
      </div>
    );
  }

  // Aggregate Category Breakdown
  const categoryBreakdown = useMemo(() => {
    const totals: Record<string, number> = {
      'Accommodation': 0,
      'Transportation': 0,
      'Activities': 0,
      'Food & Dining': 0,
      'Shopping': 0,
      'Insurance & Visa': 0,
      'Miscellaneous': 0,
    };

    // 1. From Itinerary Activities
    activeTrip.days.forEach(day => {
      day.activities.forEach(act => {
        if (act.category === 'Food & Dining') {
          totals['Food & Dining'] += Number(act.estimatedCostINR || 0);
        } else if (act.category === 'Shopping') {
          totals['Shopping'] += Number(act.estimatedCostINR || 0);
        } else {
          totals['Activities'] += Number(act.estimatedCostINR || 0);
        }
      });
    });

    // 2. From Transit Legs
    activeTrip.stops.forEach(stop => {
      if (stop.transportToNext?.estimatedCostINR) {
        totals['Transportation'] += Number(stop.transportToNext.estimatedCostINR);
      }
    });

    // 3. From Custom Expenses
    activeTrip.expenses.forEach(exp => {
      const cat = exp.category || 'Miscellaneous';
      totals[cat] = (totals[cat] || 0) + Number(exp.amountINR || 0);
    });

    return totals;
  }, [activeTrip]);

  const totalSpent = Object.values(categoryBreakdown).reduce((sum, val) => sum + val, 0);
  const budgetLimit = activeTrip.totalBudgetINR || 150000;
  const isOver = totalSpent > budgetLimit;
  const difference = Math.abs(totalSpent - budgetLimit);
  const utilizationPct = Math.round((totalSpent / budgetLimit) * 100);

  // Day-wise spend array
  const dayWiseSpending = useMemo(() => {
    return activeTrip.days.map(day => {
      const actTotal = day.activities.reduce((sum, a) => sum + Number(a.estimatedCostINR || 0), 0);
      const expTotal = activeTrip.expenses
        .filter(e => e.date === day.date)
        .reduce((sum, e) => sum + Number(e.amountINR || 0), 0);
      return {
        dayNumber: day.dayNumber,
        date: day.date,
        cityName: day.city?.name || 'City',
        amount: actTotal + expTotal,
      };
    });
  }, [activeTrip]);

  const maxDaySpend = Math.max(...dayWiseSpending.map(d => d.amount), 1);

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim()) return;

    addCustomExpense({
      tripId: activeTrip.id,
      title: expenseTitle,
      category: expenseCategory,
      amountINR: Number(expenseAmount),
      date: expenseDate,
      notes: expenseNotes,
    });

    setIsAddExpenseOpen(false);
    setExpenseTitle('');
    setExpenseNotes('');
  };

  const handleSaveBudgetGoal = () => {
    updateTripDetails(activeTrip.id, { totalBudgetINR: Number(budgetGoalInput) });
    setIsEditingBudgetGoal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-coral-600 bg-coral-50 px-2.5 py-0.5 rounded-full border border-coral-200">
              Trip Financial Analytics
            </span>
            <span className="text-xs text-slate-500 font-semibold">{activeTrip.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 font-serif">
            Budget & Expense Breakdown
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time financial barometer monitoring stays, transit, activities, dining, and custom expenses.
          </p>
        </div>

        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-coral-500/25 active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add Custom Expense</span>
        </button>
      </div>

      {/* Dynamic Health Feedback Banner */}
      <div className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between gap-4 flex-wrap ${
        isOver
          ? 'bg-rose-50/90 border-rose-200 text-rose-950'
          : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            isOver ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30' : 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
          }`}>
            {isOver ? <AlertTriangle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-extrabold text-base">
              {isOver ? '⚠ Budget Exceeded Alert' : '✓ Excellent Financial Health'}
            </h3>
            <p className="text-xs opacity-90 mt-0.5">
              {isOver
                ? `You are ${formatCurrency(difference, activeTrip.currency)} over your planned budget of ${formatCurrency(budgetLimit, activeTrip.currency)}. Consider optimizing high-cost accommodations or transport.`
                : `You are within budget! You have a comfortable buffer of ${formatCurrency(difference, activeTrip.currency)} remaining for dining and shopping.`}
            </p>
          </div>
        </div>

        <div className="text-right ml-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Utilization Rate</div>
          <div className={`text-xl font-black ${isOver ? 'text-rose-600' : 'text-emerald-700'}`}>
            {utilizationPct}%
          </div>
        </div>
      </div>

      {/* Key Financial Snapshot Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spend */}
        <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Estimated Cost</span>
            <Wallet className="w-4 h-4 text-coral-400" />
          </div>
          <div className="text-2xl font-black tracking-tight text-white font-sans">
            {formatCurrency(totalSpent, activeTrip.currency)}
          </div>
          <div className="text-[11px] text-slate-400">
            Across {activeTrip.days.length} days & {activeTrip.stops.length} cities
          </div>
        </div>

        {/* Budget Limit */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-2 relative">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Planned Target Budget</span>
            <button
              onClick={() => setIsEditingBudgetGoal(!isEditingBudgetGoal)}
              className="text-xs text-coral-600 font-bold hover:underline"
            >
              {isEditingBudgetGoal ? 'Cancel' : 'Edit Goal'}
            </button>
          </div>

          {isEditingBudgetGoal ? (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                value={budgetGoalInput}
                onChange={e => setBudgetGoalInput(Number(e.target.value))}
                className="w-full text-sm font-bold p-1.5 border rounded-lg"
              />
              <button
                onClick={handleSaveBudgetGoal}
                className="px-3 py-1.5 bg-coral-500 text-white font-bold text-xs rounded-lg"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="text-2xl font-black text-slate-900 tracking-tight font-sans">
              {formatCurrency(budgetLimit, activeTrip.currency)}
            </div>
          )}

          <div className="text-[11px] text-slate-500">
            Click edit goal to adjust your target
          </div>
        </div>

        {/* Daily Average */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Avg. Daily Spend</span>
            <Calendar className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight font-sans">
            {formatCurrency(Math.round(totalSpent / Math.max(1, activeTrip.days.length)), activeTrip.currency)}
          </div>
          <div className="text-[11px] text-slate-500">
            Per person / day average
          </div>
        </div>

        {/* Buffer / Surplus */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{isOver ? 'Excess Deficit' : 'Surplus Buffer'}</span>
            <TrendingUp className={`w-4 h-4 ${isOver ? 'text-rose-500' : 'text-emerald-500'}`} />
          </div>
          <div className={`text-2xl font-black tracking-tight font-sans ${isOver ? 'text-rose-600' : 'text-emerald-600'}`}>
            {formatCurrency(difference, activeTrip.currency)}
          </div>
          <div className="text-[11px] text-slate-500">
            {isOver ? 'Over budget limit' : 'Under planned limit'}
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Donut Breakdown + Day Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <PieChart className="w-4 h-4 text-coral-500" />
              <span>Category Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{EXPENSE_CATEGORIES.length} Categories</span>
          </div>

          {/* Interactive Stacked Bar / Visual Meter */}
          <div className="space-y-3.5">
            {Object.entries(categoryBreakdown).map(([category, amount]) => {
              const pct = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
              const color = CATEGORY_COLORS[category] || CATEGORY_COLORS['Miscellaneous'];

              return (
                <div key={category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.fill }} />
                      <span>{category}</span>
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      {formatCurrency(amount, activeTrip.currency)} <span className="text-slate-400 font-normal text-[11px]">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color.fill }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day-by-Day Spending Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-500" />
              <span>Day-by-Day Expenditure</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{dayWiseSpending.length} Days Itinerary</span>
          </div>

          <div className="space-y-3 pt-2">
            {dayWiseSpending.map(day => {
              const pct = Math.round((day.amount / maxDaySpend) * 100);
              return (
                <div key={day.dayNumber} className="flex items-center gap-3">
                  <div className="w-20 text-xs font-bold text-slate-700 shrink-0">
                    Day {day.dayNumber} <span className="text-slate-400 font-normal">({day.cityName})</span>
                  </div>

                  <div className="flex-1 h-6 bg-slate-100 rounded-xl overflow-hidden relative flex items-center px-2">
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-xl transition-all duration-500 opacity-90"
                      style={{ width: `${Math.max(8, pct)}%` }}
                    />
                    <span className="relative z-10 text-[11px] font-extrabold text-slate-900">
                      {formatCurrency(day.amount, activeTrip.currency)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expenses Table & Management */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Custom Logged Expenses ({activeTrip.expenses.length})
            </h3>
            <p className="text-xs text-slate-500">
              Directly add flights, visas, hotel reservations, and emergency funds.
            </p>
          </div>

          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="text-xs font-bold text-coral-600 bg-coral-50 hover:bg-coral-100 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Expense Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeTrip.expenses.map(exp => {
                const color = CATEGORY_COLORS[exp.category] || CATEGORY_COLORS['Miscellaneous'];
                return (
                  <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{exp.title}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${color.bg} ${color.border}`}>
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{exp.date}</td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{exp.notes || '—'}</td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900 font-mono">
                      {formatCurrency(exp.amountINR, activeTrip.currency)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => deleteCustomExpense(exp.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {activeTrip.expenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No custom expenses added yet. Click &ldquo;+ Add Custom Expense&rdquo; above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Custom Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Wallet className="w-4 h-4 text-coral-400" />
                <span>Add Custom Expense</span>
              </h3>
              <button onClick={() => setIsAddExpenseOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Expense Description <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Paris Hotel Deposit, Eurail Pass, Visa Application"
                  value={expenseTitle}
                  onChange={e => setExpenseTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-semibold text-sm outline-none focus:border-coral-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Category
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={e => setExpenseCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm outline-none bg-white font-medium"
                  >
                    {EXPENSE_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Amount (INR) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="100"
                    value={expenseAmount}
                    onChange={e => setExpenseAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-bold text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={e => setExpenseDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Notes / Receipt Reference
                </label>
                <input
                  type="text"
                  placeholder="Booking ID or notes..."
                  value={expenseNotes}
                  onChange={e => setExpenseNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
