# 📊 GlobeTrotter — Student 3: Data Science & AI Recommendation Engine

**Owner**: [@labdhimehta-2311](https://github.com/labdhimehta-2311) (Data & AI Integration Lead)  
**Stack**: Python 3.11, FastAPI, Pandas, NumPy, Scikit-learn, Pytest

---

## 🎯 Scope & Deliverables

1. **City & Activity Datasets**: `data/cities.csv` (15+ global travel hubs) & `data/activities.csv` (80+ activities categorized with pricing).
2. **AI Recommendation Engine**: `scripts/recommender_api.py` microservice delivering cosine similarity & interest-weighted scores.
3. **Smart Budget Estimator**: `scripts/budget_estimator.py` forecasting dynamic spend across travel styles (Backpacker, Balanced, Luxury).
4. **Machine Learning Clustering**: `scripts/ml_travel_cluster.py` clustering traveler personas.
5. **Interactive EDA Notebook**: `notebooks/data_pipeline.ipynb` demonstrating exploratory data analysis.

---

## 🚀 Running the AI Recommendation Microservice

```bash
cd student-3-data-api
pip install -r requirements.txt
python scripts/recommender_api.py
```
API Documentation available at: [http://localhost:8001/docs](http://localhost:8001/docs)

## 🧪 Running Tests
```bash
pytest tests/
```
