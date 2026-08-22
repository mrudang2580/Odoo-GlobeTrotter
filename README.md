# ?? GlobeTrotter ? Empowering Personalized Travel Planning

> **Odoo Hackathon Solution** ? A personalized, intelligent, and collaborative multi-city travel planning platform.

---

## ?? Quick Demo
- Open `index.html` directly in any web browser to explore the fully functional **13-screen interactive application** with simulated API state, dynamic itinerary builder, budget charts, city search, public itinerary sharing, and admin dashboard.

---

## ?? 4-Student Team Structure & Git Repositories

This project is modularized into 4 independent, production-grade repositories for the 4 team members:

```
??? index.html                     # Complete 13-Screen Live Web App (Instant Browser Demo)
??? docs/
?   ??? GITHUB_UPLOAD_GUIDE.md     # Step-by-step Git upload guide for each student
?   ??? API_CONTRACT.md            # Standardized API schema contract
?
??? student-1-backend/             # ????? STUDENT 1: Python FastAPI + PostgreSQL Backend
?   ??? app/ (main, routers, models, schemas)
?   ??? sql/ (schema.sql, seed.sql)
?   ??? Dockerfile, requirements.txt, README.md
?
??? student-2-frontend/            # ?? STUDENT 2: Next.js 14 + Tailwind CSS Frontend
?   ??? app/ (all 13 screens implemented in App Router)
?   ??? components/, lib/api.ts
?   ??? package.json, tailwind.config.js, README.md
?
??? student-3-data-api/            # ?? STUDENT 3: Datasets & AI Recommendation Service
?   ??? data/ (cities.csv, activities.csv)
?   ??? scripts/ (budget_estimator.py, recommender_api.py, seed_generator.py)
?   ??? notebooks/ (data_pipeline.ipynb), requirements.txt, README.md
?
??? student-4-ui-ux-pitch/         # ?? STUDENT 4: Design Tokens & Pitch Presentation
    ??? pitch/ (index.html interactive slide deck, PITCH_SCRIPT.md)
    ??? design-tokens/ (tokens.json, tailwind-theme.js)
    ??? specs/ (design_spec.md, user_personas.md), README.md
```

---

## ?? Hackathon Feature Checklist (All 13 Screens Implemented)

- [x] **1. Login / Signup Screen**: Authentication, JWT token simulation, profile fields, validation.
- [x] **2. Dashboard / Home Screen**: Hero search banner, recent trips, "Plan New Trip" CTA, top destinations.
- [x] **3. Create Trip Screen**: Trip dates, destination pickers, budget limits, cover photo selection.
- [x] **4. My Trips (Trip List) Screen**: Grouped tabs (Ongoing, Upcoming, Completed), stats, edit/view/delete.
- [x] **5. Itinerary Builder Screen**: Add multi-city stops, drag/reorder sections, schedule activities with time & cost.
- [x] **6. Itinerary View Screen**: Day-by-day structured itinerary, city headers, activity blocks, list/timeline toggle.
- [x] **7. City Search**: Country/region filters, cost index, popularity score, "Add to Trip" modal.
- [x] **8. Activity Search**: Category filters (sightseeing, food, adventure, culture), max cost, duration filters.
- [x] **9. Trip Budget & Cost Breakdown Screen**: Interactive Pie & Bar charts, category totals, over-budget warnings.
- [x] **10. Trip Calendar / Timeline Screen**: Monthly calendar view, expandable day cells, activity flow.
- [x] **11. Shared/Public Itinerary View Screen**: Public shareable link, itinerary summary, "Copy Trip" cloning.
- [x] **12. User Profile / Settings Screen**: Editable profile, language/currency preferences, saved destinations.
- [x] **13. Admin / Analytics Dashboard**: Platform metrics, top 10 cities & activities, user management.

---

## ??? Uploading to GitHub
Follow the step-by-step instructions in [`docs/GITHUB_UPLOAD_GUIDE.md`](./docs/GITHUB_UPLOAD_GUIDE.md).
