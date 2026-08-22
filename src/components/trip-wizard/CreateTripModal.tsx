import React, { useState, useMemo } from 'react';
import { 
  X, Compass, MapPin, Calendar, Wallet, ArrowRight, ArrowLeft, 
  Sparkles, Check, Plus, Trash2, GripVertical, Image as ImageIcon 
} from 'lucide-react';
import { db } from '../../services/db';
import { useTrip } from '../../context/TripContext';
import { formatCurrency } from '../../services/currency';
import { City, CurrencyCode, TravelStyle } from '../../types';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated: (tripId: string) => void;
}

const PRESET_COVERS = [
  { label: 'Paris / Europe', url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Tropical Bali', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Tokyo High-Tech', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Rome Heritage', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Rajasthan Forts', url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop&q=80' },
  { label: 'London Classic', url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&auto=format&fit=crop&q=80' },
];

export const CreateTripModal: React.FC<CreateTripModalProps> = ({ isOpen, onClose, onTripCreated }) => {
  const { createTrip } = useTrip();
  const allCities = useMemo(() => db.getCities(), []);

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Trip Identity
  const [title, setTitle] = useState('European Grand Odyssey');
  const [description, setDescription] = useState('A picturesque journey across Europe’s iconic art capitals, historic landmarks, and world-class culinary trails.');
  const [startDate, setStartDate] = useState('2026-07-10');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);

  // Step 2: Stops Selection
  const [selectedStops, setSelectedStops] = useState<{ cityId: string; nights: number }[]>([
    { cityId: 'city-paris', nights: 3 },
    { cityId: 'city-amsterdam', nights: 2 },
    { cityId: 'city-rome', nights: 3 },
  ]);
  const [citySearchQuery, setCitySearchQuery] = useState('');

  // Step 3: Budget & Style
  const [totalBudgetINR, setTotalBudgetINR] = useState(150000);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('Balanced');

  // Compute total duration & end date
  const totalNights = useMemo(() => {
    return selectedStops.reduce((sum, s) => sum + (Number(s.nights) || 1), 0);
  }, [selectedStops]);

  const computedEndDate = useMemo(() => {
    const d = new Date(startDate || '2026-07-10');
    d.setDate(d.getDate() + totalNights);
    return d.toISOString().split('T')[0];
  }, [startDate, totalNights]);

  // Handle Stop Mutations
  const handleAddCityStop = (cityId: string) => {
    if (selectedStops.some(s => s.cityId === cityId)) return;
    setSelectedStops(prev => [...prev, { cityId, nights: 2 }]);
  };

  const handleRemoveStop = (index: number) => {
    setSelectedStops(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateNights = (index: number, nights: number) => {
    setSelectedStops(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], nights: Math.max(1, nights) };
      return updated;
    });
  };

  const handleFastTrackEurope = () => {
    setTitle('European Explorer 2026');
    setDescription('Iconic architecture, scenic canals, and historic wonders across Paris, Amsterdam, and Rome.');
    setSelectedStops([
      { cityId: 'city-paris', nights: 3 },
      { cityId: 'city-amsterdam', nights: 2 },
      { cityId: 'city-rome', nights: 3 },
    ]);
    setTotalBudgetINR(180000);
    setCoverImage(PRESET_COVERS[0].url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedStops.length === 0) return;

    const newTrip = createTrip(
      {
        title,
        description,
        startDate,
        endDate: computedEndDate,
        coverImage,
        totalBudgetINR: Number(totalBudgetINR) || 120000,
        currency,
      },
      selectedStops.map(s => ({
        cityId: s.cityId,
        nights: s.nights,
      }))
    );

    onTripCreated(newTrip.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-coral-500 flex items-center justify-center shadow-lg shadow-coral-500/30">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Create New Trip</h3>
              <p className="text-xs text-slate-400">Step {step} of 3 — Design your multi-city route</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleFastTrackEurope}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-coral-400 border border-coral-500/30 font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Fill Demo Trip</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-slate-100 h-1.5 w-full flex">
          <div
            className="bg-coral-500 h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* STEP 1: Details */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Trip Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., European Summer Explorer, Bali Wellness Retreat"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 text-slate-900 font-semibold text-base outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Trip Description & Goals
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe your travel vision, who you are traveling with, or highlights..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 text-slate-800 text-sm outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 text-slate-800 font-medium text-sm outline-none"
                />
              </div>

              {/* Cover Image Presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Choose Cover Image
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {PRESET_COVERS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCoverImage(preset.url)}
                      className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all cursor-pointer ${
                        coverImage === preset.url ? 'border-coral-500 scale-105 shadow-md' : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center p-1 text-center">
                        <span className="text-[10px] font-bold text-white leading-tight">{preset.label}</span>
                      </div>
                      {coverImage === preset.url && (
                        <div className="absolute top-1 right-1 bg-coral-500 text-white rounded-full p-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Multi-City Stops */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Select Destinations & Stays</h4>
                  <p className="text-xs text-slate-500">
                    Add stops in order. Duration: <strong className="text-slate-800">{totalNights} nights ({totalNights + 1} days)</strong>, ending {computedEndDate}.
                  </p>
                </div>
              </div>

              {/* Route Sequence List */}
              <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Your Sequence of Stops ({selectedStops.length})
                </div>

                {selectedStops.map((stop, index) => {
                  const city = allCities.find(c => c.id === stop.cityId);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <img src={city?.image} alt={city?.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{city?.name || 'City'}</div>
                          <div className="text-xs text-slate-500">{city?.country} · {city?.costIndex}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={stop.nights}
                            onChange={e => handleUpdateNights(index, parseInt(e.target.value) || 1)}
                            className="w-10 bg-transparent text-center font-bold text-slate-800 text-sm outline-none"
                          />
                          <span className="text-xs text-slate-500">nights</span>
                        </div>

                        {selectedStops.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStop(index)}
                            className="text-slate-400 hover:text-rose-500 p-1.5 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* City Discovery Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  + Add More Cities to Trip
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                  {allCities.map(city => {
                    const isSelected = selectedStops.some(s => s.cityId === city.id);
                    return (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => handleAddCityStop(city.id)}
                        disabled={isSelected}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900 opacity-60'
                            : 'bg-white border-slate-200 hover:border-coral-400 hover:bg-slate-50'
                        }`}
                      >
                        <img src={city.image} alt={city.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                        <div className="truncate">
                          <div className="font-semibold text-xs text-slate-800 truncate">{city.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{city.country}</div>
                        </div>
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 ml-auto shrink-0" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-slate-400 ml-auto shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Budget & Travel Style */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Target Trip Budget
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value as CurrencyCode)}
                    className="px-3 py-3 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 text-sm outline-none"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AED">AED</option>
                  </select>

                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="1000"
                      value={totalBudgetINR}
                      onChange={e => setTotalBudgetINR(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 text-slate-900 font-extrabold text-lg outline-none"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Estimated budget: {formatCurrency(totalBudgetINR, currency)}. GlobeTrotter will monitor your live spending against this goal.
                </p>
              </div>

              {/* Travel Pace */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Travel Pace & Style
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Relaxed', 'Balanced', 'Fast-Paced'] as TravelStyle[]).map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setTravelStyle(style)}
                      className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        travelStyle === style
                          ? 'border-coral-500 bg-coral-50 text-coral-900 font-bold shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-sm font-bold">{style}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {style === 'Relaxed' ? '1-2 sights/day' : style === 'Balanced' ? '2-3 sights/day' : 'Packed schedule'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ready to generate preview */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Summary</div>
                  <div className="font-extrabold text-base text-white">{title}</div>
                  <div className="text-xs text-slate-300">
                    {selectedStops.length} Cities · {totalNights} Nights · {formatCurrency(totalBudgetINR, currency)}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-coral-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as any)}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-2 px-7 py-2.5 bg-gradient-to-r from-coral-500 to-orange-500 hover:from-coral-600 hover:to-orange-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-coral-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Itinerary Workspace</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
