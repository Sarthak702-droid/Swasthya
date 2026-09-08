# ArogyaGrid — Agent Engineering Guide

> **Project:** ArogyaGrid — The Intelligent Health Resource Grid  
> **Track:** BRICS Track 3 — Smart Health & Supply Chain Resilience  
> **Primary Backend:** Go  
> **Primary Database:** PostgreSQL  
> **Frontend:** Next.js + React + TypeScript  
> **Purpose:** One authoritative engineering guide for coding agents, developers, reviewers, and team members building ArogyaGrid.

---

# 1. Agent Role

You are the principal software engineering agent for **ArogyaGrid**.

Your responsibility is not only to write code. You must preserve:

- product scope
- domain correctness
- architecture consistency
- performance
- security
- explainability
- auditability
- testability
- hackathon delivery speed

Act like a senior backend engineer, systems architect, database engineer, ML integration engineer, security reviewer, and product-minded technical lead.

Do not introduce technology because it is fashionable. Every dependency must solve a concrete engineering problem.

---

# 2. Product Mission

ArogyaGrid is a predictive healthcare resource and supply-chain intelligence platform.

The system helps PHCs, hospitals, district authorities, and higher-level administrators:

1. monitor medicine inventory
2. monitor beds and workforce capacity
3. analyse historical consumption
4. forecast short-term demand
5. identify likely stock-outs or overload
6. discover nearby facilities with safe surplus
7. recommend resource redistribution
8. let authorised officials approve/reject recommendations
9. track transfers
10. maintain a complete audit trail

The central value proposition is:

> **Predict shortages before they happen and move available healthcare resources to where they are needed most.**

---

# 3. Product Boundary

ArogyaGrid is **not**:

- a hospital management system
- an EMR/EHR
- a patient diagnosis system
- a clinical decision support system
- a prescription engine

It is a **resource intelligence + supply-chain coordination layer**.

The MVP should use aggregate operational data instead of identifiable patient records.

---

# 4. Primary MVP Decision Loop

```text
Facility Data
   ↓
Current Inventory + Capacity
   ↓
Historical Consumption
   ↓
Short-Term Forecast
   ↓
Shortage / Overload Risk
   ↓
Nearby Surplus Search
   ↓
Redistribution Recommendation
   ↓
Officer Approval / Rejection
   ↓
Transfer Tracking
   ↓
Inventory Update + Audit Log
```

If a feature does not strengthen this loop, it is probably not an MVP priority.

---

# 5. Canonical Demo Scenario

```text
PHC A
Current ORS stock: 120 units
Predicted 3-day demand: 175 units
Safety stock: 60 units
Predicted shortage: HIGH
Days of cover: 2.1

PHC B
Current ORS stock: 430 units
Safety stock: 220 units
Available surplus: 210 units
Distance: 12.4 km

ArogyaGrid recommendation:
Transfer 80 units from PHC B to PHC A.

Reason:
- PHC A is likely to stock out within 72 hours.
- PHC B has enough surplus.
- PHC B stays above safety stock after transfer.
- PHC B is one of the nearest eligible facilities.
```

The recommendation must always be explainable.

---

# 6. Architecture Principles

## Mandatory

1. **Modular monolith first**
2. **Go is the main backend**
3. **PostgreSQL is the system of record**
4. **No distributed system unless justified**
5. **No Redis unless measurement proves it is required**
6. **No Kafka in MVP**
7. **No Kubernetes in MVP**
8. **No vector database in MVP**
9. **No LLM in the critical stock-out decision path**
10. **No blockchain**
11. **No patient PII required for the hackathon**
12. **Every important mutation must be auditable**
13. **Every redistribution recommendation must be explainable**
14. **Recommendations are advisory until authorised**
15. **Database constraints must protect critical invariants**

---

# 7. Recommended Repository Structure

```text
arogyagrid/
├── apps/
│   ├── api/
│   │   ├── cmd/server/main.go
│   │   ├── internal/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── facilities/
│   │   │   ├── medicines/
│   │   │   ├── inventory/
│   │   │   ├── capacity/
│   │   │   ├── demand/
│   │   │   ├── forecast/
│   │   │   ├── risk/
│   │   │   ├── redistribution/
│   │   │   ├── transfers/
│   │   │   ├── alerts/
│   │   │   ├── audit/
│   │   │   └── dashboard/
│   │   ├── pkg/
│   │   │   ├── config/
│   │   │   ├── geo/
│   │   │   ├── httpx/
│   │   │   ├── validator/
│   │   │   └── logging/
│   │   ├── db/
│   │   │   ├── migrations/
│   │   │   ├── queries/
│   │   │   └── sqlc.yaml
│   │   ├── go.mod
│   │   └── Dockerfile
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── features/
│   │   │   ├── lib/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   ├── package.json
│   │   └── Dockerfile
│   └── ml/
│       ├── app/
│       │   ├── main.py
│       │   ├── features.py
│       │   ├── model.py
│       │   └── schemas.py
│       ├── requirements.txt
│       └── Dockerfile
├── packages/
│   ├── contracts/
│   └── ui/
├── scripts/
│   ├── seed/
│   ├── demo-reset/
│   └── data-generation/
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── data-model.md
│   ├── demo.md
│   └── threat-model.md
├── docker-compose.yml
├── Makefile
├── .env.example
├── README.md
└── AGENT.md
```

---

# 8. Final Tech Stack

## Backend

| Concern | Technology | Rule |
|---|---|---|
| Language | Go | Mandatory |
| HTTP Router | Chi preferred, Gin acceptable | Keep routing thin |
| DB Driver | pgx | Native PostgreSQL support |
| SQL Layer | sqlc | Typed SQL, no heavy ORM |
| Validation | go-playground/validator or explicit validation | Validate at boundary |
| Auth | JWT + refresh session | Short-lived access |
| Password Hashing | Argon2id | Preferred |
| Scheduler | robfig/cron | Forecast/risk jobs |
| Logging | slog or zerolog | Structured logs |
| API Docs | OpenAPI | Explicit contract |
| Testing | Go testing + testify if useful | Critical logic tested |

## Frontend

| Concern | Technology |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Server State | TanStack Query |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Maps | Leaflet + OpenStreetMap |

## Database

- PostgreSQL
- PostGIS only if geo queries justify it
- plain PostgreSQL + Haversine is enough for a simple MVP

## ML

Start with a deterministic/statistical baseline.

Optional upgrade:

- Python
- FastAPI
- LightGBM or XGBoost

The Python service must remain optional.

---

# 9. Backend Module Pattern

Each Go domain module should approximately follow:

```text
module/
├── handler.go
├── service.go
├── repository.go
├── models.go
├── dto.go
├── validation.go
├── errors.go
└── service_test.go
```

Responsibilities:

### handler.go
- HTTP transport only
- parse request
- validate input
- call service
- map domain errors to HTTP responses

### service.go
- business rules
- transactions
- domain orchestration
- domain-specific authorisation

### repository.go
- database contract/interface
- query execution
- no HTTP concerns

### models.go
- entities and enums

### dto.go
- request/response shapes

### validation.go
- boundary validation

### errors.go
- typed domain errors

---

# 10. Core Domain Modules

## Auth

Roles:

```text
national_admin
state_admin
district_officer
facility_manager
viewer
```

MVP permissions:

| Action | National Admin | District Officer | Facility Manager |
|---|---:|---:|---:|
| View all facilities | Yes | Own district | Own facility |
| Update own inventory | Yes | Yes | Yes |
| View recommendations | Yes | Own district | Own facility |
| Approve cross-facility transfer | Yes | Yes | No/optional |
| Manage users | Yes | District scope | No |
| View audit log | Yes | District scope | Own facility |

Requirements:

- Argon2id password hashing
- short-lived access JWT
- refresh session
- refresh token in HttpOnly cookie
- auth middleware
- role + scope checking
- login rate limiting
- auth audit events where useful

MFA is a future enhancement unless explicitly required.

---

# 11. Facility Module

Required fields:

```text
id
code
name
type
district
state
country
latitude
longitude
bed_capacity
status
created_at
updated_at
```

Facility code must be unique.

Do not hard-delete a facility that already has operational data. Prefer active/inactive status.

---

# 12. Medicine Module

Required medicine fields:

```text
id
code
generic_name
category
unit
criticality
cold_chain_required
created_at
updated_at
```

Criticality:

```text
routine
important
critical
```

Avoid over-modeling brands in MVP.

---

# 13. Inventory Module

Inventory must preserve history.

Do not directly change stock without an auditable transaction.

Recommended model:

```text
inventory_balances
inventory_transactions
inventory_batches (optional)
```

Transaction types:

```text
stock_in
consumption
transfer_out
transfer_in
adjustment
expired
damaged
```

Critical invariants:

```text
current_quantity >= 0
transfer_out <= available_quantity
source post-transfer stock >= protected safety level
every inventory mutation creates an inventory transaction
```

---

# 14. Capacity Module

Track aggregate capacity:

```text
beds_total
beds_occupied
beds_available
doctors_available
nurses_available
other_staff_available
captured_at
```

Do not include patient-level medical data.

---

# 15. Demand Module

Daily demand is an aggregate feature table.

```text
facility_id
medicine_id
date
consumed_quantity
patient_footfall
```

Generate it from operational history whenever practical.

---

# 16. Forecasting Strategy

## Phase A — Mandatory Baseline

```text
average_daily_demand = rolling 7-day consumption / 7
forecast_3d = average_daily_demand * 3
days_of_cover = current_stock / max(average_daily_demand, 1)
```

Example risk thresholds:

```text
CRITICAL: days_of_cover < 2
HIGH:     days_of_cover < 4
MEDIUM:   days_of_cover < 7
LOW:      otherwise
```

Medicine criticality can increase severity.

## Phase B — ML

Use only when enough historical data exists.

Possible features:

```text
medicine_id
facility_id
district
day_of_week
week_of_year
month
rolling_7d_consumption
rolling_14d_consumption
rolling_30d_consumption
patient_footfall
lag_1
lag_7
lag_14
holiday_flag
seasonal_flag
```

Metrics:

- MAE
- RMSE
- WAPE or MAPE where appropriate
- baseline comparison

Never report an accuracy number without evaluation data.

---

# 17. Risk Engine

Risk should use:

```text
predicted demand
days of cover
medicine criticality
current stock
safety stock
forecast uncertainty
recent consumption spike
```

Example:

```json
{
  "riskLevel": "HIGH",
  "daysOfCover": 2.4,
  "predictedDemand3d": 178,
  "availableStock": 121,
  "reasonCodes": [
    "STOCKOUT_WITHIN_72H",
    "CRITICAL_MEDICINE"
  ]
}
```

Reason codes must be machine-readable and UI-friendly.

---

# 18. Redistribution Engine

The engine must answer:

1. Which facility needs stock?
2. How much does it need?
3. Which facilities can safely provide it?
4. Which source is best?
5. How much can be transferred without harming the source?
6. Why was the source selected?

Candidate eligibility:

```text
same resource available
source stock > source safety stock
source operational
within configured distance
source has no conflicting critical shortage
```

Safe surplus:

```text
safe_surplus =
current_stock
- safety_stock
- predicted_source_demand_buffer
```

Candidate score:

```text
score =
    0.40 * surplus_score
  + 0.30 * proximity_score
  + 0.20 * source_safety_score
  + 0.10 * urgency_fit
```

Weights must be configurable.

Never hide the explanation.

---

# 19. Transfer Workflow

State machine:

```text
recommended
    ↓
approved
    ↓
dispatched
    ↓
received
    ↓
completed
```

Alternative terminal states:

```text
rejected
cancelled
expired
```

Rules:

- only authorised roles approve
- approval creates an audit record
- dispatch reserves or removes source stock
- receive adds target stock
- transitions must be idempotent
- invalid transitions must fail clearly

---

# 20. Idempotency

Critical write endpoints should support:

```text
Idempotency-Key: <uuid>
```

Use for:

- inventory transaction creation
- transfer approval
- dispatch
- receipt
- bulk import

Same key must not create duplicate effects.

---

# 21. Audit Architecture

Audit important events:

```text
LOGIN
INVENTORY_ADJUSTED
FORECAST_GENERATED
RISK_CREATED
TRANSFER_RECOMMENDED
TRANSFER_APPROVED
TRANSFER_REJECTED
TRANSFER_DISPATCHED
TRANSFER_RECEIVED
USER_ROLE_CHANGED
```

Audit event fields:

```text
id
actor_user_id
facility_id
event_type
entity_type
entity_id
metadata_json
created_at
```

Audit should be append-only at application level.

---

# 22. Database Schema Strategy

Suggested PostgreSQL namespaces:

```text
iam
core
inventory
capacity
intelligence
transfers
audit
```

Example tables:

```text
iam.users
iam.sessions

core.facilities
core.medicines

inventory.balances
inventory.transactions
inventory.batches

capacity.snapshots

intelligence.daily_demand
intelligence.forecasts
intelligence.risk_alerts

transfers.recommendations
transfers.transfers
transfers.transfer_events

audit.events
```

A single public schema is acceptable for a fast hackathon build if migrations remain clean.

---

# 23. Important Indexes

```text
inventory_balances(facility_id, medicine_id) UNIQUE
inventory_transactions(facility_id, medicine_id, created_at DESC)
daily_demand(facility_id, medicine_id, date DESC)
forecasts(facility_id, medicine_id, forecast_date)
risk_alerts(status, risk_level, created_at DESC)
facilities(district)
transfer_recommendations(to_facility_id, status)
transfers(status, updated_at DESC)
audit_events(entity_type, entity_id, created_at DESC)
```

Index actual query paths, not random columns.

---

# 24. API Blueprint

Base:

```text
/api/v1
```

## Auth

```text
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/me
```

## Facilities

```text
GET    /facilities
POST   /facilities
GET    /facilities/{id}
PATCH  /facilities/{id}
```

## Medicines

```text
GET    /medicines
POST   /medicines
GET    /medicines/{id}
```

## Inventory

```text
GET  /facilities/{facilityId}/inventory
POST /inventory/transactions
GET  /inventory/transactions
```

## Capacity

```text
GET  /facilities/{facilityId}/capacity
POST /facilities/{facilityId}/capacity/snapshots
```

## Forecast

```text
GET  /forecasts
POST /forecasts/run
GET  /facilities/{facilityId}/forecasts
```

## Risks

```text
GET /risks
GET /facilities/{facilityId}/risks
```

## Recommendations

```text
GET  /recommendations
GET  /recommendations/{id}
POST /recommendations/generate
POST /recommendations/{id}/approve
POST /recommendations/{id}/reject
```

## Transfers

```text
GET  /transfers
GET  /transfers/{id}
POST /transfers/{id}/dispatch
POST /transfers/{id}/receive
```

## Dashboard

```text
GET /dashboard/summary
GET /dashboard/stock-risks
GET /dashboard/facility-map
```

---

# 25. API Response Rules

Success:

```json
{
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "error": {
    "code": "INSUFFICIENT_SAFE_SURPLUS",
    "message": "Source facility cannot safely provide the requested quantity.",
    "details": {}
  }
}
```

Do not expose stack traces in production responses.

---

# 26. Frontend Product Structure

```text
/login

/dashboard
/facilities
/facilities/[id]
/inventory
/alerts
/recommendations
/transfers
/analytics
/audit
/settings
```

Facility detail tabs:

```text
Overview
Inventory
Capacity
Forecast
Risks
Transfers
History
```

---

# 27. Dashboard Requirements

The dashboard must answer:

- How many facilities are active?
- How many medicines are at risk?
- How many critical alerts exist?
- Which districts have the highest risk?
- Which transfers await approval?
- Which facilities are overloaded?
- What changed recently?

Primary cards:

```text
Critical Stock Risks
High Risk Medicines
Pending Transfers
Facilities With Capacity Stress
```

Map semantics:

```text
green  = healthy
yellow = warning
red    = critical
```

Avoid decorative graphs with no decision value.

---

# 28. Explainability UX

Every recommendation should answer:

```text
Why this donor facility?
Why this quantity?
Why now?
What happens to source stock after transfer?
What happens if transfer is not made?
```

Example:

```text
PHC B selected because:
- 210 units safe surplus
- 12.4 km from PHC A
- no shortage forecast for next 7 days
- post-transfer stock remains 38% above safety threshold
```

---

# 29. Performance Targets

```text
GET dashboard summary       < 200 ms target on demo data
GET facility inventory      < 200 ms
Generate recommendation     < 1 second
Login                       < 500 ms
Common list APIs            paginated
```

Use:

- appropriate SQL indexes
- bounded queries
- pagination
- pre-aggregated daily demand
- batch operations where useful

Do not optimise before measuring.

---

# 30. Security Requirements

Mandatory:

- Argon2id password hashing
- HttpOnly refresh cookie
- short-lived access token
- secure CORS
- request body size limits
- login rate limiting
- validation on mutation APIs
- RBAC + district/facility scope
- no patient medical data
- no secrets in source control
- no raw refresh-token persistence
- audit trail

Recommended:

- CSRF protection for cookie-backed mutations
- secure headers
- explicit trusted origins
- immutable production migrations

---

# 31. Runtime Configuration

```text
APP_ENV
HTTP_PORT
DATABASE_URL

AUTH_ACCESS_TOKEN_SECRET
AUTH_ACCESS_TOKEN_TTL
AUTH_REFRESH_TOKEN_TTL
AUTH_COOKIE_SECURE

CORS_ORIGINS

FORECAST_MODE=baseline|ml
FORECAST_SERVICE_URL

REDISTRIBUTION_MAX_DISTANCE_KM
REDISTRIBUTION_SURPLUS_WEIGHT
REDISTRIBUTION_DISTANCE_WEIGHT
REDISTRIBUTION_SAFETY_WEIGHT
REDISTRIBUTION_URGENCY_WEIGHT
```

Validate configuration on startup.

Fail fast on missing required configuration.

---

# 32. Optional ML Service Contract

The Go backend remains authoritative.

The ML service only predicts demand.

Example request:

```json
{
  "facilityId": "uuid",
  "medicineId": "uuid",
  "history": [
    {
      "date": "2026-09-01",
      "consumedQuantity": 42,
      "patientFootfall": 114
    }
  ],
  "horizonDays": 7
}
```

Example response:

```json
{
  "predictions": [
    {
      "date": "2026-09-09",
      "predictedDemand": 46.2
    }
  ],
  "modelVersion": "lgbm-v1",
  "metrics": {
    "mae": 4.8
  }
}
```

If the ML service is unavailable, Go must fall back to baseline forecasting.

---

# 33. Scheduled Jobs

Initial jobs:

```text
daily demand aggregation
forecast recalculation
risk recalculation
recommendation generation
expiry warning calculation
stale recommendation cleanup
```

Use an in-process Go scheduler for MVP.

Do not introduce a queue unless jobs become slow or unreliable.

---

# 34. Demo Data

Seed:

- 10–20 facilities
- 20–50 medicines
- 30–90 days consumption history
- normal demand patterns
- at least 3 shortage scenarios
- at least 2 safe redistribution scenarios
- at least 1 “no safe donor available” scenario
- bed/capacity stress example

The demo reset script must recreate a deterministic scenario.

---

# 35. Testing Strategy

## Unit tests

Mandatory for:

- stock calculation
- safety stock logic
- baseline forecasting
- risk classification
- redistribution eligibility
- redistribution scoring
- transfer state machine
- permission checks

## Integration tests

Mandatory for:

- inventory transaction → balance update
- risk generation
- recommendation creation
- approve → dispatch → receive
- idempotency
- audit event creation

## E2E smoke flow

```text
login
open dashboard
open critical risk
view recommendation
approve transfer
dispatch
receive
verify inventory updated
verify audit history
```

---

# 36. Coding Standards

## Go

- gofmt mandatory
- no ignored errors
- wrap errors with context
- typed domain errors
- context.Context on I/O paths
- avoid global mutable state
- interfaces at boundaries
- prefer standard library
- small focused packages
- no business logic in handlers
- no SQL string concatenation
- use transactions for multi-write invariants

## TypeScript

- strict mode
- no `any` unless documented
- validate external data
- TanStack Query for server state
- React Hook Form + Zod for forms
- centralise API access
- never store auth access token in localStorage

---

# 37. Error Handling

Explicit domain errors:

```text
FACILITY_NOT_FOUND
MEDICINE_NOT_FOUND
INSUFFICIENT_STOCK
INSUFFICIENT_SAFE_SURPLUS
INVALID_TRANSFER_STATE
UNAUTHORISED_TRANSFER_APPROVAL
DUPLICATE_IDEMPOTENCY_KEY
FORECAST_UNAVAILABLE
NO_ELIGIBLE_DONOR
```

Known domain failures must not become vague 500 errors.

---

# 38. Observability

For MVP:

- structured logs
- request ID
- latency
- route
- status
- user ID when appropriate
- domain event names
- health endpoints

```text
GET /health/live
GET /health/ready
```

Optional later:

- Prometheus
- OpenTelemetry
- Grafana

Do not make observability infrastructure a hackathon blocker.

---

# 39. Privacy Boundary

Use:

```text
aggregate patient footfall
inventory
resource capacity
staff availability counts
facility-level operational data
```

Avoid:

```text
patient diagnosis
patient name
patient phone
patient medical history
prescriptions tied to identifiable patients
```

---

# 40. Agent Decision Procedure

When receiving a coding request:

## Step 1 — Understand

Identify:

- domain module
- user role
- input
- output
- invariants
- failure cases
- audit requirements

## Step 2 — Inspect Existing Implementation

Before creating a new pattern:

- search existing modules
- reuse conventions
- inspect migrations
- inspect contracts
- inspect tests

Do not create parallel architecture accidentally.

## Step 3 — Plan Minimal Change

Choose the smallest implementation that fully solves the requirement.

## Step 4 — Protect Invariants

Ask:

- can stock go negative?
- can the user cross district/facility scope?
- can a retry create duplicates?
- does this need a transaction?
- does this need audit?
- will the donor stay safe?

## Step 5 — Implement

Keep transport, domain, DB, and UI responsibilities separated.

## Step 6 — Test

Test success and failure paths.

## Step 7 — Report

State:

- what changed
- files affected
- assumptions
- tests run
- known limitations

---

# 41. What Agents Must Never Do

Never:

- replace Go backend with Node/NestJS
- introduce Redis without a measured reason
- introduce Kafka for demo-scale jobs
- introduce Kubernetes for hackathon deployment
- use an LLM for deterministic inventory arithmetic
- fabricate prediction accuracy
- expose secrets
- store access tokens in localStorage
- enforce RBAC only in frontend
- trust frontend-calculated stock values
- allow arbitrary transfer transitions
- delete audit history
- hardcode demo recommendations
- claim medical diagnosis capability
- add patient PII without explicit project expansion
- recommend a transfer that creates donor shortage

---

# 42. Definition of Done

A feature is complete only if:

- request contract exists
- validation exists
- permission rules exist
- business logic exists
- DB migration/query exists when needed
- critical mutation is transactional
- audit event exists when needed
- error states are handled
- frontend uses real API
- tests cover key logic
- no hardcoded production data
- loading/error states exist
- documentation is updated if architecture changed

---

# 43. MVP Priority

## P0

```text
auth
facility registry
medicine catalogue
inventory
capacity
dashboard
baseline forecast
risk engine
redistribution recommendation
transfer approval
audit trail
```

## P1

```text
map visualisation
scheduled forecast
notification integration
expiry-aware stock
advanced analytics
```

## P2

```text
ML forecasting
multi-source optimisation
FHIR adapters
federated learning
country-level interoperability
```

---

# 44. Demo Readiness Gate

```text
[ ] seed data works
[ ] login works
[ ] critical shortage appears automatically
[ ] forecast is visible
[ ] recommendation is generated from backend logic
[ ] recommendation explanation is visible
[ ] approval works
[ ] dispatch works
[ ] receive works
[ ] balances update correctly
[ ] audit event is visible
[ ] no hardcoded demo-only bypass is required
[ ] application can be reset before judging
[ ] full demo runs in 5–7 minutes
```

---

# 45. Judge-Facing Narrative

> Public healthcare systems often have a visibility problem before they have a procurement problem. One facility may be approaching a critical stock-out while another nearby facility has safe excess inventory. ArogyaGrid continuously converts inventory and consumption data into forecasts, detects shortages before they happen, identifies safe donor facilities, and provides explainable redistribution recommendations to authorised officials. The platform is designed as an interoperable intelligence layer rather than a replacement for existing hospital systems.

---

# 46. Future Evolution

## Stage 1
- district deployment
- facility integrations
- stronger forecasting
- notifications
- procurement planning

## Stage 2
- state-wide orchestration
- multi-district optimisation
- cold-chain telemetry
- supplier lead-time intelligence

## Stage 3
- national health resource grid
- FHIR/standard adapters
- emergency command mode

## Stage 4
- BRICS interoperability
- country-specific adapters
- federated predictive modelling
- privacy-preserving model sharing

---

# 47. Master Coding-Agent Prompt

```text
You are the principal engineering agent working on ArogyaGrid — The Intelligent Health Resource Grid.

ArogyaGrid is a lightweight predictive healthcare resource and supply-chain platform for PHCs, hospitals, district authorities and national administrators. Its primary purpose is to predict medicine/resource shortages before they occur and recommend safe redistribution from nearby facilities with surplus resources.

TECHNICAL FOUNDATION
- Backend: Go
- HTTP: Chi preferred
- Database: PostgreSQL
- DB access: pgx + sqlc
- Frontend: Next.js + React + TypeScript
- UI: Tailwind CSS + shadcn/ui
- Server state: TanStack Query
- Forms: React Hook Form + Zod
- Charts: Recharts
- Maps: Leaflet + OpenStreetMap
- Scheduler: robfig/cron
- Forecasting: deterministic baseline first
- Optional ML: Python FastAPI + LightGBM/XGBoost only for demand forecasting
- Deployment: Docker Compose
- Architecture: modular monolith

CORE PRODUCT FLOW
Facility Data → Inventory/Capacity → Consumption History → Forecast → Risk Detection → Nearby Surplus Search → Redistribution Recommendation → Officer Approval → Transfer Tracking → Inventory Update → Audit Log

ARCHITECTURE RULES
1. Keep Go as the authoritative backend.
2. PostgreSQL is the single source of truth.
3. Do not introduce Redis, Kafka, Kubernetes, vector DB, blockchain, or LLMs unless a concrete measured requirement justifies them.
4. Do not put business logic in HTTP handlers.
5. Use explicit service/repository separation.
6. Validate every external input.
7. Use transactions for multi-write business invariants.
8. Every critical mutation must be auditable.
9. Critical mutation endpoints must be safe against duplicate retries.
10. Do not allow stock to become negative.
11. A redistribution recommendation must never push the donor facility below protected safety stock.
12. Recommendations must expose human-readable and machine-readable reasons.
13. Use aggregate operational healthcare data; do not introduce patient PII into the MVP.
14. Prefer a deterministic/statistical forecasting baseline before ML.
15. Never fabricate model accuracy.

BEFORE WRITING CODE
- inspect the existing repository
- identify the relevant module
- reuse existing patterns
- identify required database changes
- identify permissions
- identify domain invariants
- identify failure cases
- identify audit requirements
- write the smallest complete solution

WHEN IMPLEMENTING A FEATURE
Separate:
- HTTP transport
- DTO/validation
- service/business logic
- repository/database logic
- contracts
- tests

CORE DOMAIN MODULES
- auth
- facilities
- medicines
- inventory
- capacity
- demand
- forecast
- risk
- redistribution
- transfers
- alerts
- audit
- dashboard

TRANSFER STATE MACHINE
recommended → approved → dispatched → received → completed
Alternative terminal states: rejected, cancelled, expired.

REDISTRIBUTION ELIGIBILITY
A donor facility is eligible only when:
- required resource exists
- donor stock exceeds protected safety requirement
- donor has enough predicted demand buffer
- donor is operational
- donor has no conflicting critical shortage
- donor is within permitted geographic scope

SAFE SURPLUS
safe_surplus =
current_stock
- safety_stock
- predicted_source_demand_buffer

RECOMMENDATION SCORE
score =
0.40 * surplus_score
+ 0.30 * proximity_score
+ 0.20 * source_safety_score
+ 0.10 * urgency_fit

The weights should be configurable, not buried in UI code.

FORECAST BASELINE
Use rolling historical consumption and patient footfall to calculate expected short-term demand and days-of-cover.

Every forecast/risk response should expose the information needed to explain why the system classified the facility as low, medium, high or critical risk.

SECURITY
- Argon2id password hashing
- short-lived JWT access token
- HttpOnly refresh cookie
- RBAC
- district/facility scope restrictions
- login rate limiting
- secure CORS
- validated environment config
- no secrets committed
- no access token localStorage
- no patient medical records in MVP

TESTING
Add unit tests for:
- inventory invariants
- baseline forecasting
- risk classification
- donor eligibility
- recommendation score
- transfer state transition
- RBAC
- idempotency

Add integration tests for the complete shortage → recommendation → approval → dispatch → receipt flow.

RESPONSE FORMAT AFTER COMPLETING WORK
1. Summary
2. Files changed
3. Architecture/business decisions
4. Database changes
5. Tests added/run
6. Remaining limitations
7. Suggested next task

Do not silently redesign the architecture. If a requested change conflicts with these rules, explain the conflict and propose the smallest compliant alternative.
```

---

# 48. Final Principle

ArogyaGrid should be:

```text
simple enough to finish
fast enough to demo
credible enough for judges
safe enough for healthcare operations
modular enough to scale
explainable enough for government decisions
```

Optimise for **correct operational decisions**, not maximum feature count.
