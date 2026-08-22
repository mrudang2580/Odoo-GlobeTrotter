import React, { useState } from 'react';
import { 
  User, Settings, Heart, Wallet, Compass, 
  Shield, Check, Sparkles, LogOut, RotateCcw, MapPin 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { db } from '../services/db';
import { CurrencyCode, TravelStyle } from '../types';

export const ProfileView: React.FC = () => {
  const { user, updateProfile, logout, resetDemoData, toggleBookmark } = useAuth();
  const { trips } = useTrip();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [preferredCurrency, setPreferredCurrency] = useState<CurrencyCode>(user?.preferredCurrency || 'INR');
  const [travelStyle, setTravelStyle] = useState<TravelStyle>(user?.travelStyle || 'Balanced');

  const allCities = db.getCities();
  const savedCities = allCities.filter(c => user?.savedDestinationIds?.includes(c.id));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      bio,
      preferredCurrency,
      travelStyle,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Profile Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
            alt={user?.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-coral-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white font-serif">{user?.name}</h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-coral-500 text-white">
                {user?.role === 'admin' ? 'Platform Admin' : 'Pro Explorer'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
            <p className="text-xs text-slate-300 mt-2 max-w-md">{user?.bio}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetDemoData}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Preferences & Settings (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Settings className="w-5 h-5 text-coral-500" />
            <h3 className="font-extrabold text-base text-slate-900">Travel Profile & Preferences</h3>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-sm outline-none focus:border-coral-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Travel Bio & Style
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-coral-500 text-slate-800 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Preferred Currency
                </label>
                <select
                  value={preferredCurrency}
                  onChange={e => setPreferredCurrency(e.target.value as CurrencyCode)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold bg-white text-slate-800 outline-none"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AED">AED</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="SGD">SGD (S$)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Travel Pace
                </label>
                <select
                  value={travelStyle}
                  onChange={e => setTravelStyle(e.target.value as TravelStyle)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold bg-white text-slate-800 outline-none"
                >
                  <option value="Relaxed">Relaxed (1-2 stops/day)</option>
                  <option value="Balanced">Balanced (Standard)</option>
                  <option value="Fast-Paced">Fast-Paced (Intense)</option>
                  <option value="Luxury">Luxury High-End</option>
                  <option value="Backpacker">Backpacker Budget</option>
                  <option value="Foodie">Foodie Culinary</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>

        {/* Right Pane: Saved Bucket List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h3 className="font-extrabold text-base text-slate-900">Saved Bucket List ({savedCities.length})</h3>
            </div>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {savedCities.map(city => (
              <div
                key={city.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <img src={city.image} alt={city.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{city.name}</div>
                    <div className="text-slate-500">{city.country} · {city.costIndex}</div>
                  </div>
                </div>

                <button
                  onClick={() => toggleBookmark(city.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                  title="Remove from Bucket list"
                >
                  <Heart className="w-4 h-4 fill-rose-500" />
                </button>
              </div>
            ))}

            {savedCities.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                No saved destinations yet. Click the heart icon on any city to bookmark it!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
