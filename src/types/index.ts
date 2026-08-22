export type ActivityCategory = 
  | 'Sightseeing' 
  | 'Food & Dining' 
  | 'Adventure' 
  | 'Culture & Art' 
  | 'Shopping' 
  | 'Nature' 
  | 'Entertainment' 
  | 'Nightlife';

export type ExpenseCategory = 
  | 'Accommodation' 
  | 'Transportation' 
  | 'Activities' 
  | 'Food & Dining' 
  | 'Shopping' 
  | 'Insurance & Visa' 
  | 'Miscellaneous';

export type TravelStyle = 'Relaxed' | 'Balanced' | 'Fast-Paced' | 'Luxury' | 'Backpacker' | 'Foodie';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'JPY' | 'SGD';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  preferredCurrency: CurrencyCode;
  travelStyle: TravelStyle;
  role: 'user' | 'admin';
  savedDestinationIds: string[];
}

export interface City {
  id: string;
  name: string;
  country: string;
  region: 'Europe' | 'Asia' | 'North America' | 'South America' | 'Middle East' | 'Oceania' | 'Africa';
  code: string;
  description: string;
  image: string;
  heroImage: string;
  costIndex: 'Budget ($)' | 'Moderate ($$)' | 'Premium ($$$)' | 'Luxury ($$$$)';
  costLevel: 1 | 2 | 3 | 4;
  popularityScore: number; // 1-100
  lat: number;
  lng: number;
  timezone: string;
  avgDailyCostINR: number;
  topHighlights: string[];
  weather: {
    temp: string;
    condition: string;
    bestSeason: string;
  };
}

export interface Activity {
  id: string;
  cityId: string;
  name: string;
  category: ActivityCategory;
  durationMinutes: number;
  estimatedCostINR: number;
  rating: number;
  reviewCount: number;
  description: string;
  image: string;
  locationName: string;
  bestTimeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night' | 'Anytime';
  bookingRequired: boolean;
}

export interface TransportLeg {
  mode: 'train' | 'flight' | 'drive' | 'bus' | 'ferry';
  duration: string;
  estimatedCostINR: number;
  carrier?: string;
  notes?: string;
}

export interface TripStop {
  id: string;
  tripId: string;
  cityId: string;
  order: number;
  arrivalDate: string; // YYYY-MM-DD
  departureDate: string; // YYYY-MM-DD
  nights: number;
  transportToNext?: TransportLeg;
}

export interface ItineraryActivity {
  id: string;
  itineraryDayId: string;
  activityId?: string; // Optional if custom activity
  title: string;
  startTime: string; // "09:00"
  durationMinutes: number;
  estimatedCostINR: number;
  category: ActivityCategory;
  notes?: string;
  isCompleted?: boolean;
  order: number;
  locationName?: string;
  image?: string;
}

export interface ItineraryDay {
  id: string;
  tripId: string;
  tripStopId: string;
  dayNumber: number; // 1, 2, 3... across the entire trip
  date: string; // YYYY-MM-DD
  title: string;
  notes?: string;
}

export interface Expense {
  id: string;
  tripId: string;
  cityId?: string;
  title: string;
  category: ExpenseCategory;
  amountINR: number;
  date: string;
  notes?: string;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  coverImage: string;
  status: 'planning' | 'upcoming' | 'ongoing' | 'completed' | 'draft';
  totalBudgetINR: number;
  currency: CurrencyCode;
  isPublic: boolean;
  shareSlug: string;
  createdAt: string;
  updatedAt: string;
}

// Hydrated Full Trip Type for Rich UI consumption
export interface PopulatedItineraryDay extends ItineraryDay {
  stop: TripStop;
  city: City;
  activities: ItineraryActivity[];
}

export interface PopulatedTripStop extends TripStop {
  city: City;
  days: ItineraryDay[];
}

export interface PopulatedTrip extends Trip {
  user: User;
  stops: PopulatedTripStop[];
  days: PopulatedItineraryDay[];
  expenses: Expense[];
  stats: {
    totalEstimatedCostINR: number;
    activityCount: number;
    citiesCount: number;
    durationDays: number;
    budgetUtilizationPct: number;
    isOverBudget: boolean;
    budgetDifferenceINR: number;
  };
}
