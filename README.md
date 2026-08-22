# 🌍 GlobeTrotter — Empowering Personalized Travel Planning

> **Odoo Hackathon 2026 Solution**  
> An end-to-end, intelligent multi-city travel planning platform combining flexible day-by-day itinerary builders, automated category budgeting, global destination discovery, and one-click itinerary sharing.

---

## 👥 Hackathon Team Members & Contributions

| Member | GitHub Username | Role | Owned Module | Key Deliverables |
| :--- | :--- | :--- | :--- | :--- |
| **Student 1** | [@mrudang2580](https://github.com/mrudang2580) | **Backend Engineer (Lead)** | [`/student-1-backend`](./student-1-backend) | Python FastAPI REST APIs, PostgreSQL Schema, JWT Auth, Trip CRUD, Budget APIs, Dockerfile |
| **Student 2** | [@angels31206](https://github.com/angels31206) | **Frontend Engineer** | [`/student-2-frontend`](./student-2-frontend) | Next.js 14 App Router, Tailwind CSS, 13 Screens UI, Recharts, API Client |
| **Student 3** | [@labdhimehta-2311](https://github.com/labdhimehta-2311) | **Data & AI Integration Lead** | [`/student-3-data-api`](./student-3-data-api) | Global City & Activity CSV Datasets, Budget Multiplier Engine, Recommender Microservice |
| **Student 4** | [@Manas_Mashru](https://github.com/Manas_Mashru) | **UI/UX Designer & Pitch Lead** | [`/student-4-ui-ux-pitch`](./student-4-ui-ux-pitch) | Design Tokens, UI Specs, 13-Screen Wireframes, Interactive Pitch Deck & Demo Script |

---

## 🚀 Instant Live Demo
- **Open [`index.html`](./index.html) directly in any web browser** to explore the fully functional **13-screen interactive application** with simulated API state, dynamic itinerary builder, budget charts, city search, public itinerary sharing, and admin dashboard.
- **Interactive Pitch Deck**: Open [`student-4-ui-ux-pitch/pitch/index.html`](./student-4-ui-ux-pitch/pitch/index.html) in any browser to present the pitch deck.

---

## 📁 Repository Structure

```
Odoo-GlobeTrotter/
├── index.html                     # 🚀 Master 13-Screen Live Web Application (Instant Demo)
├── README.md                      # 📖 Project Documentation & Evaluator Guide
├── docs/
│   ├── API_CONTRACT.md            # 📜 Standardized REST API Contract
│   ├── ARCHITECTURE.md            # 🏗️ System Architecture & ERD Diagram
│   └── GITHUB_UPLOAD_GUIDE.md     # 👥 Team Collaboration & Git Guide
│
├── student-1-backend/             # 🐍 BACKEND MODULE (@mrudang2580)
│   ├── app/ (main.py, config.py, database.py, models/, schemas/, routers/)
│   ├── sql/ (schema.sql, seed.sql)
│   ├── tests/ (test_api.py)
│   └── Dockerfile, docker-compose.yml, requirements.txt, .env.example, README.md
│
├── student-2-frontend/            # ⚛️ FRONTEND MODULE (@angels31206)
│   ├── app/ (13 screens in Next.js 14 App Router)
│   ├── components/ (Navbar.tsx, TripCard.tsx, CityCard.tsx, ActivityCard.tsx, Footer.tsx)
│   ├── lib/ (api.ts, mock-data.ts, types.ts, utils.ts)
│   └── package.json, tailwind.config.js, tsconfig.json, README.md
│
├── student-3-data-api/            # 📊 DATA & AI MODULE (@labdhimehta-2311)
│   ├── data/ (cities.csv, activities.csv, travel_cost_indices.json)
│   ├── scripts/ (budget_estimator.py, recommender_api.py, ml_travel_cluster.py, seed_generator.py)
│   ├── notebooks/ (data_pipeline.ipynb)
│   ├── tests/ (test_recommender.py, test_budget_estimator.py)
│   └── requirements.txt, Dockerfile, README.md
│
└── student-4-ui-ux-pitch/         # 🎨 UI/UX & PITCH MODULE (@Manas_Mashru)
    ├── pitch/ (index.html Interactive Slide Deck, PITCH_SCRIPT.md, presentation_outline.md)
    ├── design-tokens/ (tokens.json, tailwind-theme.js, design-system.css)
    ├── specs/ (design_spec.md, user_personas.md, wireframes_flow.md, accessibility_audit.md)
    └── README.md
```

---

## ✅ Comprehensive Feature Checklist (All 13 Screens Implemented)

- [x] **1. Login / Signup Screen**: Authentication, profile fields, credential validation.
- [x] **2. Dashboard / Home Screen**: Hero exploration banner, "Plan New Trip" CTA, top destinations carousel, budget highlights.
- [x] **3. Create Trip Screen**: Trip dates, destination pickers, budget target goal, cover photo selection.
- [x] **4. My Trips (Trip List) Screen**: Grouped tabs (Ongoing, Upcoming, Completed), destination counts, edit/view/delete actions.
- [x] **5. Itinerary Builder Screen**: Interactive multi-city stop manager, date ranges, activity time slot scheduler, drag/reorder.
- [x] **6. Itinerary View Screen**: Day-by-day visual plan (Day 1, Day 2...), city headers, activity blocks with time and cost.
- [x] **7. City Search Screen**: Search bar with real-time filtering by region, cost index (`$` to `$$$$$`), and one-click "Add to Trip".
- [x] **8. Activity Search Screen**: Categorized activities (Sightseeing, Food, Culture, Adventure) with cost and duration filters.
- [x] **9. Trip Budget & Cost Breakdown Screen**: Interactive category spending (Transport, Stay, Activities, Meals), daily timeline, over-budget warnings.
- [x] **10. Trip Calendar / Timeline Screen**: Date-anchored schedule overview.
- [x] **11. Shared/Public Itinerary View Screen**: Read-only public preview with shareable URL slug and working **"Copy Trip"** cloning.
- [x] **12. User Profile / Settings Screen**: Editable traveler details, language/currency preferences.
- [x] **13. Admin / Analytics Dashboard**: Platform metrics (Total Users, Trips, Destinations, Average Budget) and top trending cities.

---

## 🛠️ How to Run Individual Modules Locally

### 🐍 Backend (`student-1-backend/`)
```bash
cd student-1-backend
python -m venv venv
# Windows: .\venv\Scripts\activate | macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Swagger Documentation: `http://localhost:8000/docs`

### ⚛️ Frontend (`student-2-frontend/`)
```bash
cd student-2-frontend
npm install
npm run dev
```
App URL: `http://localhost:3000`

### 📊 Data & AI Services (`student-3-data-api/`)
```bash
cd student-3-data-api
pip install -r requirements.txt
python scripts/budget_estimator.py
python scripts/recommender_api.py
```
Recommender Docs: `http://localhost:8001/docs`
