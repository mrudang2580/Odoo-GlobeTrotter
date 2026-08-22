"""
GlobeTrotter AI Activity Recommender Service (HF Space & Gradio ready)
"""
import csv

def load_activities():
    activities = []
    try:
        with open("data/activities.csv", mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                activities.append(row)
    except FileNotFoundError:
        pass
    return activities

def recommend_activities(city: str, category_interest: str = "sightseeing", max_budget: float = 100.0):
    all_act = load_activities()
    matched = [a for a in all_act if city.lower() in a["city_name"].lower()]
    if not matched:
        matched = all_act

    # Filter & rank
    ranked = []
    for item in matched:
        cost = float(item.get("cost", 0))
        if cost <= max_budget:
            score = 100
            if item.get("category", "") == category_interest:
                score += 50
            ranked.append({**item, "recommendation_score": score})

    ranked.sort(key=lambda x: x["recommendation_score"], reverse=True)
    return ranked[:5]

if __name__ == "__main__":
    recs = recommend_activities("Paris", "food", 80.0)
    print("Recommended activities for Paris:", recs)
