import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Trip, PopulatedTrip, City, Activity, Expense, CurrencyCode } from '../types';
import { db } from '../services/db';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import confetti from 'canvas-confetti';

interface TripContextType {
  trips: Trip[];
  activeTrip: PopulatedTrip | null;
  activeTripId: string | null;
  isLoading: boolean;
  setActiveTripId: (id: string | null) => void;
  refreshActiveTrip: () => void;
  refreshTrips: () => void;
  createTrip: (
    data: {
      title: string;
      description: string;
      startDate: string;
      endDate: string;
      coverImage: string;
      totalBudgetINR: number;
      currency?: CurrencyCode;
    },
    stops: { cityId: string; nights: number; transport?: any }[]
  ) => PopulatedTrip;
  updateTripDetails: (tripId: string, updates: Partial<Trip>) => void;
  deleteTrip: (tripId: string) => void;
  copyTrip: (sourceTripId: string) => PopulatedTrip | null;
  addCityStopToActiveTrip: (cityId: string, nights?: number) => void;
  removeStopFromActiveTrip: (stopId: string) => void;
  addActivityToDay: (
    dayId: string,
    activityData: {
      activityId?: string;
      title: string;
      startTime: string;
      durationMinutes: number;
      estimatedCostINR: number;
      category: any;
      notes?: string;
      locationName?: string;
      image?: string;
    }
  ) => void;
  updateItineraryActivity: (activityId: string, updates: any) => void;
  deleteItineraryActivity: (activityId: string) => void;
  reorderActivities: (dayId: string, orderedIds: string[]) => void;
  addCustomExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteCustomExpense: (expenseId: string) => void;
  celebrateTrip: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { success, error, info } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [activeTrip, setActiveTrip] = useState<PopulatedTrip | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshTrips = useCallback(() => {
    if (!user) {
      setTrips([]);
      setActiveTrip(null);
      setIsLoading(false);
      return;
    }
    const userTrips = db.getTrips(user.id);
    setTrips(userTrips);

    // Default select the first trip if none is selected
    if (!activeTripId && userTrips.length > 0) {
      setActiveTripId(userTrips[0].id);
    } else if (activeTripId) {
      const populated = db.getPopulatedTrip(activeTripId);
      setActiveTrip(populated);
    }
    setIsLoading(false);
  }, [user, activeTripId]);

  useEffect(() => {
    refreshTrips();
  }, [refreshTrips]);

  useEffect(() => {
    if (activeTripId) {
      const populated = db.getPopulatedTrip(activeTripId);
      setActiveTrip(populated);
    } else {
      setActiveTrip(null);
    }
  }, [activeTripId]);

  const refreshActiveTrip = useCallback(() => {
    if (activeTripId) {
      const populated = db.getPopulatedTrip(activeTripId);
      setActiveTrip(populated);
    }
  }, [activeTripId]);

  const celebrateTrip = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5A36', '#3B82F6', '#10B981', '#F59E0B'],
      });
    } catch (e) {
      // safe fallback
    }
  };

  const createTrip = (
    data: {
      title: string;
      description: string;
      startDate: string;
      endDate: string;
      coverImage: string;
      totalBudgetINR: number;
      currency?: CurrencyCode;
    },
    stops: { cityId: string; nights: number; transport?: any }[]
  ): PopulatedTrip => {
    if (!user) {
      throw new Error('You must be logged in to create a trip');
    }

    const newPopulated = db.createTrip(
      {
        ...data,
        userId: user.id,
      },
      stops
    );

    refreshTrips();
    setActiveTripId(newPopulated.id);
    setActiveTrip(newPopulated);
    celebrateTrip();
    success(`Trip "${data.title}" Created!`, 'Your multi-city route & itinerary are ready to customize.');
    return newPopulated;
  };

  const updateTripDetails = (tripId: string, updates: Partial<Trip>) => {
    const updated = db.updateTrip(tripId, updates);
    if (updated) {
      refreshTrips();
      if (activeTripId === tripId) {
        setActiveTrip(updated);
      }
      success('Trip updated successfully');
    }
  };

  const deleteTrip = (tripId: string) => {
    const tripName = db.getTripById(tripId)?.title || 'Trip';
    db.deleteTrip(tripId);
    if (activeTripId === tripId) {
      setActiveTripId(null);
      setActiveTrip(null);
    }
    refreshTrips();
    info(`Trip "${tripName}" deleted`);
  };

  const copyTrip = (sourceTripId: string): PopulatedTrip | null => {
    if (!user) {
      error('Please sign in to copy this trip to your account');
      return null;
    }
    const cloned = db.duplicateTrip(sourceTripId, user.id);
    if (cloned) {
      refreshTrips();
      setActiveTripId(cloned.id);
      setActiveTrip(cloned);
      celebrateTrip();
      success(`Trip Copied!`, `"${cloned.title}" has been saved to your trips.`);
      return cloned;
    }
    error('Could not copy trip');
    return null;
  };

  const addCityStopToActiveTrip = (cityId: string, nights: number = 2) => {
    if (!activeTripId) return;
    const city = db.getCityById(cityId);
    const updated = db.addTripStop(activeTripId, cityId, nights);
    if (updated) {
      setActiveTrip(updated);
      success(`Stop added: ${city?.name || 'City'}`, `${nights} nights added to your route.`);
    }
  };

  const removeStopFromActiveTrip = (stopId: string) => {
    if (!activeTripId) return;
    const updated = db.removeTripStop(activeTripId, stopId);
    if (updated) {
      setActiveTrip(updated);
      info('Stop removed from route');
    }
  };

  const addActivityToDay = (
    dayId: string,
    activityData: {
      activityId?: string;
      title: string;
      startTime: string;
      durationMinutes: number;
      estimatedCostINR: number;
      category: any;
      notes?: string;
      locationName?: string;
      image?: string;
    }
  ) => {
    if (!activeTripId) return;
    db.addActivityToDay(dayId, activityData);
    refreshActiveTrip();
    success('Activity added to day itinerary');
  };

  const updateItineraryActivity = (activityId: string, updates: any) => {
    db.updateItineraryActivity(activityId, updates);
    refreshActiveTrip();
    success('Activity updated');
  };

  const deleteItineraryActivity = (activityId: string) => {
    db.deleteItineraryActivity(activityId);
    refreshActiveTrip();
    info('Activity removed');
  };

  const reorderActivities = (dayId: string, orderedIds: string[]) => {
    db.reorderActivitiesInDay(dayId, orderedIds);
    refreshActiveTrip();
  };

  const addCustomExpense = (expense: Omit<Expense, 'id'>) => {
    db.addExpense(expense);
    refreshActiveTrip();
    success('Expense added to trip budget');
  };

  const deleteCustomExpense = (expenseId: string) => {
    db.deleteExpense(expenseId);
    refreshActiveTrip();
    info('Expense removed from budget');
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTrip,
        activeTripId,
        isLoading,
        setActiveTripId,
        refreshActiveTrip,
        refreshTrips,
        createTrip,
        updateTripDetails,
        deleteTrip,
        copyTrip,
        addCityStopToActiveTrip,
        removeStopFromActiveTrip,
        addActivityToDay,
        updateItineraryActivity,
        deleteItineraryActivity,
        reorderActivities,
        addCustomExpense,
        deleteCustomExpense,
        celebrateTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
