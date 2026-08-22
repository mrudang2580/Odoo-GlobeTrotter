import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider, useTrip } from './context/TripContext';
import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { CreateTripModal } from './components/trip-wizard/CreateTripModal';
import { ShareTripModal } from './components/common/ShareTripModal';

import { DashboardView } from './views/DashboardView';
import { MyTripsView } from './views/MyTripsView';
import { ItineraryBuilder } from './components/itinerary/ItineraryBuilder';
import { ExploreView } from './views/ExploreView';
import { BudgetView } from './views/BudgetView';
import { CalendarView } from './views/CalendarView';
import { SharedTripView } from './views/SharedTripView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';
import { MapRouteView } from './views/MapRouteView';
import { AuthView } from './views/AuthView';

const MainApp: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { activeTrip, setActiveTripId } = useTrip();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [sharedTripId, setSharedTripId] = useState<string | null>(null);

  // Modals
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Hash route detector for public share links: /#trip/:slug
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#trip/')) {
        const slug = hash.replace('#trip/', '');
        setSharedTripId(slug);
        setCurrentTab('shared-trip');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global search shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (tab: string, tripId?: string) => {
    if (tripId) {
      setActiveTripId(tripId);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTripCreated = (newTripId: string) => {
    setActiveTripId(newTripId);
    setCurrentTab('itinerary');
  };

  if (!isAuthenticated) {
    return <AuthView onSuccess={() => setCurrentTab('dashboard')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] pb-16 md:pb-0">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenCreateTrip={() => setIsCreateTripOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'dashboard' && (
          <DashboardView
            onNavigate={handleNavigate}
            onOpenCreateTrip={() => setIsCreateTripOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}

        {currentTab === 'my-trips' && (
          <MyTripsView
            onNavigate={handleNavigate}
            onOpenCreateTrip={() => setIsCreateTripOpen(true)}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        )}

        {currentTab === 'itinerary' && (
          <ItineraryBuilder
            onNavigate={handleNavigate}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onOpenCreateTrip={() => setIsCreateTripOpen(true)}
          />
        )}

        {currentTab === 'explore' && <ExploreView />}

        {currentTab === 'budget' && <BudgetView />}

        {currentTab === 'calendar' && <CalendarView />}

        {currentTab === 'map' && (
          <MapRouteView
            onNavigateToBuilder={tripId => handleNavigate('itinerary', tripId)}
            onOpenCreateTrip={() => setIsCreateTripOpen(true)}
          />
        )}

        {currentTab === 'shared-trip' && (
          <SharedTripView
            tripId={sharedTripId || activeTrip?.id}
            onNavigateToBuilder={tripId => handleNavigate('itinerary', tripId)}
          />
        )}

        {currentTab === 'profile' && <ProfileView />}

        {currentTab === 'admin' && <AdminView />}
      </main>

      {/* Bottom Mobile Navigation */}
      <MobileNav currentTab={currentTab} onNavigate={handleNavigate} />

      {/* Global Modals */}
      <CreateTripModal
        isOpen={isCreateTripOpen}
        onClose={() => setIsCreateTripOpen(false)}
        onTripCreated={handleTripCreated}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      <ShareTripModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        trip={activeTrip}
        onNavigateToPublicView={tripId => {
          setSharedTripId(tripId);
          setCurrentTab('shared-trip');
        }}
      />
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <TripProvider>
          <MainApp />
        </TripProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
