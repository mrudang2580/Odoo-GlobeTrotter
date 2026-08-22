'use client';
import React, { useState, useEffect } from 'react';
import { User, Mail, Globe, MapPin, Phone, Shield, Bell, Save, CheckCircle2, Award, Compass } from 'lucide-react';
import { api } from '../../lib/api';
import { User as UserType } from '../../lib/types';

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [name, setName] = useState('Alex Wanderer');
  const [email, setEmail] = useState('alex.wanderer@globetrotter.io');
  const [city, setCity] = useState('San Francisco');
  const [country, setCountry] = useState('United States');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('English (US)');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getCurrentUser().then((u) => {
      if (u) {
        setUser(u);
        setName(u.name);
        setEmail(u.email);
        setCity(u.city || 'San Francisco');
        setCountry(u.country || 'United States');
        setPhone(u.phone || '+1 (555) 234-5678');
      }
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">User Profile & Settings</h1>
        <p className="text-slate-500 text-xs mt-0.5">Manage your personal information, travel preferences, and regional settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-center">
          <div className="relative w-24 h-24 mx-auto">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"
              alt="Avatar"
              className="w-full h-full rounded-2xl object-cover ring-4 ring-sky-50 shadow-md"
            />
            <span className="absolute -bottom-2 -right-2 p-1.5 bg-sky-600 text-white rounded-lg shadow-sm">
              <Compass className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <h3 className="font-extrabold text-lg text-slate-900">{name}</h3>
            <p className="text-xs text-slate-500">{email}</p>
            <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-sky-600" /> Pro Explorer
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Trips</span>
              <p className="text-lg font-black text-slate-900">3</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Countries</span>
              <p className="text-lg font-black text-slate-900">7</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-slate-900">Account Details</h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Preferred Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Display Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500"
                >
                  <option value="English (US)">English (US)</option>
                  <option value="Spanish">Español</option>
                  <option value="French">Français</option>
                  <option value="German">Deutsch</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/30 flex items-center gap-1.5 transition"
              >
                {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                {saved ? 'Preferences Saved!' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
