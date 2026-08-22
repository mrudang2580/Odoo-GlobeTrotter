# 👥 GlobeTrotter — Team Git Collaboration Guide

This guide explains how all 4 team members collaborate in our single shared repository:  
**Repository**: [https://github.com/mrudang2580/Odoo-GlobeTrotter](https://github.com/mrudang2580/Odoo-GlobeTrotter)

---

## 👥 Team Mapping & Ownership

| Member | GitHub Username | Role | Owned Directory |
| :--- | :--- | :--- | :--- |
| **Student 1** | [@mrudang2580](https://github.com/mrudang2580) | **Backend Engineer (Lead)** | `student-1-backend/` |
| **Student 2** | [@angels31206](https://github.com/angels31206) | **Frontend Engineer** | `student-2-frontend/` |
| **Student 3** | [@labdhimehta-2311](https://github.com/labdhimehta-2311) | **Data & AI Integration Lead** | `student-3-data-api/` |
| **Student 4** | [@Manas_Mashru](https://github.com/Manas_Mashru) | **UI/UX Designer & Pitch Lead** | `student-4-ui-ux-pitch/` |

---

## 🔑 Step 1: Add Teammates as Collaborators (Repo Owner @mrudang2580)

1. Go to [https://github.com/mrudang2580/Odoo-GlobeTrotter/settings/access](https://github.com/mrudang2580/Odoo-GlobeTrotter/settings/access)
2. Click **Add people** and invite:
   - `angels31206`
   - `Manas_Mashru`
   - `labdhimehta-2311`
3. Each teammate accepts the invitation in their email or at [https://github.com/mrudang2580/Odoo-GlobeTrotter/invitations](https://github.com/mrudang2580/Odoo-GlobeTrotter/invitations).

---

## 🚀 Step 2: How Each Teammate Clones and Pushes Contributions

Each member runs these commands on their computer:

### 1. Clone the shared repository:
```bash
git clone https://github.com/mrudang2580/Odoo-GlobeTrotter.git
cd Odoo-GlobeTrotter
```

### 2. Create your own feature branch:
- **Student 2 (Frontend)**:
  ```bash
  git checkout -b feature/angels-frontend
  ```
- **Student 3 (Data & AI)**:
  ```bash
  git checkout -b feature/labdhi-data-ai
  ```
- **Student 4 (UI/UX & Pitch)**:
  ```bash
  git checkout -b feature/manas-ui-pitch
  ```

### 3. Make changes and commit:
```bash
# Work inside your assigned folder, then commit:
git add .
git commit -m "feat: updated module features"
git push -u origin <your-branch-name>
```

### 4. Merge into `main`:
Open a Pull Request on GitHub to merge into `main`. The evaluator will see clear commit contributions from all 4 student accounts in the GitHub commit graph!
