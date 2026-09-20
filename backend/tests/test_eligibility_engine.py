from datetime import date
import pytest
import app.db.base
from app.models.family import Family
from app.models.family_member import FamilyMember
from app.models.eligibility_rule import EligibilityRule
from app.services.eligibility_engine import evaluate_eligibility, compare_value, calculate_age


def make_test_family(income=150000, category="SC", housing="Rented", district="Ahmedabad", family_size=4):
    return Family(
        family_id="GJ-F999001",
        ration_card_id="RC-TEST999",
        district=district,
        taluka="Daskroi",
        village="Sanand Moti",
        annual_income=income,
        social_category=category,
        housing_status=housing,
        land_holding_acres=0.5,
        family_size=family_size,
    )


def make_test_member(age=65, gender="Male", relation="Head", student=False, edu="Graduate", disability=False):
    # Reference date is 2026-09-20
    dob = date(2026 - age, 9, 15)
    return FamilyMember(
        member_id="GJ-M999001",
        family_id="GJ-F999001",
        name="Rameshbhai Patel",
        dob=dob,
        gender=gender,
        relation_to_head=relation,
        education_level=edu,
        student_status=student,
        occupation="Retired",
        disability_status=disability,
    )


def test_family_meets_all_rules():
    """Test Case 1: Family and members satisfy all statutory conditions for Old Age Pension."""
    family = make_test_family(income=120000)
    member = make_test_member(age=65)

    rules = [
        EligibilityRule(rule_id="R1", scheme_id="SCH004", attribute="age", operator=">=", value="60"),
        EligibilityRule(rule_id="R2", scheme_id="SCH004", attribute="income", operator="<=", value="200000"),
    ]

    res = evaluate_eligibility(family, [member], rules)
    assert "SCH004" in res
    assert res["SCH004"].is_eligible is True
    assert len(res["SCH004"].matched_rules) == 2
    assert len(res["SCH004"].failed_rules) == 0


def test_family_fails_one_rule():
    """Test Case 2: Family satisfies age requirement but exceeds the income ceiling."""
    family = make_test_family(income=250000)  # Exceeds 200,000
    member = make_test_member(age=65)

    rules = [
        EligibilityRule(rule_id="R1", scheme_id="SCH004", attribute="age", operator=">=", value="60"),
        EligibilityRule(rule_id="R2", scheme_id="SCH004", attribute="income", operator="<=", value="200000"),
    ]

    res = evaluate_eligibility(family, [member], rules)
    assert "SCH004" in res
    assert res["SCH004"].is_eligible is False
    assert len(res["SCH004"].matched_rules) == 1
    assert len(res["SCH004"].failed_rules) == 1
    assert res["SCH004"].failed_rules[0].attribute == "income"


def test_family_missing_required_data():
    """Test Case 3: Family record missing required data field (e.g. None income)."""
    family = make_test_family(income=None)
    member = make_test_member(age=65)

    rules = [
        EligibilityRule(rule_id="R1", scheme_id="SCH004", attribute="income", operator="<=", value="200000"),
    ]

    res = evaluate_eligibility(family, [member], rules)
    assert res["SCH004"].is_eligible is False
    assert "family.income" in res["SCH004"].missing_data_fields


def test_in_operator_and_not_in_operator():
    """Test Case 4: Testing IN and NOT_IN multi-value category matching."""
    family_sc = make_test_family(category="SC")
    family_gen = make_test_family(category="General")
    member = make_test_member()

    rules = [
        EligibilityRule(rule_id="R1", scheme_id="SCH007", attribute="category", operator="IN", value="SC,ST"),
    ]

    res_sc = evaluate_eligibility(family_sc, [member], rules)
    assert res_sc["SCH007"].is_eligible is True

    res_gen = evaluate_eligibility(family_gen, [member], rules)
    assert res_gen["SCH007"].is_eligible is False


def test_numeric_boundary_conditions():
    """Test Case 5: Exact boundary edge cases for >=, <=, >, <."""
    assert compare_value(60, ">=", "60") is True
    assert compare_value(59, ">=", "60") is False
    assert compare_value(200000, "<=", "200000") is True
    assert compare_value(200001, "<=", "200000") is False
    assert compare_value(18, ">", "18") is False
    assert compare_value(19, ">", "18") is True
    assert compare_value(18, "<", "18") is False
    assert compare_value(17, "<", "18") is True


def test_member_education_and_student_status():
    """Test Case 6: Pre-matric scholarship with student status and primary education level."""
    family = make_test_family(income=150000, category="SC")
    student_child = make_test_member(age=10, student=True, edu="Primary")
    non_student = make_test_member(age=10, student=False, edu="Primary")

    rules = [
        EligibilityRule(rule_id="R1", scheme_id="SCH001", attribute="category", operator="IN", value="SC"),
        EligibilityRule(rule_id="R2", scheme_id="SCH001", attribute="student_status", operator="=", value="True"),
        EligibilityRule(rule_id="R3", scheme_id="SCH001", attribute="education_level", operator="IN", value="Primary,Secondary"),
    ]

    res_pass = evaluate_eligibility(family, [student_child], rules)
    assert res_pass["SCH001"].is_eligible is True

    res_fail = evaluate_eligibility(family, [non_student], rules)
    assert res_fail["SCH001"].is_eligible is False
