import sys
import httpx

BASE_URL = "http://localhost:8000"

def test_endpoints():
    client = httpx.Client(base_url=BASE_URL, timeout=10.0)
    print("=" * 60)
    print("TESTING ALL PHASE 3 REST API ENDPOINTS")
    print("=" * 60)

    # 1. Health check
    r = client.get("/health")
    assert r.status_code == 200, f"Health check failed: {r.status_code}"
    print("1. GET /health -> 200 OK")

    # 2. GET /api/families (paginated)
    r = client.get("/api/families?page=1&page_size=5&has_gap=true")
    assert r.status_code == 200, f"List families failed: {r.status_code}"
    data = r.json()
    assert "items" in data and len(data["items"]) == 5
    sample_f_id = data["items"][0]["family_id"]
    print(f"2. GET /api/families -> 200 OK (Total: {data['total']}, Sample: {sample_f_id})")

    # 3. GET /api/families/{id} (Family 360 profile)
    r = client.get(f"/api/families/{sample_f_id}")
    assert r.status_code == 200, f"Family detail failed: {r.status_code}"
    f_detail = r.json()
    assert "members" in f_detail and len(f_detail["members"]) >= 2
    assert "benefits" in f_detail
    print(f"3. GET /api/families/{sample_f_id} -> 200 OK ({len(f_detail['members'])} members, {len(f_detail['benefits'])} benefits)")

    # 4. GET /api/families/{id}/eligibility
    r = client.get(f"/api/families/{sample_f_id}/eligibility")
    assert r.status_code == 200, f"Eligibility failed: {r.status_code}"
    el_data = r.json()
    assert len(el_data) == 11, f"Expected 11 schemes evaluated, got {len(el_data)}"
    print(f"4. GET /api/families/{sample_f_id}/eligibility -> 200 OK (11 schemes evaluated)")

    # 5. GET /api/families/{id}/benefit-gap for 3 different families
    test_families = ["GJ-F000001", "GJ-F000002", "GJ-F000003"]
    print("5. GET /api/families/{id}/benefit-gap for 3 families:")
    for fid in test_families:
        r = client.get(f"/api/families/{fid}/benefit-gap")
        assert r.status_code == 200, f"Benefit gap for {fid} failed: {r.status_code}"
        bg = r.json()
        print(f"   -> {fid}: Eligible: {bg['eligible_count']}, Receiving: {bg['receiving_count']}, Gaps: {bg['gap_count']}")
        assert "gap_schemes" in bg
        assert "receiving_schemes" in bg

    # 6. GET /api/schemes
    r = client.get("/api/schemes")
    assert r.status_code == 200, f"List schemes failed: {r.status_code}"
    schemes = r.json()
    assert len(schemes) == 11
    print(f"6. GET /api/schemes -> 200 OK (11 schemes returned)")

    # 7. GET /api/schemes/{id}
    r = client.get("/api/schemes/SCH001")
    assert r.status_code == 200, f"Scheme detail failed: {r.status_code}"
    sch = r.json()
    assert sch["scheme_id"] == "SCH001"
    assert len(sch["rules"]) >= 2
    print(f"7. GET /api/schemes/SCH001 -> 200 OK ('{sch['scheme_name']}', {len(sch['rules'])} rules)")

    # 8. GET /api/dashboard/district-summary
    r = client.get("/api/dashboard/district-summary")
    assert r.status_code == 200, f"District summary failed: {r.status_code}"
    ds = r.json()
    assert ds["total_families"] == 3000
    assert len(ds["districts"]) == 10
    print(f"8. GET /api/dashboard/district-summary -> 200 OK ({ds['total_families']} families across {len(ds['districts'])} districts)")

    # 9. GET /api/officers
    r = client.get("/api/officers")
    assert r.status_code == 200, f"List officers failed: {r.status_code}"
    officers = r.json()
    assert len(officers) == 15
    print(f"9. GET /api/officers -> 200 OK ({len(officers)} officers returned)")

    # 10. POST /api/applications (Create application)
    app_payload = {
        "family_id": "GJ-F000001",
        "scheme_id": "SCH004"
    }
    r = client.post("/api/applications", json=app_payload)
    assert r.status_code == 201, f"Create application failed: {r.status_code} {r.text}"
    app_res = r.json()
    created_app_id = app_res["application_id"]
    assert app_res["status"] == "SUBMITTED"
    print(f"10a. POST /api/applications -> 201 Created (ID: {created_app_id}, Status: {app_res['status']})")

    # 11. PATCH /api/applications/{id} (Update status)
    update_payload = {
        "status": "APPROVED",
        "assigned_officer": "Dinesh Joshi (District Officer)"
    }
    r = client.patch(f"/api/applications/{created_app_id}", json=update_payload)
    assert r.status_code == 200, f"Update application failed: {r.status_code}"
    patched_app = r.json()
    assert patched_app["status"] == "APPROVED"
    print(f"10b. PATCH /api/applications/{created_app_id} -> 200 OK (Status transitioned to {patched_app['status']})")

    # 12. CORS preflight check
    r = client.options(
        "/api/families",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET"
        }
    )
    assert "access-control-allow-origin" in r.headers, "CORS header missing!"
    print(f"11. CORS Options Preflight Check -> Headers Verified ({r.headers.get('access-control-allow-origin')})")

    print("\n" + "=" * 60)
    print("ALL 10 API ENDPOINTS + CORS VERIFIED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    test_endpoints()
