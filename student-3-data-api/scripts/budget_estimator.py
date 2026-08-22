import json
import os
from typing import List, Dict

def estimate_trip_budget(
    city_names: List[str],
    total_days: int,
    travel_style: str = "balanced", # backpacker, balanced, luxury
    season: str = "shoulder"        # peak, shoulder, off
) -> Dict:
    """
    Calculates detailed budget forecast based on destinations, duration, traveler persona, and season.
    """
    base_city_costs = {
        "paris": 180,
        "tokyo": 200,
        "rome": 150,
        "barcelona": 140,
        "bali": 75,
        "new york city": 250,
        "cairo": 60,
        "sydney": 190,
        "kyoto": 160,
        "amsterdam": 170,
        "cape town": 80,
        "bangkok": 70,
        "london": 220,
        "dubai": 240,
        "rio de janeiro": 110
    }

    style_multipliers = {
        "backpacker": 0.65,
        "balanced": 1.0,
        "luxury": 2.2
    }

    season_multipliers = {
        "peak": 1.3,
        "shoulder": 1.0,
        "off": 0.75
    }

    # Calculate average daily rate across selected cities
    city_costs = [base_city_costs.get(c.lower(), 150) for c in city_names]
    avg_city_cost = sum(city_costs) / max(1, len(city_costs)) if city_costs else 150.0

    adjusted_daily_rate = avg_city_cost * style_multipliers.get(travel_style, 1.0) * season_multipliers.get(season, 1.0)
    total_estimated = round(adjusted_daily_rate * total_days, 2)

    # Category breakdown distributions
    if travel_style == "backpacker":
        cat_dist = {"transport": 0.35, "stay": 0.30, "activities": 0.20, "meals": 0.15}
    elif travel_style == "luxury":
        cat_dist = {"transport": 0.22, "stay": 0.48, "activities": 0.18, "meals": 0.12}
    else:
        cat_dist = {"transport": 0.28, "stay": 0.35, "activities": 0.22, "meals": 0.15}

    breakdown = {
        k: round(total_estimated * weight, 2) for k, weight in cat_dist.items()
    }

    # Inter-city transport estimate
    inter_city_transfer = max(0, len(city_names) - 1) * (120 if travel_style != "luxury" else 350)
    total_with_transit = round(total_estimated + inter_city_transfer, 2)

    return {
        "total_estimated_budget": total_with_transit,
        "daily_average": round(total_with_transit / max(1, total_days), 2),
        "days": total_days,
        "cities": city_names,
        "travel_style": travel_style,
        "season": season,
        "category_breakdown": breakdown,
        "inter_city_transit_cost": inter_city_transfer,
        "contingency_reserve_10pct": round(total_with_transit * 0.10, 2)
    }

if __name__ == "__main__":
    result = estimate_trip_budget(["Paris", "Rome", "Barcelona"], total_days=10, travel_style="balanced")
    print(json.dumps(result, indent=2))
