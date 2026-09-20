import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.session import SessionLocal
import app.db.base
from app.models.family import Family
from app.models.family_member import FamilyMember
from app.models.identity_record import IdentityRecord
from app.models.benefit import Benefit


def main():
    db = SessionLocal()
    print("=" * 60)
    print("PHASE 2 ACCEPTANCE CRITERIA VERIFICATION")
    print("=" * 60)

    # 1. Spot-check 5 members with 2+ identity records
    print("\n--- Spot-checking 5 members with multiple identity records ---")
    mult_members = (
        db.query(FamilyMember)
        .join(IdentityRecord)
        .group_by(FamilyMember.member_id)
        .having(db.query(IdentityRecord).filter(IdentityRecord.member_id == FamilyMember.member_id).count() >= 2)
        .limit(5)
        .all()
    )

    # Alternate simple query
    records_by_member = {}
    for r in db.query(IdentityRecord).filter(IdentityRecord.member_id.isnot(None)).all():
        records_by_member.setdefault(r.member_id, []).append(r)

    count = 0
    for m_id, r_list in records_by_member.items():
        if len(r_list) >= 2:
            m = db.query(FamilyMember).filter(FamilyMember.member_id == m_id).first()
            print(f"Member: {m.member_id} | Canonical: '{m.name}' | DOB: {m.dob} | Village: {m.family.village}")
            for r in r_list:
                print(f"   -> [{r.source_system}] Recorded: '{r.name_as_recorded}' | DOB: {r.dob} | Village: '{r.village}'")
            print()
            count += 1
            if count >= 5:
                break

    # 2. Check benefit distribution
    total_families = db.query(Family).count()
    f_receiving = set(r[0] for r in db.query(Benefit.family_id).filter(Benefit.status == "RECEIVING").distinct())
    f_gap = set(r[0] for r in db.query(Benefit.family_id).filter(Benefit.status == "NOT_APPLIED").distinct())

    print(f"Total Families: {total_families}")
    print(f"Families with RECEIVING benefits: {len(f_receiving)} ({len(f_receiving)/total_families*100:.1f}%)")
    print(f"Families with NOT_APPLIED gaps: {len(f_gap)} ({len(f_gap)/total_families*100:.1f}%)")

    assert total_families == 3000, f"Expected 3000 families, found {total_families}"
    assert len(f_receiving) > 2500, "Expected >2500 families with receiving benefits"
    assert len(f_gap) > 2500, "Expected >2500 families with benefit gaps"

    print("\nALL PHASE 2 ACCEPTANCE CRITERIA ARE MET!")
    db.close()


if __name__ == "__main__":
    main()
