import os
import sys
import json
import pandas as pd
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix

# Add backend root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.session import SessionLocal
import app.db.base
from app.models.identity_record import IdentityRecord
from app.ml.entity_resolution import compute_match_score


def main():
    print("=" * 60)
    print("EVALUATING ENTITY RESOLUTION / RECORD MATCHING ALGORITHM")
    print("=" * 60)

    csv_path = "data/generated/ground_truth_duplicate_pairs.csv"
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found. Run ground_truth_duplicates.py first.")
        sys.exit(1)

    df = pd.read_csv(csv_path)
    print(f"Loaded {len(df)} ground-truth labeled pairs ({df['same_person'].sum()} positives, {(df['same_person'] == 0).sum()} negatives).")

    db = SessionLocal()
    records = {r.record_id: r for r in db.query(IdentityRecord).all()}
    db.close()
    print(f"Cached {len(records)} identity records from database.")

    y_true = []
    y_pred = []
    scores = []

    threshold = 0.65

    for idx, row in df.iterrows():
        r1_id = row["record_id_1"]
        r2_id = row["record_id_2"]
        label = int(row["same_person"])

        rec_a = records.get(r1_id)
        rec_b = records.get(r2_id)

        if not rec_a or not rec_b:
            continue

        res = compute_match_score(rec_a, rec_b)
        score = res.match_score
        pred = 1 if score >= threshold else 0

        y_true.append(label)
        y_pred.append(pred)
        scores.append(score)

    precision = float(precision_score(y_true, y_pred, zero_division=0))
    recall = float(recall_score(y_true, y_pred, zero_division=0))
    f1 = float(f1_score(y_true, y_pred, zero_division=0))

    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
    fpr = float(fp / (fp + tn)) if (fp + tn) > 0 else 0.0

    results = {
        "evaluation_dataset": "ground_truth_duplicate_pairs.csv (synthetic validation set)",
        "decision_threshold": threshold,
        "total_pairs_evaluated": len(y_true),
        "true_positives": int(tp),
        "true_negatives": int(tn),
        "false_positives": int(fp),
        "false_negatives": int(fn),
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1_score": round(f1, 4),
        "false_positive_rate": round(fpr, 4),
        "precision_percentage": f"{precision * 100:.2f}%",
        "recall_percentage": f"{recall * 100:.2f}%",
        "f1_percentage": f"{f1 * 100:.2f}%",
        "fpr_percentage": f"{fpr * 100:.2f}%",
    }

    print("\n" + "=" * 60)
    print("EVALUATION RESULTS AT THRESHOLD >= 0.65")
    print("=" * 60)
    print(f"Precision: {results['precision_percentage']} (Target: >= 80%)")
    print(f"Recall:    {results['recall_percentage']}")
    print(f"F1 Score:  {results['f1_percentage']}")
    print(f"False Positive Rate (FPR): {results['fpr_percentage']}")
    print(f"Confusion Matrix: TP={tp}, FP={fp}, TN={tn}, FN={fn}")
    print("=" * 60 + "\n")

    out_json = "data/generated/matching_eval_results.json"
    with open(out_json, "w") as f:
        json.dump(results, f, indent=2)

    print(f"Saved evaluation metrics to {out_json}.")


if __name__ == "__main__":
    main()
