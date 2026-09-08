# TASKS: ArogyaGrid Chat & AI Copilot Implementation Guide

> **Parent Epic:** `EPIC-CHAT-01`  
> **Parent Stories:** [USER_STORIES.md](file:///home/sarthaktripathy/Documents/Arogya/task/USER_STORIES.md)  
> **Target Execution Agent:** Autonomous AI Coding Agent / Engineer  
> **Instructions for Agent:** Execute these tasks sequentially from Phase 1 through Phase 6. Do not skip any task. Verify each task against its Acceptance Criteria before proceeding to the next.

---

## Task Dependency Matrix

```
[Phase 1: DB Schema & Migration]
        │
        ▼
[Phase 2: Go Backend Domain Models & Repository]
        │
        ▼
[Phase 3: Go Service Layer, WebSocket Hub & HTTP Handlers]
        │
        ▼
[Phase 4: ArogyaGrid AI Copilot Engine & Tool Calling]
        │
        ▼
[Phase 5: Next.js Frontend Chat Interface & Real-time Hooks]
        │
        ▼
[Phase 6: Automated Unit Tests, E2E Smoke & Definition of Done]
```

---

## Phase 1: Database Architecture & Migrations

### TASK-CHAT-01: PostgreSQL Schema & Tables Migration
* **Story Reference:** US-CHAT-01, US-CHAT-02, US-CHAT-03, US-CHAT-07
* **Target File:** `apps/api/db/migrations/002_chat_schema.sql`
* **Agent Instructions:**
  Create PostgreSQL migration file defining the `chat` schema and 4 core tables:
  1. `chat.channels`:
     - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
     - `name VARCHAR(255) NOT NULL`
     - `slug VARCHAR(255) NOT NULL UNIQUE`
     - `type VARCHAR(32) NOT NULL` (Values: `'facility'`, `'district'`, `'transfer_context'`, `'direct'`, `'copilot'`)
     - `facility_id UUID REFERENCES core.facilities(id) ON DELETE SET NULL`
     - `district VARCHAR(100)`
     - `transfer_id UUID REFERENCES work.work_items(id) ON DELETE SET NULL`
     - `created_by UUID REFERENCES iam.users(id) ON DELETE SET NULL`
     - `is_archived BOOLEAN NOT NULL DEFAULT FALSE`
     - `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
     - `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`
  2. `chat.channel_members`:
     - `channel_id UUID NOT NULL REFERENCES chat.channels(id) ON DELETE CASCADE`
     - `user_id UUID NOT NULL REFERENCES iam.users(id) ON DELETE CASCADE`
     - `role VARCHAR(32) NOT NULL DEFAULT 'member'`
     - `joined_at TIMESTAMPTZ NOT NULL DEFAULT now()`
     - `last_read_at TIMESTAMPTZ NOT NULL DEFAULT now()`
     - `PRIMARY KEY (channel_id, user_id)`
  3. `chat.messages`:
     - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
     - `channel_id UUID NOT NULL REFERENCES chat.channels(id) ON DELETE CASCADE`
     - `sender_id UUID REFERENCES iam.users(id) ON DELETE SET NULL`
     - `sender_name VARCHAR(255) NOT NULL`
     - `sender_role VARCHAR(64) NOT NULL`
     - `message_type VARCHAR(32) NOT NULL DEFAULT 'text'` (Values: `'text'`, `'alert_card'`, `'recommendation_card'`, `'system_event'`)
     - `content TEXT NOT NULL`
     - `metadata JSONB NOT NULL DEFAULT '{}'::jsonb`
     - `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
     - `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`
  4. Indexes:
     - `CREATE INDEX idx_chat_messages_channel_created ON chat.messages(channel_id, created_at DESC);`
     - `CREATE INDEX idx_chat_channels_facility ON chat.channels(facility_id);`
     - `CREATE INDEX idx_chat_channels_district ON chat.channels(district);`
     - `CREATE INDEX idx_chat_channels_transfer ON chat.channels(transfer_id);`
* **Verification:**
  Execute migration against `arogyagrid` PostgreSQL container and run `\dt chat.*` to confirm all 3 tables exist with proper constraints.

---

### TASK-CHAT-02: Seed Initial Chat Channels & Operational History
* **Story Reference:** US-CHAT-01, US-CHAT-02, US-CHAT-05
* **Target File:** `scripts/seed/seed_chat.sql`
* **Agent Instructions:**
  Create seed data SQL file populating default channels:
  1. `#general-district-khurda` (`type='district'`, `district='Khurda'`)
  2. `#capital-hospital-internal` (`type='facility'`, linked to Capital Hospital Bhubaneswar)
  3. `#pipili-phc-internal` (`type='facility'`, linked to Pipili PHC)
  4. `#jatni-chc-internal` (`type='facility'`, linked to Jatni CHC)
  5. `#arogyagrid-ai-copilot` (`type='copilot'`, global assistant channel)
  6. Insert initial seed messages demonstrating clinical urgency, stock alerts, and greeting from the AI Copilot.
* **Verification:**
  Apply `seed_chat.sql` into PostgreSQL and run `SELECT count(*) FROM chat.channels;` (must return >= 5).

---

## Phase 2: Go Backend Domain Models & Repository

### TASK-CHAT-03: Domain Entity Models, Enums & DTOs
* **Story Reference:** All Stories
* **Target Files:**
  - `apps/api/internal/chat/models.go`
  - `apps/api/internal/chat/dto.go`
  - `apps/api/internal/chat/errors.go`
* **Agent Instructions:**
  1. In `models.go`, declare structs:
     - `ChannelType` enum (`ChannelTypeFacility`, `ChannelTypeDistrict`, `ChannelTypeTransfer`, `ChannelTypeDirect`, `ChannelTypeCopilot`)
     - `MessageType` enum (`MessageTypeText`, `MessageTypeAlertCard`, `MessageTypeRecommendationCard`, `MessageTypeSystem`)
     - `Channel`, `ChannelMember`, `Message`, `MessageCardMetadata`
  2. In `dto.go`, declare request and response payloads:
     - `CreateChannelRequest`, `SendMessageRequest`, `ChannelResponse`, `MessageResponse`
     - `CopilotQueryRequest`, `CopilotQueryResponse`
  3. In `errors.go`, declare domain errors:
     - `ErrChannelNotFound`, `ErrUnauthorizedChannelAccess`, `ErrEmptyMessageContent`, `ErrInvalidChannelType`
* **Verification:**
  File compiles cleanly with `go build ./internal/chat/...`.

---

### TASK-CHAT-04: Repository Interface & PostgreSQL Implementation
* **Story Reference:** US-CHAT-01, US-CHAT-02, US-CHAT-06
* **Target Files:**
  - `apps/api/internal/chat/repository.go`
  - `apps/api/internal/chat/postgres_repository.go`
* **Agent Instructions:**
  1. Define `Repository` interface:
     - `CreateChannel(ctx, channel) (*Channel, error)`
     - `GetChannelByID(ctx, id) (*Channel, error)`
     - `GetChannelBySlug(ctx, slug) (*Channel, error)`
     - `ListChannelsForUser(ctx, userID, facilityID, district, role) ([]Channel, error)`
     - `AddMember(ctx, channelID, userID, role) error`
     - `IsMember(ctx, channelID, userID) (bool, error)`
     - `CreateMessage(ctx, message) (*Message, error)`
     - `ListMessages(ctx, channelID, limit, beforeTimestamp) ([]Message, error)`
     - `UpdateLastRead(ctx, channelID, userID) error`
  2. Implement with `pgxpool.Pool` inside `postgres_repository.go` with parametrized queries, transaction safety, and version checks.
* **Verification:**
  Write repository unit tests or test query execution with live DB connection.

---

## Phase 3: Go Application Service, WebSocket Hub & HTTP Handlers

### TASK-CHAT-05: Real-Time Connection Hub (WebSocket / SSE)
* **Story Reference:** US-CHAT-01, US-CHAT-02
* **Target File:** `apps/api/internal/chat/hub.go`
* **Agent Instructions:**
  1. Build concurrent-safe connection manager:
     - Track active client connections mapped by `channel_id` and `user_id`.
     - Support `BroadcastToChannel(channelID string, message *Message)`
     - Support `BroadcastToUser(userID string, message *Message)`
     - Clean up closed sockets automatically on disconnect.
  2. Include WebSocket upgrader with CORS validation and token auth on handshake.
  3. Provide fallback HTTP SSE (Server-Sent Events) endpoint `/api/v1/chat/channels/{id}/events` for environments where WebSockets are blocked.
* **Verification:**
  Hub unit tests verify subscribe, broadcast, and unsubscribe behavior.

---

### TASK-CHAT-06: Chat Application Service Layer
* **Story Reference:** All Stories
* **Target File:** `apps/api/internal/chat/service.go`
* **Agent Instructions:**
  1. Implement `Service` struct coordinating:
     - `CreateChannel(ctx, req, caller)`: Enforce RBAC (e.g. only District Officer can create district channels; Facility Managers create facility channels).
     - `GetChannelMessages(ctx, channelID, caller, limit)`: Verify caller has permission to view channel before returning messages.
     - `SendMessage(ctx, req, caller)`:
       - Validate content not empty (max 4000 characters).
       - Sanitize content to prevent XSS.
       - Store message in PostgreSQL via repository.
       - Broadcast via `hub.BroadcastToChannel`.
       - If message is sent in `#arogyagrid-copilot` or mentions `@copilot`, trigger async `ProcessCopilotResponse`.
     - `MarkChannelAsRead(ctx, channelID, caller)`: Update `last_read_at`.
* **Verification:**
  Unit tests in `service_test.go` verifying message posting and permission validation.

---

### TASK-CHAT-07: REST & WebSocket HTTP Handlers (Chi Routes)
* **Story Reference:** All Stories
* **Target File:** `apps/api/internal/chat/handler.go`
* **Agent Instructions:**
  Mount Chi routes on `/api/v1/chat`:
  - `GET /channels`: List channels accessible to current authenticated user.
  - `POST /channels`: Create new channel.
  - `GET /channels/{id}`: Get channel details.
  - `GET /channels/{id}/messages`: Get message history with pagination (`limit`, `before`).
  - `POST /channels/{id}/messages`: Post new message.
  - `POST /channels/{id}/read`: Mark channel as read.
  - `GET /channels/{id}/ws`: WebSocket connection endpoint.
  - `GET /channels/{id}/events`: SSE stream endpoint.
  - `POST /copilot/query`: Direct REST query to ArogyaGrid AI Copilot.
* **Verification:**
  Test endpoints using `curl` with JWT token. Expected HTTP 200/201.

---

## Phase 4: ArogyaGrid AI Copilot Engine & Tool Calling

### TASK-CHAT-08: Deterministic Domain Tools for Copilot
* **Story Reference:** US-CHAT-05
* **Target File:** `apps/api/internal/chat/copilot_tools.go`
* **Agent Instructions:**
  Implement deterministic data access tools matching PRD Section 23:
  1. `ToolGetMedicineStock(facilityCode, medicineCode)`: Returns current balance, safety stock, and days of cover from `inventory.balances`.
  2. `ToolListDistrictRisks(district)`: Queries `intelligence.risk_alerts` for all CRITICAL or HIGH shortage risks in the specified district.
  3. `ToolGetFacilityCapacity(facilityCode)`: Queries `capacity.snapshots` for total beds, occupied beds, and available staff.
  4. `ToolFindSafeDonors(recipientFacilityCode, medicineCode, neededQty)`: Calls PRD Section 9.2 Safe Surplus formula:
     `safe_surplus = current_stock - safety_stock - predicted_demand_buffer`
     and returns top 3 ranked donor facilities with distances and surplus numbers.
* **Verification:**
  Unit tests verify that calling `ToolGetMedicineStock` returns accurate numbers matching PostgreSQL seed data.

---

### TASK-CHAT-09: Copilot NLP Intent Processor & Explainability Formatter
* **Story Reference:** US-CHAT-05
* **Target File:** `apps/api/internal/chat/copilot.go`
* **Agent Instructions:**
  1. Build Intent Processor recognizing operational questions:
     - Regex & semantic classifier for:
       - `INTENT_CHECK_STOCK`: "stock", "how many", "units", "quantity", "inventory"
       - `INTENT_LIST_RISKS`: "risk", "shortage", "critical", "alerts", "stockout"
       - `INTENT_CHECK_CAPACITY`: "beds", "capacity", "occupancy", "doctors", "nurses"
       - `INTENT_DONOR_SEARCH`: "donor", "transfer", "surplus", "where can i get"
  2. Extract parameters (Medicine name, Facility name, District).
  3. Execute appropriate tool from `TASK-CHAT-08`.
  4. Format response in clean, professional markdown with:
     - Clear numerical facts.
     - Explanation footer: *"Calculated using ArogyaGrid Safe Surplus Engine (PRD §9.2)"*.
     - Actionable suggestion (e.g. *"Click here to draft a transfer order"*).
* **Verification:**
  Submit queries like:
  - "What is the stock of Oxytocin at Capital Hospital?"
  - "Show critical shortages in Khurda"
  Verify that response contains exact real numbers and explainable markdown.

---

## Phase 5: Next.js Frontend Chat System

### TASK-CHAT-10: TypeScript Types, API Client & TanStack Query Hooks
* **Story Reference:** All Stories
* **Target Files:**
  - `apps/web/src/features/chat/types/chat.types.ts`
  - `apps/web/src/features/chat/api/chat-api.ts`
  - `apps/web/src/features/chat/hooks/useChat.ts`
* **Agent Instructions:**
  1. Define TypeScript interfaces for `ChatChannel`, `ChatMessage`, `MessageCard`, `CopilotResponse`.
  2. In `chat-api.ts`, create typed fetch methods with JWT auth headers.
  3. In `useChat.ts`, create TanStack React Query hooks:
     - `useChannels()`: Fetch and cache user channels.
     - `useMessages(channelId)`: Fetch message stream with refetch interval / WebSocket listener.
     - `useSendMessage()`: Mutation hook with optimistic UI update.
     - `useCopilotQuery()`: Mutation hook for instant AI assistant replies.
* **Verification:**
  `npm run build` verifies types compile without errors.

---

### TASK-CHAT-11: Interactive Chat UI Components
* **Story Reference:** US-CHAT-01, US-CHAT-02, US-CHAT-03, US-CHAT-04
* **Target Files:**
  - `apps/web/src/features/chat/components/ChannelList.tsx`
  - `apps/web/src/features/chat/components/MessageFeed.tsx`
  - `apps/web/src/features/chat/components/MessageComposer.tsx`
  - `apps/web/src/features/chat/components/InteractiveCards.tsx`
* **Agent Instructions:**
  1. `ChannelList.tsx`:
     - Group channels by: "AI Copilot", "District Channels", "Facility Internal", "Transfer Threads".
     - Show unread badge count and channel icons.
  2. `MessageFeed.tsx`:
     - Render scrollable message stream.
     - Distinguish user messages, system notifications, and AI Copilot responses.
     - Render role badges: `Facility Manager` (blue), `District Officer` (amber), `Logistics Officer` (purple), `AI Copilot` (teal/sparkle).
  3. `InteractiveCards.tsx`:
     - Render `StockoutAlertCard` with severity color, days of cover, and "Find Donor" button.
     - Render `TransferCard` with donor, destination, quantity, and 1-click "Approve" button.
  4. `MessageComposer.tsx`:
     - Input textarea supporting Enter to send, Shift+Enter for new line.
     - Quick prompt chips for Copilot (e.g. "Check Oxytocin stock", "Show Khurda risks").
* **Verification:**
  Test components in browser, ensuring layout is responsive and handles long messages cleanly.

---

### TASK-CHAT-12: Chat Page Route & Global Navbar Integration
* **Story Reference:** All Stories
* **Target Files:**
  - `apps/web/src/app/chat/page.tsx`
  - `apps/web/src/features/chat/pages/ChatPage.tsx`
  - `apps/web/src/components/Navbar.tsx`
* **Agent Instructions:**
  1. Create `/chat` route rendering `ChatPage`.
  2. In `Navbar.tsx`, add a prominent navigation link:
     - `💬 Operational Chat & Copilot` (`/chat`) with badge `"AI Live"`.
  3. In `WorkItemPanel.tsx` (Work Queue detail view), add a "Discuss in Chat" button that directly opens the contextual transfer chat thread.
* **Verification:**
  Navigate to `http://localhost:3000/chat` in browser and confirm complete chat application renders.

---

## Phase 6: Automated Tests, Verification & E2E Smoke

### TASK-CHAT-13: Backend Unit & Integration Tests
* **Story Reference:** All Stories
* **Target Files:**
  - `apps/api/internal/chat/service_test.go`
  - `apps/api/internal/chat/copilot_test.go`
* **Agent Instructions:**
  Write unit tests verifying:
  1. `TestSendMessage_Success`: Normal message saved and broadcasted.
  2. `TestSendMessage_EmptyContent_Rejected`: 400 Bad Request on empty message.
  3. `TestUnauthorizedChannelAccess`: 403 Forbidden when user attempts to access foreign facility channel.
  4. `TestCopilotStockQuery`: Asking for Oxytocin returns valid stock and days of cover.
  5. `TestCopilotSafeSurplusCalculation`: Verifies donor surplus calculation matches PRD formula.
* **Verification:**
  Run `go test -v ./internal/chat/...` in `apps/api`. Must output `PASS` for all test cases.

---

### TASK-CHAT-14: End-to-End Smoke Verification Script
* **Story Reference:** All Stories
* **Target File:** `scripts/test_chat_e2e.sh`
* **Agent Instructions:**
  Create automated bash script that:
  1. Authenticates as Facility Manager and District Officer.
  2. Lists available chat channels.
  3. Posts message into `#khurda-district-emergency`.
  4. Posts a query to `/api/v1/chat/copilot/query`: *"What is the stock of Oxytocin at Capital Hospital?"*.
  5. Verifies Copilot response contains `"320 units"` and HTTP 200.
  6. Prints formatted pass/fail report.
* **Verification:**
  Execute `chmod +x scripts/test_chat_e2e.sh && ./scripts/test_chat_e2e.sh`. Script exits with code 0.
