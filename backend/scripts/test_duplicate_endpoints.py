import httpx

BASE_URL = "http://localhost:8000"

def test_duplicate_endpoints():
    client = httpx.Client(base_url=BASE_URL, timeout=15.0)
    print("=" * 60)
    print("TESTING PHASE 4 ENTITY RESOLUTION ENDPOINTS")
    print("=" * 60)

    # 1. GET /api/duplicates
    r = client.get("/api/duplicates?min_score=0.65&limit=10")
    assert r.status_code == 200, f"List duplicates failed: {r.status_code} {r.text}"
    data = r.json()
    assert "items" in data and len(data["items"]) > 0
    assert "metrics" in data
    print(f"1. GET /api/duplicates -> 200 OK (Found {data['total_candidates']} candidates, {data['metrics']['reduction_percentage']}% search space reduction via blocking)")

    sample_candidate = data["items"][0]
    rec1_id = sample_candidate["record_1"]["record_id"]
    rec2_id = sample_candidate["record_2"]["record_id"]
    score = sample_candidate["match_result"]["match_score"]
    reasons = sample_candidate["match_result"]["reasons"]

    print(f"   Sample Candidate: {rec1_id} <-> {rec2_id}")
    print(f"   Confidence Score: {score}")
    print(f"   Human-Readable Reasons: {reasons}")
    assert len(reasons) > 0, "Human readable reasons must not be empty!"

    # 2. GET /api/duplicates/{r1}/{r2}
    r = client.get(f"/api/duplicates/{rec1_id}/{rec2_id}")
    assert r.status_code == 200, f"Detail failed: {r.status_code}"
    detail = r.json()
    assert len(detail["match_result"]["matched_signals"]) == 5
    print(f"2. GET /api/duplicates/{rec1_id}/{rec2_id} -> 200 OK (5 granular signals verified)")

    # 3. PATCH /api/duplicates/{r1}/{r2}/resolve
    resolve_payload = {
        "status": "CONFIRMED_DUPLICATE",
        "reviewed_by": "District Admin Patel",
        "notes": "Verified against ration card records."
    }
    r = client.patch(f"/api/duplicates/{rec1_id}/{rec2_id}/resolve", json=resolve_payload)
    assert r.status_code == 200, f"Resolve failed: {r.status_code}"
    res_data = r.json()
    assert res_data["status"] == "CONFIRMED_DUPLICATE"
    print(f"3. PATCH /api/duplicates/{rec1_id}/{rec2_id}/resolve -> 200 OK (Review status: {res_data['status']})")

    # Confirm it reflects in GET detail
    r = client.get(f"/api/duplicates/{rec1_id}/{rec2_id}")
    assert r.json()["review_status"] == "CONFIRMED_DUPLICATE"
    print(f"   Re-queried pair -> Status persisted: {r.json()['review_status']}")

    print("\n" + "=" * 60)
    print("ALL PHASE 4 ENTITY RESOLUTION ENDPOINTS VERIFIED!")
    print("=" * 60)

if __name__ == "__main__":
    test_duplicate_endpoints()
