import sys
import io
import os

sys.path.insert(0, os.path.abspath("."))
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from app.db.session import SessionLocal
from app.models.family import Family
from app.models.scheme import Scheme
from app.models.eligibility_rule import EligibilityRule
from app.services.eligibility_engine import evaluate_eligibility
from app.services.explanation_service import generate_gap_explanation
from app.services.assistant_service import process_officer_query

db = SessionLocal()

print("--- Testing Explanation Service ---")
fam = db.query(Family).first()
scheme = db.query(Scheme).filter(Scheme.scheme_id == "SCH003").first()
rules = db.query(EligibilityRule).filter(EligibilityRule.scheme_id == scheme.scheme_id).all()
eval_res = evaluate_eligibility(fam, fam.members, rules)[scheme.scheme_id]
expl = generate_gap_explanation(fam, scheme, eval_res)
print(f"Family ID: {fam.family_id}")
print(f"Scheme: {scheme.scheme_name}")
print(f"Is Eligible: {eval_res.is_eligible}")
print(f"Matched rules count: {len(eval_res.matched_rules)}")
print(f"Failed rules count: {len(eval_res.failed_rules)}")
print(f"Explanation: {expl}")

print("\n--- Testing Exact Demo Questions ---")

q1 = "Which families in Ahmedabad have the most benefit gaps?"
r1 = process_officer_query(q1, db)
print(f"\n[Q1]: {q1}")
print(f"Intent: {r1['intent']}")
print(f"Answer: {r1['answer']}")
assert len(r1['answer']) > 20, "Answer too short"

q2 = "Why is this family potentially eligible for housing assistance?"
r2 = process_officer_query(q2, db)
print(f"\n[Q2]: {q2}")
print(f"Intent: {r2['intent']}")
print(f"Answer: {r2['answer']}")
assert len(r2['answer']) > 20, "Answer too short"

q3 = "How many possible duplicate records are unresolved?"
r3 = process_officer_query(q3, db)
print(f"\n[Q3]: {q3}")
print(f"Intent: {r3['intent']}")
print(f"Answer: {r3['answer']}")
assert len(r3['answer']) > 20, "Answer too short"

print("\nALL PHASE 6 VERIFICATION CHECKS PASSED!")
