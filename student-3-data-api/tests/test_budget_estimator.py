import pytest
from scripts.budget_estimator import estimate_trip_budget

def test_budget_calculation():
    result = estimate_trip_budget(["Paris", "Rome"], total_days=6, travel_style="balanced")
    assert "total_estimated_budget" in result
    assert result["total_estimated_budget"] > 0
    assert result["days"] == 6
    assert "transport" in result["category_breakdown"]
    assert "stay" in result["category_breakdown"]

def test_backpacker_vs_luxury():
    backpacker = estimate_trip_budget(["Tokyo"], total_days=5, travel_style="backpacker")
    luxury = estimate_trip_budget(["Tokyo"], total_days=5, travel_style="luxury")
    assert luxury["total_estimated_budget"] > backpacker["total_estimated_budget"]
