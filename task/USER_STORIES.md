# USER STORIES: ArogyaGrid Chat & AI Copilot System

> **Parent Epic:** `EPIC-CHAT-01`  
> **PRD Source:** [ArogyaGrid_Detailed_PRD.docx](file:///home/sarthaktripathy/Documents/Arogya/ArogyaGrid_Detailed_PRD.docx) (Section 4: Stakeholders, Personas and Roles)  
> **Status:** `APPROVED`

---

## User Story Map Overview

| Story ID | Story Title | Primary Persona | Priority |
| :--- | :--- | :--- | :--- |
| **US-CHAT-01** | Facility Channel & Staff Collaboration | Facility Manager | P0 |
| **US-CHAT-02** | District Coordination & Emergency Channel | District Health Officer | P0 |
| **US-CHAT-03** | Contextual Transfer Threading & Negotiation | Facility Manager & District Officer | P0 |
| **US-CHAT-04** | Interactive Alert & Transfer Cards in Chat | Logistics & Facility Officers | P0 |
| **US-CHAT-05** | ArogyaGrid AI Resource Copilot Assistant | All Healthcare Personas | P0 |
| **US-CHAT-06** | Direct Peer-to-Peer Messaging | Facility Managers & Logistics Drivers | P1 |
| **US-CHAT-07** | Channel Access Control & Audit Governance | State / National Admin | P0 |

---

## US-CHAT-01: Facility Channel & Internal Staff Collaboration

**As a** Facility Manager at a Primary Health Center (e.g. Pipili PHC),  
**I want** a dedicated, authenticated `#facility-operations` chat channel for my facility,  
**So that** my staff, nurses, and pharmacists can coordinate daily stock counts, bed availability, and emergency shifts in one shared space.

### Acceptance Criteria
```gherkin
Scenario: Facility Manager logs in and views their facility channel
  Given the user is logged in as "Riya" with role "facility_manager" for facility "Capital Hospital"
  When they navigate to the Chat interface at "/chat"
  Then they should see "#capital-hospital-internal" in their channel list
  And clicking it loads the recent chronological message history
  And any message sent displays "Riya (Facility Manager)" with a blue role badge.

Scenario: Unauthorized cross-facility access is blocked
  Given the user is logged in as a Facility Manager for "Pipili PHC"
  When they attempt to join or fetch messages from "#capital-hospital-internal"
  Then the API returns HTTP 403 Forbidden with error code "UNAUTHORIZED_CHANNEL_ACCESS"
  And no messages from Capital Hospital are exposed.
```

---

## US-CHAT-02: District Coordination & Emergency Channel

**As a** District Health Officer (e.g. Vaishnavi for Khurda District),  
**I want** a district-wide coordination channel (`#khurda-district-emergency`) containing all Facility Managers within my district,  
**So that** I can broadcast high-priority shortage alerts, request volunteer donor facilities, and coordinate regional response during epidemic or disaster surges.

### Acceptance Criteria
```gherkin
Scenario: District Officer broadcasts an emergency alert
  Given the user is logged in as "Vaishnavi" with role "district_officer" for district "Khurda"
  When she posts an emergency announcement into "#khurda-district-emergency"
  Then all online Facility Managers belonging to Khurda district receive the message instantly via WebSocket
  And the message is styled with an "Urgent District Notice" indicator.

Scenario: Facility Manager replies to District Officer
  Given a Facility Manager at "Jatni CHC" reads the announcement
  When they reply in the district channel offering surplus Normal Saline
  Then the message is visible to the District Officer and all member facilities in Khurda.
```

---

## US-CHAT-03: Contextual Transfer Threading & Negotiation

**As a** Facility Manager facing an imminent stockout,  
**I want** to chat inside a thread tied directly to a specific Transfer Recommendation (`transfer_id`),  
**So that** the donor facility, recipient facility, and district approver can discuss dispatch logistics, vehicle arrival times, and cold-chain conditions without losing context.

### Acceptance Criteria
```gherkin
Scenario: Opening chat from a Transfer Recommendation
  Given a Transfer Recommendation exists from "Capital Hospital" to "Pipili PHC" for "Oxytocin 10 IU"
  When the Facility Manager clicks "Discuss Transfer" in the UI
  Then a contextual chat thread is created or opened linked to "transfer_id"
  And the header displays the Transfer summary: "Transfer #TR-004: 50 units Oxytocin"
  And both the donor Facility Manager, recipient Facility Manager, and District Officer are automatically joined as channel members.

Scenario: System posts status changes into transfer thread
  Given an active transfer chat thread
  When the District Officer approves the transfer order
  Then the system automatically posts an audit message into the chat:
    "System: Transfer approved by Vaishnavi (District Officer) at 14:32. Status moved to DISPATCHED."
```

---

## US-CHAT-04: Interactive Alert & Transfer Cards in Chat

**As an** operational healthcare officer,  
**I want** to share rich interactive cards (Stockout Alerts, Transfer Recommendations) into chat channels,  
**So that** other officers can review key numbers (Days of Cover, Safe Surplus, Distance) and click "Review / Approve" directly from the conversation.

### Acceptance Criteria
```gherkin
Scenario: Sharing a Stockout Alert card into chat
  Given a Critical Stockout Alert for "Anti-Rabies Vaccine" at "Khurda DHH"
  When the user clicks "Share to Channel" and selects "#khurda-district-emergency"
  Then a rich card is rendered in the chat stream showing:
    | Field | Value |
    | Medicine | Anti-Rabies Vaccine |
    | Severity | CRITICAL (Red Badge) |
    | Days of Cover | 0.8 Days |
    | Current Stock | 12 Vials |
  And the card contains a primary CTA button: "Find Safe Donor".

Scenario: Clicking action on a Transfer Card in chat
  Given a Transfer Recommendation Card in chat with an "Approve Transfer" button
  When an authorized District Officer clicks "Approve"
  Then the transfer state is transitioned to "APPROVED" via API call
  And the card updates inline to show "✓ Approved by Vaishnavi".
```

---

## US-CHAT-05: ArogyaGrid AI Resource Copilot Assistant

**As a** Healthcare Administrator or Facility Manager,  
**I want** to chat with the ArogyaGrid AI Copilot in natural language,  
**So that** I can instantly query inventory levels, short-term demand forecasts, bed capacities, and donor recommendations without having to manually click through multiple dashboards.

### Acceptance Criteria
```gherkin
Scenario: Querying medicine stock in natural language
  Given a user is in the "#arogyagrid-copilot" channel
  When they submit: "How many units of Oxytocin are available at Capital Hospital?"
  Then the Copilot calls the deterministic Inventory tool
  And returns a structured response:
    "Capital Hospital currently has **320 units** of Oxytocin (Safety stock: 100 units, Safe surplus: 180 units)."
  And shows an explainability badge: "Verified from PostgreSQL inventory.balances".

Scenario: Querying critical risk alerts across district
  Given multiple active risk alerts in Khurda district
  When the user asks: "Show me all critical shortages in Khurda"
  Then the Copilot returns a bulleted summary of all facilities with Days of Cover < 2 days
  Along with quick links to generate transfer recommendations for each.

Scenario: Querying bed capacity
  When the user asks: "What is the bed occupancy at Jatni CHC?"
  Then the Copilot queries capacity.snapshots
  And replies with total beds, occupied beds, and available emergency beds.
```

---

## US-CHAT-06: Direct Peer-to-Peer Messaging

**As a** Logistics Driver or Facility Manager,  
**I want** to send a direct message to a specific officer (e.g. contacting the warehouse pharmacist directly),  
**So that** sensitive or 1-on-1 operational updates (e.g. "Ambulance driver is at the back gate with cold box") can be communicated swiftly.

### Acceptance Criteria
```gherkin
Scenario: Starting a direct message
  Given an authenticated user
  When they search for a user name "Shneanjali" and click "Message"
  Then a 1-on-1 direct channel is opened
  And only the two participating users can see the conversation.
```

---

## US-CHAT-07: Channel Access Control & Audit Governance

**As a** State / National Health Administrator,  
**I want** complete RBAC enforcement and immutable audit trails on all operational communications,  
**So that** no unauthorized personnel access clinical discussions, and critical transfer agreements can be reviewed for public-health accountability.

### Acceptance Criteria
```gherkin
Scenario: Audit logging on sensitive channel events
  When a new channel is created or a transfer card is approved in chat
  Then an audit event is appended to "audit.events" with actor_id, event_type, and metadata
  And audit logs cannot be modified or deleted.

Scenario: Patient PII guardrail enforcement
  When a user accidentally inputs a phone number, Aadhaar number, or patient name in chat
  Then the system warns the user: "Reminder: ArogyaGrid is an operational resource grid. Do not share patient clinical PII."
  In compliance with PRD Section 17.
```
