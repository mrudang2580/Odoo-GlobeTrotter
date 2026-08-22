# GlobeTrotter API Contract & Schema Reference

Base URL: `http://localhost:8000/api/v1`

## Entities
- **User**: `id`, `name`, `email`, `password_hash`, `photo_url`, `city`, `country`, `phone`, `created_at`
- **Trip**: `id`, `user_id`, `name`, `description`, `start_date`, `end_date`, `cover_photo_url`, `status` (`upcoming` | `ongoing` | `completed`), `budget_limit`, `created_at`
- **Stop**: `id`, `trip_id`, `city_id`, `order_index`, `start_date`, `end_date`, `budget`
- **City**: `id`, `name`, `country`, `region`, `cost_index` (1-5), `popularity_score` (1-100), `image_url`, `description`
- **Activity**: `id`, `city_id`, `name`, `category` (`sightseeing` | `food` | `adventure` | `culture`), `cost`, `duration_minutes`, `description`, `image_url`
- **StopActivity**: `id`, `stop_id`, `activity_id`, `scheduled_date`, `scheduled_time`, `cost`
- **Expense**: `id`, `trip_id`, `category` (`transport` | `stay` | `activities` | `meals`), `amount`, `date`, `description`
- **CommunityPost**: `id`, `user_id`, `trip_id`, `caption`, `created_at`, `likes_count`

## Key REST Endpoints

### Auth (`/auth`)
- `POST /auth/signup` - Body: `{email, password, name, photo_url, city, country, phone}` -> `{token, user}`
- `POST /auth/login` - Body: `{email, password}` -> `{token, user}`
- `POST /auth/forgot-password` - Body: `{email}` -> `{message, reset_token}`
- `GET /auth/me` - Headers: `Authorization: Bearer <token>` -> User details

### Trips (`/trips`)
- `POST /trips` - Create trip
- `GET /trips` - List user trips (filters: status, sort: start_date)
- `GET /trips/{id}` - Full nested trip details (stops, activities, expenses)
- `PUT /trips/{id}` - Update trip info
- `DELETE /trips/{id}` - Remove trip (cascades)
- `GET /trips/{id}/public` - Public view (no auth needed)
- `POST /trips/{id}/copy` - Clone public trip into current user account

### Stops & Itinerary (`/trips/{id}/stops`, `/stops/{id}/activities`)
- `POST /trips/{id}/stops` - Add city stop
- `PUT /stops/{id}/reorder` - Update stop order
- `POST /stops/{id}/activities` - Schedule activity
- `DELETE /stops/{id}/activities/{activity_id}` - Remove activity
- `GET /trips/{id}/itinerary` - Full nested timeline

### Budget (`/trips/{id}/budget`)
- `GET /trips/{id}/budget` - Computed category totals, daily breakdown, over-budget warnings

### Discovery (`/cities`, `/activities`)
- `GET /cities` - Search & filter by country, cost index, popularity
- `GET /activities` - Filter by city, category, max cost, duration

### Community & Admin (`/community`, `/admin`)
- `GET /community/posts`, `POST /community/posts`
- `GET /admin/stats` - Platform KPIs, top cities, top activities, user stats
