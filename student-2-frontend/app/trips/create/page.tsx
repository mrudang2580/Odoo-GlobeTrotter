'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, Calendar, DollarSign, MapPin, Sparkles, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { api } from '../../../lib/api';

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
  'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
];

export default function CreateTripPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('2026-09-15');
  const [endDate, setEndDate] = useState('2026-09-25');
  const [budgetLimit, setBudgetLimit] = useState(2800);
  const [coverPhoto, setCoverPhoto] = useState(COVER_PRESETS[0]);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const newTrip = await api.createTrip({
      name: name || 'My Global Adventure',
      description,
      start_date: startDate,
      end_date: endDate,
      budget_limit: Number(budgetLimit),
      cover_photo_url: coverPhoto,
      is_public: isPublic,
      stops: [
        {
          id: 's_init_1',
          city_id: 'c1',
          city_name: 'Paris',
          country: 'France',
          start_date: startDate,
          end_date: '2026-09-20',
          budget: Math.round(Number(budgetLimit) * 0.6),
          activities: []
        }
      ]
    });
    setLoading(false);
    router.push(`/trips/${newTrip.id}/build`);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" /> New Itinerary Wizard
          </div>
          <h1 className="text-3xl font-black text-slate-900">Plan Your Next Trip</h1>
          <p className="text-xs text-slate-500">Set the destination scope, dates, and budget before building your daily route.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Trip Name</label>
            <input
              type="text"
              required
              placeholder="e.g. European Summer Exploration 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Description & Goals</label>
            <textarea
              rows={3}
              placeholder="Brief notes on what you want to experience, see, and accomplish on this journey..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-600" /> Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-600" /> End Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Total Budget Limit ($ USD)
            </label>
            <input
              type="number"
              min={100}
              step={50}
              required
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Cover Photo selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-500" /> Cover Photo Preset
            </label>
            <div className="grid grid-cols-4 gap-3">
              {COVER_PRESETS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => setCoverPhoto(preset)}
                  className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                    coverPhoto === preset ? 'border-sky-600 ring-2 ring-sky-500/30' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt="preset" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded text-sky-600"
              />
              Make itinerary publicly shareable with a custom link
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? 'Creating Itinerary...' : (
              <>
                Continue to Itinerary Builder <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
