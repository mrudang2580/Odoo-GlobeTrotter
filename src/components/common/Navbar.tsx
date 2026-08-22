import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, Map, Calendar, Wallet, Search, Plus, 
  ChevronDown, Sparkles, User as UserIcon, Shield, RotateCcw, 
  LogOut, Globe, Check, Layers, Share2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTrip } from '../../context/TripContext';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, tripId?: string) => void;
  onOpenCreateTrip: () => void;
  onOpenSearch: () => void;
  onOpenShareModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenCreateTrip,
  onOpenSearch,
  onOpenShareModal,
}) => {
  const { user, loginAsJudgeDemo, loginAsAdmin, resetDemoData, logout, isAdmin } = useAuth();
  const { trips, activeTrip, setActiveTripId } = useTrip();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTripSwitcherOpen, setIsTripSwitcherOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const tripSwitcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (tripSwitcherRef.current && !tripSwitcherRef.current.contains(event.target as Node)) {
        setIsTripSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'my-trips', label: 'My Trips', icon: Map },
    { id: 'itinerary', label: 'Itinerary Builder', icon: Compass },
    { id: 'explore', label: 'Explore', icon: Globe },
    { id: 'budget', label: 'Budget & Cost', icon: Wallet },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 text-white backdrop-blur-md border-b border-slate-800 shadow-lg">
      {/* Top Demo Bar for Hackathon Judges */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 text-white text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Hackathon Showcase Mode — Live Connected Travel Workspace</span>
        <button
          onClick={loginAsJudgeDemo}
          className="ml-2 bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer"
        >
          Fast-Track Judge Demo
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-coral-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25 ring-2 ring-orange-400/30">
              <Compass className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white font-serif">Globe<span className="text-coral-400">Trotter</span></span>
                <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">PRO</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Plan less. Experience more.</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-coral-500/20 text-coral-400 border border-coral-500/30 shadow-sm shadow-coral-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-coral-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors shadow-inner"
              title="Search (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] bg-slate-700/60 border border-slate-600 rounded text-slate-400 font-mono">⌘K</kbd>
            </button>

            {/* Active Trip Quick Selector (if trips exist) */}
            {trips.length > 0 && (
              <div className="relative hidden xl:block" ref={tripSwitcherRef}>
                <button
                  onClick={() => setIsTripSwitcherOpen(!isTripSwitcherOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="max-w-[130px] truncate">{activeTrip ? activeTrip.title : 'Select Trip'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isTripSwitcherOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                      Switch Active Trip
                    </div>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {trips.map(t => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setActiveTripId(t.id);
                            setIsTripSwitcherOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                            activeTrip?.id === t.id
                              ? 'bg-coral-500/20 text-coral-300 font-bold'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span className="truncate">{t.title}</span>
                          {activeTrip?.id === t.id && <Check className="w-3.5 h-3.5 text-coral-400 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* "+ Plan New Trip" CTA */}
            <button
              onClick={onOpenCreateTrip}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-coral-500 to-orange-500 hover:from-coral-600 hover:to-orange-600 text-white font-bold text-xs lg:text-sm rounded-xl shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Plan New Trip</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-coral-500/50 transition-all cursor-pointer"
              >
                {user ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-600" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 text-slate-200">
                  {user ? (
                    <div className="p-3 border-b border-slate-800">
                      <div className="font-bold text-sm text-white">{user.name}</div>
                      <div className="text-xs text-slate-400 truncate">{user.email}</div>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-full text-slate-300">
                          {user.role === 'admin' ? 'Platform Admin' : 'Pro Planner'}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-coral-500/20 border border-coral-500/30 rounded-full text-coral-400">
                          {user.preferredCurrency}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 border-b border-slate-800 text-center">
                      <div className="font-bold text-sm text-white">Not Signed In</div>
                      <button
                        onClick={loginAsJudgeDemo}
                        className="mt-2 w-full py-1.5 bg-coral-500 text-white rounded-lg text-xs font-bold"
                      >
                        1-Click Demo Login
                      </button>
                    </div>
                  )}

                  <div className="p-1 space-y-0.5 text-xs">
                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-slate-800 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>Profile & Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-slate-800 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>Admin Analytics</span>
                    </button>

                    <div className="h-px bg-slate-800 my-1" />

                    <button
                      onClick={() => {
                        loginAsJudgeDemo();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-slate-800 text-orange-400 font-medium transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Switch to Demo Judge</span>
                    </button>

                    <button
                      onClick={() => {
                        loginAsAdmin();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-slate-800 text-sky-400 font-medium transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Switch to Admin</span>
                    </button>

                    <button
                      onClick={() => {
                        resetDemoData();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset Sample Data</span>
                    </button>

                    <div className="h-px bg-slate-800 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-rose-500/20 text-rose-400 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
