import { City, Activity, Trip, User, BudgetBreakdown } from './types';

export const MOCK_CITIES: City[] = [
  {
    id: 'c1',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    cost_index: 4,
    popularity_score: 98,
    image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    description: 'The City of Light, famed for world-class art, architecture, haute cuisine, and romantic boulevards.'
  },
  {
    id: 'c2',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    cost_index: 4,
    popularity_score: 96,
    image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
    description: 'A vibrant metropolis blending futuristic technology, neon-lit skyscrapers, historic shrines, and culinary perfection.'
  },
  {
    id: 'c3',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    cost_index: 3,
    popularity_score: 94,
    image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    description: 'An open-air museum filled with ancient ruins, Renaissance basilicas, espresso culture, and Italian zest for life.'
  },
  {
    id: 'c4',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    cost_index: 3,
    popularity_score: 92,
    image_url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
    description: 'Seaside Catalan capital renowned for Gaudí’s architectural marvels, Mediterranean beaches, and legendary tapas.'
  },
  {
    id: 'c5',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    cost_index: 2,
    popularity_score: 95,
    image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    description: 'Tropical paradise known for volcanic mountains, sacred temples, iconic terraced rice paddies, and coral reefs.'
  },
  {
    id: 'c6',
    name: 'New York City',
    country: 'USA',
    region: 'North America',
    cost_index: 5,
    popularity_score: 99,
    image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    description: 'The cultural and financial epicenter with soaring skyscrapers, Central Park, Broadway shows, and 24/7 energy.'
  },
  {
    id: 'c7',
    name: 'Cairo',
    country: 'Egypt',
    region: 'Africa',
    cost_index: 2,
    popularity_score: 89,
    image_url: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800',
    description: 'Gateway to ancient pyramids, the Nile River, vibrant souks, and millennia of civilization.'
  },
  {
    id: 'c8',
    name: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    cost_index: 4,
    popularity_score: 91,
    image_url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
    description: 'Iconic harbor city famous for the Sydney Opera House, Bondi Beach surf, and sunny outdoor lifestyle.'
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    city_id: 'c1',
    name: 'Eiffel Tower Summit & Sunset Champagne',
    category: 'sightseeing',
    cost: 45,
    duration_minutes: 150,
    description: 'Skip-the-line access to the top floor with sweeping 360-degree views of Paris and sunset drinks.',
    image_url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600',
    rating: 4.9
  },
  {
    id: 'a2',
    city_id: 'c1',
    name: 'Louvre Masterpieces Guided Walking Tour',
    category: 'culture',
    cost: 65,
    duration_minutes: 180,
    description: 'Curated 3-hour journey through the Mona Lisa, Venus de Milo, and French Crown Jewels with an art historian.',
    image_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600',
    rating: 4.8
  },
  {
    id: 'a3',
    city_id: 'c1',
    name: 'Montmartre Artisan Pastry & Wine Walk',
    category: 'food',
    cost: 55,
    duration_minutes: 120,
    description: 'Sample buttery croissants, award-winning macarons, artisanal cheeses, and boutique Bordeaux wines.',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600',
    rating: 4.9
  },
  {
    id: 'a4',
    city_id: 'c2',
    name: 'Shibuya Crossing & Secret Izakaya Alley Tour',
    category: 'food',
    cost: 50,
    duration_minutes: 180,
    description: 'Experience Tokyo’s busiest crossing followed by savory yakitori, ramen, and craft sake in Nonbei Yokocho.',
    image_url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600',
    rating: 4.9
  },
  {
    id: 'a5',
    city_id: 'c2',
    name: 'Senso-ji Temple & Historic Asakusa Rickshaw',
    category: 'culture',
    cost: 40,
    duration_minutes: 120,
    description: 'Traditional rickshaw ride around Tokyo’s oldest Buddhist temple and ancient merchant streets.',
    image_url: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600',
    rating: 4.7
  },
  {
    id: 'a6',
    city_id: 'c3',
    name: 'Colosseum Underground & Arena Floor VIP Access',
    category: 'sightseeing',
    cost: 75,
    duration_minutes: 180,
    description: 'Explore the restricted gladiators’ underground chambers, Roman Forum, and Palatine Hill.',
    image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600',
    rating: 5.0
  },
  {
    id: 'a7',
    city_id: 'c4',
    name: 'Sagrada Familia Towers & Express Entry',
    category: 'culture',
    cost: 38,
    duration_minutes: 120,
    description: 'Admire Antoni Gaudí’s uncompleted masterpiece with audio guide and panoramic tower elevator.',
    image_url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600',
    rating: 4.9
  },
  {
    id: 'a8',
    city_id: 'c5',
    name: 'Mount Batur Sunrise Volcano Trek & Hot Springs',
    category: 'adventure',
    cost: 60,
    duration_minutes: 360,
    description: 'Early morning hike to the summit crater for a breathtaking sunrise over clouds followed by natural thermal springs.',
    image_url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600',
    rating: 4.8
  }
];

export const MOCK_TRIPS: Trip[] = [
  {
    id: 't1',
    name: 'European Grand Heritage Odyssey',
    description: 'A 10-day multi-city journey across Paris, Rome, and Barcelona exploring historic art, food, and architecture.',
    start_date: '2026-09-10',
    end_date: '2026-09-20',
    budget_limit: 3200,
    cover_photo_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
    status: 'upcoming',
    is_public: true,
    share_slug: 'euro-grand-2026',
    stops: [
      {
        id: 's1',
        city_id: 'c1',
        city_name: 'Paris',
        country: 'France',
        start_date: '2026-09-10',
        end_date: '2026-09-13',
        budget: 1200,
        activities: [
          { id: 'sa1', activity_id: 'a1', name: 'Eiffel Tower Summit', scheduled_date: '2026-09-10', scheduled_time: '18:00', cost: 45 },
          { id: 'sa2', activity_id: 'a2', name: 'Louvre Museum Tour', scheduled_date: '2026-09-11', scheduled_time: '10:00', cost: 65 },
          { id: 'sa3', activity_id: 'a3', name: 'Montmartre Pastry Walk', scheduled_date: '2026-09-12', scheduled_time: '15:00', cost: 55 }
        ]
      },
      {
        id: 's2',
        city_id: 'c3',
        city_name: 'Rome',
        country: 'Italy',
        start_date: '2026-09-14',
        end_date: '2026-09-17',
        budget: 1000,
        activities: [
          { id: 'sa4', activity_id: 'a6', name: 'Colosseum Underground VIP', scheduled_date: '2026-09-14', scheduled_time: '09:30', cost: 75 }
        ]
      },
      {
        id: 's3',
        city_id: 'c4',
        city_name: 'Barcelona',
        country: 'Spain',
        start_date: '2026-09-17',
        end_date: '2026-09-20',
        budget: 1000,
        activities: [
          { id: 'sa5', activity_id: 'a7', name: 'Sagrada Familia Towers', scheduled_date: '2026-09-18', scheduled_time: '11:00', cost: 38 }
        ]
      }
    ],
    expenses: [
      { id: 'e1', category: 'transport', amount: 480, date: '2026-09-10', description: 'Flight & Eurostar tickets' },
      { id: 'e2', category: 'stay', amount: 820, date: '2026-09-10', description: 'Boutique hotels in Paris & Rome' },
      { id: 'e3', category: 'activities', amount: 278, date: '2026-09-11', description: 'Museum passes & monument entries' },
      { id: 'e4', category: 'meals', amount: 450, date: '2026-09-12', description: 'Dinners, bakeries & wine' }
    ]
  },
  {
    id: 't2',
    name: 'Tokyo Neon & Kyoto Serenity Expedition',
    description: 'High-speed bullet train journey through Japan from ultra-modern Tokyo towers to ancient bamboo groves.',
    start_date: '2026-10-05',
    end_date: '2026-10-15',
    budget_limit: 4000,
    cover_photo_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
    status: 'upcoming',
    is_public: false,
    share_slug: 'tokyo-kyoto-2026',
    stops: [
      {
        id: 's4',
        city_id: 'c2',
        city_name: 'Tokyo',
        country: 'Japan',
        start_date: '2026-10-05',
        end_date: '2026-10-10',
        budget: 2200,
        activities: [
          { id: 'sa6', activity_id: 'a4', name: 'Shibuya Crossing Tour', scheduled_date: '2026-10-06', scheduled_time: '19:00', cost: 50 },
          { id: 'sa7', activity_id: 'a5', name: 'Senso-ji Rickshaw Ride', scheduled_date: '2026-10-07', scheduled_time: '10:00', cost: 40 }
        ]
      }
    ]
  },
  {
    id: 't3',
    name: 'Bali Tropical Rainforest & Surf Retreat',
    description: 'Relaxation, waterfall hikes, volcanic sunrise climbing, and world-class surfing in Indonesian paradise.',
    start_date: '2026-06-01',
    end_date: '2026-06-10',
    budget_limit: 1800,
    cover_photo_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    status: 'completed',
    is_public: true,
    share_slug: 'bali-retreat-2026',
    stops: [
      {
        id: 's5',
        city_id: 'c5',
        city_name: 'Bali',
        country: 'Indonesia',
        start_date: '2026-06-01',
        end_date: '2026-06-10',
        budget: 1800,
        activities: [
          { id: 'sa8', activity_id: 'a8', name: 'Mount Batur Sunrise Trek', scheduled_date: '2026-06-03', scheduled_time: '03:30', cost: 60 }
        ]
      }
    ]
  }
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Wanderer',
  email: 'alex.wanderer@globetrotter.io',
  photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  city: 'San Francisco',
  country: 'USA',
  phone: '+1 (555) 234-5678',
  role: 'Explorer'
};
