# Family360 — Live Presentation Demo Script & Curated Hero Families

This document contains pre-verified, curated "hero" families and step-by-step presentation cues for the live hackathon demonstration. **Do not rely on random families during live evaluation.**

---

## 🌟 Curated "Hero" Family Records

These households were verified against the full 3,000-family database to guarantee:
1. **At least 2+ prominent unclaimed benefit gaps** evaluated deterministically by the rule engine.
2. **A high-confidence candidate duplicate pair** (match score ≥ 0.90 / 1.00) in the Entity Resolution review queue.
3. **A clean, complete demographic profile** (valid ration card, income, address) ensuring flawless UI presentation.

| Family ID | District / Taluka | Category / Income | Housing | Benefit Gaps (Unclaimed) | Candidate Duplicate Pair | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`GJ-F000525`** *(Primary Hero)* | Anand (`Anand Nani`) | SC · ₹1,24,173 | Rented | **5 Gaps**: Dr. Ambedkar Awas (`SCH007`), Vrudh Pension (`SCH004`), Ganga Swarupa (`SCH005`), Swami Vivekanand (`SCH003`), Sant Surdas (`SCH009`) | `REC0002647` ⟷ `REC0002648` (*Mahesh Mukesh Solanki*, Score: 1.00) | **Best all-rounder**: Shows 5 gaps, 2 active benefits, senior citizen + student members, and 1.00 duplicate. |
| **`GJ-F001954`** *(Secondary Hero)* | Junagadh (`Keshod Kotda`) | OBC · ₹1,30,016 | Rented | **6 Gaps**: Housing, Pension, Scholarships, Ganga Swarupa | `REC0009798` ⟷ `REC0009799` (*Anil Nilesh Pandya*, Score: 1.00) | Demonstrates high-gap concentration for backward class household. |
| **`GJ-F000049`** *(Housing Hero)* | Rajkot (`Kotda Sangani`) | SC · ₹1,97,663 | **None** (Homeless/Kucha) | **2 Gaps**: Dr. Ambedkar Awas Yojana (`SCH007`), Pre-Matric Scholarship (`SCH001`) | `REC0000222` ⟷ `REC0000223` (*Mukesh Dipak Gohil*, Score: 1.00) | Perfect for demonstrating Dr. Ambedkar Awas housing eligibility. |
| **`GJ-F002842`** *(Low-Income Hero)* | Junagadh (`Visavadar`) | OBC · ₹90,491 | Rented | **2 Gaps**: Ganga Swarupa, Post-Matric Scholarship | `REC0014219` ⟷ `REC0014220` (*Nilesh Kishore Parmar*, Score: 1.00) | Demonstrates low-income widow and youth welfare tracking. |
| **`GJ-F000012`** *(Ahmedabad Hero)* | Ahmedabad (`Daskroi Gam`) | SC · ₹1,40,701 | Rented | **5 Gaps**: Pre-Matric, Ganga Swarupa, Ambedkar Awas | Candidate duplicate in Civil Supplies | Directly matches natural language query assistant demo questions. |

---

## ⏱️ 5-Minute Live Demo Flow

### Act 1: The Problem & Officer Command Center (0:00 – 1:15)
1. **Route**: `/officer/dashboard`
2. **Key Talking Points**:
   - In India, welfare benefits are fragmented across departmental silos (Civil Supplies, Social Justice, Education, Health). Citizens often qualify for life-changing schemes but never receive them because of lack of awareness or paperwork hurdles.
   - Family360 unifies departmental data into a single Gujarat Family ID anchor.
3. **Visual Highlights**:
   - **4 KPI Cards**: 3,000 families tracked, 2,639+ unserved gaps surfaced proactively.
   - **Data Quality & Cross-Registry Telemetry** (`DataQualityPanel`): Highlight the 72.6% completeness score, 609 address discrepancies, and 500 candidate duplicate pairs. Emphasize: *"These aren't bugs—they are the real data quality challenges of legacy government MISs."*

### Act 2: Proactive Benefit Gap Surfacing & Deterministic Explainer (1:15 – 2:45)
1. **Route**: Navigate to `/officer/families/GJ-F000525`
2. **Visual Highlights**:
   - **360-Degree Profile**: Shows head Vijay Thakor, 5 members, ration card `RC-GJ53444580`, income ₹1,24,173.
   - **Benefit Gap Matrix**: Visually shows 2 active schemes (Manav Garima, Education Loan) and **5 unclaimed benefit gaps** (Ambedkar Awas, Vrudh Pension, etc.).
3. **Open Scheme Explainer Modal**:
   - Click on **Dr. B.R. Ambedkar Awas Yojana (`SCH007`)**.
   - Show the **AI Plain-Language Administrative Memo**:
     > *"Household GJ-F000525 qualifies for Dr. B.R. Ambedkar Awas Yojana based on verified annual income of ₹1,24,173 (<= ₹1,50,000) and Rented housing status..."*
   - Point out: **Architectural guardrail**: The rule engine deterministically evaluates the boolean condition; the LLM only translates the matched rules into plain language for the officer.
   - Click **"Submit Application"** to show instant creation of an assisted benefit application.

### Act 3: Explainable Entity Resolution & Deduplication (2:45 – 3:45)
1. **Route**: Navigate to `/officer/duplicates`
2. **Talking Points**:
   - When departments merge data, duplicate identities create ghost beneficiaries or fragmented entitlements.
   - Brute-force comparison on 15,000 records requires ~113M comparisons. Family360 uses **phonetic and demographic blocking** `(district, first_letter)`, reducing comparisons by >96% to maintain sub-second response times.
3. **Action**:
   - Search for **Anand** or open candidate pair `REC0002647` ⟷ `REC0002648` (Mahesh Mukesh Solanki).
   - Show the **Field-by-Field Explainability**: Name similarity 100%, DOB match 100%, Address 100% -> Overall Score 1.00.
   - Click **"Confirm Duplicate"** or **"Resolve"** with audit notes.

### Act 4: Natural-Language Officer Assistant (3:45 – 4:30)
1. **Route**: Return to `/officer/dashboard` (or open AI Explainer drawer)
2. **Demo the 3 Suggested Clickable Chips**:
   - Click: *"Which families in Ahmedabad have the most benefit gaps?"* → Instantly surfaces top unserved families like `GJ-F000012` with direct profile link.
   - Click: *"Why is family GJ-F000012 potentially eligible for housing assistance?"* → Outlines exact income and rented status criteria.
   - Click: *"How many possible duplicate records are unresolved?"* → Displays the candidate count and blocking metrics.
3. **Safety Note**: Emphasize: *"This uses intent-matching over a fixed template set, not open-ended text-to-SQL, keeping behavior deterministic and safe for government infrastructure."*

### Act 5: Citizen View & Closing (4:30 – 5:00)
1. **Route**: Navigate to `/citizen/family/GJ-F000525`
2. **Point Out**: Citizens see transparent entitlement statuses, their family graph, and one-click assisted application tracking without navigating 11 separate departmental portals.
3. **Closing Pitch**: *"Family360 turns passive welfare into proactive, family-centric entitlement delivery for the Government of Gujarat."*
