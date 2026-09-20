import os
import sys
import json
import random
from itertools import combinations
import pandas as pd

# Add backend root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.session import SessionLocal
import app.db.base
from app.models.identity_record import IdentityRecord

random.seed(42)


def main():
    print("Exporting ground truth duplicate pairs for Phase 4 evaluation...")

    map_path = "data/generated/member_records_map.json"
    if not os.path.exists(map_path):
        print(f"Error: {map_path} not found. Run generate_dataset.py first.")
        sys.exit(1)

    with open(map_path, "r") as f:
        known_member_records = json.load(f)

    # 1. Generate Positive Pairs (same_person = 1)
    positive_pairs = []
    all_positive_records = set()
    for member_id, record_ids in known_member_records.items():
        if len(record_ids) >= 2:
            for r1, r2 in combinations(record_ids, 2):
                pair = sorted([r1, r2])
                positive_pairs.append({
                    "record_id_1": pair[0],
                    "record_id_2": pair[1],
                    "same_person": 1
                })
                all_positive_records.add(pair[0])
                all_positive_records.add(pair[1])

    print(f"Found {len(positive_pairs)} true positive duplicate pairs.")

    # 2. Generate Negative Pairs (same_person = 0)
    # Sample realistic challenging negative pairs (different members in same district)
    db = SessionLocal()
    records = db.query(IdentityRecord).all()
    records_by_district = {}
    for r in records:
        records_by_district.setdefault(r.district, []).append(r)
    db.close()

    # Invert member_records_map to record -> member
    record_to_member = {}
    for member_id, r_ids in known_member_records.items():
        for r_id in r_ids:
            record_to_member[r_id] = member_id

    negative_pairs = []
    target_negatives = len(positive_pairs) * 2  # Balanced 1:2 ratio

    district_names = list(records_by_district.keys())
    attempts = 0
    max_attempts = target_negatives * 15

    while len(negative_pairs) < target_negatives and attempts < max_attempts:
        attempts += 1
        dist = random.choice(district_names)
        dist_records = records_by_district[dist]
        if len(dist_records) < 2:
            continue

        r_a, r_b = random.sample(dist_records, 2)
        m_a = record_to_member.get(r_a.record_id)
        m_b = record_to_member.get(r_b.record_id)

        # Ensure different members (true negatives)
        if m_a and m_b and m_a == m_b:
            continue

        pair = sorted([r_a.record_id, r_b.record_id])
        negative_pairs.append({
            "record_id_1": pair[0],
            "record_id_2": pair[1],
            "same_person": 0
        })

    # Deduplicate negative pairs
    neg_df = pd.DataFrame(negative_pairs).drop_duplicates(subset=["record_id_1", "record_id_2"])
    pos_df = pd.DataFrame(positive_pairs)

    combined_df = pd.concat([pos_df, neg_df], ignore_index=True).sample(frac=1.0, random_state=42).reset_index(drop=True)
    out_csv = "data/generated/ground_truth_duplicate_pairs.csv"
    combined_df.to_csv(out_csv, index=False)

    print(f"Exported {len(combined_df)} total labeled pairs ({len(pos_df)} positive, {len(neg_df)} negative) to {out_csv}.")


if __name__ == "__main__":
    main()
