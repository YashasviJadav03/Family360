from datetime import date
from typing import Any
from pydantic import BaseModel
from rapidfuzz import fuzz
from app.models.identity_record import IdentityRecord


class MatchedSignal(BaseModel):
    signal_name: str
    weight: float
    raw_score: float
    weighted_contribution: float
    detail: str


class MatchResult(BaseModel):
    match_score: float  # Normalized 0.0 to 1.0
    classification: str  # "Likely Duplicate", "Possible Duplicate — needs review", "Not a match"
    matched_signals: list[MatchedSignal]
    reasons: list[str]


def compute_match_score(
    record_a: IdentityRecord,
    record_b: IdentityRecord,
) -> MatchResult:
    """
    Computes a deterministic, explainable weighted similarity score between two identity records.
    Every signal produces a quantitative score and an auditable plain-language explanation
    for administrative officer review.

    Scoring formula:
        match_score = 0.35 * name_similarity      (rapidfuzz.fuzz.token_sort_ratio / 100)
                    + 0.25 * dob_match             (1.0 if exact, 0.5 if off by <=1 year, 0 otherwise)
                    + 0.15 * address_similarity    (district + village fuzzy match)
                    + 0.15 * ration_card_match     (1.0 if ration_card_id matches exactly, 0 otherwise)
                    + 0.10 * gender_match          (1.0 if match, 0 otherwise)

    Classification thresholds:
        score >= 0.85: "Likely Duplicate"
        0.65 <= score < 0.85: "Possible Duplicate — needs review"
        score < 0.65: "Not a match"
    """
    signals: list[MatchedSignal] = []
    reasons: list[str] = []

    # 1. Name Similarity (Weight: 0.35)
    name_a = str(record_a.name_as_recorded or "").strip()
    name_b = str(record_b.name_as_recorded or "").strip()
    name_ratio = fuzz.token_sort_ratio(name_a, name_b) / 100.0
    name_contrib = round(0.35 * name_ratio, 4)
    signals.append(
        MatchedSignal(
            signal_name="name_similarity",
            weight=0.35,
            raw_score=round(name_ratio, 4),
            weighted_contribution=name_contrib,
            detail=f"{int(name_ratio * 100)}% name similarity ('{name_a}' vs '{name_b}')",
        )
    )
    if name_ratio >= 0.80:
        reasons.append(f"{int(name_ratio * 100)}% name match ('{name_a}' vs '{name_b}')")
    elif name_ratio >= 0.60:
        reasons.append(f"Moderate name match ({int(name_ratio * 100)}%)")

    # 2. Date of Birth Match (Weight: 0.25)
    dob_score = 0.0
    dob_detail = "DOB mismatch"
    if record_a.dob and record_b.dob:
        if record_a.dob == record_b.dob:
            dob_score = 1.0
            dob_detail = f"Exact DOB match ({record_a.dob})"
            reasons.append(f"Same DOB ({record_a.dob})")
        else:
            days_diff = abs((record_a.dob - record_b.dob).days)
            if days_diff <= 366:
                dob_score = 0.5
                dob_detail = f"DOB differs by <= 1 year ({record_a.dob} vs {record_b.dob})"
                reasons.append(f"DOB off by <= 1 year ({record_a.dob.year} vs {record_b.dob.year})")
            else:
                dob_detail = f"DOB discrepancy ({record_a.dob} vs {record_b.dob})"
    dob_contrib = round(0.25 * dob_score, 4)
    signals.append(
        MatchedSignal(
            signal_name="dob_match",
            weight=0.25,
            raw_score=dob_score,
            weighted_contribution=dob_contrib,
            detail=dob_detail,
        )
    )

    # 3. Address Similarity (District + Village) (Weight: 0.15)
    dist_match = 1.0 if str(record_a.district).strip().lower() == str(record_b.district).strip().lower() else 0.0
    vil_a = str(record_a.village or "").strip()
    vil_b = str(record_b.village or "").strip()
    vil_ratio = fuzz.token_sort_ratio(vil_a, vil_b) / 100.0 if (vil_a and vil_b) else 0.0
    address_score = (0.5 * dist_match) + (0.5 * vil_ratio)
    addr_contrib = round(0.15 * address_score, 4)
    signals.append(
        MatchedSignal(
            signal_name="address_similarity",
            weight=0.15,
            raw_score=round(address_score, 4),
            weighted_contribution=addr_contrib,
            detail=f"District match: {bool(dist_match)}, Village similarity: {int(vil_ratio * 100)}% ('{vil_a}' vs '{vil_b}')",
        )
    )
    if dist_match and vil_ratio >= 0.85:
        reasons.append(f"Same district ({record_a.district}) and village ('{vil_a}')")
    elif dist_match:
        reasons.append(f"Same district ({record_a.district})")

    # 4. Ration Card Match (Weight: 0.15)
    rc_score = 0.0
    rc_detail = "Ration card unavailable or mismatch"
    rc_a = record_a.ration_card_id
    rc_b = record_b.ration_card_id
    if rc_a and rc_b and rc_a.strip().upper() == rc_b.strip().upper():
        rc_score = 1.0
        rc_detail = f"Exact ration card match ({rc_a})"
        reasons.append(f"Same ration card ({rc_a})")
    elif rc_a and rc_b:
        rc_detail = f"Different ration cards ({rc_a} vs {rc_b})"
    rc_contrib = round(0.15 * rc_score, 4)
    signals.append(
        MatchedSignal(
            signal_name="ration_card_match",
            weight=0.15,
            raw_score=rc_score,
            weighted_contribution=rc_contrib,
            detail=rc_detail,
        )
    )

    # 5. Gender Match (Weight: 0.10)
    gen_score = 0.0
    gen_a = str(record_a.gender or "").strip().lower()
    gen_b = str(record_b.gender or "").strip().lower()
    if gen_a and gen_b and gen_a == gen_b:
        gen_score = 1.0
        reasons.append(f"Matching gender ({record_a.gender})")
    gen_contrib = round(0.10 * gen_score, 4)
    signals.append(
        MatchedSignal(
            signal_name="gender_match",
            weight=0.10,
            raw_score=gen_score,
            weighted_contribution=gen_contrib,
            detail=f"Gender match: {bool(gen_score)} ({record_a.gender} vs {record_b.gender})",
        )
    )

    # Composite Score
    total_score = round(name_contrib + dob_contrib + addr_contrib + rc_contrib + gen_contrib, 4)
    total_score = min(1.0, max(0.0, total_score))

    # Classification
    if total_score >= 0.85:
        classification = "Likely Duplicate"
    elif total_score >= 0.65:
        classification = "Possible Duplicate — needs review"
    else:
        classification = "Not a match"

    return MatchResult(
        match_score=total_score,
        classification=classification,
        matched_signals=signals,
        reasons=reasons,
    )
