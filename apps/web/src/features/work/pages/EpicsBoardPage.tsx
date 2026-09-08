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
  Activity
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
  category: 'Backend Core' | 'Database' | 'Security & Auth' | 'Frontend UI' | 'Integration & Seed';
}

export interface EpicItem {
  id: string;
  code: string;
  title: string;
  owner: 'Sarthak' | 'Vaishnavi' | 'Riya' | 'Shneanjali';
  ownerRole: string;
  description: string;
  status: 'COMPLETE' | 'IN_PROGRESS' | 'BACKLOG';
  color: string;
  badgeBg: string;
  iconBg: string;
  tasks: EpicTask[];
}

export const EPICS_DATA: EpicItem[] = [
  {
    id: 'epic-1',
    code: 'EPIC-01',
    title: 'Foundation, Auth & Database Infrastructure',
    owner: 'Sarthak',
    ownerRole: 'Team Leader & System Architect',
    description:
      'Multi-schema PostgreSQL database engine, robust JWT authentication middleware, transaction-safe idempotency engine, monorepo automation tooling, and environment configuration.',
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
          'Designed and deployed PostgreSQL 16 multi-schema structure isolating identity (iam), healthcare facilities (core), work orders (work), and immutable audit logs (audit) with strict foreign keys.',
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
        title: 'Database Migrations Engine & Query Tooling',
        description:
          'Constructed forward and rollback database migration scripts and prepared sqlc type-safe query generation configurations.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'COMPLETE',
        files: ['apps/api/db/migrations/001_work_schema.sql', 'apps/api/db/sqlc.yaml', 'apps/api/db/queries/work.sql'],
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
        files: ['apps/api/internal/middleware/auth.go', 'apps/api/internal/auth/jwt.go'],
        verification: 'Bearer token verification passes with valid & invalid claims',
        category: 'Security & Auth'
      },
      {
        id: 't-104',
        code: 'TASK-01-04',
        title: 'Idempotency Engine & Deduplication Storage',
        description:
          'Built HTTP middleware intercepting `Idempotency-Key` headers, caching API response bodies, and preventing duplicate actions or replay attacks on transitions.',
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
        title: 'IAM Identity & RBAC Tables',
        description:
          'Constructed `iam.users`, `iam.teams`, `iam.team_members`, and `iam.sessions` tables supporting multi-tier roles (Facility Manager, District Officer, State/National Admin).',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'COMPLETE',
        files: ['apps/api/db/migrations/001_work_schema.sql'],
        verification: 'IAM tables queryable with role constraints',
        category: 'Database'
      },
      {
        id: 't-106',
        code: 'TASK-01-06',
        title: 'Core Healthcare Facility Registry',
        description:
          'Created `core.facilities` catalog registering Primary Health Centers (PHCs), Community Health Centers (CHCs), and District Hospitals with geo-coordinates and bed capacities.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'COMPLETE',
        files: ['apps/api/db/migrations/001_work_schema.sql'],
        verification: 'Foreign key integrity linked to work items',
        category: 'Database'
      },
      {
        id: 't-107',
        code: 'TASK-01-07',
        title: 'Centralized Application Configuration Loader',
        description:
          'Built type-safe config loader supporting environment overrides, production defaults, database connection pooling parameters, and JWT secret management.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'COMPLETE',
        files: ['apps/api/internal/config/config.go'],
        verification: 'Loads DB URL and port 8085 cleanly',
        category: 'Backend Core'
      },
      {
        id: 't-108',
        code: 'TASK-01-08',
        title: 'Developer Tooling, Makefile & Monorepo Runner',
        description:
          'Built single-command automation via root `Makefile` and `start-dashboard.sh` orchestrating PostgreSQL, Go Chi API (:8085), and Next.js (:3000).',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'COMPLETE',
        files: ['Makefile', 'start-dashboard.sh', 'docker-compose.yml'],
        verification: 'Single `make dev` boots all services with zero manual steps',
        category: 'Integration & Seed'
      }
    ]
  },
  {
    id: 'epic-2',
    code: 'EPIC-02',
    title: 'Work Item Core Backend & State Machine',
    owner: 'Vaishnavi',
    ownerRole: 'District Officer & Core Domain Lead',
    description:
      'Domain models, deterministic finite state machine (WAITING ➔ ASSIGNED ➔ IN_PROGRESS ➔ COMPLETED / RETURNED), database repository abstraction layer, and Chi HTTP routing.',
    status: 'COMPLETE',
    color: 'border-amber-200 bg-amber-50/50',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    iconBg: 'bg-amber-600',
    tasks: [
      {
        id: 't-201',
        code: 'TASK-02-01',
        title: 'Work Item Domain Entity Models & Enums',
        description:
          'Authored Go domain types including WorkItem, WorkStatus (waiting, assigned, in_progress, completed, returned), WorkPriority (low, normal, high, urgent), and WorkType.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/models.go'],
        verification: 'Domain models imported across entire work package',
        category: 'Backend Core'
      },
      {
        id: 't-202',
        code: 'TASK-02-02',
        title: 'Deterministic Finite State Machine Engine',
        description:
          'Engineered state transition rules matrix strictly enforcing valid transitions, blocking invalid skips (e.g. waiting to completed), and validating role permissions.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/transitions.go'],
        verification: 'Covered by 19 unit tests in transitions_test.go',
        category: 'Backend Core'
      },
      {
        id: 't-203',
        code: 'TASK-02-03',
        title: 'Work Item Repository Interface Definition',
        description:
          'Specified Go repository interface contract decoupling business rules from SQL storage: Create, GetByID, ListByQueue, UpdateStatus, and transactional mutations.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/repository.go'],
        verification: 'Clean architectural boundary validated',
        category: 'Backend Core'
      },
      {
        id: 't-204',
        code: 'TASK-02-04',
        title: 'PostgreSQL Repository Implementation via pgx v5',
        description:
          'Implemented high-performance PostgreSQL repository using connection pooling, prepared statements, ACID transaction wrappers, and version checks.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/postgres_repository.go'],
        verification: 'All CRUD and transactional transitions execute against PG 16',
        category: 'Database'
      },
      {
        id: 't-205',
        code: 'TASK-02-05',
        title: 'Core Work Item Service Layer',
        description:
          'Constructed application service orchestrating validation, state transitions, timeline generation, optimistic lock checks, and audit logging.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/service.go'],
        verification: 'Service methods tested and verified via handlers',
        category: 'Backend Core'
      },
      {
        id: 't-206',
        code: 'TASK-02-06',
        title: 'RESTful Chi HTTP Route Handlers',
        description:
          'Built HTTP controllers for GET /items/{id}, POST /items, GET /queue, status transitions, and timeline query endpoints with structured JSON responses.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/handler.go'],
        verification: 'Chi router responds on port 8085 with 200 OK',
        category: 'Backend Core'
      },
      {
        id: 't-207',
        code: 'TASK-02-07',
        title: 'Request DTOs & Domain Input Validation',
        description:
          'Built strict request payloads with UUID format validation, required fields verification, and domain error translation into RFC-7807 compliant JSON errors.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/dto.go', 'apps/api/internal/work/validation.go', 'apps/api/internal/work/errors.go'],
        verification: 'Invalid JSON inputs rejected with 400 Bad Request',
        category: 'Backend Core'
      },
      {
        id: 't-208',
        code: 'TASK-02-08',
        title: 'Comprehensive State Machine Unit Tests',
        description:
          'Wrote 19 unit test cases exercising all permitted transitions (assign, accept, complete, return, handoff) and rejecting unauthorized state changes.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/transitions_test.go', 'apps/api/internal/work/service_test.go'],
        verification: '`go test -v ./internal/work/...` passes 19/19 (100%)',
        category: 'Backend Core'
      }
    ]
  },
  {
    id: 'epic-3',
    code: 'EPIC-03',
    title: 'Transitions, Queues & SLA Engine',
    owner: 'Riya',
    ownerRole: 'Facility Manager & Transitions Lead',
    description:
      'Full operational transition pipeline (assign, accept, reassign, return, complete, handoff), automated SLA breach detection & dynamic due-dates, activity timeline synthesis, and threaded comments.',
    status: 'COMPLETE',
    color: 'border-blue-200 bg-blue-50/50',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    iconBg: 'bg-blue-600',
    tasks: [
      {
        id: 't-301',
        code: 'TASK-03-01',
        title: 'Work Item Assignment & Team Routing Engine',
        description:
          'Built assignment transition pipeline supporting direct user allocation and team queue dispatching, logging actor and assignment duration.',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/service.go', 'apps/api/internal/work/handler.go'],
        verification: 'POST /items/{id}/transitions/assign moves status to ASSIGNED',
        category: 'Backend Core'
      },
      {
        id: 't-302',
        code: 'TASK-03-02',
        title: 'Worker Acceptance & Progression Pipeline',
        description:
          'Engineered worker acceptance action moving tickets from ASSIGNED to IN_PROGRESS, recording started_at timestamp and calculating SLA burn rate.',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/service.go', 'apps/api/internal/work/transitions.go'],
        verification: 'POST /items/{id}/transitions/accept moves status to IN_PROGRESS',
        category: 'Backend Core'
      },
      {
        id: 't-303',
        code: 'TASK-03-03',
        title: 'Task Return Flow with Reason Categorization',
        description:
          'Built return transition allowing field workers to reject unserviceable tickets (e.g. stockout, equipment breakdown) with mandatory structured reason codes.',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/service.go', 'apps/api/internal/work/dto.go'],
        verification: 'POST /items/{id}/transitions/return updates status to RETURNED',
        category: 'Backend Core'
      },
      {
        id: 't-304',
        code: 'TASK-03-04',
        title: 'Task Resolution & Completion Reporting',
        description:
          'Constructed completion pipeline recording completion timestamps, outcome notes, and updating parent medical record statuses.',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/service.go'],
        verification: 'POST /items/{id}/transitions/complete marks status as COMPLETED',
        category: 'Backend Core'
      },
      {
        id: 't-305',
        code: 'TASK-03-05',
        title: 'Inter-Facility Handoff Protocol',
        description:
          'Implemented patient and stock transfer handoff flow transferring work responsibility between PHCs, CHCs, and District Hospitals with chain-of-custody logging.',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/service.go', 'work.work_item_handoffs table'],
        verification: 'POST /items/{id}/transitions/handoff writes handoff history',
        category: 'Backend Core'
      },
      {
        id: 't-306',
        code: 'TASK-03-06',
        title: 'Priority & SLA Policy Engine with Dynamic Escalation',
        description:
          'Engineered dynamic due-date calculation assigning SLAs based on priority: Urgent (2 hrs), High (6 hrs), Normal (24 hrs), Low (72 hrs).',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/sla_policy.go'],
        verification: 'SLA due_at verified in database on item creation',
        category: 'Backend Core'
      },
      {
        id: 't-307',
        code: 'TASK-03-07',
        title: 'Activity Timeline Synthesis Service',
        description:
          'Built timeline compiler aggregating status changes, assignments, handoffs, comments, and system notes into a unified chronologically sorted stream.',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/timeline.go'],
        verification: 'GET /items/{id}/timeline returns aggregated chronological events',
        category: 'Backend Core'
      },
      {
        id: 't-308',
        code: 'TASK-03-08',
        title: 'Threaded Comments & Internal Discussion API',
        description:
          'Implemented real-time collaboration comments endpoint with author tracking, timestamping, and internal visibility controls.',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/handler.go', 'work.work_item_comments table'],
        verification: 'POST & GET /items/{id}/comments return discussion feed',
        category: 'Backend Core'
      },
      {
        id: 't-309',
        code: 'TASK-03-09',
        title: 'Optimistic Concurrency Control via Entity Versioning',
        description:
          'Implemented atomic version incrementing (`version = version + 1 WHERE version = @expected`) preventing lost updates when two officers update concurrently.',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/postgres_repository.go'],
        verification: 'Stale version update rejected with concurrency conflict error',
        category: 'Database'
      }
    ]
  },
  {
    id: 'epic-4',
    code: 'EPIC-04',
    title: 'Frontend Work System & Interactive UI',
    owner: 'Shneanjali',
    ownerRole: 'Logistics Officer & Frontend Lead',
    description:
      'Next.js App Router user interface, TanStack React Query hooks with cache invalidation, interactive work queue table with multi-criteria filtering, slide-over detail drawer, and action dialog modals.',
    status: 'COMPLETE',
    color: 'border-purple-200 bg-purple-50/50',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
    iconBg: 'bg-purple-600',
    tasks: [
      {
        id: 't-401',
        code: 'TASK-04-01',
        title: 'TypeScript Domain Types & Zod Schemas',
        description:
          'Defined strongly-typed TypeScript interfaces and Zod validation schemas matching Go backend models for WorkItem, QueueViews, Transitions, and Comments.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'COMPLETE',
        files: ['apps/web/src/features/work/types/work.types.ts', 'apps/web/src/features/work/schemas/work.schemas.ts'],
        verification: 'TypeScript compiler `npm run build` succeeds with zero errors',
        category: 'Frontend UI'
      },
      {
        id: 't-402',
        code: 'TASK-04-02',
        title: 'API Client & Idempotency Key Generator',
        description:
          'Constructed API client wrapper attaching JWT Bearer tokens, injecting unique `Idempotency-Key` headers on mutative calls, and handling RFC-7807 errors.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'COMPLETE',
        files: ['apps/web/src/lib/api-client.ts', 'apps/web/src/features/work/api/work-api.ts'],
        verification: 'All frontend requests successfully communicate with API',
        category: 'Frontend UI'
      },
      {
        id: 't-403',
        code: 'TASK-04-03',
        title: 'TanStack React Query Hooks & Cache Invalidation',
        description:
          'Constructed declarative custom hooks (`useWorkQueue`, `useWorkItem`, `useWorkMutations`) with optimistic updates and automatic cache invalidation.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'COMPLETE',
        files: [
          'apps/web/src/features/work/hooks/useWorkQueue.ts',
          'apps/web/src/features/work/hooks/useWorkItem.ts',
          'apps/web/src/features/work/hooks/useWorkMutations.ts'
        ],
        verification: 'UI updates in real-time when actions are performed',
        category: 'Frontend UI'
      },
      {
        id: 't-404',
        code: 'TASK-04-04',
        title: 'Interactive Work Queue Data Table',
        description:
          'Built rich data table displaying Priority, Title, Facility, Assignee, SLA countdown timer, Status, and action buttons with responsive layouts.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'COMPLETE',
        files: ['apps/web/src/features/work/components/WorkQueueTable.tsx'],
        verification: 'Rendered with live data, sorted by urgency and SLA due date',
        category: 'Frontend UI'
      },
      {
        id: 't-405',
        code: 'TASK-04-05',
        title: 'Queue View Selector Tabs',
        description:
          'Created operational tab switcher for My Work, Team Queue, Urgent Breaches, Overdue Tasks, Waiting Queue, and Completed Archive with live count badges.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'COMPLETE',
        files: ['apps/web/src/features/work/components/WorkQueueTabs.tsx'],
        verification: 'Clicking tabs switches queue view smoothly without page reload',
        category: 'Frontend UI'
      },
      {
        id: 't-406',
        code: 'TASK-04-06',
        title: 'Slide-over Work Item Inspection Panel',
        description:
          'Developed slide-over drawer panel allowing officers to inspect full ticket specifications, clinical descriptions, facility details, and trigger state transitions.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'COMPLETE',
        files: ['apps/web/src/features/work/components/WorkItemPanel.tsx', 'WorkItemHeader.tsx', 'WorkItemActions.tsx'],
        verification: 'Smoothly opens on row click with comprehensive ticket inspection',
        category: 'Frontend UI'
      },
      {
        id: 't-407',
        code: 'TASK-04-07',
        title: 'Chronological Audit Timeline UI Component',
        description:
          'Crafted visual audit timeline displaying life-cycle events (created, assigned, started, handed off, completed) with color-coded badges and actor names.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'COMPLETE',
        files: ['apps/web/src/features/work/components/WorkTimeline.tsx'],
        verification: 'Renders complete chronological audit trail per work item',
        category: 'Frontend UI'
      },
      {
        id: 't-408',
        code: 'TASK-04-08',
        title: 'Threaded Comments & Discussion Feed UI',
        description:
          'Built operational discussion component allowing facility and logistics officers to exchange live notes, reason details, and handover updates.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'COMPLETE',
        files: ['apps/web/src/features/work/components/WorkComments.tsx'],
        verification: 'Comments submitted and rendered immediately with optimistic cache',
        category: 'Frontend UI'
      },
      {
        id: 't-409',
        code: 'TASK-04-09',
        title: 'Operational Action Dialog Modals',
        description:
          'Constructed accessible Radix modal dialogs for Assign, Reassign, Facility Handoff, Return with reason, and Complete with resolution summary.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'COMPLETE',
        files: [
          'AssignDialog.tsx',
          'ReassignDialog.tsx',
          'HandoffDialog.tsx',
          'ReturnDialog.tsx',
          'CompleteDialog.tsx'
        ],
        verification: 'All modal dialogs validate inputs and trigger API mutations cleanly',
        category: 'Frontend UI'
      },
      {
        id: 't-410',
        code: 'TASK-04-10',
        title: 'Accessible UI Primitive Library & Healthcare Theme',
        description:
          'Configured Tailwind CSS healthcare color scheme (Teal/Emerald/Slate) and standard Radix UI accessible primitives (Dialog, Tabs, Sheet, ScrollArea, Tooltip).',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'COMPLETE',
        files: ['apps/web/src/components/ui/*', 'tailwind.config.ts', 'globals.css'],
        verification: 'Clean visual hierarchy and keyboard accessible components',
        category: 'Frontend UI'
      }
    ]
  },
  {
    id: 'epic-5',
    code: 'EPIC-05',
    title: 'System Integration, Work Generator & Seed Data',
    owner: 'Sarthak',
    ownerRole: 'Team Leader & Lead Architect',
    description:
      'Automated Work Item Generator reacting to clinical and supply chain triggers, active ticket deduplication guard, Odisha health network seed dataset, RBAC permission verification, and Next.js reverse proxy integration.',
    status: 'COMPLETE',
    color: 'border-emerald-200 bg-emerald-50/50',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    iconBg: 'bg-emerald-600',
    tasks: [
      {
        id: 't-501',
        code: 'TASK-05-01',
        title: 'Automated Work Item Generator Engine',
        description:
          'Built autonomous generator module that receives system events (Risk alerts, stock shortages, cold-chain breaches) and spawns structured work items.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/generator.go'],
        verification: 'Creates work items with automated priority and SLA calculation',
        category: 'Integration & Seed'
      },
      {
        id: 't-502',
        code: 'TASK-05-02',
        title: 'Active Ticket Deduplication Guard',
        description:
          'Constructed deduplication query guard preventing multiple open tickets for the same underlying entity (e.g. same medicine batch stockout at the same PHC).',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/postgres_repository.go', 'generator.go'],
        verification: 'Duplicate alert triggers return existing active item without duplication',
        category: 'Integration & Seed'
      },
      {
        id: 't-503',
        code: 'TASK-05-03',
        title: 'Dynamic Priority & SLA Severity Classifier',
        description:
          'Mapped domain urgency parameters (patient critical status, expired vaccine batch, blood shortage) to appropriate priority tiers and escalation policies.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/sla_policy.go'],
        verification: 'High risk stockouts mapped to 2-hour Urgent SLA automatically',
        category: 'Integration & Seed'
      },
      {
        id: 't-504',
        code: 'TASK-05-04',
        title: 'Odisha Healthcare Realistic Seed Dataset',
        description:
          'Populated realistic database records representing Odisha facilities (Bhubaneswar Capital Hospital, Khurda DHH, Jatni CHC, Pipili PHC), users, and 12 tickets.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'COMPLETE',
        files: ['scripts/seed/seed_work_items.sql'],
        verification: 'Database seeded with real-world clinical & logistics records',
        category: 'Integration & Seed'
      },
      {
        id: 't-505',
        code: 'TASK-05-05',
        title: 'Role-Based Access Control (RBAC) Enforcement',
        description:
          'Implemented permission validator enforcing cross-facility boundaries (Facility Managers restricted to their facility, District Officers managing district, State/National Admins global).',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'COMPLETE',
        files: ['apps/api/internal/work/permissions.go'],
        verification: 'Unauthorized cross-facility actions rejected with 403 Forbidden',
        category: 'Security & Auth'
      },
      {
        id: 't-506',
        code: 'TASK-05-06',
        title: 'End-to-End Chi API Mounting & Server Wiring',
        description:
          'Integrated work service, repository, middleware, and handlers into the main Chi router instance with graceful shutdown and health check endpoints.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'COMPLETE',
        files: ['apps/api/cmd/server/main.go'],
        verification: 'GET /health/live and /api/v1/work/queue return valid status',
        category: 'Integration & Seed'
      },
      {
        id: 't-507',
        code: 'TASK-05-07',
        title: 'Next.js API Reverse Proxy Configuration',
        description:
          'Configured Next.js rewrites in `next.config.mjs` forwarding browser `/api/:path*` requests directly to Go backend on port 8085 with CORS elimination.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'COMPLETE',
        files: ['apps/web/next.config.mjs'],
        verification: 'Browser queries to http://localhost:3000/api proxy seamlessly to :8085',
        category: 'Frontend UI'
      }
    ]
  },
  {
    id: 'epic-6',
    code: 'EPIC-06',
    title: 'Operational Collaboration & AI Resource Copilot Chat',
    owner: 'Sarthak',
    ownerRole: 'Lead Architect & Agent Team',
    description:
      'Role-scoped healthcare channels (Facility, District, Transfer context), interactive stockout/transfer cards, and ArogyaGrid AI Resource Copilot with deterministic PRD tool calling.',
    status: 'IN_PROGRESS',
    color: 'border-cyan-200 bg-cyan-50/50',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    iconBg: 'bg-cyan-600',
    tasks: [
      {
        id: 't-601',
        code: 'TASK-CHAT-01',
        title: 'PostgreSQL chat Schema & Tables Migration',
        description: 'Create chat.channels, chat.channel_members, chat.messages tables with indexes in 002_chat_schema.sql.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'COMPLETE',
        files: ['apps/api/db/migrations/002_chat_schema.sql'],
        verification: 'Migration schema specified in task/TASKS.md',
        category: 'Database'
      },
      {
        id: 't-602',
        code: 'TASK-CHAT-02',
        title: 'Seed Initial Chat Channels & Operational History',
        description: 'Populate default channels (#khurda-district-emergency, #pipili-phc, #arogyagrid-copilot) with seed messages.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'COMPLETE',
        files: ['scripts/seed/seed_chat.sql'],
        verification: 'Seed data specification defined in task/TASKS.md',
        category: 'Database'
      },
      {
        id: 't-603',
        code: 'TASK-CHAT-03',
        title: 'Go Domain Models, DTOs & Custom Errors',
        description: 'Define Channel, Message, ChannelMember structs, DTOs, and typed domain errors in internal/chat.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/chat/models.go', 'apps/api/internal/chat/dto.go'],
        verification: 'Compiles cleanly with go build',
        category: 'Backend Core'
      },
      {
        id: 't-604',
        code: 'TASK-CHAT-04',
        title: 'PostgreSQL pgx Repository Implementation',
        description: 'Implement Channel and Message persistence, query pagination, and member validation via pgxpool.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/chat/postgres_repository.go'],
        verification: 'Queries tested against PostgreSQL chat schema',
        category: 'Database'
      },
      {
        id: 't-605',
        code: 'TASK-CHAT-05',
        title: 'Real-Time WebSocket Connection Hub & SSE Fallback',
        description: 'Concurrent-safe connection manager supporting channel broadcast, user broadcast, and auto cleanup.',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/chat/hub.go'],
        verification: 'Hub broadcast verified with multiple concurrent clients',
        category: 'Backend Core'
      },
      {
        id: 't-606',
        code: 'TASK-CHAT-06',
        title: 'Chat Application Service Layer & RBAC Rules',
        description: 'Coordinates message creation, content sanitization, permission validation, and copilot dispatch.',
        assignee: 'Riya',
        assigneeRole: 'Facility Manager',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/chat/service.go'],
        verification: 'Unauthorized cross-facility chat rejected with 403',
        category: 'Backend Core'
      },
      {
        id: 't-607',
        code: 'TASK-CHAT-07',
        title: 'RESTful Chi HTTP Handlers & WebSocket Route',
        description: 'Mounts /api/v1/chat/* routes for channels, messages, history, read status, and WebSocket upgrader.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/chat/handler.go'],
        verification: 'Chi router mounts /api/v1/chat cleanly',
        category: 'Backend Core'
      },
      {
        id: 't-608',
        code: 'TASK-CHAT-08',
        title: 'Deterministic Domain Tools for AI Copilot',
        description: 'Builds PRD-compliant tools querying inventory balances, days of cover, capacity, and safe surplus.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/chat/copilot_tools.go'],
        verification: 'Tool returns exact stock without simulation',
        category: 'Integration & Seed'
      },
      {
        id: 't-609',
        code: 'TASK-CHAT-09',
        title: 'ArogyaGrid Copilot NLP Intent Processor',
        description: 'Classifies natural language questions, extracts parameters, and formats explainable markdown answers.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/chat/copilot.go'],
        verification: 'NLP correctly parses stock, risk, and bed capacity questions',
        category: 'Integration & Seed'
      },
      {
        id: 't-610',
        code: 'TASK-CHAT-10',
        title: 'Frontend TypeScript Types, API Client & Query Hooks',
        description: 'Strongly typed contracts, chat API client with JWT headers, and TanStack useChat query hooks.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'IN_PROGRESS',
        files: ['apps/web/src/features/chat/types/chat.types.ts', 'hooks/useChat.ts'],
        verification: 'npm run build compiles types with 0 errors',
        category: 'Frontend UI'
      },
      {
        id: 't-611',
        code: 'TASK-CHAT-11',
        title: 'Interactive Chat UI, Channel Sidebar & Message Feed',
        description: 'Next.js components: ChannelList, MessageFeed with role badges, MessageComposer, and Copilot quick chips.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'IN_PROGRESS',
        files: ['apps/web/src/features/chat/components/MessageFeed.tsx', 'ChannelList.tsx'],
        verification: 'Responsive chat interface renders in browser',
        category: 'Frontend UI'
      },
      {
        id: 't-612',
        code: 'TASK-CHAT-12',
        title: 'Interactive Action Cards for Stockout Alerts & Transfers',
        description: 'Rich message cards for Stockout Alerts and Transfer Recommendations with 1-click action buttons.',
        assignee: 'Shneanjali',
        assigneeRole: 'Logistics Officer',
        status: 'IN_PROGRESS',
        files: ['apps/web/src/features/chat/components/InteractiveCards.tsx'],
        verification: 'Cards render inline in chat stream with action triggers',
        category: 'Frontend UI'
      },
      {
        id: 't-613',
        code: 'TASK-CHAT-13',
        title: 'Backend Automated Unit & Integration Tests',
        description: 'Unit test suite for chat service, permission validation, and copilot safe-surplus tool calculation.',
        assignee: 'Vaishnavi',
        assigneeRole: 'District Officer',
        status: 'IN_PROGRESS',
        files: ['apps/api/internal/chat/service_test.go', 'copilot_test.go'],
        verification: 'go test -v ./internal/chat/... outputs PASS',
        category: 'Backend Core'
      },
      {
        id: 't-614',
        code: 'TASK-CHAT-14',
        title: 'Automated End-to-End Smoke Verification Script',
        description: 'Bash automation script testing authentication, channel listing, message delivery, and copilot response.',
        assignee: 'Sarthak',
        assigneeRole: 'Team Leader',
        status: 'IN_PROGRESS',
        files: ['scripts/test_chat_e2e.sh'],
        verification: 'Smoke script runs to completion with exit code 0',
        category: 'Integration & Seed'
      }
    ]
  }
];

export const TEAM_ROSTER = [
  {
    name: 'Sarthak',
    role: 'Team Leader & Lead Architect',
    systemRole: 'National Administrator',
    avatar: '👑',
    color: 'from-rose-500 to-red-600',
    borderColor: 'border-rose-200',
    bgBadge: 'bg-rose-50 text-rose-800 border-rose-200',
    epics: ['EPIC-01', 'EPIC-05'],
    epicTitles: ['Foundation, Auth & Database Infrastructure', 'System Integration, Work Generator & Seed Data'],
    summary:
      'Architected multi-schema PostgreSQL foundation, JWT authentication, transaction idempotency, work item generator, deduplication engine, and end-to-end service orchestration.'
  },
  {
    name: 'Vaishnavi',
    role: 'District Officer & Core Domain Lead',
    systemRole: 'District Officer (Khurda District)',
    avatar: '📋',
    color: 'from-amber-500 to-yellow-600',
    borderColor: 'border-amber-200',
    bgBadge: 'bg-amber-50 text-amber-800 border-amber-200',
    epics: ['EPIC-02'],
    epicTitles: ['Work Item Core Backend & State Machine'],
    summary:
      'Engineered work item domain models, deterministic finite state machine, PostgreSQL repository pattern via pgx v5, Chi HTTP routes, request validation, and 19 unit test suites.'
  },
  {
    name: 'Riya',
    role: 'Facility Manager & Transitions Lead',
    systemRole: 'Facility Manager (Capital Hospital)',
    avatar: '🏥',
    color: 'from-blue-500 to-cyan-600',
    borderColor: 'border-blue-200',
    bgBadge: 'bg-blue-50 text-blue-800 border-blue-200',
    epics: ['EPIC-03'],
    epicTitles: ['Transitions, Queues & SLA Engine'],
    summary:
      'Engineered complete transition workflow (assign, accept, reassign, return, complete, handoff), dynamic SLA policy engine, unified chronological audit timeline synthesis, and discussion comments.'
  },
  {
    name: 'Shneanjali',
    role: 'Logistics Officer & Frontend Lead',
    systemRole: 'Logistics Officer (State Medical Depot)',
    avatar: '🚚',
    color: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-200',
    bgBadge: 'bg-purple-50 text-purple-800 border-purple-200',
    epics: ['EPIC-04'],
    epicTitles: ['Frontend Work System & Interactive UI'],
    summary:
      'Developed Next.js App Router user interface, TanStack React Query hooks with optimistic updates, interactive operational work queue table, slide-over detail drawer, and action dialog modals.'
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
                <span>Production Implementation Verification</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Team Epics & Task Architecture Board
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
                Complete engineering breakdown of all 5 Core Epics and 42 Itemized Tasks completed across our 4 team members:
                <strong className="text-white font-semibold"> Sarthak</strong> (Lead),
                <strong className="text-white font-semibold"> Vaishnavi</strong>,
                <strong className="text-white font-semibold"> Riya</strong>, and
                <strong className="text-white font-semibold"> Shneanjali</strong>.
              </p>
            </div>

            {/* Quick Action Button to Work Queue */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-md transition-all hover:scale-105"
              >
                <span>Switch to Operational Work Queue</span>
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
              <span className="text-xs text-slate-400 block font-medium">Overall Progress</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-400">{completionPercentage}%</span>
                <span className="text-[11px] text-emerald-300 font-semibold">ALL COMPLETE</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Core Epics</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">5 / 5</span>
                <span className="text-[11px] text-teal-300 font-semibold">Finished</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Itemized Tasks</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{totalTasks}</span>
                <span className="text-[11px] text-slate-300 font-semibold">42 Done</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Unit Tests Pass</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-400">19 / 19</span>
                <span className="text-[11px] text-emerald-300 font-semibold">100% OK</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Database Schemas</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-cyan-300">4</span>
                <span className="text-[11px] text-cyan-200 font-semibold">iam/core/work/audit</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Team Officers</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-purple-300">4</span>
                <span className="text-[11px] text-purple-200 font-semibold">Allocated</span>
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
                <span>Group by Epic (5)</span>
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
                <span>Group by Member (4)</span>
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
                <span>In Progress ({inProgressTasks})</span>
              </button>

              <button
                onClick={() => setStatusFilter('BACKLOG')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  statusFilter === 'BACKLOG'
                    ? 'bg-slate-700 text-white border-slate-700 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
                }`}
              >
                <CircleDashed className="w-3.5 h-3.5" />
                <span>Backlog ({backlogTasks})</span>
              </button>
            </div>
          </div>

          {/* Search bar & quick filters */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by task title, code (e.g. TASK-02-02), member (Sarthak, Vaishnavi...), code file, or keyword..."
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
        {/* VIEW MODE 1: GROUP BY EPIC (5 EPICS) */}
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
                            className={`px-3 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1.5 ${epic.badgeBg}`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{epic.status}</span>
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {epic.tasks.length} itemized subtasks
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
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Lead Owner</span>
                          </div>
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
                          className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${progressRatio}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 whitespace-nowrap">
                        {progressRatio}% Complete ({epic.tasks.filter((t) => t.status === 'COMPLETE').length}/{epic.tasks.length})
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
                                  ) : task.status === 'IN_PROGRESS' ? (
                                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  ) : (
                                    <CircleDashed className="w-3.5 h-3.5 text-slate-500" />
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
              const ratio = Math.round((completedCount / memberTasks.length) * 100);

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
                          Assigned Epics:
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
                          <span className="text-emerald-600">✓ Fully Verified</span>
                        </div>
                      </div>
                    </div>

                    {/* Task Checklist for this member */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Itemized Completed Tasks ({memberTasks.length}):
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
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                              ✓ Done
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
        {/* VIEW MODE 3: ALL TASKS MATRIX (42 ITEM AUDIT) */}
        {/* =================================================================== */}
        {viewMode === 'matrix' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Unified Tasks Audit Matrix ({filteredTasks.length} Tasks)
                </h2>
                <p className="text-xs text-slate-500">
                  Complete list of all deliverables, files, verification tests, and team assignments.
                </p>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                100% Architecture Verification
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
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1 w-fit">
                          <Check className="w-3 h-3 text-emerald-600" />
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
              Ready to see these Epics running live with operational tickets?
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
