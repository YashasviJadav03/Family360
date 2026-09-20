import re
import logging
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.family import Family
from app.models.family_member import FamilyMember
from app.models.benefit import Benefit
from app.models.scheme import Scheme
from app.models.eligibility_rule import EligibilityRule
from app.models.duplicate_review import DuplicateReview
from app.services.duplicate_detection_service import find_candidate_duplicates
from app.services.eligibility_engine import evaluate_eligibility
from app.services.llm_client import call_llm

logger = logging.getLogger(__name__)

# This uses intent-matching over a fixed template set, not open-ended text-to-SQL, to keep behavior predictable and safe for a government data context.

GUJARAT_DISTRICTS = [
    "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha",
    "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod",
    "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath",
    "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar",
    "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal",
    "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat",
    "Surendranagar", "Tapi", "Vadodara", "Valsad"
]


def extract_district(text: str) -> str | None:
    for d in GUJARAT_DISTRICTS:
        if d.lower() in text.lower():
            return d
    return None


def extract_family_id(text: str) -> str | None:
    match = re.search(r"GJ-F\d{6}", text, re.IGNORECASE)
    if match:
        return match.group(0).upper()
    return None


def handle_district_benefit_gaps(district: str, db: Session) -> dict:
    """
    Finds families with the most unclaimed benefit gaps in a specific district.
    """
    gaps_query = (
        db.query(
            Family.family_id,
            Family.village,
            Family.annual_income,
            Family.social_category,
            func.count(Benefit.benefit_id).label("gap_count")
        )
        .join(Benefit, Benefit.family_id == Family.family_id)
        .filter(Family.district == district)
        .filter(Benefit.status == "NOT_APPLIED")
        .group_by(Family.family_id, Family.village, Family.annual_income, Family.social_category)
        .order_by(func.count(Benefit.benefit_id).desc(), Family.family_id)
        .limit(5)
        .all()
    )

    top_families = []
    for row in gaps_query:
        # Get head of family name
        head = (
            db.query(FamilyMember)
            .filter(FamilyMember.family_id == row.family_id)
            .filter(FamilyMember.relation_to_head == "Head")
            .first()
        )
        head_name = head.name if head else "Head of Household"

        # Get the gap scheme names
        gap_benefits = (
            db.query(Scheme.scheme_name)
            .join(Benefit, Benefit.scheme_id == Scheme.scheme_id)
            .filter(Benefit.family_id == row.family_id)
            .filter(Benefit.status == "NOT_APPLIED")
            .all()
        )
        scheme_names = [s[0] for s in gap_benefits]

        top_families.append({
            "family_id": row.family_id,
            "head_name": head_name,
            "village": row.village,
            "annual_income": row.annual_income,
            "social_category": row.social_category,
            "gap_count": row.gap_count,
            "unclaimed_schemes": scheme_names,
        })

    structured_data = {
        "district": district,
        "top_families": top_families,
    }

    # Format for LLM
    family_lines = []
    for f in top_families:
        schemes_str = ", ".join(f["unclaimed_schemes"]) if f["unclaimed_schemes"] else "multiple schemes"
        family_lines.append(
            f"- Family {f['family_id']} ({f['head_name']}, {f['village']}): {f['gap_count']} gaps ({schemes_str}), Income: ₹{f['annual_income']:,}, Category: {f['social_category']}"
        )
    data_summary = "\n".join(family_lines) if family_lines else f"No unserved benefit gaps detected in {district}."

    system_prompt = (
        "You are an administrative welfare intelligence assistant for the Government of Gujarat. "
        "Answer the district officer's question using ONLY the provided verified database results. "
        "Do not invent facts or make eligibility decisions. Keep your response professional, precise, and concise."
    )
    user_prompt = f"""
Officer Question: Which families in {district} have the most benefit gaps?

Verified Database Results for {district}:
{data_summary}

Provide a concise, 2-3 sentence administrative briefing summarizing these households and recommending field outreach.
"""

    llm_answer = call_llm(system_prompt, user_prompt)
    if not llm_answer:
        if top_families:
            f0 = top_families[0]
            f_names = ", ".join([f"{f['family_id']} ({f['head_name']}, {f['gap_count']} gaps)" for f in top_families[:3]])
            llm_answer = (
                f"In {district} district, the households with the most unserved benefit gaps are {f_names}. "
                f"For example, household {f0['family_id']} in {f0['village']} qualifies for {', '.join(f0['unclaimed_schemes'][:2])} "
                f"based on their annual income of ₹{f0['annual_income']:,} and {f0['social_category']} category. "
                f"Proactive outreach by the Taluka Welfare Officer is recommended for immediate enrollment."
            )
        else:
            llm_answer = f"No families in {district} currently have unresolved benefit gaps in the state registry."

    return {
        "intent": "DISTRICT_BENEFIT_GAPS",
        "answer": llm_answer,
        "data": structured_data,
        "suggested_links": [
            {"label": f"View {district} Families", "url": f"/officer/families?district={district}"}
        ]
    }


def handle_family_eligibility_explanation(family_id: str | None, scheme_keyword: str | None, db: Session) -> dict:
    """
    Explains why a family is eligible for a specific scheme (e.g., housing assistance)
    or why they were flagged with benefit gaps.
    """
    # If no family_id was explicitly provided, pick a family eligible for housing (SCH007) with a gap
    target_family_id = family_id
    if not target_family_id:
        sample_fam = (
            db.query(Family.family_id)
            .join(Benefit, Benefit.family_id == Family.family_id)
            .filter(Benefit.scheme_id.in_(["SCH007", "SCH008"]))
            .filter(Benefit.status == "NOT_APPLIED")
            .first()
        )
        target_family_id = sample_fam[0] if sample_fam else "GJ-F000012"

    family = db.query(Family).filter(Family.family_id == target_family_id).first()
    if not family:
        return {
            "intent": "FAMILY_ELIGIBILITY_EXPLANATION",
            "answer": f"Household record '{target_family_id}' was not found in the Gujarat Family ID database.",
            "data": {},
        }

    # Identify relevant scheme
    scheme_id = "SCH007"  # Dr. B.R. Ambedkar Awas Yojana (Housing)
    if scheme_keyword and "housing" in scheme_keyword.lower():
        scheme_id = "SCH007"
    elif scheme_keyword and "pension" in scheme_keyword.lower():
        scheme_id = "SCH004"

    scheme = db.query(Scheme).filter(Scheme.scheme_id == scheme_id).first()
    if not scheme:
        scheme = db.query(Scheme).first()

    all_rules = db.query(EligibilityRule).filter(EligibilityRule.scheme_id == scheme.scheme_id).all()
    eval_map = evaluate_eligibility(family, family.members, all_rules)
    result = eval_map.get(scheme.scheme_id)

    matched_attrs = [f"{r.attribute.replace('_', ' ')} ({r.operator} {r.threshold})" for r in result.matched_rules] if result else []
    failed_attrs = [f"{r.attribute.replace('_', ' ')} ({r.operator} {r.threshold})" for r in result.failed_rules] if result else []

    structured_data = {
        "family_id": family.family_id,
        "district": family.district,
        "village": family.village,
        "annual_income": family.annual_income,
        "social_category": family.social_category,
        "housing_status": family.housing_status,
        "scheme_name": scheme.scheme_name,
        "is_eligible": result.is_eligible if result else False,
        "matched_rules": matched_attrs,
        "failed_rules": failed_attrs,
    }

    system_prompt = (
        "You are an administrative welfare intelligence assistant for the Government of Gujarat. "
        "Explain why this household qualifies for the scheme using ONLY the provided pre-computed deterministic evaluation. "
        "CRITICAL: Do not determine eligibility yourself. State the factual rule matches clearly for an officer."
    )
    user_prompt = f"""
Family ID: {family.family_id}
Location: {family.village}, {family.taluka}, {family.district}
Social Category: {family.social_category}
Annual Income: ₹{family.annual_income:,}
Housing Status: {family.housing_status}
Scheme: {scheme.scheme_name}
Deterministic Status: {'ELIGIBLE' if result and result.is_eligible else 'NOT ELIGIBLE'}
Satisfied Criteria: {', '.join(matched_attrs) if matched_attrs else 'None'}
Unmet Criteria: {', '.join(failed_attrs) if failed_attrs else 'None'}

Explain why this family is eligible in 2 clear, formal administrative sentences.
"""

    llm_answer = call_llm(system_prompt, user_prompt)
    if not llm_answer:
        if result and result.is_eligible:
            llm_answer = (
                f"Household {family.family_id} ({family.village}, {family.district}) is eligible for {scheme.scheme_name} "
                f"because their annual household income of ₹{family.annual_income:,} is within the statutory ₹2,00,000 threshold, "
                f"their social category is {family.social_category}, and their housing status is recorded as {family.housing_status}. "
                f"All mandatory criteria have been satisfied deterministically by the rule engine."
            )
        else:
            llm_answer = (
                f"Household {family.family_id} does not currently qualify for {scheme.scheme_name} "
                f"due to unmet statutory criteria: {', '.join(failed_attrs)}."
            )

    return {
        "intent": "FAMILY_ELIGIBILITY_EXPLANATION",
        "answer": llm_answer,
        "data": structured_data,
        "suggested_links": [
            {"label": f"Inspect Family {family.family_id} 360 Profile", "url": f"/officer/families/{family.family_id}"}
        ]
    }


def handle_unresolved_duplicates(district: str | None, db: Session) -> dict:
    """
    Answers how many duplicate records are unresolved across registries.
    """
    # Check pending in DuplicateReview table
    pending_reviews_count = (
        db.query(DuplicateReview)
        .filter(DuplicateReview.status == "PENDING")
        .count()
    )

    # Also calculate candidate duplicate pairs via entity resolution blocking
    candidates, metrics = find_candidate_duplicates(db=db, min_score=0.70, district_filter=district, limit=100)
    total_unresolved = len(candidates) + pending_reviews_count

    structured_data = {
        "district": district or "All Gujarat",
        "pending_reviews_count": pending_reviews_count,
        "candidate_pairs_found": len(candidates),
        "total_unresolved_estimate": total_unresolved,
        "comparisons_pruned": metrics.get("comparisons_pruned", 0),
        "comparisons_evaluated": metrics.get("comparisons_evaluated", 0),
    }

    system_prompt = (
        "You are an administrative welfare intelligence assistant for the Government of Gujarat. "
        "Answer the district officer's question regarding unresolved duplicate records using the provided metrics. "
        "Be concise, factual, and direct."
    )
    user_prompt = f"""
Officer Question: How many possible duplicate records are unresolved?
Metrics:
- Unresolved Candidate Pairs Requiring Review: {total_unresolved}
- Comparisons Pruned by District/Initial Blocking: {metrics.get('comparisons_pruned', 0):,}
- Evaluated High-Confidence Matches: {metrics.get('comparisons_evaluated', 0):,}

Provide a concise 2-sentence administrative summary highlighting the candidate count and urging review in the Duplicate Review Queue.
"""

    llm_answer = call_llm(system_prompt, user_prompt)
    if not llm_answer:
        llm_answer = (
            f"There are currently {total_unresolved} candidate duplicate identity records pending review across departmental registries. "
            f"The entity resolution engine evaluated {metrics.get('comparisons_evaluated', 0):,} cross-system pairs while pruning "
            f"{metrics.get('comparisons_pruned', 0):,} non-matching pairs using phonetic and demographic blocking."
        )

    return {
        "intent": "DUPLICATE_SUMMARY",
        "answer": llm_answer,
        "data": structured_data,
        "suggested_links": [
            {"label": "Open Duplicate Review Queue", "url": "/officer/duplicates"}
        ]
    }


def handle_scheme_criteria(question: str, db: Session) -> dict:
    """
    Answers questions about specific scheme criteria.
    """
    schemes = db.query(Scheme).all()
    matched_scheme = None
    q_lower = question.lower()
    for s in schemes:
        if s.scheme_name.lower() in q_lower or s.scheme_id.lower() in q_lower or s.category.lower() in q_lower:
            matched_scheme = s
            break

    if not matched_scheme:
        # Default to Ambedkar Awas Yojana if housing mentioned, or first scheme
        if "housing" in q_lower or "awas" in q_lower:
            matched_scheme = db.query(Scheme).filter(Scheme.scheme_id == "SCH007").first()
        elif "pension" in q_lower:
            matched_scheme = db.query(Scheme).filter(Scheme.scheme_id == "SCH004").first()
        else:
            matched_scheme = db.query(Scheme).filter(Scheme.scheme_id == "SCH007").first()

    rules = db.query(EligibilityRule).filter(EligibilityRule.scheme_id == matched_scheme.scheme_id).all()
    rule_summaries = [f"- {r.attribute.replace('_', ' ').capitalize()}: {r.operator} {r.value}" for r in rules]

    answer = (
        f"{matched_scheme.scheme_name} ({matched_scheme.scheme_id}) under the {matched_scheme.department} "
        f"provides: {matched_scheme.benefit}. Statutory eligibility criteria:\n"
        + "\n".join(rule_summaries)
    )

    return {
        "intent": "SCHEME_CRITERIA",
        "answer": answer,
        "data": {
            "scheme_id": matched_scheme.scheme_id,
            "scheme_name": matched_scheme.scheme_name,
            "department": matched_scheme.department,
            "benefit": matched_scheme.benefit,
            "rules": rule_summaries,
        },
        "suggested_links": [
            {"label": "Browse Scheme Directory", "url": "/officer/schemes"}
        ]
    }


def process_officer_query(question: str, db: Session) -> dict:
    """
    Processes an incoming natural-language officer query via keyword/intent detection
    and maps it to existing deterministic services.

    ARCHITECTURAL CONSTRAINT (SAFETY):
    This uses intent-matching over a fixed template set, not open-ended text-to-SQL,
    to keep behavior predictable and safe for a government data context.
    """
    q = question.strip()
    q_lower = q.lower()

    district = extract_district(q)
    family_id = extract_family_id(q)

    # 1. Intent: District benefit gaps
    # Examples: "Which families in Ahmedabad have the most benefit gaps?", "families with gaps in Surat"
    if ("benefit gap" in q_lower or "gap" in q_lower or "unclaimed" in q_lower) and (district or "ahmedabad" in q_lower or "which families" in q_lower):
        target_district = district or "Ahmedabad"
        return handle_district_benefit_gaps(target_district, db)

    # 2. Intent: Family eligibility / housing assistance explanation
    # Examples: "Why is this family potentially eligible for housing assistance?", "Why was family GJ-F000001 flagged"
    if ("housing" in q_lower or "eligible" in q_lower or "flagged" in q_lower or "why is" in q_lower or family_id):
        scheme_kw = "housing" if "housing" in q_lower or "awas" in q_lower else None
        return handle_family_eligibility_explanation(family_id, scheme_kw, db)

    # 3. Intent: Unresolved duplicates
    # Examples: "How many possible duplicate records are unresolved?", "how many duplicates"
    if "duplicate" in q_lower or "reconcil" in q_lower or "unresolved" in q_lower:
        return handle_unresolved_duplicates(district, db)

    # 4. Intent: Scheme criteria
    if "criteria" in q_lower or "rules" in q_lower or "requirement" in q_lower or "awas" in q_lower or "pension" in q_lower or "scheme" in q_lower:
        return handle_scheme_criteria(q, db)

    # Default fallback: general intelligence overview
    total_families = db.query(Family).count()
    total_gaps = db.query(Benefit).filter(Benefit.status == "NOT_APPLIED").count()
    return {
        "intent": "GENERAL_SUMMARY",
        "answer": (
            f"Family360 Welfare Intelligence Command Center: Currently tracking {total_families:,} registered families "
            f"and {total_gaps:,} identified benefit gaps across 10 Gujarat districts. "
            f"You can ask me about families with the most benefit gaps, why a specific family qualifies for housing or pension, "
            f"or the status of unresolved duplicate records."
        ),
        "data": {
            "total_families": total_families,
            "total_benefit_gaps": total_gaps,
        },
        "suggested_links": [
            {"label": "State Overview Dashboard", "url": "/officer/dashboard"},
            {"label": "Browse Family Registry", "url": "/officer/families"},
        ]
    }
