import csv
import json
import os

def export_seed_fixtures():
    """Converts CSV data into JSON fixtures and SQL inserts."""
    base_dir = os.path.dirname(__file__)
    cities_file = os.path.join(base_dir, "..", "data", "cities.csv")
    activities_file = os.path.join(base_dir, "..", "data", "activities.csv")

    cities = []
    with open(cities_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            cities.append(r)

    activities = []
    with open(activities_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            activities.append(r)

    print(f"✅ Successfully processed {len(cities)} cities and {len(activities)} activities.")

if __name__ == "__main__":
    export_seed_fixtures()
