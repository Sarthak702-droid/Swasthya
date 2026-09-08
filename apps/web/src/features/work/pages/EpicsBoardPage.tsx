'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  CircleDashed,
  Layers,
  Users,
  ShieldCheck,
  FileCode2,
  GitPullRequest,
  Search,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Check,
  Building2,
  Filter,
  Sparkles,
  Server,
  Database,
  Terminal,
  Activity,
  MapPin,
  MessageSquare,
  BarChart3,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
        assigneeRole: 'Team Leader',
        status: 'COMPLETE',
        files: ['apps/api/db/migrations/001_work_schema.sql'],
        verification: 'Applied cleanly to PostgreSQL 16 (arogyagrid DB)',
        category: 'Database'
      },
      {
        id: 't-102',
        code: 'TASK-01-02',
        title: 'Database Migrations Engine & sqlc Configuration',
        description:
          'Constructed forward and rollback database migration scripts and prepared sqlc type-safe query generation configurations.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'COMPLETE',
        files: ['apps/api/db/migrations/001_work_schema.sql', 'apps/api/db/sqlc.yaml'],
        verification: 'Table schema verified in PostgreSQL',
        category: 'Database'
      },
      {
        id: 't-103',
        code: 'TASK-01-03',
        title: 'JWT Authentication & Authorization Middleware',
        description:
          'Constructed HMAC-SHA256 JWT middleware validating tokens, extracting user ID, facility ID, role, and propagating caller context into Go request contexts.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'COMPLETE',
        files: ['apps/api/internal/middleware/auth.go'],
        verification: 'Bearer token verification passes with valid & invalid claims',
        category: 'Security & Auth'
      },
      {
        id: 't-104',
        code: 'TASK-01-04',
        title: 'Idempotency Engine & Deduplication Storage',
        description:
          'Built HTTP middleware intercepting Idempotency-Key headers, caching API response bodies, and preventing duplicate actions or replay attacks.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'COMPLETE',
        files: ['apps/api/internal/middleware/idempotency.go'],
        verification: 'Dual POST with matching key returns cached response safely',
        category: 'Security & Auth'
      },
      {
        id: 't-105',
        code: 'TASK-01-05',
        title: 'Developer Tooling, Makefile & Monorepo Runner',
        description:
          'Built single-command automation via root Makefile and start-dashboard.sh orchestrating PostgreSQL, Go Chi API (:8085), and Next.js (:3000).',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'COMPLETE',
        files: ['Makefile', 'start-dashboard.sh', 'docker-compose.yml'],
        verification: 'Single make dev boots all services with zero manual steps',
        category: 'Integration & Seed'
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
    color: 'border-emerald-200 bg-emerald-50/50',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    iconBg: 'bg-emerald-600',
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
        verification: 'Table core.medicines created with unique code index',
        category: 'Database'
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
        verification: 'Row-level locking on balance mutations verified',
        category: 'Database'
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
        verification: 'Every balance update backed by an immutable transaction row',
        category: 'Backend Core'
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
        verification: 'Unit test verifying rejection of negative stock deduction',
        category: 'Backend Core'
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
    color: 'border-blue-200 bg-blue-50/50',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    iconBg: 'bg-blue-600',
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
        verification: 'Snapshots queryable with time-series ordering',
        category: 'Database'
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
        verification: 'Emits alert when simulated occupancy reaches 95%',
        category: 'Backend Core'
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
        verification: 'API returns latest snapshot within 50ms',
        category: 'Backend Core'
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
    owner: 'Sarthak',
    ownerRole: 'Team Leader & Lead Architect',
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
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/demand/aggregation.go'],
        verification: 'Produces clean daily demand feature rows from raw transactions',
        category: 'Analytics & ML'
      },
      {
        id: 't-402',
        code: 'TASK-04-02',
        title: 'Baseline 3–7 Day Demand Forecast Engine',
        description:
          'Implement rolling 7-day consumption average: average_daily_demand = sum(7d)/7; forecast_3d = average_daily_demand * 3.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/forecast/baseline.go'],
        verification: 'Unit tests confirm deterministic 3-day and 7-day forecast output',
        category: 'Analytics & ML'
      },
      {
        id: 't-403',
        code: 'TASK-04-03',
        title: 'Days-of-Cover & Shortage Risk Classifier',
        description:
          'Implement days_of_cover = current_stock / max(daily_demand, 1). Classify risk: CRITICAL (<2d), HIGH (<4d), MEDIUM (<7d), LOW (otherwise).',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/risk/classifier.go'],
        verification: 'Correctly classifies 1.5 days cover as CRITICAL risk alert',
        category: 'Analytics & ML'
      },
      {
        id: 't-404',
        code: 'TASK-04-04',
        title: 'Risk Alerts Queue & Reason Codes',
        description:
          'Store alerts in intelligence.risk_alerts with structured reason codes (STOCKOUT_WITHIN_72H, CRITICAL_MEDICINE, RECENT_SURGE).',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/risk/service.go'],
        verification: 'GET /risks returns active prioritized alerts queue',
        category: 'Backend Core'
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
    owner: 'Vaishnavi',
    ownerRole: 'District Officer & Core Domain Lead',
    prdSection: 'PRD §9.1–9.4',
    description:
      'Mathematical redistribution engine calculating safe donor surplus (Stock - Safety Stock - Demand Buffer), computing Haversine distances, and ranking donor facilities with multi-factor scoring.',
    status: 'IN_PROGRESS',
    color: 'border-indigo-200 bg-indigo-50/50',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    iconBg: 'bg-indigo-600',
    tasks: [
      {
        id: 't-501',
        code: 'TASK-05-01',
        title: 'Safe Surplus Mathematical Formula',
        description:
          'Implement PRD §9.2: safe_surplus = current_stock - safety_stock - predicted_demand_buffer. Guarantee donor never becomes unsafe post-transfer.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/redistribution/surplus.go'],
        verification: 'Tests prove donor with 150 units & 100 safety has max 50 surplus',
        category: 'Backend Core'
      },
      {
        id: 't-502',
        code: 'TASK-05-02',
        title: 'Haversine Geographic Proximity Scoring',
        description:
          'Compute real-world road/great-circle distance between donor and recipient facilities in kilometers using latitude/longitude.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'IN_PROGRESS',
        files: ['apps/api/pkg/geo/haversine.go'],
        verification: 'Distance verified between Bhubaneswar and Jatni (approx 22km)',
        category: 'Backend Core'
      },
      {
        id: 't-503',
        code: 'TASK-05-03',
        title: 'Multi-Factor Donor Candidate Scoring Algorithm',
        description:
          'Implement score = 0.40 * surplus + 0.30 * proximity + 0.20 * safety + 0.10 * urgency. Rank eligible donors descending.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/redistribution/scoring.go'],
        verification: 'Weights configurable via backend config without hardcoded values',
        category: 'Backend Core'
      },
      {
        id: 't-504',
        code: 'TASK-05-04',
        title: 'Explainable Transfer Recommendation Generator',
        description:
          'Build recommendation payload showing destination, source, quantity, distance, score, reason codes, and human-readable explanation.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/redistribution/service.go'],
        verification: 'POST /recommendations/generate returns ranked eligible donors',
        category: 'Backend Core'
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
    owner: 'Riya',
    ownerRole: 'Facility Manager & Operations Lead',
    prdSection: 'PRD §9.5, §9.6',
    description:
      'Deterministic transfer state machine (recommended ➔ approved ➔ dispatched ➔ received ➔ completed) with transactional dual-inventory mutations.',
    status: 'IN_PROGRESS',
    color: 'border-teal-200 bg-teal-50/50',
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
    iconBg: 'bg-teal-600',
    tasks: [
      {
        id: 't-601',
        code: 'TASK-06-01',
        title: 'Transfer State Machine Implementation',
        description:
          'Implement finite state machine strictly enforcing: recommended -> approved -> dispatched -> received -> completed (and rejected/cancelled).',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/transfers/state_machine.go'],
        verification: 'Rejects invalid state jumps (e.g. recommended directly to received)',
        category: 'Backend Core'
      },
      {
        id: 't-602',
        code: 'TASK-06-02',
        title: 'Dual-Inventory Atomic Mutation Engine',
        description:
          'On dispatch, deduct quantity from donor inventory inside a DB transaction; on receipt, increment recipient inventory balance transactionally.',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/transfers/service.go'],
        verification: 'ACID transaction test verifies both balances updated atomically',
        category: 'Database'
      },
      {
        id: 't-603',
        code: 'TASK-06-03',
        title: 'Chain-of-Custody & Audit Event Recording',
        description:
          'Record transfer_events on every transition with actor_id, timestamp, vehicle/driver notes, and append to audit.events.',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/transfers/events.go'],
        verification: 'Audit log verifies who approved, dispatched, and received transfer',
        category: 'Security & Auth'
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
    color: 'border-purple-200 bg-purple-50/50',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
    iconBg: 'bg-purple-600',
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
        verification: '19 unit tests passing in transitions_test.go',
        category: 'Backend Core'
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
        verification: 'Due date automatically computed on creation',
        category: 'Backend Core'
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
        category: 'Frontend UI'
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
        verification: 'Opens on row click with comprehensive ticket inspection',
        category: 'Frontend UI'
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
        verification: 'All modal dialogs validate inputs and trigger API mutations cleanly',
        category: 'Frontend UI'
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
    owner: 'Shneanjali',
    ownerRole: 'Logistics Officer & Frontend Lead',
    prdSection: 'PRD §10',
    description:
      'High-level executive KPI summary cards, interactive Leaflet / OpenStreetMap visualization of Odisha healthcare network, color-coded facility risk markers, and facility detail drilldowns.',
    status: 'IN_PROGRESS',
    color: 'border-cyan-200 bg-cyan-50/50',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    iconBg: 'bg-cyan-600',
    tasks: [
      {
        id: 't-801',
        code: 'TASK-08-01',
        title: 'Executive Network KPI Summary Cards',
        description:
          'Build GET /dashboard/summary endpoint returning Active Facilities, Critical Stockouts, Bed Capacity Stress, and Active Transfers.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/dashboard/summary.go'],
        verification: 'Summary endpoint responds with accurate live metrics',
        category: 'Backend Core'
      },
      {
        id: 't-802',
        code: 'TASK-08-02',
        title: 'Leaflet / OpenStreetMap Geographic Risk Map',
        description:
          'Implement interactive map component rendering facility pins color-coded by risk: Red (Critical Stockout/Bed Stress), Orange (High Risk), Green (Safe Surplus Donor).',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'IN_PROGRESS',
        files: ['apps/web/src/features/dashboard/components/FacilityMap.tsx'],
        verification: 'Map renders Odisha PHC coordinates with popup risk cards',
        category: 'Frontend UI'
      },
      {
        id: 't-803',
        code: 'TASK-08-03',
        title: 'Facility 360 Drilldown Page',
        description:
          'Build dedicated facility view displaying inventory balances, capacity snapshot, consumption charts, risk history, and transfer records.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'IN_PROGRESS',
        files: ['apps/web/src/app/facilities/[id]/page.tsx'],
        verification: 'Page renders comprehensive single-facility operational view',
        category: 'Frontend UI'
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
    color: 'border-pink-200 bg-pink-50/50',
    badgeBg: 'bg-pink-100 text-pink-800 border-pink-300',
    iconBg: 'bg-pink-600',
    tasks: [
      {
        id: 't-901',
        code: 'TASK-09-01',
        title: 'PostgreSQL chat Schema & Tables Migration',
        description:
          'Create chat.channels, chat.channel_members, chat.messages tables with indexes in 002_chat_schema.sql.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'COMPLETE',
        files: ['apps/api/db/migrations/002_chat_schema.sql'],
        verification: 'Migration schema specified in task/TASKS.md',
        category: 'Database'
      },
      {
        id: 't-902',
        code: 'TASK-09-02',
        title: 'Real-Time WebSocket Connection Hub & SSE Fallback',
        description:
          'Concurrent-safe connection manager supporting channel broadcast, user broadcast, and auto cleanup.',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/chat/hub.go'],
        verification: 'Hub broadcast verified with multiple concurrent clients',
        category: 'Backend Core'
      },
      {
        id: 't-903',
        code: 'TASK-09-03',
        title: 'Deterministic Domain Tools for AI Copilot',
        description:
          'Builds PRD-compliant tools querying inventory balances, days of cover, capacity, and safe surplus without hallucinations.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/chat/copilot_tools.go'],
        verification: 'Tool returns exact stock matching PostgreSQL database',
        category: 'Integration & Seed'
      },
      {
        id: 't-904',
        code: 'TASK-09-04',
        title: 'Interactive Chat UI, Channel Sidebar & Message Feed',
        description:
          'Next.js components: ChannelList, MessageFeed with role badges, MessageComposer, and Copilot quick chips.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'IN_PROGRESS',
        files: ['apps/web/src/features/chat/components/MessageFeed.tsx'],
        verification: 'Responsive chat interface renders at /chat route',
        category: 'Frontend UI'
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
    color: 'border-yellow-200 bg-yellow-50/50',
    badgeBg: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    iconBg: 'bg-yellow-600',
    tasks: [
      {
        id: 't-1001',
        code: 'TASK-10-01',
        title: 'robfig/cron In-Process Background Scheduler',
        description:
          'Configure Go background scheduler in cmd/server/main.go executing periodic jobs with graceful cancellation.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/scheduler/cron.go'],
        verification: 'Scheduler boots cleanly with server and runs test tick',
        category: 'Backend Core'
      },
      {
        id: 't-1002',
        code: 'TASK-10-02',
        title: 'Automated Demand, Forecast & Risk Refresh Jobs',
        description:
          'Automate midnight demand aggregation, forecast horizon projection, and risk alert recalculation.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/scheduler/jobs.go'],
        verification: 'Job triggers demand aggregation and refreshes risk queue',
        category: 'Backend Core'
      },
      {
        id: 't-1003',
        code: 'TASK-10-03',
        title: 'Comprehensive Odisha 15-Facility Realistic Seed Dataset',
        description:
          'Realistic database records representing 15 facilities (Bhubaneswar, Khurda, Jatni, Pipili), 30 medicines, and 60-day consumption trends.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'IN_PROGRESS',
        files: ['scripts/seed/seed_full_demo.sql'],
        verification: '5–7 minute judging storyboard executes cleanly from seed data',
        category: 'Integration & Seed'
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
    epics: ['EPIC-01', 'EPIC-04', 'EPIC-09', 'EPIC-10'],
    epicTitles: [
      'Foundation, Auth & Database Infrastructure',
      'Demand Aggregation, Forecasting & Shortage Risk Engine',
      'Operational Collaboration & AI Resource Copilot Chat',
      'Automated Background Scheduler & Realistic Demo Dataset'
    ],
    summary:
      'Architects multi-schema PostgreSQL foundation, JWT authentication, short-term demand forecasting, AI Copilot query engine, background cron scheduler, and system orchestration.'
  },
  {
    name: 'Vaishnavi',
    role: 'District Officer & Core Domain Lead',
    systemRole: 'District Officer (Khurda District)',
    avatar: '📋',
    color: 'from-amber-500 to-yellow-600',
    borderColor: 'border-amber-200',
    bgBadge: 'bg-amber-50 text-amber-800 border-amber-200',
    epics: ['EPIC-02', 'EPIC-05'],
    epicTitles: [
      'Medicine Catalog & Operational Inventory Ledger',
      'Safe Surplus Redistribution & Scoring Engine'
    ],
    summary:
      'Engineers medicine master catalog, immutable inventory transaction ledger, negative stock invariant, safe surplus formula, and multi-factor donor ranking algorithm.'
  },
  {
    name: 'Riya',
    role: 'Facility Manager & Operations Lead',
    systemRole: 'Facility Manager (Capital Hospital)',
    avatar: '🏥',
    color: 'from-blue-500 to-cyan-600',
    borderColor: 'border-blue-200',
    bgBadge: 'bg-blue-50 text-blue-800 border-blue-200',
    epics: ['EPIC-03', 'EPIC-06'],
    epicTitles: [
      'Bed & Workforce Capacity Monitoring',
      'Transfer Lifecycle & Dual-Inventory Execution'
    ],
    summary:
      'Engineers time-series bed occupancy snapshots, capacity stress alerts, transfer state machine (recommended -> approved -> dispatched -> received), and atomic dual-inventory updates.'
  },
  {
    name: 'Shneanjali',
    role: 'Logistics Officer & Frontend Lead',
    systemRole: 'Logistics Officer (State Medical Depot)',
    avatar: '🚚',
    color: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-200',
    bgBadge: 'bg-purple-50 text-purple-800 border-purple-200',
    epics: ['EPIC-07', 'EPIC-08'],
    epicTitles: [
      'Operational Work Queue & Task Management System',
      'Executive Dashboard & Leaflet Geographic Risk Map'
    ],
    summary:
      'Develops Next.js operational work queue, slide-over detail drawer, action dialog modals, executive KPI summary cards, and interactive Leaflet / OSM geographic facility risk map.'
  }
];

export function EpicsBoardPage() {
  const [viewMode, setViewMode] = useState<'by-epic' | 'by-member' | 'matrix'>('by-epic');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETE' | 'IN_PROGRESS' | 'BACKLOG'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null);

  // Flatten all tasks
  const allTasks = useMemo(() => {
    return EPICS_DATA.flatMap((epic) =>
      epic.tasks.map((task) => ({
        ...task,
        epicCode: epic.code,
        epicTitle: epic.title,
        epicBadgeBg: epic.badgeBg
      }))
    );
  }, []);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return allTasks.filter((t) => {
      // Status filter
      if (statusFilter !== 'ALL' && t.status !== statusFilter) {
        return false;
      }
      // Epic filter
      if (selectedEpicId && !t.epicCode.toLowerCase().includes(selectedEpicId.toLowerCase())) {
        return false;
      }
      // Search filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          t.code.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.assignee.toLowerCase().includes(q) ||
          t.epicTitle.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.files.some((f) => f.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [allTasks, statusFilter, selectedEpicId, searchQuery]);

  // Overall Statistics
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.status === 'COMPLETE').length;
  const inProgressTasks = allTasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const backlogTasks = allTasks.filter((t) => t.status === 'BACKLOG').length;
  const completedEpics = EPICS_DATA.filter((e) => e.status === 'COMPLETE').length;
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Banner / Hero */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white pt-10 pb-12 px-6 shadow-inner">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>BRICS Smart Health PRD Specification • 10 Epics Architecture</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                ArogyaGrid PRD 10-Epics Architecture Board
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
                Complete engineering breakdown of all <strong className="text-white font-bold">10 PRD Epics</strong> and{' '}
                <strong className="text-white font-bold">{totalTasks} Itemized Tasks</strong> distributed across our 4 team members:
                <strong className="text-white font-semibold"> Sarthak</strong> (Lead),
                <strong className="text-white font-semibold"> Vaishnavi</strong> (District),
                <strong className="text-white font-semibold"> Riya</strong> (Facility), and
                <strong className="text-white font-semibold"> Shneanjali</strong> (Logistics).
              </p>
            </div>

            {/* Quick Action Button to Work Queue */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-md transition-all hover:scale-105"
              >
                <span>Operational Work Queue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="https://github.com/Sarthak702-droid/Swasthya/pull/1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition"
              >
                <GitPullRequest className="w-4 h-4 text-emerald-400" />
                <span>GitHub PR #1</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Metric Badges Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-700/60">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Total PRD Epics</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{EPICS_DATA.length}</span>
                <span className="text-[11px] text-teal-300 font-semibold">Full PRD Scope</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Completed Epics</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-400">{completedEpics} / {EPICS_DATA.length}</span>
                <span className="text-[11px] text-emerald-300 font-semibold">Verified Live</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Active / Roadmap</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-amber-400">{EPICS_DATA.length - completedEpics}</span>
                <span className="text-[11px] text-amber-300 font-semibold">In Progress</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Itemized Tasks</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{totalTasks}</span>
                <span className="text-[11px] text-slate-300 font-semibold">{completedTasks} Done</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Go Unit Tests</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-400">19 / 19</span>
                <span className="text-[11px] text-emerald-300 font-semibold">100% Passing</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Core Schemas</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-cyan-300">6</span>
                <span className="text-[11px] text-cyan-200 font-semibold">iam/core/inv/cap/work</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Navigation / Filter Controls */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold">
              <button
                onClick={() => setViewMode('by-epic')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                  viewMode === 'by-epic'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4 text-teal-600" />
                <span>Group by Epic ({EPICS_DATA.length})</span>
              </button>

              <button
                onClick={() => setViewMode('by-member')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                  viewMode === 'by-member'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Group by Member ({TEAM_ROSTER.length})</span>
              </button>

              <button
                onClick={() => setViewMode('matrix')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                  viewMode === 'matrix'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Filter className="w-4 h-4 text-amber-600" />
                <span>All Tasks Matrix ({filteredTasks.length})</span>
              </button>
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status:</span>
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  statusFilter === 'ALL'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                All ({totalTasks})
              </button>

              <button
                onClick={() => setStatusFilter('COMPLETE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  statusFilter === 'COMPLETE'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Complete ({completedTasks})</span>
              </button>

              <button
                onClick={() => setStatusFilter('IN_PROGRESS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  statusFilter === 'IN_PROGRESS'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Active ({inProgressTasks})</span>
              </button>
            </div>
          </div>

          {/* Search bar & quick filters */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all 10 Epics by keyword (e.g. Inventory, Safe Surplus, Forecast, Bed, Chat, Sarthak, TASK-04-02)..."
              className="pl-10 h-10 bg-slate-50 border-slate-200 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700 bg-slate-200 px-2 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {/* =================================================================== */}
        {/* VIEW MODE 1: GROUP BY EPIC (ALL 10 EPICS) */}
        {/* =================================================================== */}
        {viewMode === 'by-epic' && (
          <div className="space-y-8">
            {EPICS_DATA.map((epic) => {
              const epicMatchingTasks = epic.tasks.filter((t) => {
                if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
                if (searchQuery.trim() !== '') {
                  const q = searchQuery.toLowerCase();
                  return (
                    t.code.toLowerCase().includes(q) ||
                    t.title.toLowerCase().includes(q) ||
                    t.description.toLowerCase().includes(q) ||
                    t.assignee.toLowerCase().includes(q) ||
                    t.category.toLowerCase().includes(q) ||
                    epic.code.toLowerCase().includes(q) ||
                    epic.title.toLowerCase().includes(q) ||
                    t.files.some((f) => f.toLowerCase().includes(q))
                  );
                }
                return true;
              });

              const isComplete = epic.status === 'COMPLETE';
              const progressRatio = Math.round(
                (epic.tasks.filter((t) => t.status === 'COMPLETE').length / epic.tasks.length) * 100
              );

              return (
                <div
                  key={epic.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-slate-300"
                >
                  {/* Epic Header Card */}
                  <div className="p-6 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono text-xs font-bold tracking-wider">
                            {epic.code}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1.5 ${
                              isComplete
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}
                          >
                            {isComplete ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                            )}
                            <span>{epic.status}</span>
                          </span>
                          <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-semibold">
                            {epic.prdSection}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {epic.tasks.length} itemized tasks
                          </span>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                          {epic.title}
                        </h2>

                        <p className="text-sm text-slate-600 max-w-4xl leading-relaxed">
                          {epic.description}
                        </p>
                      </div>

                      {/* Owner Profile Badge */}
                      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-xl">
                          {epic.owner === 'Sarthak' ? '👑' : epic.owner === 'Vaishnavi' ? '📋' : epic.owner === 'Riya' ? '🏥' : '🚚'}
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Lead Owner</span>
                          <span className="font-bold text-slate-900 text-sm block">
                            {epic.owner}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            {epic.ownerRole}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-4">
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            isComplete ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${progressRatio}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
                        {progressRatio}% ({epic.tasks.filter((t) => t.status === 'COMPLETE').length}/{epic.tasks.length} Tasks)
                      </span>
                    </div>
                  </div>

                  {/* Task List Under This Epic */}
                  <div className="p-6 divide-y divide-slate-100">
                    {epicMatchingTasks.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-sm">
                        No tasks match current filter.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {epicMatchingTasks.map((task) => (
                          <div
                            key={task.id}
                            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 transition-all space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                                  {task.code}
                                </span>
                                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                                  {task.title}
                                </h3>
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                                  {task.category}
                                </span>
                              </div>

                              {/* Task Status Badge */}
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 border ${
                                    task.status === 'COMPLETE'
                                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                      : task.status === 'IN_PROGRESS'
                                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                                      : 'bg-slate-100 text-slate-700 border-slate-300'
                                  }`}
                                >
                                  {task.status === 'COMPLETE' ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  )}
                                  <span>{task.status}</span>
                                </span>
                              </div>
                            </div>

                            {/* Task Description */}
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                              {task.description}
                            </p>

                            {/* Code Artifacts & Verification */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                              <div className="flex items-start gap-1.5">
                                <FileCode2 className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                                <div className="space-y-0.5">
                                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                                    Deliverable Code Files:
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {task.files.map((file, idx) => (
                                      <code
                                        key={idx}
                                        className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800"
                                      >
                                        {file}
                                      </code>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-start gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                <div className="space-y-0.5">
                                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                                    Verification & Quality Gate:
                                  </span>
                                  <span className="text-slate-700 font-medium text-xs">
                                    {task.verification}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW MODE 2: GROUP BY TEAM MEMBER (4 MEMBERS) */}
        {/* =================================================================== */}
        {viewMode === 'by-member' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEAM_ROSTER.map((member) => {
              const memberTasks = allTasks.filter((t) => t.assignee === member.name);
              const completedCount = memberTasks.filter((t) => t.status === 'COMPLETE').length;
              const ratio = memberTasks.length > 0 ? Math.round((completedCount / memberTasks.length) * 100) : 0;

              return (
                <div
                  key={member.name}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl shadow-sm">
                            {member.avatar}
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-slate-900">{member.name}</h2>
                            <p className="text-xs font-semibold text-slate-500">{member.role}</p>
                            <span className="text-[11px] text-teal-700 font-medium block mt-0.5">
                              {member.systemRole}
                            </span>
                          </div>
                        </div>

                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {completedCount}/{memberTasks.length} Tasks Done
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                        {member.summary}
                      </p>

                      {/* Assigned Epics */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                          Assigned Epics ({member.epics.length}):
                        </span>
                        {member.epics.map((code) => (
                          <span
                            key={code}
                            className="text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white font-mono"
                          >
                            {code}
                          </span>
                        ))}
                      </div>

                      {/* Progress */}
                      <div className="mt-4">
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${ratio}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[11px] font-semibold text-slate-500 mt-1.5">
                          <span>Progress: {ratio}%</span>
                          <span className="text-emerald-600">✓ In Active Build</span>
                        </div>
                      </div>
                    </div>

                    {/* Task Checklist for this member */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Itemized Tasks Assigned ({memberTasks.length}):
                      </h3>

                      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                        {memberTasks.map((t) => (
                          <div
                            key={t.id}
                            className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-slate-700">{t.code}</span>
                                <span className="text-slate-300">•</span>
                                <span className="font-semibold text-slate-900">{t.title}</span>
                              </div>
                              <p className="text-slate-500 line-clamp-2 text-[11px]">
                                {t.description}
                              </p>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                                t.status === 'COMPLETE'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {t.status === 'COMPLETE' ? '✓ Done' : '⚡ Active'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                    <span className="text-xs text-slate-500">
                      Ownership verified in repository branch <code className="font-mono font-semibold">feature/arogyagrid-epic-work-item-system</code>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW MODE 3: ALL TASKS MATRIX (10 EPICS AUDIT) */}
        {/* =================================================================== */}
        {viewMode === 'matrix' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Full 10-Epics Tasks Audit Matrix ({filteredTasks.length} Tasks)
                </h2>
                <p className="text-xs text-slate-500">
                  Complete list of all deliverables, files, verification tests, and team assignments across all 10 PRD Epics.
                </p>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded bg-teal-100 text-teal-800 border border-teal-300">
                100% PRD Coverage Matrix
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Task Code</th>
                    <th className="py-3 px-4">Epic</th>
                    <th className="py-3 px-4">Title & Details</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Deliverable File</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredTasks.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {t.code}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border">
                          {t.epicCode}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-bold text-slate-900">{t.title}</div>
                        <p className="text-slate-500 text-[11px] line-clamp-2 mt-0.5">
                          {t.description}
                        </p>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{t.assignee}</div>
                        <div className="text-[10px] text-slate-400">{t.assigneeRole}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {t.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[11px] flex items-center gap-1 w-fit ${
                            t.status === 'COMPLETE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {t.status === 'COMPLETE' ? <Check className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                          <span>{t.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate font-mono text-[11px] text-slate-600">
                        {t.files[0]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bottom Banner: Transition to Work Queue */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6 border border-teal-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-teal-950 text-base">
              Ready to see the operational work items running live?
            </h3>
            <p className="text-xs text-teal-800">
              The operational work queue demonstrates this architecture running against real-world Odisha PHC emergency alerts.
            </p>
          </div>

          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition shrink-0"
          >
            <span>Open Operational Work Queue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
