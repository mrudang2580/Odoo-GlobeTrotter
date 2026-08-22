import { City, Activity, Trip, User, BudgetBreakdown } from './types';
import { MOCK_CITIES, MOCK_ACTIVITIES, MOCK_TRIPS, MOCK_USER } from './mock-data';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Safe fetch wrapper with fallback
async function fetcher<T>(endpoint: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!res.ok) {
      throw new Error(`API Error: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw err;
  }
}

export const api = {
  // Cities
  getCities: async (params?: { region?: string; search?: string }): Promise<City[]> => {
    let cities = await fetcher<City[]>('/cities', {}, MOCK_CITIES);
    if (params?.region && params.region !== 'All') {
      cities = cities.filter(c => c.region.toLowerCase() === params.region?.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      cities = cities.filter(c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q));
    }
    return cities;
  },

  // Activities
  getActivities: async (params?: { city_id?: string; category?: string; search?: string }): Promise<Activity[]> => {
    let activities = await fetcher<Activity[]>('/activities', {}, MOCK_ACTIVITIES);
    if (params?.city_id) {
      activities = activities.filter(a => a.city_id === params.city_id);
    }
    if (params?.category && params.category !== 'all') {
      activities = activities.filter(a => a.category.toLowerCase() === params.category?.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      activities = activities.filter(a => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }
    return activities;
  },

  // Trips
  getTrips: async (status?: string): Promise<Trip[]> => {
    let trips = await fetcher<Trip[]>('/trips', {}, MOCK_TRIPS);
    if (status && status !== 'all') {
      trips = trips.filter(t => t.status === status);
    }
    return trips;
  },

  getTripById: async (id: string): Promise<Trip | undefined> => {
    const trip = await fetcher<Trip>(`/trips/${id}`, {}, MOCK_TRIPS.find(t => t.id === id || t.share_slug === id));
    return trip;
  },

  createTrip: async (payload: Partial<Trip>): Promise<Trip> => {
    const newTrip: Trip = {
      id: `t${Date.now()}`,
      name: payload.name || 'New Adventure',
      description: payload.description || '',
      start_date: payload.start_date || new Date().toISOString().split('T')[0],
      end_date: payload.end_date || new Date().toISOString().split('T')[0],
      budget_limit: payload.budget_limit || 2500,
      cover_photo_url: payload.cover_photo_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
      status: 'upcoming',
      is_public: payload.is_public || false,
      share_slug: payload.name?.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 7),
      stops: payload.stops || []
    };
    try {
      return await fetcher<Trip>('/trips', {
        method: 'POST',
        body: JSON.stringify(payload)
      }, newTrip);
    } catch {
      return newTrip;
    }
  },

  // Budget
  getTripBudget: async (tripId: string): Promise<BudgetBreakdown> => {
    const fallbackBreakdown: BudgetBreakdown = {
      total_cost: 2028,
      budget_limit: 3200,
      is_over_budget: false,
      by_category: {
        transport: 480,
        stay: 820,
        activities: 278,
        meals: 450
      },
      by_day: [
        { date: '2026-09-10', cost: 580 },
        { date: '2026-09-11', cost: 165 },
        { date: '2026-09-12', cost: 155 },
        { date: '2026-09-14', cost: 420 },
        { date: '2026-09-18', cost: 238 }
      ],
      average_cost_per_day: 202.8,
      over_budget_days: []
    };
    return await fetcher<BudgetBreakdown>(`/trips/${tripId}/budget`, {}, fallbackBreakdown);
  },

  // Auth / User
  getCurrentUser: async (): Promise<User> => {
    return await fetcher<User>('/auth/me', {}, MOCK_USER);
  }
};
