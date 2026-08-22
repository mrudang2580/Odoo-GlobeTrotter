import React, { useState } from 'react';
import { Compass, Sparkles, ArrowRight, ShieldCheck, Check, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthViewProps {
  onSuccess: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess }) => {
  const { login, signup, loginAsJudgeDemo, loginAsAdmin } = useAuth();

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isSignup) {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match');
        return;
      }
      await signup(name, email, password);
      onSuccess();
    } else {
      if (!email.trim()) {
        setErrorMsg('Please enter your email address');
        return;
      }
      await login(email, password);
      onSuccess();
    }
  };

  const handleJudgeFastTrack = () => {
    loginAsJudgeDemo();
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Hero Pane (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 text-white p-8 sm:p-12 relative flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <img
              src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80"
              alt="Paris Skyline"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

          {/* Top Branding */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-coral-500 to-orange-500 flex items-center justify-center shadow-lg shadow-coral-500/30">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-2xl tracking-tight text-white font-serif">
                Globe<span className="text-coral-400">Trotter</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">Plan less. Experience more.</p>
          </div>

          {/* Hero Statement */}
          <div className="relative z-10 space-y-4 my-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight font-serif">
              The intelligent workspace for multi-city travel.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Seamlessly sequence destinations, build day-by-day itineraries, track budgets in real time, and share journeys with fellow travelers.
            </p>
          </div>

          {/* Footer Features */}
          <div className="relative z-10 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-coral-400" />
              <span>Multi-city sequencing with automatic duration sync</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-coral-400" />
              <span>Real-time budget barometer and category meters</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-coral-400" />
              <span>1-Click Public Forkable Trip sharing</span>
            </div>
          </div>
        </div>

        {/* Right Form Pane (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          {/* Hackathon Judge Fast Track Banner */}
          <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-rose-500/10 border border-orange-500/30 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-coral-500 to-orange-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-coral-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-coral-700">Hackathon Judge Demo</div>
                <div className="text-xs text-slate-600 font-medium">Skip typing and log in directly with seeded trips.</div>
              </div>
            </div>

            <button
              onClick={handleJudgeFastTrack}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
            >
              1-Click Demo Login
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-serif">
              {isSignup ? 'Create Your Traveler Account' : 'Welcome back to GlobeTrotter'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isSignup ? 'Start planning your next multi-destination adventure.' : 'Sign in to access your itineraries and saved trips.'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Sarah Jenkins"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 outline-none focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="sarah@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 outline-none focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 outline-none focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20"
              />
            </div>

            {isSignup && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 outline-none focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-coral-500 to-orange-500 hover:from-coral-600 hover:to-orange-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-coral-500/25 active:scale-95 transition-all cursor-pointer"
            >
              {isSignup ? 'Create Account' : 'Sign In to Workspace'}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setErrorMsg('');
              }}
              className="text-xs font-bold text-coral-600 hover:underline cursor-pointer"
            >
              {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
