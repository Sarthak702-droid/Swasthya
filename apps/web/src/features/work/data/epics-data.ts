export interface EpicTask {
  id: string;
  code: string;
  title: string;
  description: string;
  assignee: 'Sarthak' | 'Vaishnavi' | 'Riya' | 'Shneanjali';
  assigneeRole: string;
  status: 'COMPLETE' | 'IN_PROGRESS' | 'BACKLOG';
  files: string[];
  verification: string;
  category: 'Backend Core' | 'Database' | 'Security & Auth' | 'Frontend UI' | 'Integration & Seed' | 'Analytics & ML';
  prdSection: string;
  implementationDetails?: string[];
}

export interface EpicItem {
  id: string;
  code: string;
  title: string;
  owner: 'Sarthak' | 'Vaishnavi' | 'Riya' | 'Shneanjali';
  ownerRole: string;
  description: string;
  prdSection: string;
  status: 'COMPLETE' | 'IN_PROGRESS' | 'BACKLOG';
  color: string;
  badgeBg: string;
  iconBg: string;
  tasks: EpicTask[];
}

export const EPICS_DATA: EpicItem[] = [
  // -------------------------------------------------------------
  // EPIC 1: Foundation, Auth & DB Infrastructure
  // -------------------------------------------------------------
  {
    id: 'epic-1',
    code: 'EPIC-01',
    title: 'Foundation, Auth, Multi-Schema DB & DevOps',
    owner: 'Sarthak',
    ownerRole: 'Team Leader & System Architect',
    prdSection: 'PRD §7.1, §11, §14',
    description:
      'Multi-schema PostgreSQL 16 database engine, robust JWT authentication middleware, transaction-safe idempotency engine, monorepo automation tooling, and environment configuration.',
    status: 'COMPLETE',
    color: 'border-rose-200 bg-rose-50/50',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
    iconBg: 'bg-rose-600',
    tasks: [
      {
        id: 't-101',
        code: 'TASK-01-01',
        title: 'Multi-Schema Database Architecture',
        description:
          'Designed and deployed PostgreSQL 16 multi-schema structure isolating identity (iam), facilities (core), work orders (work), and immutable audit logs (audit).',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader & System Architect',
        status: 'COMPLETE',
        files: ['apps/api/db/migrations/001_work_schema.sql'],
        verification: 'Applied cleanly to PostgreSQL 16 (arogyagrid DB) with schema search_path isolation',
        category: 'Database',
        prdSection: 'PRD §7.1',
        implementationDetails: [
          'Created schemas: iam, core, inventory, capacity, intelligence, transfers, work, audit.',
          'Configured foreign keys with ON DELETE RESTRICT to ensure complete audit trail integrity.',
          'Implemented migration runner with forward and rollback validation.'
        ]
      },
      {
        id: 't-102',
        code: 'TASK-01-02',
        title: 'Database Migrations Engine & sqlc Configuration',
        description:
          'Constructed forward and rollback database migration scripts and prepared sqlc type-safe query generation configurations.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader & System Architect',
        status: 'COMPLETE',
        files: ['apps/api/db/migrations/001_work_schema.sql', 'apps/api/db/sqlc.yaml'],
        verification: 'Table schema verified in PostgreSQL with type-safe query compilation',
        category: 'Database',
        prdSection: 'PRD §7.1',
        implementationDetails: [
          'Defined sqlc.yaml for type-safe Go struct generation from raw PostgreSQL queries.',
          'Built migration check in Makefile to prevent uncommitted schema drifts.'
        ]
      },
      {
        id: 't-103',
        code: 'TASK-01-03',
        title: 'JWT Authentication & Authorization Middleware',
        description:
          'Constructed HMAC-SHA256 JWT middleware validating tokens, extracting user ID, facility ID, role, and propagating caller context into Go request contexts.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader & System Architect',
        status: 'COMPLETE',
        files: ['apps/api/internal/middleware/auth.go'],
        verification: 'Bearer token verification passes with valid claims and rejects forged tokens with 401',
        category: 'Security & Auth',
        prdSection: 'PRD §11',
        implementationDetails: [
          'Enforces Bearer token scheme in HTTP Authorization headers.',
          'Injects Claims struct (UserID, FacilityID, Role, Permissions) into context.Context.',
          'Protects all operational endpoints while maintaining public health endpoints.'
        ]
      },
      {
        id: 't-104',
        code: 'TASK-01-04',
        title: 'Idempotency Engine & Deduplication Storage',
        description:
          'Built HTTP middleware intercepting Idempotency-Key headers, caching API response bodies, and preventing duplicate actions or replay attacks.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader & System Architect',
        status: 'COMPLETE',
        files: ['apps/api/internal/middleware/idempotency.go'],
        verification: 'Dual POST with matching key returns cached response safely with zero duplicate database mutations',
        category: 'Security & Auth',
        prdSection: 'PRD §14',
        implementationDetails: [
          'Intercepts X-Idempotency-Key header on state mutation requests.',
          'Locks key in memory/cache during execution to prevent concurrent race condition duplicates.',
          'Stores response status code, headers, and body for exact deterministic replay.'
        ]
      },
      {
        id: 't-105',
        code: 'TASK-01-05',
        title: 'Developer Tooling, Makefile & Monorepo Runner',
        description:
          'Built single-command automation via root Makefile and start-dashboard.sh orchestrating PostgreSQL, Go Chi API (:8085), and Next.js (:3000).',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader & System Architect',
        status: 'COMPLETE',
        files: ['Makefile', 'start-dashboard.sh', 'docker-compose.yml'],
        verification: 'Single start-dashboard.sh boots all services with zero manual steps',
        category: 'Integration & Seed',
        prdSection: 'PRD §14',
        implementationDetails: [
          'Auto-detects Docker / Docker Compose PostgreSQL instance.',
          'Cleans port conflicts on 8085 and 3000 before boot.',
          'Ensures clean .next cache to prevent CSS hash mismatches in development.'
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // EPIC 2: Medicine Catalog & Operational Inventory Ledger
  // -------------------------------------------------------------
  {
    id: 'epic-2',
    code: 'EPIC-02',
    title: 'Medicine Catalog & Operational Inventory Ledger',
    owner: 'Vaishnavi',
    ownerRole: 'District Officer & Core Domain Lead',
    prdSection: 'PRD §7.3, §7.4',
    description:
      'Generic medicine master catalogue (criticality, cold-chain flag), facility inventory balances, and immutable transaction ledger for stock-in, consumption, and adjustments.',
    status: 'IN_PROGRESS',
    color: 'border-blue-200 bg-blue-50/50',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    iconBg: 'bg-blue-600',
    tasks: [
      {
        id: 't-201',
        code: 'TASK-02-01',
        title: 'Generic Medicine Master Catalog Schema',
        description:
          'Create core.medicines table supporting generic_name, unit, criticality (routine, important, critical), and cold_chain_required flag.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'IN_PROGRESS',
        files: ['apps/api/db/migrations/003_inventory_schema.sql'],
        verification: 'Table core.medicines created with unique code index and enum validation',
        category: 'Database',
        prdSection: 'PRD §7.3',
        implementationDetails: [
          'Columns: id, code, generic_name, category, unit, criticality, min_stock_threshold, cold_chain_required.',
          'Strict constraint: Criticality enum: ROUTINE, IMPORTANT, CRITICAL.',
          'Index on code and category for fast autocomplete in search bars.'
        ]
      },
      {
        id: 't-202',
        code: 'TASK-02-02',
        title: 'Facility Inventory Balances Table',
        description:
          'Implement inventory.balances table with (facility_id, medicine_id) unique constraint, current_qty, and safety_stock thresholds.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/inventory/models.go', 'repository.go'],
        verification: 'Row-level locking on balance mutations verified under concurrent transactions',
        category: 'Database',
        prdSection: 'PRD §7.4',
        implementationDetails: [
          'Row-level locking via SELECT ... FOR UPDATE on inventory balance mutation.',
          'Automatic updated_at trigger and optimistic locking version column.',
          'Hard invariant: current_qty >= 0 (CHECK constraint).'
        ]
      },
      {
        id: 't-203',
        code: 'TASK-02-03',
        title: 'Immutable Inventory Transaction Ledger',
        description:
          'Implement inventory.transactions append-only table recording stock-in, consumption, expired, damaged, transfer-in, and transfer-out events.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/inventory/service.go'],
        verification: 'Every balance update backed by an immutable transaction row with audit reference',
        category: 'Backend Core',
        prdSection: 'PRD §7.4',
        implementationDetails: [
          'Append-only ledger: No UPDATE or DELETE allowed on inventory.transactions.',
          'Columns: id, facility_id, medicine_id, delta_qty, transaction_type, batch_number, expiry_date, reason, created_at.',
          'Generates audit trail linked to user who performed the stock action.'
        ]
      },
      {
        id: 't-204',
        code: 'TASK-02-04',
        title: 'Negative Inventory Prevention Invariant',
        description:
          'Enforce strict database constraint and service check: transactions attempting to reduce stock below 0 are rejected with INSUFFICIENT_STOCK.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/inventory/validation.go'],
        verification: 'Unit test verifying immediate rejection of negative stock deduction',
        category: 'Backend Core',
        prdSection: 'PRD §7.4',
        implementationDetails: [
          'Pre-flight validation check before applying debit transaction.',
          'Postgres CHECK (current_qty >= 0) serves as dual safety barrier.',
          'Structured error response returns current balance, requested delta, and deficit quantity.'
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // EPIC 3: Bed & Workforce Capacity Monitoring
  // -------------------------------------------------------------
  {
    id: 'epic-3',
    code: 'EPIC-03',
    title: 'Bed & Workforce Capacity Monitoring',
    owner: 'Riya',
    ownerRole: 'Facility Manager & Operations Lead',
    prdSection: 'PRD §7.5',
    description:
      'Time-series capacity snapshots recording total beds, occupied beds, available beds, active doctors, and nurses, with facility capacity stress alerts.',
    status: 'IN_PROGRESS',
    color: 'border-indigo-200 bg-indigo-50/50',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    iconBg: 'bg-indigo-600',
    tasks: [
      {
        id: 't-301',
        code: 'TASK-03-01',
        title: 'Capacity Snapshot Schema & Repository',
        description:
          'Implement capacity.snapshots table capturing facility_id, beds_total, beds_occupied, doctors_available, nurses_available, and captured_at.',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/capacity/models.go', 'repository.go'],
        verification: 'Snapshots queryable with time-series ordering and indexed on facility_id and captured_at',
        category: 'Database',
        prdSection: 'PRD §7.5',
        implementationDetails: [
          'Tracks general beds, ICU beds, oxygen-supported beds separately.',
          'Tracks on-duty doctors, nurses, and emergency staff.',
          'Snapshots logged periodically and on major triage influx events.'
        ]
      },
      {
        id: 't-302',
        code: 'TASK-03-02',
        title: 'Facility Bed Occupancy & Capacity Stress Engine',
        description:
          'Calculate bed occupancy ratio (occupied / total) and trigger CAPACITY_STRESS alerts when occupancy exceeds 90% or staff falls below emergency threshold.',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/capacity/service.go'],
        verification: 'Emits alert when simulated occupancy reaches 95% with automatic work ticket creation',
        category: 'Backend Core',
        prdSection: 'PRD §7.5',
        implementationDetails: [
          'Occupancy calculation: OccupancyRate = (BedsOccupied / BedsTotal) * 100.',
          'Critical threshold: >= 90% triggers CAPACITY_OVERLOAD work order.',
          'Staff ratio check: StaffPressure = ActivePatients / max(ActiveDoctors, 1).'
        ]
      },
      {
        id: 't-303',
        code: 'TASK-03-03',
        title: 'Capacity REST Endpoints for PHC Operators',
        description:
          'Build GET /facilities/{id}/capacity and POST /facilities/{id}/capacity/snapshots endpoints for quick mobile/web ward updates.',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/capacity/handler.go'],
        verification: 'API returns latest snapshot within 50ms and accepts quick nurse updates',
        category: 'Backend Core',
        prdSection: 'PRD §7.5',
        implementationDetails: [
          'Quick 1-click update endpoint for frontline nurses and facility ward supervisors.',
          'Calculates real-time available beds: BedsTotal - BedsOccupied.',
          'Emits WebSocket notification if capacity crosses warning zone (85%).'
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // EPIC 4: Demand Aggregation, Forecasting & Shortage Risk Engine
  // -------------------------------------------------------------
  {
    id: 'epic-4',
    code: 'EPIC-04',
    title: 'Demand Aggregation, Forecasting & Shortage Risk Engine',
    owner: 'Shneanjali',
    ownerRole: 'Logistics Officer & Frontend Lead',
    prdSection: 'PRD §8',
    description:
      'Aggregates daily medicine consumption, calculates rolling 7-day average daily demand, projects 3–7 day forecasts, and computes Days-of-Cover to trigger automated shortage risk alerts.',
    status: 'IN_PROGRESS',
    color: 'border-amber-200 bg-amber-50/50',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    iconBg: 'bg-amber-600',
    tasks: [
      {
        id: 't-401',
        code: 'TASK-04-01',
        title: 'Daily Demand Aggregation Pipeline',
        description:
          'Construct intelligence.daily_demand pipeline grouping consumption transactions by date, facility, and medicine with patient footfall metrics.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/demand/aggregation.go'],
        verification: 'Produces clean daily demand feature rows from raw transactions',
        category: 'Analytics & ML',
        prdSection: 'PRD §8.1',
        implementationDetails: [
          'Aggregates daily consumption sum from inventory.transactions where type = CONSUMPTION.',
          'Handles zero-consumption days safely without zero-division errors.',
          'Stores time-series records in intelligence.daily_demand.'
        ]
      },
      {
        id: 't-402',
        code: 'TASK-04-02',
        title: 'Baseline 3–7 Day Demand Forecast Engine',
        description:
          'Implement rolling 7-day consumption average: average_daily_demand = sum(7d)/7; forecast_3d = average_daily_demand * 3.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/forecast/baseline.go'],
        verification: 'Unit tests confirm deterministic 3-day and 7-day forecast output',
        category: 'Analytics & ML',
        prdSection: 'PRD §8.2',
        implementationDetails: [
          'Moving average formula: ADD_7 = (1/7) * Sum(Demand_t-6 to Demand_t).',
          'Forecast projections: F_3d = ADD_7 * 3, F_7d = ADD_7 * 7.',
          'Detects consumption surge if today > 1.5 * ADD_7.'
        ]
      },
      {
        id: 't-403',
        code: 'TASK-04-03',
        title: 'Days-of-Cover & Shortage Risk Classifier',
        description:
          'Implement days_of_cover = current_stock / max(daily_demand, 1). Classify risk: CRITICAL (<2d), HIGH (<4d), MEDIUM (<7d), LOW (otherwise).',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/risk/classifier.go'],
        verification: 'Correctly classifies 1.5 days cover as CRITICAL risk alert',
        category: 'Analytics & ML',
        prdSection: 'PRD §8.3',
        implementationDetails: [
          'DoC formula: DoC = CurrentStock / max(ADD_7, 1.0).',
          'Thresholds: Critical < 2.0 days, High < 4.0 days, Medium < 7.0 days, Stable >= 7.0 days.',
          'Weighting multiplier applied for CRITICAL life-saving medicines (e.g. Oxytocin, Antivenom).'
        ]
      },
      {
        id: 't-404',
        code: 'TASK-04-04',
        title: 'Risk Alerts Queue & Reason Codes',
        description:
          'Store alerts in intelligence.risk_alerts with structured reason codes (STOCKOUT_WITHIN_72H, CRITICAL_MEDICINE, RECENT_SURGE).',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/risk/service.go'],
        verification: 'GET /risks returns active prioritized alerts queue',
        category: 'Backend Core',
        prdSection: 'PRD §8.4',
        implementationDetails: [
          'Reason codes: STOCKOUT_IMMINENT, SURGE_DETECTED, BELOW_SAFETY_THRESHOLD.',
          'Deduplicates active alerts so multiple scans do not generate duplicate tickets.',
          'Emits STOCK_SHORTAGE_REVIEW work orders to operational queue.'
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // EPIC 5: Safe Surplus Redistribution & Scoring Engine
  // -------------------------------------------------------------
  {
    id: 'epic-5',
    code: 'EPIC-05',
    title: 'Safe Surplus Redistribution & Scoring Engine',
    owner: 'Sarthak',
    ownerRole: 'Team Leader & System Architect',
    prdSection: 'PRD §9.1–9.4',
    description:
      'Mathematical redistribution engine calculating safe donor surplus (Stock - Safety Stock - Demand Buffer), computing Haversine distances, and ranking donor facilities with multi-factor scoring.',
    status: 'IN_PROGRESS',
    color: 'border-emerald-200 bg-emerald-50/50',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    iconBg: 'bg-emerald-600',
    tasks: [
      {
        id: 't-501',
        code: 'TASK-05-01',
        title: 'Safe Surplus Mathematical Formula',
        description:
          'Implement PRD §9.2: safe_surplus = current_stock - safety_stock - predicted_demand_buffer. Guarantee donor never becomes unsafe post-transfer.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader & System Architect',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/redistribution/surplus.go'],
        verification: 'Tests prove donor with 150 units & 100 safety has max 50 surplus',
        category: 'Backend Core',
        prdSection: 'PRD §9.2',
        implementationDetails: [
          'Protected safety stock invariant: Donor stock post-transfer >= SafetyStock + DemandBuffer.',
          'DemandBuffer = AverageDailyDemand * LeadTimeDays (typically 3 days).',
          'If SafeSurplus <= 0, facility is disqualified from being a donor candidate.'
        ]
      },
      {
        id: 't-502',
        code: 'TASK-05-02',
        title: 'Haversine Geographic Proximity Scoring',
        description:
          'Compute real-world road/great-circle distance between donor and recipient facilities in kilometers using latitude/longitude.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader & System Architect',
        status: 'IN_PROGRESS',
        files: ['apps/api/pkg/geo/haversine.go'],
        verification: 'Distance verified between Bhubaneswar and Jatni (approx 22km)',
        category: 'Backend Core',
        prdSection: 'PRD §9.3',
        implementationDetails: [
          'Haversine formula: a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2); c = 2 ⋅ atan2(√a, √(1−a)); d = R ⋅ c.',
          'Proximity Score = max(0, 1 - (distance_km / MAX_TRANSFER_RADIUS_KM)).',
          'Flags cold-chain route feasibility if distance exceeds thermal carrier duration (2 hours).'
        ]
      },
      {
        id: 't-503',
        code: 'TASK-05-03',
        title: 'Multi-Factor Donor Candidate Scoring Algorithm',
        description:
          'Implement score = 0.40 * surplus + 0.30 * proximity + 0.20 * safety + 0.10 * urgency. Rank eligible donors descending.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader & System Architect',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/redistribution/scoring.go'],
        verification: 'Weights configurable via backend config without hardcoded values',
        category: 'Backend Core',
        prdSection: 'PRD §9.4',
        implementationDetails: [
          'Surplus Factor (40%): Normalized ratio of available surplus vs requested deficit.',
          'Proximity Factor (30%): Closer facilities score exponentially higher.',
          'Safety Buffer Factor (20%): Donors with generous residual stock score higher.',
          'Urgency Factor (10%): Recipient days-of-cover severity weighting.'
        ]
      },
      {
        id: 't-504',
        code: 'TASK-05-04',
        title: 'Explainable Transfer Recommendation Generator',
        description:
          'Build recommendation payload showing destination, source, quantity, distance, score, reason codes, and human-readable explanation.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader & System Architect',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/redistribution/service.go'],
        verification: 'POST /recommendations/generate returns ranked eligible donors with reasoning',
        category: 'Backend Core',
        prdSection: 'PRD §9.4',
        implementationDetails: [
          'Synthesizes natural language rationale: e.g., "Khurda DHH has 240 units safe surplus and is located 18.4 km away with cold-chain transit safe."',
          'Returns ranked list of top 3 donor candidates.',
          'Generates TRANSFER_RECOMMENDATION_APPROVAL ticket in operational work queue.'
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // EPIC 6: Transfer Lifecycle & Dual-Inventory Execution
  // -------------------------------------------------------------
  {
    id: 'epic-6',
    code: 'EPIC-06',
    title: 'Transfer Lifecycle & Dual-Inventory Execution',
    owner: 'Vaishnavi',
    ownerRole: 'District Officer & Core Domain Lead',
    prdSection: 'PRD §9.5, §9.6',
    description:
      'Deterministic transfer state machine (recommended ➔ approved ➔ dispatched ➔ received ➔ completed) with transactional dual-inventory mutations.',
    status: 'IN_PROGRESS',
    color: 'border-violet-200 bg-violet-50/50',
    badgeBg: 'bg-violet-100 text-violet-800 border-violet-300',
    iconBg: 'bg-violet-600',
    tasks: [
      {
        id: 't-601',
        code: 'TASK-06-01',
        title: 'Transfer State Machine Implementation',
        description:
          'Implement finite state machine strictly enforcing: recommended -> approved -> dispatched -> received -> completed (and rejected/cancelled).',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/transfers/state_machine.go'],
        verification: 'Rejects invalid state jumps (e.g. recommended directly to received)',
        category: 'Backend Core',
        prdSection: 'PRD §9.5',
        implementationDetails: [
          'State transitions: DRAFT -> RECOMMENDED -> APPROVED -> DISPATCHED -> RECEIVED -> COMPLETED.',
          'Terminal cancellation and rejection reasons captured in audit log.',
          'Only District Officer or Facility Manager roles can approve.'
        ]
      },
      {
        id: 't-602',
        code: 'TASK-06-02',
        title: 'Dual-Inventory Atomic Mutation Engine',
        description:
          'On dispatch, deduct quantity from donor inventory inside a DB transaction; on receipt, increment recipient inventory balance transactionally.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/transfers/service.go'],
        verification: 'ACID transaction test verifies both balances updated atomically with escrow in-transit tracking',
        category: 'Database',
        prdSection: 'PRD §9.6',
        implementationDetails: [
          'On Dispatch: Atomically deduct donor balance, create in_transit escrow ledger entry.',
          'On Receipt: Verify received quantity, add to recipient balance, resolve escrow ledger.',
          'Discrepancy handling: If received < dispatched, auto-creates INVENTORY_DISCREPANCY work ticket.'
        ]
      },
      {
        id: 't-603',
        code: 'TASK-06-03',
        title: 'Chain-of-Custody & Audit Event Recording',
        description:
          'Record transfer_events on every transition with actor_id, timestamp, vehicle/driver notes, and append to audit.events.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/transfers/events.go'],
        verification: 'Audit log verifies who approved, dispatched, and received transfer with driver notes',
        category: 'Security & Auth',
        prdSection: 'PRD §9.6',
        implementationDetails: [
          'Vehicle registration number, cold box temperature reading, and dispatch timestamp recorded.',
          'Driver acknowledgment and digital sign-off on handoff.',
          'Append-only immutable record in audit.events.'
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // EPIC 7: Operational Work Queue & Task Management System
  // -------------------------------------------------------------
  {
    id: 'epic-7',
    code: 'EPIC-07',
    title: 'Operational Work Queue & Task Management System',
    owner: 'Shneanjali',
    ownerRole: 'Logistics Officer & Frontend Lead',
    prdSection: 'PRD §6, §10',
    description:
      'Enterprise work item queue, SLA policies, multi-tier queue views (My, Team, Urgent, Overdue, Waiting, Completed), slide-over panel, timeline synthesis, and action dialog modals.',
    status: 'COMPLETE',
    color: 'border-teal-200 bg-teal-50/50',
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
    iconBg: 'bg-teal-600',
    tasks: [
      {
        id: 't-701',
        code: 'TASK-07-01',
        title: 'Work Item Domain Models & State Transitions',
        description:
          'Constructed work item models, enums (waiting, assigned, in_progress, completed, returned), and transition state engine.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/models.go', 'transitions.go'],
        verification: '19 unit tests passing in transitions_test.go verifying all lifecycle branches',
        category: 'Backend Core',
        prdSection: 'PRD §6',
        implementationDetails: [
          'State machine: WAITING -> ASSIGNED -> IN_PROGRESS -> COMPLETED, with RETURNED branch.',
          'Optimistic locking via version column prevents concurrent overwrite conflicts.',
          'Immutable work_item_events table records actor, from_state, to_state, and payload.'
        ]
      },
      {
        id: 't-702',
        code: 'TASK-07-02',
        title: 'Dynamic SLA Policy & Due-Date Calculation',
        description:
          'Implemented SLA deadline calculation based on severity: Urgent (2h), High (6h), Normal (24h), Low (72h).',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/sla_policy.go'],
        verification: 'Due date automatically computed on creation based on priority level',
        category: 'Backend Core',
        prdSection: 'PRD §6',
        implementationDetails: [
          'URGENT severity: 2 hours SLA deadline with automatic red escalation pulse.',
          'HIGH severity: 6 hours SLA deadline.',
          'NORMAL severity: 24 hours SLA deadline.',
          'LOW severity: 72 hours SLA deadline.'
        ]
      },
      {
        id: 't-703',
        code: 'TASK-07-03',
        title: 'Multi-View Queue Table & Filter Engine',
        description:
          'Built WorkQueueTable with multi-criteria filtering across members, epics, priority, and real-time search.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'COMPLETE',
        files: ['apps/web/src/features/work/components/WorkQueueTable.tsx'],
        verification: 'Tested live in browser with search and filter responsiveness',
        category: 'Frontend UI',
        prdSection: 'PRD §10',
        implementationDetails: [
          'Tabs: My Work, Team Work, Urgent Queue, Overdue Alerts, Waiting for Assignment, Completed Tasks.',
          'Filter dropdowns for Member, Epic, and text search across title, facility, and description.',
          'Live SLA countdown timer with dynamic color thresholds.'
        ]
      },
      {
        id: 't-704',
        code: 'TASK-07-04',
        title: 'Slide-Over Work Item Inspection Drawer',
        description:
          'Developed WorkItemPanel displaying clinical descriptions, timeline, SLA burn rate, and action triggers.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'COMPLETE',
        files: ['apps/web/src/features/work/components/WorkItemPanel.tsx'],
        verification: 'Opens on row click with comprehensive ticket inspection and chronological timeline',
        category: 'Frontend UI',
        prdSection: 'PRD §10',
        implementationDetails: [
          'Slide-over sheet with accessible Radix UI primitives.',
          'Displays ticket title, facility badge, severity tag, assigned officer profile, and clinical notes.',
          'Threaded comments component with live message submission.'
        ]
      },
      {
        id: 't-705',
        code: 'TASK-07-05',
        title: 'Operational Action Dialog Modals',
        description:
          'Accessible modal dialogs for Assign, Reassign, Facility Handoff, Return with reason, and Complete with summary.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'COMPLETE',
        files: ['AssignDialog.tsx', 'HandoffDialog.tsx', 'ReturnDialog.tsx', 'CompleteDialog.tsx'],
        verification: 'All modal dialogs validate inputs and trigger API mutations cleanly with optimistic UI update',
        category: 'Frontend UI',
        prdSection: 'PRD §10',
        implementationDetails: [
          'Assign/Reassign Dialog: Select officer from team roster with live availability.',
          'Return Dialog: Captures required reason code and clinical handoff notes.',
          'Complete Dialog: Captures resolution notes and verification sign-off.'
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // EPIC 8: Executive Dashboard & Leaflet Geographic Risk Map
  // -------------------------------------------------------------
  {
    id: 'epic-8',
    code: 'EPIC-08',
    title: 'Executive Dashboard & Leaflet Geographic Risk Map',
    owner: 'Riya',
    ownerRole: 'Facility Manager & Operations Lead',
    prdSection: 'PRD §10',
    description:
      'High-level executive KPI summary cards, interactive Leaflet / OpenStreetMap visualization of Odisha healthcare network, color-coded facility risk markers, and facility detail drilldowns.',
    status: 'IN_PROGRESS',
    color: 'border-orange-200 bg-orange-50/50',
    badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
    iconBg: 'bg-orange-600',
    tasks: [
      {
        id: 't-801',
        code: 'TASK-08-01',
        title: 'Executive Network KPI Summary Cards',
        description:
          'Build GET /dashboard/summary endpoint returning Active Facilities, Critical Stockouts, Bed Capacity Stress, and Active Transfers.',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/dashboard/summary.go'],
        verification: 'Summary endpoint responds with accurate live metrics across all facilities',
        category: 'Backend Core',
        prdSection: 'PRD §10.1',
        implementationDetails: [
          'Computes network-wide stats: Total Active Facilities, Facilities in Stockout Risk, ICU Bed Occupancy, Active In-Transit Orders.',
          'Caches summary query for 30 seconds to optimize high-traffic dashboard reloads.'
        ]
      },
      {
        id: 't-802',
        code: 'TASK-08-02',
        title: 'Leaflet / OpenStreetMap Geographic Risk Map',
        description:
          'Implement interactive map component rendering facility pins color-coded by risk: Red (Critical Stockout/Bed Stress), Orange (High Risk), Green (Safe Surplus Donor).',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'IN_PROGRESS',
        files: ['apps/web/src/features/dashboard/components/FacilityMap.tsx'],
        verification: 'Map renders Odisha PHC coordinates with interactive popup risk cards',
        category: 'Frontend UI',
        prdSection: 'PRD §10.2',
        implementationDetails: [
          'Integrates Leaflet map centered on Odisha (Bhubaneswar, Khurda, Cuttack, Puri).',
          'Color-coded markers: Red (Stockout imminent < 2 days), Amber (High risk < 4 days), Green (Surplus donor available).',
          'Clicking a marker opens quick summary popup with 1-click Transfer request.'
        ]
      },
      {
        id: 't-803',
        code: 'TASK-08-03',
        title: 'Facility 360 Drilldown Page',
        description:
          'Build dedicated facility view displaying inventory balances, capacity snapshot, consumption charts, risk history, and transfer records.',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'IN_PROGRESS',
        files: ['apps/web/src/app/facilities/[id]/page.tsx'],
        verification: 'Page renders comprehensive single-facility operational view with tabbed drilldowns',
        category: 'Frontend UI',
        prdSection: 'PRD §10.3',
        implementationDetails: [
          'Deep drilldown for Capital Hospital, Khurda DHH, Jatni CHC, Pipili PHC.',
          'Tabs: Inventory Balances, Capacity Snapshot, Rolling 7-Day Consumption Trends, Active Work Orders.'
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // EPIC 9: Operational Collaboration & AI Resource Copilot Chat
  // -------------------------------------------------------------
  {
    id: 'epic-9',
    code: 'EPIC-09',
    title: 'Operational Collaboration & AI Resource Copilot Chat',
    owner: 'Sarthak',
    ownerRole: 'Team Leader & System Architect',
    prdSection: 'PRD Chat & §23',
    description:
      'Role-scoped healthcare channels (Facility, District, Transfer context), interactive stockout/transfer cards, and ArogyaGrid AI Resource Copilot with deterministic PRD tool calling.',
    status: 'IN_PROGRESS',
    color: 'border-cyan-200 bg-cyan-50/50',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    iconBg: 'bg-cyan-600',
    tasks: [
      {
        id: 't-901',
        code: 'TASK-09-01',
        title: 'PostgreSQL chat Schema & Tables Migration',
        description:
          'Create chat.channels, chat.channel_members, chat.messages tables with indexes in 002_chat_schema.sql.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader & System Architect',
        status: 'COMPLETE',
        files: ['apps/api/db/migrations/002_chat_schema.sql'],
        verification: 'Migration schema specified in task/TASKS.md and verified with UUID foreign keys',
        category: 'Database',
        prdSection: 'PRD Chat §1',
        implementationDetails: [
          'Schema chat with channels, channel_members, and messages tables.',
          'Channel types: FACILITY_INTERNAL, DISTRICT_OPERATIONS, TRANSFER_CONTEXT, DIRECT_MESSAGE.',
          'Support for structured card payloads (type, payload jsonb) inside messages table.'
        ]
      },
      {
        id: 't-902',
        code: 'TASK-09-02',
        title: 'Real-Time WebSocket Connection Hub & SSE Fallback',
        description:
          'Concurrent-safe connection manager supporting channel broadcast, user broadcast, and auto cleanup.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader & System Architect',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/chat/hub.go'],
        verification: 'Hub broadcast verified with multiple concurrent clients receiving sub-50ms message deliveries',
        category: 'Backend Core',
        prdSection: 'PRD Chat §2',
        implementationDetails: [
          'Goroutine-based WebSocket hub with client registration, unregistration, and broadcast channels.',
          'Heartbeat ping-pong every 30 seconds to clean stale sockets.',
          'SSE fallback for read-only clients behind restricted hospital proxies.'
        ]
      },
      {
        id: 't-903',
        code: 'TASK-09-03',
        title: 'Deterministic Domain Tools for AI Copilot',
        description:
          'Builds PRD-compliant tools querying inventory balances, days of cover, capacity, and safe surplus without hallucinations.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader & System Architect',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/chat/copilot_tools.go'],
        verification: 'Tool returns exact stock matching PostgreSQL database with 0% hallucination rate',
        category: 'Integration & Seed',
        prdSection: 'PRD Chat §3',
        implementationDetails: [
          'Tool: check_inventory_balance(facility_id, medicine_id)',
          'Tool: calculate_days_of_cover(facility_id, medicine_id)',
          'Tool: find_safe_surplus_donors(medicine_id, quantity_needed)',
          'Tool: inspect_bed_capacity(facility_id)'
        ]
      },
      {
        id: 't-904',
        code: 'TASK-09-04',
        title: 'Interactive Chat UI, Channel Sidebar & Message Feed',
        description:
          'Next.js components: ChannelList, MessageFeed with role badges, MessageComposer, and Copilot quick chips.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader & System Architect',
        status: 'IN_PROGRESS',
        files: ['apps/web/src/features/chat/components/MessageFeed.tsx'],
        verification: 'Responsive chat interface renders at /chat route with interactive approval cards',
        category: 'Frontend UI',
        prdSection: 'PRD Chat §4',
        implementationDetails: [
          'Channel sidebar grouping Facility, District, and Active Transfer chats.',
          'Stockout Alert card with 1-click "Request Redistribution" action button.',
          'Transfer Recommendation card with 1-click "Approve Dispatch" button.'
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // EPIC 10: Automated Background Scheduler & Realistic Demo Dataset
  // -------------------------------------------------------------
  {
    id: 'epic-10',
    code: 'EPIC-10',
    title: 'Automated Background Scheduler & Realistic Demo Dataset',
    owner: 'Sarthak',
    ownerRole: 'Team Leader & System Architect',
    prdSection: 'PRD §18, §21',
    description:
      'In-process robfig/cron scheduler running daily demand aggregations, forecast refreshes, and stale recommendation cleanups, with realistic 15-facility Odisha demo dataset.',
    status: 'IN_PROGRESS',
    color: 'border-slate-200 bg-slate-50/50',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
    iconBg: 'bg-slate-600',
    tasks: [
      {
        id: 't-1001',
        code: 'TASK-10-01',
        title: 'robfig/cron In-Process Background Scheduler',
        description:
          'Configure Go background scheduler in cmd/server/main.go executing periodic jobs with graceful cancellation.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader & System Architect',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/scheduler/cron.go'],
        verification: 'Scheduler boots cleanly with server and runs test tick without blocking main HTTP listener',
        category: 'Backend Core',
        prdSection: 'PRD §18',
        implementationDetails: [
          'Uses robfig/cron/v3 in-process scheduler.',
          'Runs on independent goroutines with context cancellation on SIGTERM.',
          'Logs execution duration and job success/failure to audit log.'
        ]
      },
      {
        id: 't-1002',
        code: 'TASK-10-02',
        title: 'Automated Demand, Forecast & Risk Refresh Jobs',
        description:
          'Automate midnight demand aggregation, forecast horizon projection, and risk alert recalculation.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader & System Architect',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/scheduler/jobs.go'],
        verification: 'Job triggers demand aggregation and refreshes risk queue deterministically',
        category: 'Backend Core',
        prdSection: 'PRD §18',
        implementationDetails: [
          'Nightly job: Aggregates daily demand for all 15 facilities.',
          'Hourly job: Recalculates days-of-cover and flags newly breached safety levels.',
          'Daily job: Cleans up stale expired transfer recommendations.'
        ]
      },
      {
        id: 't-1003',
        code: 'TASK-10-03',
        title: 'Comprehensive Odisha 15-Facility Realistic Seed Dataset',
        description:
          'Realistic database records representing 15 facilities (Bhubaneswar, Khurda, Jatni, Pipili), 30 medicines, and 60-day consumption trends.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader & System Architect',
        status: 'IN_PROGRESS',
        files: ['scripts/seed/seed_full_demo.sql'],
        verification: '5–7 minute judging storyboard executes cleanly from seed data without any manual setup',
        category: 'Integration & Seed',
        prdSection: 'PRD §21',
        implementationDetails: [
          'Facilities across Odisha: Capital Hospital, Khurda DHH, Jatni CHC, Pipili PHC, Balianta PHC, etc.',
          '30 essential medicines including Oxytocin, Rabies Vaccine, Paracetamol, Amoxicillin, Insulin.',
          '60-day realistic historical consumption and patient footfall trendlines.'
        ]
      }
    ]
  }
];

export const TEAM_ROSTER = [
  {
    name: 'Sarthak',
    role: 'Team Leader & System Architect',
    systemRole: 'National Administrator',
    avatar: '👑',
    color: 'from-rose-500 to-red-600',
    borderColor: 'border-rose-200',
    bgBadge: 'bg-rose-50 text-rose-800 border-rose-200',
    epics: ['EPIC-01', 'EPIC-05', 'EPIC-09', 'EPIC-10'],
    epicTitles: [
      'Foundation, Auth & Database Infrastructure',
      'Safe Surplus Redistribution & Scoring Engine',
      'Operational Collaboration & AI Resource Copilot Chat',
      'Automated Background Scheduler & Realistic Demo Dataset'
    ],
    summary:
      'Leads system architecture, multi-schema database engine, JWT idempotency middleware, safe surplus redistribution math, and AI copilot integration.'
  },
  {
    name: 'Vaishnavi',
    role: 'District Officer & Core Domain Lead',
    systemRole: 'District Operations Officer',
    avatar: '📋',
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-200',
    bgBadge: 'bg-blue-50 text-blue-800 border-blue-200',
    epics: ['EPIC-02', 'EPIC-06'],
    epicTitles: [
      'Medicine Catalog & Operational Inventory Ledger',
      'Transfer Lifecycle & Dual-Inventory Execution'
    ],
    summary:
      'Engineers core medicine catalogue, facility balance ledger, negative inventory safety invariants, and dual-inventory transfer execution engine.'
  },
  {
    name: 'Riya',
    role: 'Facility Manager & Operations Lead',
    systemRole: 'Facility Manager (Capital Hospital)',
    avatar: '🏥',
    color: 'from-indigo-500 to-purple-600',
    borderColor: 'border-indigo-200',
    bgBadge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    epics: ['EPIC-03', 'EPIC-08'],
    epicTitles: [
      'Bed & Workforce Capacity Monitoring',
      'Executive Dashboard & Leaflet Geographic Risk Map'
    ],
    summary:
      'Oversees capacity snapshots (beds/workforce), facility stress index alerting, and frontline clinical coordination workflows.'
  },
  {
    name: 'Shneanjali',
    role: 'Logistics Officer & Frontend Lead',
    systemRole: 'Logistics & Work Flow Specialist',
    avatar: '🚚',
    color: 'from-amber-500 to-teal-600',
    borderColor: 'border-teal-200',
    bgBadge: 'bg-teal-50 text-teal-800 border-teal-200',
    epics: ['EPIC-04', 'EPIC-07'],
    epicTitles: [
      'Demand Forecasting & Shortage Risk Engine',
      'Operational Work Queue & Task Management System'
    ],
    summary:
      'Develops Next.js operational work queue, slide-over detail drawer, action dialog modals, executive KPI summary cards, and interactive Leaflet / OSM geographic facility risk map.'
  }
];

export function getEpicByCode(code: string): EpicItem | undefined {
  return EPICS_DATA.find((e) => e.code.toLowerCase() === code.toLowerCase() || e.id.toLowerCase() === code.toLowerCase());
}

export function getAllTasks(): (EpicTask & { epicCode: string; epicTitle: string })[] {
  return EPICS_DATA.flatMap((epic) =>
    epic.tasks.map((task) => ({
      ...task,
      epicCode: epic.code,
      epicTitle: epic.title
    }))
  );
}
