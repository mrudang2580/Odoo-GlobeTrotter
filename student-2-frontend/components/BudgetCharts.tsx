'use client';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#ec4899'];

export default function BudgetCharts({ budget }: { budget: any }) {
  const pieData = [
    { name: 'Transport', value: budget.by_category?.transport || 420 },
    { name: 'Stay / Lodging', value: budget.by_category?.stay || 850 },
    { name: 'Activities', value: budget.by_category?.activities || 450 },
    { name: 'Meals & Dining', value: budget.by_category?.meals || 380 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-4 text-sm">Expenses by Category</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`$${value}`, 'Cost']} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-4 text-sm">Daily Cost Timeline ($)</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budget.by_day || [{ date: 'Day 1', cost: 250 }, { date: 'Day 2', cost: 180 }, { date: 'Day 3', cost: 320 }]}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: any) => [`$${value}`, 'Daily Cost']} />
              <Bar dataKey="cost" fill="#0284c7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
