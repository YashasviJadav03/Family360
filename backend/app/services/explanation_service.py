import logging
from typing import Optional
from app.models.family import Family
from app.models.scheme import Scheme
from app.services.eligibility_engine import EligibilityResult
from app.services.llm_client import call_llm

logger = logging.getLogger(__name__)

# In-memory LRU-style explanation cache to avoid redundant API costs
EXPLANATION_CACHE: dict[tuple[str, str], str] = {}


def generate_gap_explanation(
    family: Family,
    scheme: Scheme,
    eligibility_result: EligibilityResult
) -> str:
    """
    Generates a natural-language explanation of why a family is eligible or
    unserved for a specific scheme.

    ARCHITECTURAL CONSTRAINT (CRITICAL):
    Under no circumstances does this function or any underlying LLM determine
    eligibility. The boolean eligibility outcome is strictly pre-computed by
    the deterministic rule engine (evaluate_eligibility). The LLM's sole role
    is linguistic synthesis for government officers. See ADR-002.

    Args:
        family: Family ORM entity with attributes and members
        scheme: Scheme ORM entity with department and benefit description
        eligibility_result: Deterministic output containing matched and failed rules

    Returns:
        str: Concise, respectful explanation suitable for an administrative review memo
    """
    cache_key = (family.family_id, scheme.scheme_id)
    if cache_key in EXPLANATION_CACHE:
        return EXPLANATION_CACHE[cache_key]

    matched_summary = [
        f"- {r.attribute.replace('_', ' ').capitalize()} satisfied requirement: {r.operator} {r.threshold}"
        for r in eligibility_result.matched_rules
    ]
    failed_summary = [
        f"- {r.attribute.replace('_', ' ').capitalize()} unmet requirement: {r.operator} {r.threshold}"
        for r in eligibility_result.failed_rules
    ]

    system_prompt = (
        "You are an administrative welfare intelligence assistant for the Government of Gujarat. "
        "Your task is to explain a pre-computed welfare eligibility evaluation for a District Officer. "
        "CRITICAL RULE: Do not determine eligibility yourself. You are not authorized to make decisions. "
        "Only explain the following pre-computed rule evaluation in plain, respectful, objective language."
    )

    user_prompt = f"""
Family ID: {family.family_id}
Location: Village {family.village}, Taluka {family.taluka}, District {family.district}
Social Category: {family.social_category}
Annual Household Income: ₹{family.annual_income:,}
Household Size: {family.family_size} members

Scheme: {scheme.scheme_name} (ID: {scheme.scheme_id})
Department: {scheme.department}
Entitlement Benefit: {scheme.benefit}

Pre-Computed Rule Engine Outcome:
- Status: {'ELIGIBLE (POTENTIAL BENEFIT GAP)' if eligibility_result.is_eligible else 'NOT ELIGIBLE'}
- Satisfied Criteria:
{chr(10).join(matched_summary) if matched_summary else 'None'}
- Unmet Criteria:
{chr(10).join(failed_summary) if failed_summary else 'None'}

Provide a 2 to 3 sentence administrative memo summarizing why this family was surfaced and what verification steps or documents the officer should check. Keep it concise, formal, and objective.
"""

    llm_output = call_llm(system_prompt, user_prompt)

    if not llm_output:
        # High-fidelity deterministic template fallback
        head_name = family.members[0].name if family.members else "Household Head"
        if eligibility_result.is_eligible:
            matched_attrs = ", ".join([r.attribute.replace('_', ' ') for r in eligibility_result.matched_rules])
            explanation = (
                f"Household {family.family_id} ({head_name}, {family.village}, {family.district}) qualifies for "
                f"{scheme.scheme_name} based on verified {matched_attrs}. "
                f"With an annual income of ₹{family.annual_income:,} and {family.social_category} category, "
                f"this family represents an unserved benefit gap under the {scheme.department}."
            )
        else:
            failed_attrs = ", ".join([r.attribute.replace('_', ' ') for r in eligibility_result.failed_rules])
            explanation = (
                f"Household {family.family_id} does not currently qualify for {scheme.scheme_name} "
                f"as the following statutory criteria were unmet: {failed_attrs}. "
                f"All other civil identity and demographic markers remain registered on the Gujarat Family ID platform."
            )
    else:
        explanation = llm_output

    EXPLANATION_CACHE[cache_key] = explanation
    return explanation
