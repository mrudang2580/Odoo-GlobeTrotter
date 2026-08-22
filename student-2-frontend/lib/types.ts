export interface City {
  id: string;
  name: string;
  country: string;
  region: string;
  cost_index: number; // 1 to 5
  popularity_score: number; // 1 to 100
  image_url: string;
  description: string;
}

export interface Activity {
  id: string;
  city_id: string;
  name: string;
  category: 'sightseeing' | 'food' | 'adventure' | 'culture' | 'nightlife';
  cost: number;
  duration_minutes: number;
  description: string;
  image_url: string;
  rating?: number;
}

export interface StopActivity {
  id: string;
  activity_id: string;
  name?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  cost: number;
}

export interface Stop {
  id: string;
  city_id: string;
  city_name: string;
  country: string;
  start_date: string;
  end_date: string;
  budget: number;
  activities: StopActivity[];
}

export interface Expense {
  id: string;
  category: 'transport' | 'stay' | 'activities' | 'meals';
  amount: number;
  date: string;
  description: string;
}

export interface Trip {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  budget_limit: number;
  cover_photo_url: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  is_public: boolean;
  share_slug?: string;
  stops: Stop[];
  expenses?: Expense[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  photo_url?: string;
  city?: string;
  country?: string;
  phone?: string;
  role?: string;
}

export interface BudgetBreakdown {
  total_cost: number;
  budget_limit: number;
  is_over_budget: boolean;
  by_category: {
    transport: number;
    stay: number;
    activities: number;
    meals: number;
  };
  by_day: Array<{ date: string; cost: number }>;
  average_cost_per_day: number;
  over_budget_days: string[];
}
