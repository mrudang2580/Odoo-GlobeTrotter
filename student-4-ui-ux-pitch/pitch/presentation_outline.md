# 📑 GlobeTrotter Presentation Outline & Judge Q&A Prep

## 📊 Presentation Structure
1. **Slide 1**: Title, Team Members & Roles
2. **Slide 2**: Problem Statement (App fragmentation, budget overruns, lack of sharing)
3. **Slide 3**: Solution: GlobeTrotter All-in-One Platform
4. **Slide 4**: Complete 13-Screen Implementation Scope
5. **Slide 5**: Decoupled Full-Stack Architecture & Microservices
6. **Slide 6**: Monetization & Odoo Ecosystem Synergy
7. **Slide 7**: Closing & Live Demonstration

---

## ❓ Anticipated Judge Questions & Strong Answers

**Q1: How does the AI recommendation engine calculate match scores?**  
*Answer*: We extract semantic tags, budget thresholds, and regional preferences from the user's input, calculate cosine similarity across our indexed activity/city matrices, and weight the score by popularity and customer ratings.

**Q2: How does the budget forecaster prevent over-budget situations?**  
*Answer*: As stops and activities are added, the system computes total daily cost against the trip budget limit divided by duration. If a single day exceeds average allocation, an interactive warning tag is rendered.

**Q3: Can this work offline?**  
*Answer*: Yes, we have client-side state caching with localStorage / IndexedDB fallbacks, allowing travelers to view their schedules during flights.
