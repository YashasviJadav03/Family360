"""
SCALE CONSIDERATION & ARCHITECTURAL NOTE:
At hackathon scale (3,000 families, ~12,000 members, 11 schemes), on-demand evaluation
during read requests executes in <5ms per family. However, at Gujarat state scale
(~1.5 crore families) or India scale (~30 crore families), synchronous per-request evaluation
becomes an I/O and CPU bottleneck. At production scale, eligibility computation would transition
from 'evaluate-on-read' to 'evaluate-on-write' via event-driven background workers (e.g., Celery/Kafka).
When a citizen's income certificate or demographic profile updates, an async event recalculates
entitlements and persists pre-computed gap flags to an indexed cache (Redis / materialized view),
allowing O(1) instant dashboard reads. Cross-referenced in docs/system_design.md Section 3.
"""

from datetime import date
from typing import Any
from pydantic import BaseModel
from app.models.family import Family
from app.models.family_member import FamilyMember
from app.models.eligibility_rule import EligibilityRule


class RuleEvaluationDetail(BaseModel):
    rule_id: str
    attribute: str
    operator: str
    threshold: str
    actual_value: Any
    passed: bool
    description: str


class EligibilityResult(BaseModel):
    scheme_id: str
    is_eligible: bool
    matched_rules: list[RuleEvaluationDetail]
    failed_rules: list[RuleEvaluationDetail]
    missing_data_fields: list[str]


def calculate_age(born: date, reference_date: date | None = None) -> int:
    """Calculates age in completed years from date of birth."""
    if not born:
        return 0
    ref = reference_date or date(2026, 9, 20)
    return ref.year - born.year - ((ref.month, ref.day) < (born.month, born.day))


def compare_value(actual: Any, operator: str, threshold: str) -> bool:
    """Evaluates an atomic condition between actual value and threshold string."""
    if actual is None:
        return False

    op = operator.strip()
    thresh_str = threshold.strip()

    # Numeric comparisons
    if op in {">=", "<=", ">", "<"}:
        try:
            num_actual = float(actual)
            num_thresh = float(thresh_str)
            if op == ">=":
                return num_actual >= num_thresh
            elif op == "<=":
                return num_actual <= num_thresh
            elif op == ">":
                return num_actual > num_thresh
            elif op == "<":
                return num_actual < num_thresh
        except (ValueError, TypeError):
            return False

    # Equality comparisons
    elif op == "=":
        if isinstance(actual, bool):
            return str(actual).lower() == thresh_str.lower()
        return str(actual).strip().lower() == thresh_str.lower()

    elif op == "!=":
        if isinstance(actual, bool):
            return str(actual).lower() != thresh_str.lower()
        return str(actual).strip().lower() != thresh_str.lower()

    # Set membership comparisons
    elif op == "IN":
        allowed = [v.strip().lower() for v in thresh_str.split(",") if v.strip()]
        return str(actual).strip().lower() in allowed

    elif op == "NOT_IN":
        allowed = [v.strip().lower() for v in thresh_str.split(",") if v.strip()]
        return str(actual).strip().lower() not in allowed

    return False


def evaluate_eligibility(
    family: Family,
    members: list[FamilyMember],
    rules: list[EligibilityRule],
) -> dict[str, EligibilityResult]:
    """
    Evaluates a family + its members against a set of scheme eligibility rules.
    Why rule-based, not ML: eligibility determinations affect real entitlements;
    a deterministic, auditable engine is required so any citizen/officer can be
    shown exactly which rule passed or failed. See ADR-002.

    Args:
        family: Family model instance with demographic and socioeconomic attributes.
        members: List of FamilyMember instances belonging to the family.
        rules: Flat list of EligibilityRule instances across one or more schemes.

    Returns:
        dict[str, EligibilityResult]: Mapping of scheme_id to its structured evaluation result.
    """
    # Group rules by scheme_id
    schemes_rules: dict[str, list[EligibilityRule]] = {}
    for r in rules:
        schemes_rules.setdefault(r.scheme_id, []).append(r)

    family_level_attributes = {"income", "category", "housing_status", "district", "family_size"}
    member_level_attributes = {"age", "gender", "education_level", "student_status", "disability_status"}

    results: dict[str, EligibilityResult] = {}

    for scheme_id, scheme_rules in schemes_rules.items():
        matched_rules: list[RuleEvaluationDetail] = []
        failed_rules: list[RuleEvaluationDetail] = []
        missing_fields: list[str] = []

        # Partition rules into family-level vs member-level criteria
        fam_rules = [r for r in scheme_rules if r.attribute in family_level_attributes]
        mem_rules = [r for r in scheme_rules if r.attribute in member_level_attributes]

        # 1. Evaluate Family-Level Rules
        fam_rules_pass = True
        for r in fam_rules:
            val = None
            if r.attribute == "income":
                val = family.annual_income
            elif r.attribute == "category":
                val = family.social_category
            elif r.attribute == "housing_status":
                val = family.housing_status
            elif r.attribute == "district":
                val = family.district
            elif r.attribute == "family_size":
                val = family.family_size

            if val is None:
                missing_fields.append(f"family.{r.attribute}")
                passed = False
            else:
                passed = compare_value(val, r.operator, r.value)

            detail = RuleEvaluationDetail(
                rule_id=r.rule_id,
                attribute=r.attribute,
                operator=r.operator,
                threshold=r.value,
                actual_value=val,
                passed=passed,
                description=f"Family {r.attribute} ({val}) {r.operator} {r.value}",
            )

            if passed:
                matched_rules.append(detail)
            else:
                failed_rules.append(detail)
                fam_rules_pass = False

        # 2. Evaluate Member-Level Rules
        # If there are member-level rules, at least one member must satisfy ALL member rules for this scheme
        if mem_rules:
            qualifying_member_found = False
            # Check members
            for m in members:
                m_age = calculate_age(m.dob)
                member_passes_all = True
                for r in mem_rules:
                    val = None
                    if r.attribute == "age":
                        val = m_age
                    elif r.attribute == "gender":
                        val = m.gender
                    elif r.attribute == "education_level":
                        val = m.education_level
                    elif r.attribute == "student_status":
                        val = m.student_status
                    elif r.attribute == "disability_status":
                        val = m.disability_status

                    if val is None:
                        member_passes_all = False
                        break
                    if not compare_value(val, r.operator, r.value):
                        member_passes_all = False
                        break

                if member_passes_all:
                    qualifying_member_found = True
                    break

            # Document member rule outcomes in the result detail
            for r in mem_rules:
                # Find sample actual value across members
                sample_vals = []
                for m in members:
                    if r.attribute == "age":
                        sample_vals.append(f"{m.name}: {calculate_age(m.dob)}")
                    elif r.attribute == "gender":
                        sample_vals.append(f"{m.name}: {m.gender}")
                    elif r.attribute == "student_status":
                        sample_vals.append(f"{m.name}: {m.student_status}")
                    elif r.attribute == "disability_status":
                        sample_vals.append(f"{m.name}: {m.disability_status}")
                    elif r.attribute == "education_level":
                        sample_vals.append(f"{m.name}: {m.education_level}")

                passed = qualifying_member_found
                detail = RuleEvaluationDetail(
                    rule_id=r.rule_id,
                    attribute=r.attribute,
                    operator=r.operator,
                    threshold=r.value,
                    actual_value=", ".join(sample_vals[:3]),
                    passed=passed,
                    description=f"Member {r.attribute} {r.operator} {r.value}",
                )
                if passed:
                    matched_rules.append(detail)
                else:
                    failed_rules.append(detail)

            is_eligible = fam_rules_pass and qualifying_member_found
        else:
            is_eligible = fam_rules_pass

        results[scheme_id] = EligibilityResult(
            scheme_id=scheme_id,
            is_eligible=is_eligible,
            matched_rules=matched_rules,
            failed_rules=failed_rules,
            missing_data_fields=missing_fields,
        )

    return results
