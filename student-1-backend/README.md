# 🧑‍💻 GlobeTrotter — Backend Repository (Student 1)

FastAPI & PostgreSQL backend service powering the GlobeTrotter multi-city travel planning platform.

---

## 🛠️ Tech Stack
- **Framework**: Python 3.11 + FastAPI
- **Database**: PostgreSQL (Supabase compatible) / SQLite for local development
- **ORM**: SQLAlchemy 2.0 + Pydantic v2
- **Auth**: JWT + Passlib Bcrypt

---

## 🚀 How to Run Locally

```bash
# 1. Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run FastAPI server
uvicorn app.main:app --reload --port 8000
```

- Swagger API documentation: `http://localhost:8000/docs`

---

## 🚢 Push to GitHub
```bash
git init
git branch -M main
git add .
git commit -m "feat(backend): complete FastAPI backend with PostgreSQL schema and all 13 features"
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/globetrotter-backend.git
git push -u origin main
```
