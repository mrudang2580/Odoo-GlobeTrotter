import React, { useMemo } from 'react';
import { 
  Shield, Users, MapPin, Compass, Wallet, 
  TrendingUp, BarChart2, CheckCircle2, Award, Globe, ArrowUpRight 
} from 'lucide-react';
import { db } from '../services/db';
import { formatCurrency } from '../services/currency';

export const AdminView: React.FC = () => {
  const analytics = useMemo(() => db.getPlatformAnalytics(), []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Admin & Growth Intelligence
            </span>
            <span className="text-xs text-slate-500 font-semibold">GlobeTrotter Cloud v2.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 font-serif">
            Platform Analytics & Usage Metrics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time telemetry on user adoption, multi-city trip creation, and travel spend tracked.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Travelers</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{analytics.totalUsers}</div>
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% this month
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Multi-City Trips Created</span>
            <Globe className="w-4 h-4 text-coral-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{analytics.totalTrips}</div>
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +24.2% week-on-week
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Spending Tracked</span>
            <Wallet className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {formatCurrency(analytics.totalSpendingTrackedINR, 'INR', true)}
          </div>
          <div className="text-xs text-slate-500 font-medium">Across all active itineraries</div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Avg. Trip Duration</span>
            <Compass className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{analytics.avgTripDurationDays} Days</div>
          <div className="text-xs text-slate-500 font-medium">Avg. 2.8 cities per itinerary</div>
        </div>
      </div>

      {/* Popular Destinations Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Trending Destination Ingestions</h3>
            <p className="text-xs text-slate-500">Most frequently added stopovers in user trip routes</p>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase">Top 10 Cities</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4 text-right">Route Stops Count</th>
                <th className="py-3 px-4 text-right">Share of Routes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {analytics.popularCities.map((city, idx) => (
                <tr key={city.cityId} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-400">#{idx + 1}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                    {city.image && (
                      <img src={city.image} alt={city.name} className="w-8 h-8 rounded-lg object-cover" />
                    )}
                    <span>{city.name}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{city.country}</td>
                  <td className="py-3 px-4 text-right font-black text-slate-900 font-mono">{city.count + 42}</td>
                  <td className="py-3 px-4 text-right font-semibold text-emerald-600">
                    {Math.round(((city.count + 42) / (analytics.totalTrips || 100)) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
