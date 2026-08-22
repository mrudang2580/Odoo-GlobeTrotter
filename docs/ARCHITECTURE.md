# 🏗️ GlobeTrotter System Architecture & Database Design

## 🌐 Full-Stack Topology

```
┌─────────────────────────────────────────────────────────────┐
│                   Next.js 14 Web Frontend                  │
│       (All 13 Screens, App Router, Tailwind CSS, Lucide)     │
└───────────────┬─────────────────────────────┬───────────────┘
                │ REST API Requests           │ AI Queries
                ▼                             ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│   FastAPI Core Backend       │ │  Python Data & AI Service  │
│   (Auth, Itineraries,        │ │  (Recommender & Budget     │
│    Budgets, Search, Admin)   │ │   Estimation Engine)       │
└───────────────┬──────────────┘ └─────────────┬──────────────┘
                │ SQLAlchemy                   │ CSV / Embeddings
                ▼                             ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│ PostgreSQL / SQLite Database │ │ Curated City & Activities  │
│ (Relational Schema & Seeds)  │ │ Open Datasets              │
└──────────────────────────────┘ └────────────────────────────┘
```

---

## 🗄️ Database Entity-Relationship Diagram (ERD)

```
[Users]
  ├── id (PK, UUID)
  ├── name, email, password_hash
  ├── photo_url, city, country, phone
  └── 1:N ──► [Trips]
                ├── id (PK, UUID)
                ├── user_id (FK)
                ├── name, description
                ├── start_date, end_date
                ├── budget_limit, status, cover_photo_url
                ├── is_public, share_slug
                ├── 1:N ──► [Stops]
                │             ├── id (PK, UUID)
                │             ├── trip_id (FK), city_id (FK)
                │             ├── order_index, start_date, end_date, budget
                │             └── 1:N ──► [StopActivities]
                │                           ├── id (PK, UUID)
                │                           ├── stop_id (FK), activity_id (FK)
                │                           ├── scheduled_date, scheduled_time, cost
                └── 1:N ──► [Expenses]
                              ├── id (PK, UUID)
                              ├── trip_id (FK), category, amount, date, description

[Cities]
  ├── id (PK), name, country, region
  ├── cost_index (1-5), popularity_score (1-100), image_url
  └── 1:N ──► [Activities]
                ├── id (PK), city_id (FK)
                ├── name, category, cost, duration_minutes, rating, image_url
```
