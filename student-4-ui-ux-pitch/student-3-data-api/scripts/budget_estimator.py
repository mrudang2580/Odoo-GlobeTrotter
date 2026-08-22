"""
GlobeTrotter Budget Estimation Service
Calculates daily breakdown based on city cost index and traveler preference style.
"""

def estimate_budget(cost_index: int, num_days: int, travel_style: str = "mid") -> dict:
    base_rates = {
        "budget": {"stay": 35.0, "meals": 20.0, "transport": 10.0, "activities": 15.0},
        "mid": {"stay": 90.0, "meals": 45.0, "transport": 20.0, "activities": 35.0},
        "luxury": {"stay": 250.0, "meals": 120.0, "transport": 50.0, "activities": 90.0},
    }

    style_rates = base_rates.get(travel_style, base_rates["mid"])
    multiplier = 0.6 + (cost_index * 0.2) # cost_index 1 -> 0.8x, 5 -> 1.6x

    daily_breakdown = {cat: round(amt * multiplier, 2) for cat, amt in style_rates.items()}
    daily_total = sum(daily_breakdown.values())
    total_cost = round(daily_total * num_days, 2)

    return {
        "num_days": num_days,
        "travel_style": travel_style,
        "city_cost_multiplier": multiplier,
        "daily_breakdown": daily_breakdown,
        "daily_total": round(daily_total, 2),
        "total_estimated_cost": total_cost,
    }

if __name__ == "__main__":
    result = estimate_budget(cost_index=4, num_days=4, travel_style="mid")
    print("Sample 4-day Paris budget estimate:", result)
