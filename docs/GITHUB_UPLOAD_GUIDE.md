# GlobeTrotter ? 4-Student GitHub Upload Guide

This document provides each student on the team with the exact, copy-paste terminal instructions to upload their respective folder to a separate GitHub repository.

---

## ?? Student Repository Mapping

| Student | Hackathon Role | Folder Name | Suggested GitHub Repo Name |
| :--- | :--- | :--- | :--- |
| **Student 1** | **Backend Dev (Python/FastAPI/Postgres)** | `student-1-backend/` | `globetrotter-backend` |
| **Student 2** | **Frontend Dev (React/Next.js/Tailwind)** | `student-2-frontend/` | `globetrotter-frontend` |
| **Student 3** | **Data & AI Integration Lead** | `student-3-data-api/` | `globetrotter-data-ai` |
| **Student 4** | **UI/UX Designer & Pitch Lead** | `student-4-ui-ux-pitch/` | `globetrotter-ui-pitch` |

---

## ????? Student 1: Backend Developer
```bash
cd student-1-backend
git init
git branch -M main
git add .
git commit -m "feat(backend): complete FastAPI backend, PostgreSQL schema, and APIs"
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/globetrotter-backend.git
git push -u origin main
```

---

## ?? Student 2: Frontend Developer
```bash
cd student-2-frontend
git init
git branch -M main
git add .
git commit -m "feat(frontend): complete Next.js 14 application with 13 screens and Tailwind UI"
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/globetrotter-frontend.git
git push -u origin main
```

---

## ?? Student 3: Data & AI Integration Lead
```bash
cd student-3-data-api
git init
git branch -M main
git add .
git commit -m "feat(data-ai): travel datasets, budget estimator service, and recommendation API"
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/globetrotter-data-ai.git
git push -u origin main
```

---

## ?? Student 4: UI/UX & Pitch Lead
```bash
cd student-4-ui-ux-pitch
git init
git branch -M main
git add .
git commit -m "feat(design-pitch): interactive pitch deck, design tokens, and UI specs"
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/globetrotter-ui-pitch.git
git push -u origin main
```

---

## ?? Full Monorepo Option
```bash
# In the root folder containing all 4 packages:
git init
git branch -M main
git add .
git commit -m "feat: complete GlobeTrotter multi-city travel planning platform"
git remote add origin https://github.com/<TEAM_OR_ORG_NAME>/globetrotter.git
git push -u origin main
```
