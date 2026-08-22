import React from 'react';
import { Users, Compass, Globe, TrendingUp } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Platform Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold uppercase">Total Users</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">1,248</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold uppercase">Trips Created</span>
          <p className="text-2xl font-bold text-sky-600 mt-1">3,490</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold uppercase">Destinations</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">142 Cities</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold uppercase">Avg Budget</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">$2,840</p>
        </div>
      </div>
    </div>
  );
}
