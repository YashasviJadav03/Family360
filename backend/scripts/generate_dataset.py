import os
import sys
import random
from datetime import date, datetime, timedelta
import numpy as np
import pandas as pd
from faker import Faker

# Add backend root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.session import SessionLocal, engine
from app.models.family import Family
from app.models.family_member import FamilyMember
from app.models.identity_record import IdentityRecord
from app.models.scheme import Scheme
from app.models.eligibility_rule import EligibilityRule
from app.models.benefit import Benefit
from app.models.application import Application
from app.models.officer import Officer
from app.services.eligibility_engine import evaluate_eligibility

fake = Faker("en_IN")
random.seed(42)
np.random.seed(42)

DISTRICTS_DATA = {
    "Ahmedabad": ["Daskroi", "Sanand", "Dholka"],
    "Surat": ["Chorasi", "Olpad", "Bardoli"],
    "Rajkot": ["Rajkot Rural", "Gondal", "Kotda Sangani"],
    "Vadodara": ["Vadodara Rural", "Padra", "Dabhoi"],
    "Bhavnagar": ["Bhavnagar Rural", "Sihor", "Palitana"],
    "Jamnagar": ["Jamnagar Rural", "Dhrol", "Lalpur"],
    "Junagadh": ["Junagadh Rural", "Keshod", "Visavadar"],
    "Gandhinagar": ["Gandhinagar", "Kalol", "Dehgam"],
    "Anand": ["Anand", "Petlad", "Khambhat"],
    "Mehsana": ["Mehsana", "Kadi", "Visnagar"],
}

GUJARATI_FIRST_NAMES_MALE = [
    "Rajesh", "Pravin", "Haresh", "Kishore", "Dinesh", "Sanjay", "Ramesh", "Mukesh",
    "Ashok", "Bharat", "Mahesh", "Dipak", "Kiran", "Nilesh", "Girish", "Hitesh",
    "Chetan", "Vijay", "Jignesh", "Anil", "Bhavin", "Hardik", "Paresh", "Vipul"
]

GUJARATI_FIRST_NAMES_FEMALE = [
    "Geeta", "Bhavna", "Kailash", "Rekha", "Sharda", "Kokila", "Hansa", "Meena",
    "Daksha", "Chetna", "Jagruti", "Nayana", "Varsha", "Jyoti", "Lata", "Usha",
    "Alka", "Suman", "Vandana", "Ila", "Kajal", "Pooja", "Drashti", "Neeta"
]

GUJARATI_SURNAMES = [
    "Patel", "Shah", "Desai", "Vaghela", "Parmar", "Chauhan", "Solanki", "Gohil",
    "Makwana", "Thakor", "Zala", "Prajapati", "Panchal", "Mistry", "Dave", "Joshi",
    "Pandya", "Trivedi", "Rathod", "Mehta", "Bhatt", "Chavda", "Barot", "Dabhi"
]

SOCIAL_CATEGORIES = ["General", "OBC", "SC", "ST", "SEBC"]
SOCIAL_WEIGHTS = [0.30, 0.35, 0.15, 0.12, 0.08]

SOURCE_SYSTEMS = ["ration", "scholarship", "housing", "health", "education"]


def generate_name(gender: str) -> str:
    first = random.choice(GUJARATI_FIRST_NAMES_MALE if gender == "Male" else GUJARATI_FIRST_NAMES_FEMALE)
    middle = random.choice(GUJARATI_FIRST_NAMES_MALE)
    surname = random.choice(GUJARATI_SURNAMES)
    return f"{first} {middle} {surname}"


def mutate_name(name: str) -> str:
    parts = name.split()
    if len(parts) >= 3:
        variant = random.choice([1, 2, 3])
        if variant == 1:
            # "Rajesh Kumar Patel" -> "Rajesh K Patel"
            return f"{parts[0]} {parts[1][0]} {parts[2]}"
        elif variant == 2:
            # "Rajesh Kumar Patel" -> "R.K. Patel"
            return f"{parts[0][0]}.{parts[1][0]}. {parts[2]}"
        else:
            # "Rajesh Kumar Patel" -> "Rajeshbhai Patel"
            return f"{parts[0]}bhai {parts[2]}"
    elif len(parts) == 2:
        return f"{parts[0]} {random.choice(['Kumar', 'Bhai', 'Ben'])} {parts[1]}"
    return name


def mutate_village(village: str) -> str:
    if len(village) > 4:
        idx = random.randint(1, len(village) - 2)
        return village[:idx] + village[idx + 1:]
    return village + " Pur"


def main():
    db = SessionLocal()
    print("Starting synthetic dataset generation for Family360...")

    # Clear existing data in reverse dependency order
    print("Clearing old records...")
    db.query(Application).delete()
    db.query(Benefit).delete()
    db.query(IdentityRecord).delete()
    db.query(FamilyMember).delete()
    db.query(Family).delete()
    db.query(EligibilityRule).delete()
    db.query(Scheme).delete()
    db.query(Officer).delete()
    db.commit()

    # 1. Load Schemes Master & Eligibility Rules
    print("Loading schemes and eligibility rules from CSVs...")
    schemes_df = pd.read_csv("data/raw/schemes_master.csv")
    rules_df = pd.read_csv("data/raw/eligibility_rules.csv")

    scheme_objects = []
    for _, row in schemes_df.iterrows():
        scheme_objects.append(Scheme(
            scheme_id=row["scheme_id"],
            scheme_name=row["scheme_name"],
            department=row["department"],
            category=row["category"],
            description=row["description"],
            benefit=row["benefit"],
            application_url=row["application_url"],
            source_url=row["source_url"]
        ))
    db.bulk_save_objects(scheme_objects)
    db.commit()

    rule_objects = []
    for _, row in rules_df.iterrows():
        rule_objects.append(EligibilityRule(
            rule_id=row["rule_id"],
            scheme_id=row["scheme_id"],
            attribute=row["attribute"],
            operator=row["operator"],
            value=str(row["value"])
        ))
    db.bulk_save_objects(rule_objects)
    db.commit()
    print(f"Loaded {len(scheme_objects)} schemes and {len(rule_objects)} rules.")

    # 2. Generate Officers (15 officers across districts)
    print("Generating 15 administrative officers...")
    officers = []
    districts_list = list(DISTRICTS_DATA.keys())
    officer_roles = ["Taluka Officer", "District Officer", "State Admin"]
    for i in range(1, 16):
        dist = districts_list[(i - 1) % len(districts_list)]
        officers.append(Officer(
            officer_id=f"OFF{i:03d}",
            name=f"{random.choice(GUJARATI_FIRST_NAMES_MALE)} {random.choice(GUJARATI_SURNAMES)}",
            district=dist,
            role=officer_roles[i % len(officer_roles)]
        ))
    db.bulk_save_objects(officers)
    db.commit()

    # 3. Generate 3000 Families & Members
    N_FAMILIES = 3000
    print(f"Generating {N_FAMILIES} families and demographic members...")

    # Log-normal annual income with median ~180,000
    incomes = np.random.lognormal(mean=12.05, sigma=0.42, size=N_FAMILIES).astype(int)
    # Clip between ₹35,000 and ₹750,000
    incomes = np.clip(incomes, 35000, 750000)

    # Pre-fetch rules for eligibility evaluator
    all_rules = db.query(EligibilityRule).all()

    families_batch = []
    members_batch = []
    identity_records_batch = []
    benefits_batch = []
    applications_batch = []

    total_members_count = 0
    total_identity_records_count = 0
    total_benefits_count = 0
    total_applications_count = 0
    duplicate_clusters_count = 0
    families_with_gaps_count = 0

    # For ground truth duplicate pairs tracking
    known_member_records = {}  # member_id -> list of record_ids

    member_id_counter = 1
    record_id_counter = 1
    benefit_id_counter = 1
    app_id_counter = 1

    ref_date = date(2026, 9, 20)

    for f_idx in range(1, N_FAMILIES + 1):
        family_id = f"GJ-F{f_idx:06d}"
        district = random.choice(districts_list)
        taluka = random.choice(DISTRICTS_DATA[district])
        village = f"{taluka} {random.choice(['Moti', 'Nani', 'Gam', 'Kotda', 'Vadiya'])}"
        social_category = random.choices(SOCIAL_CATEGORIES, weights=SOCIAL_WEIGHTS)[0]
        housing_status = random.choices(["Owned", "Rented", "None"], weights=[0.65, 0.30, 0.05])[0]
        land_acres = round(float(np.random.exponential(scale=1.5)), 2) if random.random() < 0.4 else None
        annual_income = int(incomes[f_idx - 1])

        # Family size weighted 4-5
        family_size = random.choices([2, 3, 4, 5, 6, 7], weights=[0.10, 0.20, 0.35, 0.25, 0.07, 0.03])[0]
        has_ration = random.random() < 0.92
        ration_card_id = f"RC-GJ{random.randint(10000000, 99999999)}" if has_ration else None

        family = Family(
            family_id=family_id,
            ration_card_id=ration_card_id,
            district=district,
            taluka=taluka,
            village=village,
            annual_income=annual_income,
            social_category=social_category,
            housing_status=housing_status,
            land_holding_acres=land_acres,
            family_size=family_size,
            created_at=datetime.utcnow() - timedelta(days=random.randint(30, 600)),
            updated_at=datetime.utcnow()
        )
        families_batch.append(family)

        # Generate members
        family_members = []

        # 1. Head of Family (age 35-72)
        head_age = random.randint(35, 72)
        head_gender = random.choices(["Male", "Female"], weights=[0.75, 0.25])[0]
        head_dob = ref_date - timedelta(days=head_age * 365 + random.randint(0, 360))
        head_edu = random.choices(
            ["None", "Primary", "Secondary", "HigherSecondary", "Graduate"],
            weights=[0.20, 0.30, 0.30, 0.12, 0.08]
        )[0]
        head_disability = random.random() < 0.04

        head_member = FamilyMember(
            member_id=f"GJ-M{member_id_counter:06d}",
            family_id=family_id,
            name=generate_name(head_gender),
            dob=head_dob,
            gender=head_gender,
            relation_to_head="Head",
            education_level=head_edu,
            student_status=False,
            occupation=random.choice(["Agriculture", "Laborer", "Self-Employed", "Service", "Retired"]),
            disability_status=head_disability
        )
        member_id_counter += 1
        family_members.append(head_member)

        # 2. Spouse (if family_size >= 2)
        if family_size >= 2:
            spouse_gender = "Female" if head_gender == "Male" else "Male"
            spouse_age = max(18, head_age + random.randint(-6, 4))
            spouse_dob = ref_date - timedelta(days=spouse_age * 365 + random.randint(0, 360))
            spouse_member = FamilyMember(
                member_id=f"GJ-M{member_id_counter:06d}",
                family_id=family_id,
                name=generate_name(spouse_gender),
                dob=spouse_dob,
                gender=spouse_gender,
                relation_to_head="Spouse",
                education_level=random.choices(
                    ["None", "Primary", "Secondary", "HigherSecondary", "Graduate"],
                    weights=[0.25, 0.35, 0.25, 0.10, 0.05]
                )[0],
                student_status=False,
                occupation="Homemaker" if spouse_gender == "Female" else "Laborer",
                disability_status=random.random() < 0.03
            )
            member_id_counter += 1
            family_members.append(spouse_member)

        # 3. Children / Parents for remaining members
        for m_idx in range(len(family_members), family_size):
            # Decide if child or elderly parent
            if random.random() < 0.85 and head_age >= 25:
                # Child (Son/Daughter)
                child_gender = random.choice(["Male", "Female"])
                child_age = max(1, min(head_age - 18, random.randint(3, 24)))
                child_dob = ref_date - timedelta(days=child_age * 365 + random.randint(0, 360))
                is_student = 5 <= child_age <= 22

                edu = "None"
                if child_age >= 18:
                    edu = random.choice(["HigherSecondary", "Graduate"])
                elif child_age >= 14:
                    edu = "Secondary"
                elif child_age >= 6:
                    edu = "Primary"

                child_member = FamilyMember(
                    member_id=f"GJ-M{member_id_counter:06d}",
                    family_id=family_id,
                    name=generate_name(child_gender),
                    dob=child_dob,
                    gender=child_gender,
                    relation_to_head="Son" if child_gender == "Male" else "Daughter",
                    education_level=edu,
                    student_status=is_student,
                    occupation="Student" if is_student else "Employed",
                    disability_status=random.random() < 0.03
                )
                member_id_counter += 1
                family_members.append(child_member)
            else:
                # Elderly Parent (age >= 60)
                parent_gender = random.choice(["Male", "Female"])
                parent_age = max(60, head_age + random.randint(18, 30))
                parent_dob = ref_date - timedelta(days=parent_age * 365 + random.randint(0, 360))
                parent_member = FamilyMember(
                    member_id=f"GJ-M{member_id_counter:06d}",
                    family_id=family_id,
                    name=generate_name(parent_gender),
                    dob=parent_dob,
                    gender=parent_gender,
                    relation_to_head="Parent",
                    education_level=random.choice(["None", "Primary"]),
                    student_status=False,
                    occupation="Retired",
                    disability_status=random.random() < 0.08
                )
                member_id_counter += 1
                family_members.append(parent_member)

        members_batch.extend(family_members)
        total_members_count += len(family_members)

        # 4. Generate Identity Records per member (1 to 3 records, with deliberate noise)
        for m in family_members:
            # 20% of members have 2+ identity records
            n_records = random.choices([1, 2, 3], weights=[0.80, 0.16, 0.04])[0]
            if n_records > 1:
                duplicate_clusters_count += 1

            m_records = []
            chosen_sources = random.sample(SOURCE_SYSTEMS, n_records)

            for r_idx in range(n_records):
                record_id = f"REC{record_id_counter:07d}"
                record_id_counter += 1
                source_sys = chosen_sources[r_idx]

                # Noise distribution:
                # 70% exact
                # 20% minor name variation
                # 10% DOB off by 1 year OR village typo
                noise_type = random.choices(["exact", "name_var", "dob_or_village"], weights=[0.70, 0.20, 0.10])[0]

                rec_name = m.name
                rec_dob = m.dob
                rec_village = village

                if noise_type == "name_var":
                    rec_name = mutate_name(m.name)
                elif noise_type == "dob_or_village":
                    if random.random() < 0.5:
                        delta_yr = random.choice([-1, 1])
                        try:
                            rec_dob = m.dob.replace(year=m.dob.year + delta_yr)
                        except ValueError:
                            rec_dob = m.dob.replace(year=m.dob.year + delta_yr, day=28)
                    else:
                        rec_village = mutate_village(village)

                id_rec = IdentityRecord(
                    record_id=record_id,
                    member_id=m.member_id if random.random() < 0.90 else None,  # some unlinked for realistic resolution
                    source_system=source_sys,
                    source_member_id=f"{source_sys.upper()[:3]}-{random.randint(100000, 999999)}",
                    name_as_recorded=rec_name,
                    dob=rec_dob,
                    gender=m.gender,
                    district=district,
                    village=rec_village,
                    ration_card_id=ration_card_id if random.random() < 0.85 else None
                )
                identity_records_batch.append(id_rec)
                total_identity_records_count += 1
                m_records.append(record_id)

            known_member_records[m.member_id] = m_records

        # 5. Evaluate Eligibility for this Family using real eligibility engine
        eligibility_eval = evaluate_eligibility(family, family_members, all_rules)
        eligible_schemes = [s_id for s_id, res in eligibility_eval.items() if res.is_eligible]

        if not eligible_schemes:
            # For demo guarantees, ensure every family qualifies for at least 1 or 2 schemes
            # e.g., Manav Garima (SCH010) or Vahli Dikri / Ambedkar / Deendayal
            eligible_schemes = ["SCH010", "SCH008"]

        # Guarantee demo variety: at least one RECEIVING and at least one NOT_APPLIED when >=2 schemes eligible
        n_eligible = len(eligible_schemes)
        if n_eligible == 1:
            # 50/50 chance
            statuses = [random.choice(["RECEIVING", "NOT_APPLIED"])]
        else:
            # Ensure at least 1 RECEIVING and at least 1 NOT_APPLIED
            statuses = ["RECEIVING", "NOT_APPLIED"]
            for _ in range(n_eligible - 2):
                statuses.append(random.choices(["RECEIVING", "NOT_APPLIED"], weights=[0.40, 0.60])[0] )
            random.shuffle(statuses)

        family_has_gap = False
        for s_idx, s_id in enumerate(eligible_schemes):
            status = statuses[s_idx]
            if status == "NOT_APPLIED":
                family_has_gap = True

            app_date = ref_date - timedelta(days=random.randint(60, 400)) if status == "RECEIVING" else None
            appr_date = app_date + timedelta(days=random.randint(15, 45)) if app_date else None
            amount = random.choice([1000, 1250, 3500, 120000, 25000]) if status == "RECEIVING" else None

            benefit = Benefit(
                benefit_id=f"BEN{benefit_id_counter:07d}",
                family_id=family_id,
                member_id=family_members[0].member_id,
                scheme_id=s_id,
                status=status,
                application_date=app_date,
                approval_date=appr_date,
                amount=amount
            )
            benefit_id_counter += 1
            benefits_batch.append(benefit)
            total_benefits_count += 1

            # For ~15% of NOT_APPLIED gaps, create an application mid-process
            if status == "NOT_APPLIED" and random.random() < 0.15:
                app_status = random.choice(["SUBMITTED", "DOCS_VERIFIED", "UNDER_VERIFICATION"])
                app = Application(
                    application_id=f"APP{app_id_counter:07d}",
                    family_id=family_id,
                    member_id=family_members[0].member_id,
                    scheme_id=s_id,
                    status=app_status,
                    submitted_at=datetime.utcnow() - timedelta(days=random.randint(2, 30)),
                    assigned_officer=random.choice(officers).name
                )
                app_id_counter += 1
                applications_batch.append(app)
                total_applications_count += 1

        if family_has_gap:
            families_with_gaps_count += 1

        # Periodic batch commit every 500 families
        if f_idx % 500 == 0:
            print(f"Committing batch at family {f_idx}/{N_FAMILIES}...")
            db.bulk_save_objects(families_batch)
            db.bulk_save_objects(members_batch)
            db.bulk_save_objects(identity_records_batch)
            db.bulk_save_objects(benefits_batch)
            db.bulk_save_objects(applications_batch)
            db.commit()

            families_batch.clear()
            members_batch.clear()
            identity_records_batch.clear()
            benefits_batch.clear()
            applications_batch.clear()

    # Final commit if any remaining
    if families_batch:
        db.bulk_save_objects(families_batch)
        db.bulk_save_objects(members_batch)
        db.bulk_save_objects(identity_records_batch)
        db.bulk_save_objects(benefits_batch)
        db.bulk_save_objects(applications_batch)
        db.commit()

    db.close()

    # Save known member record clusters to scratch for ground truth duplicate pairs generation
    import json
    os.makedirs("data/generated", exist_ok=True)
    with open("data/generated/member_records_map.json", "w") as f:
        json.dump(known_member_records, f)

    print("\n" + "=" * 60)
    print("DATASET GENERATION SUMMARY")
    print("=" * 60)
    print(f"Generated: {N_FAMILIES} families, {total_members_count} members, {total_identity_records_count} identity records, {total_benefits_count} benefits, {total_applications_count} applications")
    print(f"Duplicate identity clusters injected: {duplicate_clusters_count} members have 2+ identity_records (~{duplicate_clusters_count / total_members_count * 100:.1f}%)")
    print(f"Benefit gaps created: {families_with_gaps_count} families have at least 1 unclaimed eligible scheme (~{families_with_gaps_count / N_FAMILIES * 100:.1f}%)")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
