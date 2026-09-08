# ArogyaGrid — Complete Master Epics Registry (Epics 1 to 6)

> **Repository:** `ArogyaGrid`  
> **Source PRD:** [ArogyaGrid_Detailed_PRD.docx](file:///home/sarthaktripathy/Documents/Arogya/ArogyaGrid_Detailed_PRD.docx)  
> **Status:** Epics 1–5 **COMPLETE (100%)** | Epic 6 (Chat & Copilot) **READY FOR BUILD**

---

## Master Epics Overview Table

| Epic Code | Epic Title | Lead Owner | Tasks | Status | Deliverable Code & Artifacts |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **EPIC-01** | **Foundation, Auth & Database Infrastructure** | 👑 Sarthak | 8 / 8 | `COMPLETE` | PostgreSQL multi-schema (`iam`, `core`, `work`, `audit`), JWT Auth, Idempotency, Monorepo runner |
| **EPIC-02** | **Work Item Core Backend & State Machine** | 📋 Vaishnavi | 8 / 8 | `COMPLETE` | Work item domain models, State Machine, pgx v5 repository, Chi handlers, 19 passing unit tests |
| **EPIC-03** | **Transitions, Queues & SLA Engine** | 🏥 Riya | 9 / 9 | `COMPLETE` | Assign/Accept/Return/Complete/Handoff transitions, Dynamic SLA engine, Activity timeline, Comments |
| **EPIC-04** | **Frontend Work System & Interactive UI** | 🚚 Shneanjali | 10 / 10 | `COMPLETE` | Next.js App Router, TanStack Query hooks, Work Queue table, Slide-over panel, Action dialog modals |
| **EPIC-05** | **System Integration, Work Generator & Seed** | 👑 Sarthak | 7 / 7 | `COMPLETE` | Autonomous generator, ticket deduplication guard, Odisha seed data, Next.js reverse proxy |
| **EPIC-06** | **Operational Collaboration & AI Copilot Chat** | 🤖 Agent Team | 14 Tasks | `READY FOR BUILD` | `chat` schema, WebSocket/SSE hub, AI Resource Copilot, interactive cards, `/chat` page |

---

## Detailed Breakdown of Completed Epics (1 to 5)

### 🟢 EPIC-01: Foundation, Auth & Database Infrastructure
* **Owner:** Sarthak (Team Leader & System Architect)
* **Status:** `COMPLETE` (8/8 Tasks — 100%)
* **Key Deliverables:**
  1. `TASK-01-01`: Multi-Schema PostgreSQL Architecture (`apps/api/db/migrations/001_work_schema.sql`)
  2. `TASK-01-02`: Migration Engine & sqlc Configuration (`db/sqlc.yaml`, `db/queries/work.sql`)
  3. `TASK-01-03`: JWT Authentication & Authorization Middleware (`internal/middleware/auth.go`)
  4. `TASK-01-04`: Idempotency Engine & Deduplication Storage (`internal/middleware/idempotency.go`)
  5. `TASK-01-05`: IAM Database Tables & RBAC (`iam.users`, `iam.teams`, `iam.team_members`, `iam.sessions`)
  6. `TASK-01-06`: Core Facility Registry (`core.facilities` table with lat/lon)
  7. `TASK-01-07`: Centralized Config Loader (`internal/config/config.go`)
  8. `TASK-01-08`: Unified Monorepo Runner (`Makefile`, `start-dashboard.sh`)

---

### 🟢 EPIC-02: Work Item Core Backend & State Machine
* **Owner:** Vaishnavi (District Officer & Core Domain Lead)
* **Status:** `COMPLETE` (8/8 Tasks — 100%)
* **Key Deliverables:**
  1. `TASK-02-01`: Work Item Domain Models & Enums (`internal/work/models.go`)
  2. `TASK-02-02`: Deterministic Finite State Machine (`internal/work/transitions.go`)
  3. `TASK-02-03`: Repository Interface (`internal/work/repository.go`)
  4. `TASK-02-04`: PostgreSQL Repository via pgx v5 (`internal/work/postgres_repository.go`)
  5. `TASK-02-05`: Core Work Service Layer (`internal/work/service.go`)
  6. `TASK-02-06`: RESTful Chi HTTP Route Handlers (`internal/work/handler.go`)
  7. `TASK-02-07`: Request DTOs & Validation (`internal/work/dto.go`, `validation.go`)
  8. `TASK-02-08`: Unit Tests (`transitions_test.go` — 19/19 passing tests)

---

### 🟢 EPIC-03: Transitions, Queues & SLA Engine
* **Owner:** Riya (Facility Manager & Transitions Lead)
* **Status:** `COMPLETE` (9/9 Tasks — 100%)
* **Key Deliverables:**
  1. `TASK-03-01`: Work Item Assignment & Team Routing (`service.go:AssignWorkItem`)
  2. `TASK-03-02`: Worker Acceptance Pipeline (`service.go:AcceptWorkItem`)
  3. `TASK-03-03`: Return Flow with Reason Codes (`service.go:ReturnWorkItem`)
  4. `TASK-03-04`: Task Completion & Resolution Reporting (`service.go:CompleteWorkItem`)
  5. `TASK-03-05`: Inter-Facility Handoff Protocol (`service.go:HandoffWorkItem`)
  6. `TASK-03-06`: Dynamic SLA Policy Engine (`internal/work/sla_policy.go`)
  7. `TASK-03-07`: Activity Timeline Synthesis (`internal/work/timeline.go`)
  8. `TASK-03-08`: Internal Threaded Discussion & Comments API (`work.work_item_comments`)
  9. `TASK-03-09`: Optimistic Concurrency Control (`version` checking)

---

### 🟢 EPIC-04: Frontend Work System & Interactive UI
* **Owner:** Shneanjali (Logistics Officer & Frontend Lead)
* **Status:** `COMPLETE` (10/10 Tasks — 100%)
* **Key Deliverables:**
  1. `TASK-04-01`: TypeScript Domain Types & Zod Schemas (`src/features/work/types/work.types.ts`)
  2. `TASK-04-02`: API Client & Idempotency Key Injection (`src/lib/api-client.ts`)
  3. `TASK-04-03`: TanStack React Query Hooks (`useWorkQueue`, `useWorkItem`, `useWorkMutations`)
  4. `TASK-04-04`: Interactive Work Queue Table (`WorkQueueTable.tsx`)
  5. `TASK-04-05`: Queue View Selector Tabs (`WorkQueueTabs.tsx`: My, Team, Urgent, Overdue, Waiting, Completed)
  6. `TASK-04-06`: Slide-over Detail Inspection Panel (`WorkItemPanel.tsx`, `WorkItemHeader.tsx`)
  7. `TASK-04-07`: Chronological Audit Timeline UI (`WorkTimeline.tsx`)
  8. `TASK-04-08`: Threaded Comments Feed (`WorkComments.tsx`)
  9. `TASK-04-09`: Operational Action Dialog Modals (Assign, Reassign, Handoff, Return, Complete)
  10. `TASK-04-10`: Accessible UI Library & Healthcare Theme (`components/ui/*`, `globals.css`)

---

### 🟢 EPIC-05: System Integration, Work Generator & Seed Data
* **Owner:** Sarthak (Team Leader & System Architect)
* **Status:** `COMPLETE` (7/7 Tasks — 100%)
* **Key Deliverables:**
  1. `TASK-05-01`: Autonomous Work Item Generator (`internal/work/generator.go`)
  2. `TASK-05-02`: Active Ticket Deduplication Guard (`postgres_repository.go`)
  3. `TASK-05-03`: Dynamic Priority & SLA Severity Classifier (`sla_policy.go`)
  4. `TASK-05-04`: Odisha Healthcare Realistic Seed Dataset (`scripts/seed/seed_work_items.sql`)
  5. `TASK-05-05`: RBAC Permission Enforcement Layer (`internal/work/permissions.go`)
  6. `TASK-05-06`: End-to-End Chi API Mounting (`cmd/server/main.go`)
  7. `TASK-05-07`: Next.js Reverse Proxy & Unified Routing (`next.config.mjs`)

---

## Upcoming Epic for Execution:

### 🟡 EPIC-06: Operational Collaboration & AI Resource Copilot Chat
* **Status:** `READY FOR IMPLEMENTATION` (14 Tasks across 6 Phases)
* **Full Specification:** See [EPIC.md](file:///home/sarthaktripathy/Documents/Arogya/task/EPIC.md), [USER_STORIES.md](file:///home/sarthaktripathy/Documents/Arogya/task/USER_STORIES.md), and [TASKS.md](file:///home/sarthaktripathy/Documents/Arogya/task/TASKS.md).
* **Phases:**
  1. Database Schema (`002_chat_schema.sql` and `seed_chat.sql`)
  2. Go Backend Models & Repository (`internal/chat`)
  3. Go Service Layer, WebSocket Hub & Chi Handlers
  4. ArogyaGrid AI Copilot Engine & Deterministic PRD Tools
  5. Next.js Frontend Chat Interface (`apps/web/src/features/chat`)
  6. Automated Tests & E2E Smoke Script
