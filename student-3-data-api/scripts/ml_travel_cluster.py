import numpy as np
from typing import Dict, List

class TravelPersonaClusterer:
    """
    Classifies travelers into 4 clusters based on spending preferences and pace:
    0: Budget Backpacker
    1: Cultural Heritage Explorer
    2: Luxury Resort & Relaxer
    3: High-Octane Outdoor Adventurer
    """
    def __init__(self):
        # Cluster centroids: [cost_sensitivity, culture_pref, adventure_pref, luxury_pref]
        self.centroids = np.array([
            [0.9, 0.5, 0.7, 0.1],  # 0: Budget Backpacker
            [0.4, 0.95, 0.4, 0.5], # 1: Cultural Heritage Explorer
            [0.1, 0.4, 0.2, 0.95], # 2: Luxury Resort & Relaxer
            [0.5, 0.3, 0.95, 0.4]  # 3: High-Octane Outdoor Adventurer
        ])
        self.labels = [
            "Budget Backpacker",
            "Cultural Heritage Explorer",
            "Luxury Resort & Relaxer",
            "High-Octane Outdoor Adventurer"
        ]

    def predict_cluster(self, profile: List[float]) -> Dict:
        """
        Calculates Euclidean distance to centroids to determine closest persona.
        profile: [cost_sensitivity (0-1), culture_pref (0-1), adventure_pref (0-1), luxury_pref (0-1)]
        """
        vec = np.array(profile)
        distances = [np.linalg.norm(vec - c) for c in self.centroids]
        best_cluster_idx = int(np.argmin(distances))
        confidence = float(1.0 / (1.0 + distances[best_cluster_idx]))
        
        return {
            "cluster_id": best_cluster_idx,
            "persona_name": self.labels[best_cluster_idx],
            "confidence_score": round(confidence, 3),
            "suggested_destinations": self._get_suggestions(best_cluster_idx)
        }

    def _get_suggestions(self, cluster_id: int) -> List[str]:
        suggestions = {
            0: ["Bali", "Cairo", "Bangkok", "Budapest"],
            1: ["Rome", "Paris", "Kyoto", "Athens"],
            2: ["Dubai", "New York City", "Santorini", "Monaco"],
            3: ["Queenstown", "Reykjavik", "Cape Town", "Interlaken"]
        }
        return suggestions.get(cluster_id, ["Paris", "Tokyo"])

if __name__ == "__main__":
    clusterer = TravelPersonaClusterer()
    # Test for Cultural Explorer
    test_user = [0.3, 0.9, 0.3, 0.6]
    res = clusterer.predict_cluster(test_user)
    print("Classified Persona:", res)
