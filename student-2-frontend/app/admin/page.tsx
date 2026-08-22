'use client';
import React from 'react';
import { Users, Compass, DollarSign, Activity, Star, TrendingUp, ShieldCheck, Database, Server } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function AdminDashboardPage() {
  const kpis = [
    { title: 'Registered Travelers', value: '14,280', delta: '+18.4% this month', icon: Users, color: 'text-sky-600 bg-sky-50' },
    { title: 'Itineraries Generated', value: '48,920', delta: '+32.1% this month', icon: Compass, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Gross Itinerary Budgets', value: '$38.4M', delta: '+24.6% this month', icon: DollarSign, color: 'text-amber-600 bg-amber-50' },
    { title: 'API Gateway Health', value: '99.98%', delta: '24ms latency', icon: Server, color: 'text-purple-600 bg-purple-50' },
  ];

  const topCities = [
    { name: 'Paris', country: 'France', trips: 1840, rating: 4.9 },
    { name: 'Tokyo', country: 'Japan', trips: 1620, rating: 4.95 },
    { name: 'Rome', country: 'Italy', trips: 1410, rating: 4.85 },
    { name: 'Barcelona', country: 'Spain', trips: 1290, rating: 4.8 },
    { name: 'Bali', country: 'Indonesia', trips: 1180, rating: 4.9 },
  ];

  const topActivities = [
    { name: 'Eiffel Tower Summit Tour', city: 'Paris', booked: 3200, revenue: 144000 },
    { name: 'Shibuya Night Gastronomy', city: 'Tokyo', booked: 2890, revenue: 144500 },
    { name: 'Colosseum Underground Access', city: 'Rome', booked: 2650, revenue: 198750 },
    { name: 'Sagrada Familia Fast Track', city: 'Barcelona', booked: 2420, revenue: 91960 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Platform Administration & Telemetry
        </div>
        <h1 className="text-3xl font-black text-slate-900">Admin & Analytics Dashboard</h1>
        <p className="text-slate-500 text-xs mt-0.5">Platform KPIs, city popularity leaderboards, activity booking volume, and system metrics.</p>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{kpi.title}</span>
              <div className={`p-2 rounded-xl ${kpi.color}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">{kpi.value}</h3>
              <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">{kpi.delta}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Cities */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-600" /> Top 5 Global Destinations
          </h3>

          <div className="space-y-2">
            {topCities.map((city, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-bold text-slate-900">{city.name}, {city.country}</p>
                    <p className="text-[11px] text-slate-400">{city.trips} itineraries planned</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 font-bold text-amber-600">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {city.rating}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Booked Activities */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" /> Top Scheduled Activities
          </h3>

          <div className="space-y-2">
            {topActivities.map((act, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <p className="font-bold text-slate-900">{act.name}</p>
                  <p className="text-[11px] text-slate-400">{act.city} • {act.booked.toLocaleString()} bookings</p>
                </div>
                <span className="font-black text-emerald-600">{formatCurrency(act.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
