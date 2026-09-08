# ArogyaGrid Chat & AI Copilot Task Directory

> **Directory Location:** `/home/sarthaktripathy/Documents/Arogya/task/` (also accessible via symlink `tasks/`)  
> **Source PRD:** [ArogyaGrid_Detailed_PRD.docx](file:///home/sarthaktripathy/Documents/Arogya/ArogyaGrid_Detailed_PRD.docx)  
> **Parent Epic:** `EPIC-CHAT-01`

---

## 📂 Directory Contents

| File | Purpose | Description |
| :--- | :--- | :--- |
| **[EPIC.md](file:///home/sarthaktripathy/Documents/Arogya/task/EPIC.md)** | **Master Epic Specification** | Executive problem statement, architecture diagrams, PRD mapping, and system scope. |
| **[USER_STORIES.md](file:///home/sarthaktripathy/Documents/Arogya/task/USER_STORIES.md)** | **User Stories & Acceptance Criteria** | 7 user stories covering Facility Managers, District Officers, Logistics Drivers, and AI Copilot. |
| **[TASKS.md](file:///home/sarthaktripathy/Documents/Arogya/task/TASKS.md)** | **Sequential Agent Execution Tasks** | 14 itemized, unambiguous tasks divided into 6 execution phases with exact code files and test commands. |

---

## 🤖 Instructions for AI Coding Agents

When tasked with implementing or extending the Chat System:
1. **Start with [TASKS.md](file:///home/sarthaktripathy/Documents/Arogya/task/TASKS.md)**: Follow the phases in strict numerical sequence:
   * **Phase 1:** Database Schema & Migration (`002_chat_schema.sql` and seed data)
   * **Phase 2:** Go Domain Models & PostgreSQL Repository (`internal/chat`)
   * **Phase 3:** Go Application Service, WebSocket Connection Hub, and Chi HTTP Handlers
   * **Phase 4:** ArogyaGrid AI Copilot Engine & Deterministic PRD Domain Tools
   * **Phase 5:** Next.js Frontend Chat Interface (`apps/web/src/features/chat`)
   * **Phase 6:** Automated Unit Tests and E2E Smoke Script
2. **Consult [USER_STORIES.md](file:///home/sarthaktripathy/Documents/Arogya/task/USER_STORIES.md)** for edge cases, role-scoped permission rules, and Gherkin scenarios.
3. **Always Adhere to PRD §23 Guardrails**:
   * All inventory numbers, stock balances, days-of-cover, and safe-surplus figures reported by the AI Copilot must be queried deterministically from the PostgreSQL database. Never generate simulated or hallucinated numbers.
   * Do not store patient clinical PII (Names, Phone Numbers, Aadhaar) in chat messages.

---

## 🎯 Quick Verification Commands

```bash
# 1. Run database migration
docker exec -i bimanyaya_postgres psql -U arogyagrid -d arogyagrid < apps/api/db/migrations/002_chat_schema.sql

# 2. Run Go backend unit tests
cd apps/api && go test -v ./internal/chat/...

# 3. Verify Next.js frontend build
cd apps/web && npm run build

# 4. Run full E2E smoke test
./scripts/test_chat_e2e.sh
```
