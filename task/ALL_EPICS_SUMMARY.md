# ArogyaGrid — 10 PRD Epics Master Architecture Registry

> **Source PRD:** [ArogyaGrid_Detailed_PRD.docx](file:///home/sarthaktripathy/Documents/Arogya/ArogyaGrid_Detailed_PRD.docx) (Sections 5, 6, 7, 8, 9, 10, 11, 14, 18, 21, 23)  
> **Status:** **10 Total Epics** (2 Complete • 8 In Progress/Roadmap)

---

## Complete 10-Epic Architecture Matrix

| # | Epic Code | Epic Title | Owner / Persona | Status | PRD Section | Key Deliverables |
| :-: | :--- | :--- | :---: | :---: | :---: | :--- |
| **1** | **EPIC-01** | **Foundation, Auth, Multi-Schema DB & DevOps** | 👑 Sarthak (Lead) | `COMPLETE` | PRD §7.1, §11, §14 | PostgreSQL 16 multi-schema (`iam`, `core`, `work`, `audit`), JWT HMAC-SHA256, Idempotency engine, Monorepo runner (`make dev`). |
| **2** | **EPIC-02** | **Medicine Catalog & Operational Inventory Ledger** | 📋 Vaishnavi (District) | `IN_PROGRESS` | PRD §7.3, §7.4 | `core.medicines` master (criticality, cold chain), `inventory.balances`, `inventory.transactions` (stock-in, consumption, adjustment, negative stock invariant). |
| **3** | **EPIC-03** | **Bed & Workforce Capacity Monitoring** | 🏥 Riya (Facility) | `IN_PROGRESS` | PRD §7.5 | `capacity.snapshots` (total beds, occupied beds, available beds, doctors, nurses), time-series tracking, capacity stress indicators. |
| **4** | **EPIC-04** | **Demand Aggregation, Forecasting & Shortage Risk Engine** | 👑 Sarthak (Lead) | `IN_PROGRESS` | PRD §8 | `intelligence.daily_demand`, rolling 7-day average daily demand, 3–7 day demand projection, Days-of-Cover formula ($\text{DoC} = \frac{\text{Stock}}{\text{Demand}}$), Critical/High alerts. |
| **5** | **EPIC-05** | **Safe Surplus Redistribution & Scoring Engine** | 📋 Vaishnavi (District) | `IN_PROGRESS` | PRD §9.1–9.4 | Protected safety stock, Safe Surplus formula ($\text{Stock} - \text{Safety} - \text{Demand Buffer}$), Multi-factor candidate scoring ($0.40 \times \text{Surplus} + 0.30 \times \text{Distance} + 0.20 \times \text{Safety} + 0.10 \times \text{Urgency}$). |
| **6** | **EPIC-06** | **Transfer Lifecycle & Dual-Inventory Execution** | 🏥 Riya (Facility) | `IN_PROGRESS` | PRD §9.5, §9.6 | Transfer state machine (`recommended` ➔ `approved` ➔ `dispatched` ➔ `received` ➔ `completed`). ACID dual inventory updates (deduct source, credit destination). |
| **7** | **EPIC-07** | **Operational Work Queue & Task Management System** | 🚚 Shneanjali (Logistics) | `COMPLETE` | PRD §6, §10 | Work items table, SLA breach policies, inter-facility handoffs, reason-coded returns, slide-over inspection drawer, queue views (My, Team, Urgent, Overdue, Waiting, Completed). |
| **8** | **EPIC-08** | **Executive Dashboard & Leaflet Geographic Risk Map** | 🚚 Shneanjali (Logistics) | `IN_PROGRESS` | PRD §10 | Network KPI cards (Active facilities, critical shortages, active transfers, bed stress), Leaflet / OpenStreetMap color-coded facility pins (Red/Orange/Green), facility drilldowns. |
| **9** | **EPIC-09** | **Operational Collaboration & AI Resource Copilot Chat** | 👑 Sarthak (Lead) | `IN_PROGRESS` | PRD Chat | Role-scoped channels (`#facility-internal`, `#district-emergency`, transfer threads), interactive stockout/transfer cards, ArogyaGrid AI Copilot with deterministic PRD tools. |
| **10** | **EPIC-10** | **Automated Background Scheduler & Realistic Demo Dataset** | 👑 Sarthak (Lead) | `IN_PROGRESS` | PRD §18, §21 | `robfig/cron` background jobs (daily aggregation, forecast run, stale cleanup), realistic Odisha healthcare network dataset (10–20 facilities, 20–50 medicines, 30–90d history). |

---

## Detailed Breakdown of Each Epic

### 🟢 EPIC-01: Foundation, Auth, Multi-Schema DB & DevOps
* **Owner:** Sarthak (Team Leader & System Architect)
* **Status:** `COMPLETE` (8/8 Tasks — 100%)
* **Scope:**
  * Multi-schema PostgreSQL 16 database architecture isolating `iam`, `core`, `work`, and `audit`.
  * HMAC-SHA256 JWT auth middleware and Argon2id password security.
  * Idempotency middleware (`Idempotency-Key` header) preventing duplicate mutations.
  * Centralized configuration loader and monorepo runner (`make dev`).

---

### 🟡 EPIC-02: Medicine Catalog & Operational Inventory Ledger
* **Owner:** Vaishnavi (District Officer & Core Domain Lead)
* **Status:** `IN_PROGRESS`
* **Scope (PRD §7.3, §7.4):**
  * `core.medicines` generic master catalog (code, generic_name, unit, criticality, cold_chain_flag).
  * `inventory.balances` tracking current quantity and safety stock per facility-medicine.
  * `inventory.transactions` append-only ledger (stock-in, consumption, transfer-in, transfer-out, adjustment).
  * Hard invariant: Reject any transaction resulting in negative balance.

---

### 🟡 EPIC-03: Bed & Workforce Capacity Monitoring
* **Owner:** Riya (Facility Manager & Transitions Lead)
* **Status:** `IN_PROGRESS`
* **Scope (PRD §7.5):**
  * `capacity.snapshots` time-series table (total beds, occupied beds, available beds, doctors, nurses).
  * Capacity stress index calculation on facility dashboard.
  * Alerts for bed occupancy exceeding operational safety limits (>90%).

---

### 🟡 EPIC-04: Demand Aggregation, Forecasting & Shortage Risk Engine
* **Owner:** Sarthak (Team Leader & Lead Architect)
* **Status:** `IN_PROGRESS`
* **Scope (PRD §8):**
  * `intelligence.daily_demand` feature table aggregating consumption by date/facility/medicine.
  * Rolling 7-day average daily demand calculation.
  * Short-term 3-day and 7-day demand projections.
  * Days-of-cover formula: $\text{DoC} = \frac{\text{Current Stock}}{\max(\text{Average Daily Demand}, 1)}$.
  * Risk alerts: Critical (< 2 days), High (< 4 days), Medium (< 7 days) with reason codes.

---

### 🟡 EPIC-05: Safe Surplus Redistribution & Scoring Engine
* **Owner:** Vaishnavi (District Officer & Core Domain Lead)
* **Status:** `IN_PROGRESS`
* **Scope (PRD §9.1–9.4):**
  * Protected safety stock invariant: Donor must remain safe after transfer.
  * Safe Surplus formula: $\text{Safe Surplus} = \text{Current Stock} - \text{Safety Stock} - \text{Predicted Demand Buffer}$.
  * Haversine distance calculator between donor and recipient facilities.
  * Multi-factor scoring algorithm: $0.40 \times \text{Surplus} + 0.30 \times \text{Proximity} + 0.20 \times \text{Safety} + 0.10 \times \text{Urgency}$.
  * Explainable recommendation object with donor rankings and reasoning.

---

### 🟡 EPIC-06: Transfer Lifecycle & Dual-Inventory Execution
* **Owner:** Riya (Facility Manager & Operations Lead)
* **Status:** `IN_PROGRESS`
* **Scope (PRD §9.5, §9.6):**
  * Transfer state machine: `recommended` ➔ `approved` ➔ `dispatched` ➔ `received` ➔ `completed`.
  * ACID dual inventory mutation: Automatically deduct donor stock on dispatch, and credit recipient stock on receipt.
  * Rejection, cancellation, and expiration handling.
  * Full audit trail integration for chain of custody.

---

### 🟢 EPIC-07: Operational Work Queue & Task Management System
* **Owner:** Shneanjali (Logistics Officer & Frontend Lead)
* **Status:** `COMPLETE` (10/10 Tasks — 100%)
* **Scope (PRD §6, §10):**
  * Work item domain model, queue views (My Work, Team, Urgent, Overdue, Waiting, Completed).
  * State transitions (`assign`, `accept`, `reassign`, `return`, `complete`, `handoff`).
  * SLA policy engine with dynamic escalation.
  * Slide-over inspection drawer, chronological audit timeline, threaded comments, and action modals.

---

### 🟡 EPIC-08: Executive Dashboard & Leaflet Geographic Risk Map
* **Owner:** Shneanjali (Logistics Officer & Frontend Lead)
* **Status:** `IN_PROGRESS`
* **Scope (PRD §10):**
  * High-level executive KPI cards (Active facilities, critical stockout alerts, pending transfers, bed stress).
  * Interactive Leaflet / OpenStreetMap visualization of Odisha healthcare network.
  * Color-coded facility risk pins (Red = Critical stockout/bed stress, Orange = High risk, Green = Stable).
  * Facility detail view displaying inventory, capacity, forecasts, and transfer history.

---

### 🟡 EPIC-09: Operational Collaboration & AI Resource Copilot Chat
* **Owner:** Sarthak (Team Leader & System Architect)
* **Status:** `IN_PROGRESS` (Specification ready in `task/`)
* **Scope (PRD Chat):**
  * Role-scoped communication channels (`#facility-internal`, `#district-emergency`, transfer threads).
  * Interactive chat cards for Stockout Alerts and Transfer Orders with 1-click approvals.
  * ArogyaGrid AI Copilot with deterministic database tool-calling (stock, days of cover, safe surplus, capacity).

---

### 🟡 EPIC-10: Automated Background Scheduler & Realistic Demo Dataset
* **Owner:** Sarthak (Team Leader & System Architect)
* **Status:** `IN_PROGRESS`
* **Scope (PRD §18, §21):**
  * `robfig/cron` in-process background scheduler for Go backend.
  * Automated cron jobs: Daily demand aggregation, forecast recalculation, risk alert refresh, stale recommendation cleanup.
  * Realistic Odisha healthcare seed dataset (15 facilities across Khurda/Cuttack/Puri, 30 essential medicines, 60 days history).
  * Deterministic demo reset script for judging and evaluation.
