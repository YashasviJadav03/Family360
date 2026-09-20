# Family360 — System Design Document
## Scalable Family-Centric Welfare Intelligence & Entitlement Delivery Infrastructure

---

## 1. Problem Framing & Scope

### 1.1 The Core Problem
In Indian public governance, social welfare delivery has historically operated around **individual scheme applications** rather than **family-centric entitlement**. This creates four systemic failures:
1. **The Awareness & Application Gap**: The poorest households rarely know all 11+ welfare schemes they qualify for (scholarships, pensions, housing, maternal aid). Benefit uptake depends on citizen initiative, leading to massive under-delivery.
2. **Departmental Data Silos**: Civil Supplies (Ration Cards), Social Justice (Scholarships/Pensions), Health (Ayushman/PMJAY), and Urban/Rural Housing maintain independent databases with conflicting demographics, typos, and fragmented IDs.
3. **Ghost Beneficiaries & Inefficient Deduplication**: Cross-system duplicates allow ineligible individuals to claim multiple mutual-exclusion subsidies, while genuine families are excluded due to spelling mismatches.
4. **Administrative Cognitive Overload**: Field and district welfare officers lack holistic 360-degree household intelligence to conduct proactive outreach or verify eligibility efficiently.

### 1.2 The Family360 Vision
Family360 transforms the Gujarat Family ID concept from a static database key into an **active intelligence layer**. It acts as a Digital Public Infrastructure (DPI) component that:
- Aggregates multi-source departmental footprints into an explainable 360-degree household profile.
- Runs a high-performance **deterministic rule engine** to surface unclaimed welfare entitlements proactively.
- Uses **explainable entity resolution** with blocking to detect cross-registry duplicates.
- Provides an **AI explanation and query translation layer** (strictly decoupled from boolean decisions) to empower administrative officers.

### 1.3 Hackathon Scope vs. Production Reality
| Dimension | Hackathon Prototype (Family360 v1.0) | Production State Scale (Gujarat) | National Scale (India) |
| :--- | :--- | :--- | :--- |
| **Household Volume** | 3,000 families (~12,141 residents) | ~1.5 Crore (15M) households (~65M citizens) | ~30 Crore (300M) households (~1.4B citizens) |
| **Data Footprints** | 15,023 synthetic identity records | ~8 Crore multi-departmental records | ~150 Crore cross-system identity records |
| **Database Engine** | Single PostgreSQL 15 instance | Partitioned Postgres cluster + Read Replicas | Distributed NewSQL (CockroachDB/Yugabyte) + Sharded Data Lakehouse |
| **Eligibility Evaluation** | Synchronous compute-on-read (<5ms) | Asynchronous write-time event pipeline (Kafka + Celery) | Distributed streaming compute (Apache Flink / Spark Streaming) |
| **Entity Resolution** | Request-time blocking `(district, initial)` | Async nightly batch + incremental event-triggered resolution | Two-tier blocking: Hashed Annoy/FAISS vector index + MinHash LSH |
| **Authentication** | Mock Family ID & Officer Role Switcher | Digital Gujarat SSO (OAuth2/OIDC) + UIDAI Consent Auth | India Stack federated e-Pramaan / Aadhaar FaceRD |

---

## 2. Current Architecture (As Built)

```
                            ┌─────────────────────────────────────────────────────────┐
                            │                   Client Applications                   │
                            │  (React 18 + Vite + Tailwind CSS + Lucide Icons + Recharts)│
                            └───────────────────────────┬─────────────────────────────┘
                                                        │ HTTP / REST (Axios)
                                                        ▼
                            ┌─────────────────────────────────────────────────────────┐
                            │                 FastAPI Gateway (Port 8000)             │
                            │        CORS · Pydantic v2 · Structured Error Layer      │
                            └───────┬─────────────┬─────────────┬─────────────┬───────┘
                                    │             │             │             │
                 ┌──────────────────┘             │             │             └──────────────────┐
                 ▼                                ▼             ▼                                ▼
  ┌───────────────────────────────┐ ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────────────────┐
  │   Deterministic Rule Engine   │ │ Entity Resolution │ │ Data Quality MIS  │ │     AI Explanation Layer      │
  │     (app/services/eligibility)│ │  (app/ml/entity)  │ │ (app/api/dashboard│ │ (app/services/llm_client.py)   │
  │ • Atomic condition evaluation │ │ • Blocking Keys   │ │ • Profile score   │ │ • Intent-matched templates    │
  │ • Matched vs. failed audits   │ │ • RapidFuzz score │ │ • Address clash   │ │ • max_tokens=300 token cap    │
  │ • NO LLM decision autonomy    │ │ • Signal breakdown│ │ • Unlinked audit  │ │ • In-memory TTL caching       │
  └──────────────┬────────────────┘ └────────┬──────────┘ └─────────┬─────────┘ └──────────────┬────────────────┘
                 │                           │                      │                          │
                 └───────────────────────────┼──────────────────────┴──────────────────────────┘
                                             ▼
                            ┌─────────────────────────────────────────────────────────┐
                            │              PostgreSQL 15 Relational DB                │
                            │  families · family_members · benefits · identity_records│
                            │   schemes · eligibility_rules · duplicate_reviews       │
                            └─────────────────────────────────────────────────────────┘
```

### Architectural Pillars:
1. **Rule Engine Decides, LLM Explains (ADR-002)**: The boolean eligibility outcome (`is_eligible`) is exclusively calculated by atomic relational logic (`evaluate_eligibility`). Under no circumstances is LLM output connected to decision fields. The LLM functions purely as an administrative phrasing assistant.
2. **Blocking-Powered Entity Resolution (ADR-003)**: Brute-force $O(N^2)$ pairwise comparison across 15,000 records requires ~113 million comparisons. Blocking by `(district, first_letter)` reduces candidate pairs by >96%, achieving sub-second matching.
3. **Auditable Plain-Language Explanations**: Every determination preserves exact rule-by-rule audit trails (`threshold`, `operator`, `actual_value`).

---

## 3. Scale Considerations: 3,000 Families to Gujarat & India Scale

### 3.1 What Breaks First at Gujarat Scale (~1.5 Crore Households)?
When scaling from 3,000 to 15,000,000 households, the following components will fail immediately if unaddressed:

1. **Synchronous Per-Request Eligibility Evaluation**:
   - *Failure Mode*: Currently, when `/api/families/{id}/eligibility` or `/benefit-gap` is called, the system fetches all 11 schemes and 40+ rules and iterates in Python. At 1.5 crore families with ~5,000 concurrent officer requests, DB connection pool starvation and CPU saturation occur within seconds.
   - *Production Solution*: **Transition from Evaluate-on-Read to Evaluate-on-Write**.
     - Entitlement evaluation is offloaded to an asynchronous event-driven worker pool (e.g., Celery/Kafka).
     - When a citizen's income certificate changes or a child is born, a message `HouseholdUpdated(family_id)` is published.
     - A background worker re-evaluates the 11 schemes and persists pre-computed boolean flags into a `family_entitlement_cache` table or Redis key. Read requests become an $O(1)$ key lookup (<2ms).

2. **Entity Resolution Blocking Strategy**:
   - *Failure Mode*: A single block `('ahmedabad', 'P')` in a district with 2,000,000 residents would still contain ~100,000 records, requiring $(100,000 \times 99,999) / 2 \approx 5 \text{ billion}$ comparisons.
   - *Production Solution*: **Multi-Pass Hierarchical Blocking + MinHash LSH**.
     - Pass 1: Block by `(district_code, taluka_code, yob)`.
     - Pass 2: Block by `(soundex(last_name), gender, yob)`.
     - Partition the `identity_records` PostgreSQL table using native list partitioning by `district_id`.
     - Move deduplication out of request-time entirely into an asynchronous batch pipeline (nightly batch jobs using Apache Spark or PySpark running on AWS EMR / on-premise OpenShift).

3. **Dashboard Aggregations**:
   - *Failure Mode*: `SELECT COUNT(*) FROM benefits GROUP BY district` takes ~45ms on 8,000 rows. On 4 crore benefit rows, a table scan takes 15–30 seconds.
   - *Production Solution*: Materialized views refreshed every 15 minutes, coupled with Redis counter increments on benefit state transitions.

### 3.2 What Architectural Pattern is Needed at India Scale (~30 Crore Households)?
At Aadhaar/India scale (300M households, 1.4B residents, ~1.5B identity footprints):
- **Distributed Database Architecture**: Replace single-instance PostgreSQL with a distributed NewSQL engine such as **CockroachDB** or **YugabyteDB**, sharded geographically by State Code and District Code.
- **Cross-Departmental Streaming Event Mesh**: Departments (PDS, PFMS, PM-KISAN, State Scholarships) do not write directly to the Family360 database. Instead, they publish signed events to an **Apache Kafka / Redpanda** event mesh.
- **Read-Side Optimization & Caching**: Multi-tier caching with **Redis Cluster** maintaining serialized family summaries, serving 98% of citizen portal lookups without touching primary storage.

### 3.3 What We Did NOT Build and Why (Honest Engineering Trade-offs)
- **Distributed Job Queue**: We did not introduce Celery/Kafka/RabbitMQ because a single Docker Compose instance running synchronous evaluation in <5ms was far more reliable and reproducible during a fast-paced hackathon demo.
- **Text-to-SQL Engine**: We deliberately rejected open-ended text-to-SQL for the officer assistant. In a public administration context, open-ended SQL generation risks hallucinations, unauthorized data leakage, and unpredictable latency. Fixed template intent-matching is predictable, safe, and auditable.

---

## 4. Integration Points with Existing Government Infrastructure

### 4.1 UIDAI (Aadhaar) — Identity Authentication
- **Integration Approach**: Family360 **never stores raw 12-digit Aadhaar numbers**, complying strictly with the Aadhaar Act and Supreme Court guidelines.
- **Production Mechanism**:
  1. Citizen enters their Aadhaar or performs biometric authentication via UIDAI's standard e-KYC API (Authentication Service Agency / KYC Service Agency).
  2. UIDAI returns a cryptographic **Aadhaar Virtual ID (VID)** or **Aadhaar Token** (a 72-character SHA-256 reference key) along with demographic attributes (Name, Gender, YOB, Masked Address).
  3. Family360 stores only this hashed reference token (`aadhaar_hash`) to verify that the resident is an authentic civil entity without possessing sensitive biometric data.

### 4.2 Digital Gujarat SSO — Citizen & Officer Access
- **Integration Approach**: Instead of creating a parallel username/password identity system, Family360 acts as a relying party under the **Digital Gujarat Single Sign-On (SSO)** ecosystem.
- **Production Mechanism**:
  1. Citizen clicks *"Login with Digital Gujarat"*.
  2. The portal redirects to the state OAuth 2.0 / OpenID Connect (OIDC) identity provider.
  3. Upon OTP verification, Digital Gujarat issues a signed JWT containing the authenticated citizen's verified mobile number and primary Family ID.
  4. Role-Based Access Control (RBAC): Government officers authenticate using their official Government of Gujarat `@gujarat.gov.in` credentials with NIC e-Kavach 2FA.

### 4.3 e-Samaj Kalyan — System of Record Synchronization
- **Integration Approach**: **Family360 is an intelligence and discovery layer, NOT a replacement system of record.**
- **Production Mechanism**:
  1. Social Justice and Empowerment applications are legally submitted and processed through the existing **e-Samaj Kalyan** portal.
  2. Family360 surfaces proactive recommendations and generates a pre-filled application draft.
  3. When an officer or citizen clicks *"Submit Application"*, Family360 invokes e-Samaj Kalyan's secured REST ingestion API:
     `POST https://esamajkalyan.gujarat.gov.in/api/v1/applications/external`
  4. A unidirectional webhook updates Family360 when e-Samaj Kalyan changes the application status (`UNDER_VERIFICATION` → `APPROVED` → `DISBURSED`).

### 4.4 DBT / PFMS — Payment Rails Integration
- **Integration Approach**: Downstream entitlement consumption.
- **Production Mechanism**:
  1. Once an entitlement application transitions to `APPROVED` within e-Samaj Kalyan or Digital Gujarat, the sanction order payload is transmitted to the **Public Financial Management System (PFMS)** and **Aadhaar Payment Bridge (APB)**.
  2. Family360 displays the disbursement confirmation number (UTR) on the citizen's 360 profile, closing the transparency loop.

---

## 5. Data Privacy & Security Posture

1. **Digital Personal Data Protection (DPDP) Act 2023 Compliance**:
   - Family360 implements purpose limitation: family data is accessed solely for determining and delivering gazetted social welfare benefits.
   - Citizen consent is logged immutably whenever an officer triggers a profile inspection.
2. **Field-Level Data Masking**:
   - Citizen identity cards, bank account numbers, and mobile numbers are masked by default (`XXXX-XXXX-4902`, `XXXXXX7891`).
3. **Immutable Officer Audit Trail**:
   - Every read, rule explanation generation, and duplicate resolution decision is recorded with the officer's ID, timestamp, IP address, and administrative review rationale.

---

## 6. What We Would Build Next (Actionable Next Steps)

1. **Write-Time Event Pipeline for Entitlement Computation**:
   - Replace read-time calculation with Celery workers listening to database change data capture (CDC via Debezium) to pre-calculate and cache benefit gap reports.
2. **Pilot Real Entity Resolution with Anonymized Department Data**:
   - Run our RapidFuzz blocking pipeline on 100,000 anonymized records under a formal research data-sharing agreement with the Gujarat Social Justice Department to tune matching thresholds against real Gujarati phonetic variations (Indic Soundex).
3. **Integrate Real Digital Gujarat SSO Authentication**:
   - Replace the mock Family ID selector with real OIDC authorization code flow.
4. **WhatsApp Citizen Entitlement Chatbot**:
   - Implement an open-source WhatsApp Business API bot (using GovChat/Bhashini) allowing rural citizens to send a voice note in Gujarati or enter their Ration Card ID to receive an audio message summarizing their unclaimed entitlements.
5. **GIS Taluka Vulnerability Heatmaps**:
   - Enhance the officer dashboard with Leaflet/Mapbox choropleth maps highlighting talukas with the highest concentration of unclaimed housing and pension gaps.
