# 🏗️ Pramathi — Modular Business Platform: Complete Architecture Document

> **Purpose**: Pura codebase ka deep-dive — tech stack, auth system, DB design, Dashboard, Epic/Work system, aur dusre project mein same architecture replicate karna.

---

## 📦 1. Monorepo Structure (Turborepo + pnpm)

```
modular-business-platform/
├── apps/
│   ├── api/              # Backend (NestJS + Fastify)
│   ├── web/              # Frontend (React + Vite)
│   ├── worker/           # Background jobs
│   ├── superadmin-api/   # Super-admin backend
│   ├── superadmin-web/   # Super-admin frontend
│   └── superadmin-worker/
├── packages/
│   ├── contracts/        # Shared types & Zod schemas (API contracts)
│   ├── db/               # Database schema + repositories (Drizzle ORM)
│   ├── config/           # Runtime config loader
│   ├── ui/               # Shared UI component library (shadcn)
│   ├── permissions/      # RBAC permission engine
│   ├── licensing/        # Feature licensing logic
│   ├── catalogue/        # Product catalogue shared logic
│   └── testing/          # Test utilities
└── scripts/              # Build & validation scripts
```

### Build System
| Tool | Version | Role |
|------|---------|------|
| **Turborepo** | 2.9.14 | Monorepo build orchestration, task caching |
| **pnpm** | 11.10.0 | Package manager with workspaces |
| **TypeScript** | 5.9.2 | Strict typing across all packages |
| **Node.js** | 24.x | Runtime |

---

## 🖥️ 2. Tech Stack

### Backend (`apps/api`)
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | NestJS 11 | Modular DI-based server framework |
| **HTTP Adapter** | Fastify 5 | High-performance HTTP server |
| **Auth** | argon2id + jose (JWT) | Password hashing + access token signing |
| **ORM** | Drizzle ORM 0.45 | Type-safe SQL query builder |
| **Database** | PostgreSQL | Primary datastore |
| **WebSocket** | NestJS WebSockets + ws | Real-time session invalidation |
| **MFA** | otplib (TOTP) + AES-256 | Time-based OTP with encrypted secrets |
| **Validation** | Zod 4 | Runtime schema validation |
| **OpenAPI** | @nestjs/swagger | Auto-generated API docs |
| **Rate Limiting** | @fastify/rate-limit | Login abuse protection |
| **CORS/Helmet** | @fastify/cors, @fastify/helmet | Security headers |

### Frontend (`apps/web`)
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 19 | UI rendering |
| **Build Tool** | Vite 7 | Fast dev server + bundler |
| **Routing** | TanStack Router 1.170 | Type-safe file-based routing |
| **Data Fetching** | TanStack Query 5 | Server state management |
| **Forms** | React Hook Form + Zod | Form validation |
| **UI Components** | shadcn/ui + Radix UI | Accessible component library |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **Icons** | Lucide React | Icon library |
| **Testing** | Vitest + Testing Library | Unit tests |
| **E2E Testing** | Playwright | End-to-end tests |

### Database (`packages/db`)
| Layer | Technology |
|-------|-----------|
| **ORM** | Drizzle ORM |
| **Migrations** | Drizzle Kit |
| **Schema** | PostgreSQL schemas (namespaced) |
| **Pattern** | Repository Pattern |

---

## 🔐 3. Auth System — Deep Dive

> Auth system do-tier hai: **Backend (`apps/api/src/modules/auth`)** + **Frontend (`apps/web/src/auth`)**

### 3.1 Auth Flow — High Level

```
User Login → Rate Limit Check → Identity Lookup → Password Verify
          → MFA Check (if enrolled) → Session Create → JWT Issue
          → Refresh Token (HttpOnly Cookie) + Access Token (memory)
```

### 3.2 Backend Auth Architecture

#### Files
- [`auth.service.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/api/src/modules/auth/auth.service.ts) — Core auth logic
- [`auth.types.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/api/src/modules/auth/auth.types.ts) — Interface definitions
- [`auth.module.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/api/src/modules/auth/auth.module.ts) — NestJS module registration
- [`auth.controller.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/api/src/modules/auth/auth.controller.ts) — HTTP endpoints
- [`drizzle-auth.repository.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/api/src/modules/auth/drizzle-auth.repository.ts) — DB operations
- [`password-hasher.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/api/src/modules/auth/password-hasher.ts) — argon2id hashing
- [`access-token-signer.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/api/src/modules/auth/access-token-signer.ts) — JWT signing via `jose`
- [`login-abuse-protector.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/api/src/modules/auth/login-abuse-protector.ts) — In-memory rate limiting
- [`mfa-crypto.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/api/src/modules/auth/mfa-crypto.ts) — AES-256 encrypt/decrypt for MFA secrets

#### Key Interfaces (auth.types.ts)

```typescript
// Login ke 3 identity types supported
type NormalizedIdentityKind = 'email' | 'phone' | 'username';

// Session object (har protected route pe yahi travel karta hai)
type AuthenticatedSession = {
  sessionId: string;
  userId: string;
  tenantId: string;
  permissionVersion: number;
};

// Login result union type
type LoginServiceResult =
  | (LoginResponse & { refreshToken: string })  // success
  | MfaPendingLoginResponse                      // MFA required
  | LoginFailure;                               // rate_limited | failure
```

#### Auth Module — Dynamic Registration Pattern

```typescript
// app.module.ts mein aise register hota hai:
AuthModule.register({
  tenantId: config.tenantId,
  repository: drizzleAuthRepository,
  passwordHasher: argon2Hasher,
  accessTokenSigner: jwtSigner,
  accessTokenVerifier: jwtVerifier,
  abuseProtector: inMemoryRateLimiter,
  fingerprinter: hmacFingerprinter,
  mfa: { secretCipher, totpProvider, recoveryCodes, abuseProtector },
}, { 
  includeController: true,
  sessionInvalidation: 'realtime'  // WebSocket-based instant logout
})
```

#### Token Strategy
- **Access Token**: Short-lived JWT (900 seconds / 15 min), stored **in memory** (never localStorage)
- **Refresh Token**: Long-lived (30 days), stored as **HttpOnly cookie** (CSRF-protected)
- **Refresh Token Rotation**: Har refresh pe naya token, reuse detect hone par **family revocation**

#### Security Features
| Feature | Implementation |
|---------|---------------|
| Password Hashing | argon2id with configurable parameters |
| Account Lockout | Failed attempts → `lockedUntil` field in DB |
| TOTP MFA | otplib, secret encrypted with AES-256 key |
| MFA Recovery | Pre-hashed recovery codes (peppered) |
| Session Invalidation | WebSocket push on logout from other device |
| Login Fingerprint | HMAC of identity to tie rate limit to account |
| CSRF | Double-submit cookie pattern |
| Token Reuse Detection | Refresh token family tracking in DB |

### 3.3 Database Schema — Auth Related

> Schema namespace: `iam` (PostgreSQL schema)

```sql
-- IAM Schema Tables:

iam.users              -- User records (id, tenantId, displayName, status, permissionVersion)
iam.user_identities    -- Login identifiers (email/phone/username → normalized)
iam.credentials        -- Password hashes (argon2id, failedAttempts, lockedUntil)
iam.credential_reset_tokens  -- Admin-issued activation links (hash-only)
iam.sessions           -- Durable session records (revocable)
iam.refresh_tokens     -- Refresh tokens (hash-only, familyId for reuse detection)
iam.mfa_methods        -- TOTP methods (encrypted secret, status: pending/active/disabled)
iam.mfa_login_challenges    -- Temporary MFA challenge records
iam.mfa_recovery_codes      -- Hashed recovery codes
iam.login_attempts           -- Audit trail for failed logins
iam.mfa_audit                -- Audit trail for MFA events
```

**Key design decisions:**
- Refresh token: sirf hash store hota hai, original token never persisted
- MFA secret: AES-256 encrypted in DB, decrypt sirf verification ke waqt
- `permissionVersion`: har role change pe increment, session invalidation trigger

### 3.4 Frontend Auth Architecture

#### Files
- [`auth-session.tsx`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/web/src/auth/auth-session.tsx) — Core React Context + session lifecycle
- [`login-form.tsx`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/web/src/auth/login-form.tsx) — Login UI
- [`mfa-challenge.tsx`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/web/src/auth/mfa-challenge.tsx) — MFA code entry
- [`mfa-management.tsx`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/web/src/auth/mfa-management.tsx) — Enroll/disable MFA
- [`session-list.tsx`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/web/src/auth/session-list.tsx) — View/revoke active sessions
- [`session-api.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/web/src/auth/session-api.ts) — API calls for session management

#### `AuthSessionProvider` — Core Pattern

```typescript
// main.tsx mein wrap hota hai:
<AuthSessionProvider>
  <RoutedApplication />
</AuthSessionProvider>

// Context expose karta hai:
type AuthSession = {
  accessToken: string | null;
  isSessionResolved: boolean;
  mfaChallengeId: string | null;
  setAccessToken: (token, expiresInSeconds?) => void;
  ensureSession: () => Promise<string | null>;
  renewSession: () => Promise<string | null>;
  signOut: () => Promise<void>;
};
```

#### Token Lifecycle in Frontend
1. **On Load**: `ensureSession()` → cookie-backed refresh attempt
2. **Proactive Renewal**: Timer scheduled `(expiresAt - 2min)` before expiry
3. **401 Bridge**: API client ki 401 response pe auto-renew
4. **Logout**: Cookie revocation, generation bump (prevents stale refresh from restoring)
5. **Generation Counter**: Prevents race conditions between concurrent refresh flights

---

## 📊 4. Dashboard System

### Location
[`apps/web/src/dashboard/dashboard-page.tsx`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/web/src/dashboard/dashboard-page.tsx)

### Architecture Pattern
Dashboard ek **pure presentational component** hai — koi API calls nahi, koi state nahi.

```
DashboardPage
├── Hero Section       → "Workspace online" badge + CTA to Sales Module
├── Workspace Overview → 3 Module Cards (Customer, My Work, Operations)
│   ├── Customer workspace  → status: "Next"    → /customers
│   ├── My Work             → status: "Active"  → /work
│   └── Operations          → status: "Planned" → (no link)
└── Account & Activity
    ├── Security Card  → Active Sessions + MFA links
    └── Activity Feed  → Empty state (future: authorized updates)
```

### Module Readiness States
```typescript
const readiness = [
  { title: 'Customer workspace', state: 'Next', to: '/customers' },
  { title: 'My Work',           state: 'Active', to: '/work' },
  { title: 'Operations',        state: 'Planned' },  // no link yet
];
```

### Dashboard Route Guard
Router mein auth guard laga hai — `/` route sirf logged-in users dekh sakte hain:

```typescript
// router.tsx
const protectedRoute = createRoute({
  beforeLoad: async ({ context }) => {
    const token = await context.auth.ensureSession();
    if (!token) throw redirect({ to: '/login' });
  }
})
```

### Styling Conventions
- `dashboard-hero` class — global CSS mein gradient hero
- `dashboard-action` — clickable action card links
- `eyebrow` — small label text above headings
- Responsive: `lg:grid-cols-3`, `sm:space-y-8`

---

## ⚡ 5. Epic / Work Item System

> "Epic" = **Work Item** system. Yeh internal task/workflow management system hai.

### 5.1 Architecture Overview

```
Work System (3 layers):

Frontend                Backend                   Database
────────────────────    ────────────────────────   ──────────────────────
WorkQueuePage.tsx  ──→  work.controller.ts    ──→  work.work_items
work-api.ts        ──→  work.service.ts       ──→  work.work_item_assignments
WorkItemPanel.tsx       work.types.ts              work.work_item_handoffs
HandoffDialog.tsx        drizzle-work-repository    work.work_item_comments
                                                    work.work_item_due_dates
                                                    work.work_item_status_history
```

### 5.2 Backend Work Module

#### Files
- [`work.controller.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/api/src/modules/business/work/work.controller.ts) — HTTP routes
- [`work.service.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/api/src/modules/business/work/work.service.ts) — Business logic
- [`work.types.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/api/src/modules/business/work/work.types.ts) — Repository interface + error types
- [`work.module.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/api/src/modules/business/work/work.module.ts) — NestJS module
- [`drizzle-work-repository.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/packages/db/src/drizzle-work-repository.ts) — DB implementation

#### Work Item Status Machine

```
waiting → assigned → in_progress → completed
                   ↓
                 returned (back to team queue)
```

#### Work Item Transitions (API endpoints)
| Transition | Method | Endpoint |
|------------|--------|----------|
| Create | POST | `/work/items` |
| Get detail | GET | `/work/items/:id` |
| Assign | POST | `/work/items/:id/transitions/assign` |
| Accept | POST | `/work/items/:id/transitions/accept` |
| Reassign | POST | `/work/items/:id/transitions/reassign` |
| Complete | POST | `/work/items/:id/transitions/complete` |
| Return | POST | `/work/items/:id/transitions/return` |
| Handoff | POST | `/work/items/:id/transitions/handoff` |
| Comments | GET/POST | `/work/items/:id/comments` |
| History | GET | `/work/items/:id/history` |

#### Idempotency Pattern
Har mutation `Idempotency-Key` header required hai → network retry safe:

```typescript
function mutationHeaders(idempotencyKey: string) {
  return { 'Idempotency-Key': idempotencyKey };
}
```

### 5.3 Work Queue Views

```typescript
type WorkQueueView = 'my' | 'team' | 'overdue' | 'waiting' | 'completed';
```

| View | Description |
|------|-------------|
| `my` | Current user ke assigned items |
| `team` | User ke team ki unassigned items |
| `overdue` | Due date cross kar chuke items |
| `waiting` | Kisi ka response wait kar raha hai |
| `completed` | Done items |

### 5.4 Database Schema — Work

```typescript
// work.work_items (main table)
{
  id: uuid PK,
  tenantId: uuid FK → core.tenants,
  locationId: uuid FK → core.locations,  // IMMUTABLE (PostgreSQL trigger)
  type: varchar(64),        // e.g., 'sales_order', 'leave_approval'
  priority: varchar(32),    // 'normal' | 'high' | 'urgent'
  currentTeamId: uuid FK → iam.teams,
  assignedUserId: uuid FK → iam.users,
  dueDate: timestamp,
  status: enum('waiting','assigned','in_progress','completed','returned'),
  source: varchar(64),      // origin module
  entityKind: varchar(64),  // linked entity type
  entityId: uuid,           // linked entity ID (e.g., sales order UUID)
  createdAt, updatedAt
}

// work.work_item_handoffs (team transfers)
{ fromTeamId, toTeamId, fromUserId, toUserId, reason, handoffTime }

// work.work_item_status_history (full audit trail)
{ status, reason, changedByUserId, changedAt }
```

**Key design**: `entityKind + entityId` — work item kisi bhi entity (order, leave request, etc.) se link ho sakta hai. Yeh generic work tracking ka pattern hai.

### 5.5 Frontend Work System

#### [`WorkQueuePage.tsx`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/web/src/work/WorkQueuePage.tsx)
```
WorkQueuePage
├── Queue Selector Cards (My Work / Team / Overdue / Waiting / Completed)
├── Work Items Table
│   ├── Columns: Type, Priority, Status, Due Date, Assigned User
│   └── Row Click → WorkItemPanel (side panel)
├── WorkItemPanel (detail view)
│   ├── Entity link (e.g., sales order)
│   ├── Comments section
│   ├── Status history
│   └── Action buttons (Accept / Complete / Return / Handoff)
└── HandoffDialog (transfer to another team)
```

#### Data Flow
```typescript
// TanStack Query pattern:
const queueQuery = useQuery({
  queryKey: ['work', 'queue', activeTab, locationId],
  queryFn: () => fetchWorkQueue(accessToken, activeTab, { locationId }),
});

// Mutation with optimistic update:
const completeMutation = useMutation({
  mutationFn: ({ id, key }) => completeWorkItem(accessToken, id, key),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['work'] }),
});
```

---

## 🏛️ 6. Backend Architecture — Deep Dive

### 6.1 Module Structure (NestJS)

```
apps/api/src/modules/
├── auth/              # Authentication (AUTH-001)
├── core/
│   ├── access/        # RBAC guard + permission evaluation (IAM-002)
│   ├── audit/         # Audit log access
│   ├── documents/     # Document generation
│   ├── exports/       # Data export
│   ├── files/         # File storage
│   ├── health/        # Health check endpoint
│   ├── imports/       # Bulk data import
│   ├── locations/     # Physical locations
│   ├── privacy/       # Data privacy/GDPR
│   ├── realtime/      # WebSocket gateway
│   ├── settings/      # Tenant settings
│   └── tenant/        # Tenant management
├── iam/
│   ├── roles/         # Role management (RBAC)
│   ├── users/         # User management
│   └── permission-events/  # Permission version events
├── business/
│   ├── crm/           # Customer relationship
│   ├── notifications/ # Push notifications
│   ├── reminders/     # Scheduled reminders
│   ├── visits/        # Field visits
│   └── work/          # Work item system ⭐
├── catalogue/
│   ├── product-masters/
│   └── product-requests/
├── inventory/         # Stock management
├── damage/            # Damage reports
├── hrms/              # HR management
├── purchase/          # Purchase orders
├── sales/             # Sales module
└── reporting/         # Reports
```

### 6.2 Access Control (RBAC) Layer

#### `AccessModule` → Guards every protected route

```typescript
// Every protected controller uses:
@UseGuards(AuthenticatedSessionGuard, EffectiveAccessGuard)

// AccessEvaluationContextResolver resolves:
{
  principal: {
    userId, tenantId,
    authenticated, active,
    tokenPermissionVersion,
    currentPermissionVersion,  // DB se fresh
    roleCapabilities: [],       // user ke roles se capabilities
    overrideCapabilities: [],   // explicit grants
    owner: boolean
  },
  licence: { state, capabilities },  // feature licensing
  scopes: [],                        // location/team scopes
  resource: { tenantId, locationId }
}
```

### 6.3 Environment Configuration

```
Required env vars:
DATABASE_URL          PostgreSQL connection string
TENANT_SLUG           Tenant identifier
AUTH_ACCESS_TOKEN_SECRET     JWT signing secret (min 32 chars)
AUTH_LOGIN_FINGERPRINT_SECRET
AUTH_MFA_ENCRYPTION_KEY      Base64url 32-byte key for AES-256
AUTH_MFA_RECOVERY_CODE_PEPPER
AUTH_CREDENTIAL_RESET_TOKEN_PEPPER
AUTH_CREDENTIAL_RESET_URL_BASE
AUTH_TOKEN_ISSUER / AUTH_TOKEN_AUDIENCE
AUTH_ACCESS_TOKEN_TTL_SECONDS (600–900, default 900)
CORS_ORIGINS / CSRF_TRUSTED_ORIGINS
RATE_LIMIT_MAX / RATE_LIMIT_WINDOW_MS
```

---

## 🗄️ 7. Database Architecture

### 7.1 PostgreSQL Schema Namespacing

```
PostgreSQL Schemas (namespaces):
├── core          → tenants, locations, settings
├── iam           → users, identities, credentials, sessions, mfa
├── work          → work_items, assignments, handoffs, comments
├── inventory     → stock, transfers, counts, reservations
├── sales         → quotations, orders, reservations
├── purchase      → requests, orders, receipts
├── crm           → contacts, interactions, follow-ups
├── hrms          → employees, teams, leave
├── catalogue     → products, categories, prices
├── audit         → immutable audit log (append-only)
├── notifications → notification records
├── licensing     → capability grants, usage
└── reporting     → report templates
```

### 7.2 Core Patterns

#### Tenant Isolation
```typescript
// Har query mein tenantId mandatory:
where(eq(workItems.tenantId, session.tenantId))
```

#### Idempotency Keys
```typescript
// Create operations mein UUID-based idempotency:
uniqueIndex('locations_tenant_idempotency_unique').on(
  table.tenantId, table.createIdempotencyKey
)
```

#### Keyset Pagination (cursor-based)
```typescript
// Alphabetical list ke liye:
index('locations_tenant_name_id_cursor_index').on(
  table.tenantId, sql`lower(${table.name})`, table.id
)
```

#### Version-based Optimistic Locking
```typescript
// Concurrent update conflict detection:
version: integer('version').notNull().default(1)
// Update: WHERE version = expectedVersion AND increment
```

#### Audit Trail
```typescript
// Har significant change ka immutable record:
audit.events table → append-only, no UPDATE allowed
```

### 7.3 Repository Pattern

```typescript
// Every DB module ek interface define karta hai:
interface WorkRepository {
  get(input: GetInput): Promise<WorkItemDetailResponse | null>;
  listQueue(input: QueueInput): Promise<WorkQueuePageResponse>;
  create(input: CreateInput): Promise<WorkItemResponse>;
  assign(input: AssignInput): Promise<WorkItemResponse | null>;
  // ... etc
}

// Concrete implementation:
class DrizzleWorkRepository implements WorkRepository { ... }

// NestJS injection:
{ provide: WORK_REPOSITORY_TOKEN, useClass: DrizzleWorkRepository }
```

---

## 🎨 8. Frontend Architecture

### 8.1 Application Entry

```
main.tsx
└── StrictMode
    └── ApplicationErrorBoundary
        └── QueryClientProvider
            └── AuthSessionProvider
                └── TooltipProvider
                    └── RouterProvider (context: { auth })
```

### 8.2 Router Architecture (TanStack Router)

```typescript
// Root route → auth context inject hota hai
const rootRoute = createRootRouteWithContext<{ auth: AuthSession }>()({...})

// Auth-protected layout
const appRoute = createRoute({
  beforeLoad: async ({ context }) => {
    const token = await context.auth.ensureSession();
    if (!token) throw redirect({ to: '/login' });
    return { accessToken: token };
  }
})

// Protected routes → AppShell ke andar
const dashboardRoute = createRoute({ path: '/', component: DashboardPage })
const workRoute = createRoute({ path: '/work', component: WorkQueuePage })
```

### 8.3 API Client Pattern

```typescript
// Centralized authorized fetch:
authorizedFetch(path, init, { accessToken, fetcher, apiBaseUrl })

// Auth bridge (401 auto-retry):
bindAuthRequestBridge({
  getAccessToken: () => accessTokenRef.current,
  renewSession: () => renewSessionRef.current()
})

// Zod validation on response:
workQueuePageResponseSchema.parse(await request(...))
```

### 8.4 Contracts Package (`@platform/contracts`)

Shared TypeScript types aur Zod schemas jo backend aur frontend dono use karte hain:

```typescript
// Backend: Zod se validate karta hai incoming request
// Frontend: Zod se validate karta hai API response

loginResponseSchema
workItemResponseSchema
workQueuePageResponseSchema
// ... etc
```

---

## 🔄 9. Real-time System

```
WebSocket Flow:
User logs out from Device A
        ↓
AuthController → RealtimeSessionInvalidator.invalidate(sessionId)
        ↓
RealtimeConnectionRegistry.broadcast(sessionId, 'session:invalidated')
        ↓
Frontend (Device B) receives → clearLocalSession() → redirect to /login
```

---

## 🆕 10. Naye Project Mein Same Architecture Replicate Karna

### Step 1: Monorepo Setup

```bash
# Structure create karo:
mkdir my-platform && cd my-platform
pnpm init
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'

# Install turborepo
pnpm add -Dw turbo typescript prettier eslint
```

### Step 2: Packages Create Karo

```
packages/
├── contracts/    # Zod schemas + shared types
├── db/           # Drizzle schema + repositories
├── config/       # Env validation (Zod)
└── ui/           # shadcn component library
```

**contracts/src/index.ts pattern:**
```typescript
// Har resource ke liye:
export const userResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  // ...
});
export type UserResponse = z.infer<typeof userResponseSchema>;
```

**db/src/schema/[domain].ts pattern:**
```typescript
const mySchema = pgSchema('my_domain');

export const myTable = mySchema.table('my_table', {
  id: uuid('id').primaryKey(),
  tenantId: uuid('tenant_id').notNull(),
  // ...
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull().default(sql`now()`),
}, (table) => [
  index('my_table_tenant_index').on(table.tenantId),
]);
```

### Step 3: Backend App (NestJS + Fastify)

```bash
cd apps/api
pnpm add @nestjs/core @nestjs/common @nestjs/platform-fastify fastify
pnpm add drizzle-orm zod argon2 jose otplib
```

**Module pattern:**
```typescript
// my-feature.module.ts
@Module({})
export class MyFeatureModule {
  static register(options: MyFeatureOptions): DynamicModule {
    return {
      module: MyFeatureModule,
      controllers: [MyFeatureController],
      providers: [
        { provide: MyFeatureService, useFactory: (...) => new MyFeatureService(...) },
        { provide: MY_REPOSITORY_TOKEN, useClass: DrizzleMyFeatureRepository },
      ],
      exports: [MyFeatureService],
    };
  }
}
```

**Service → Repository separation:**
```typescript
// Service: business logic (no DB import)
// Repository: DB queries (Drizzle import)
// Interface: WorkRepository → DrizzleWorkRepository

// types.ts mein:
export interface MyRepository {
  findById(id: string): Promise<MyEntity | null>;
  create(input: CreateInput): Promise<MyEntity>;
}
```

### Step 4: Auth System Copy

```typescript
// 1. Copy auth module files
// 2. DB schema copy karo (iam.ts)
// 3. Environment variables set karo
// 4. app.module.ts mein register karo:

AuthModule.register({
  tenantId: config.tenantId,
  repository: new DrizzleAuthRepository(db),
  passwordHasher: new Argon2PasswordHasher(),
  accessTokenSigner: new JoseAccessTokenSigner(secret),
  accessTokenVerifier: new JoseAccessTokenVerifier(secret),
  abuseProtector: new InMemoryLoginAbuseProtector(),
  fingerprinter: new HmacLoginFingerprinter(secret),
}, { includeController: true, sessionInvalidation: 'disabled' })
```

### Step 5: Frontend App (React + Vite)

```bash
cd apps/web
pnpm add react react-dom @tanstack/react-router @tanstack/react-query
pnpm add tailwindcss shadcn zod react-hook-form
pnpm add -D vite @vitejs/plugin-react vitest playwright
```

**main.tsx pattern:**
```tsx
createRoot(rootElement).render(
  <StrictMode>
    <ApplicationErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthSessionProvider>
          <RouterProvider context={{ auth }} router={router} />
        </AuthSessionProvider>
      </QueryClientProvider>
    </ApplicationErrorBoundary>
  </StrictMode>
);
```

**router.tsx pattern:**
```typescript
const rootRoute = createRootRouteWithContext<{ auth: AuthSession }>()({
  component: () => <Outlet />,
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  beforeLoad: async ({ context }) => {
    const token = await context.auth.ensureSession();
    if (!token) throw redirect({ to: '/login' });
    return { accessToken: token };
  },
  component: AppShell,
});
```

### Step 6: Work/Epic System Add Karna

```
1. DB schema copy: packages/db/src/schema/work.ts
2. Backend copy: apps/api/src/modules/business/work/
3. Contracts add: packages/contracts/src/work.ts (schemas)
4. Frontend copy: apps/web/src/work/
5. Router mein route add: /work → WorkQueuePage
```

**Entity linking pattern (generic work items):**
```typescript
// Kisi bhi entity se work item link ho sakta hai:
entityKind: 'sales_order' | 'leave_request' | 'damage_report' | '...'
entityId: uuid  // linked entity ka ID
```

---

## ✅ 11. Architecture Checklist — Naya Project Ke Liye

### Foundation
- [ ] Turborepo + pnpm workspace setup
- [ ] TypeScript strict mode everywhere
- [ ] Shared `contracts` package (Zod schemas)
- [ ] Shared `db` package (Drizzle + repositories)
- [ ] Environment schema validation (Zod) on startup

### Auth
- [ ] `argon2id` password hashing (no bcrypt)
- [ ] Short-lived JWT access tokens (15 min)
- [ ] Long-lived HttpOnly cookie refresh tokens (30 days)
- [ ] Refresh token rotation + reuse detection
- [ ] TOTP MFA support
- [ ] Session management UI (list + revoke)
- [ ] Rate limiting on login endpoint
- [ ] Account lockout after N failed attempts

### Backend
- [ ] NestJS + Fastify (not Express)
- [ ] Dynamic module registration pattern
- [ ] Repository interface + Drizzle implementation
- [ ] Tenant isolation on every query
- [ ] Idempotency keys on all mutations
- [ ] Audit trail (append-only)
- [ ] OpenAPI auto-generation

### Frontend
- [ ] `AuthSessionProvider` wrapping everything
- [ ] TanStack Router with auth context
- [ ] TanStack Query for server state
- [ ] Zod validation on API responses
- [ ] Proactive token renewal (before expiry)
- [ ] 401 auto-retry bridge

### Database
- [ ] PostgreSQL schema namespacing per domain
- [ ] `tenantId` on every table
- [ ] Keyset pagination (cursor-based)
- [ ] `version` field for optimistic locking
- [ ] Indexes: `(tenantId, status)`, `(tenantId, entityKind, entityId)`

---

## 📁 Quick File Reference

| What | Path |
|------|------|
| **Auth Service (backend)** | [`apps/api/src/modules/auth/auth.service.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/api/src/modules/auth/auth.service.ts) |
| **Auth Context (frontend)** | [`apps/web/src/auth/auth-session.tsx`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/web/src/auth/auth-session.tsx) |
| **Dashboard Page** | [`apps/web/src/dashboard/dashboard-page.tsx`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/web/src/dashboard/dashboard-page.tsx) |
| **Work Queue Page** | [`apps/web/src/work/WorkQueuePage.tsx`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/web/src/work/WorkQueuePage.tsx) |
| **Work API (frontend)** | [`apps/web/src/work/work-api.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/web/src/work/work-api.ts) |
| **Work Service (backend)** | [`apps/api/src/modules/business/work/work.service.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/api/src/modules/business/work/work.service.ts) |
| **IAM DB Schema** | [`packages/db/src/schema/iam.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/packages/db/src/schema/iam.ts) |
| **Work DB Schema** | [`packages/db/src/schema/work.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/packages/db/src/schema/work.ts) |
| **Core DB Schema** | [`packages/db/src/schema/core.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/packages/db/src/schema/core.ts) |
| **App Module** | [`apps/api/src/app.module.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/api/src/app.module.ts) |
| **Router** | [`apps/web/src/router.tsx`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/web/src/router.tsx) |
| **Main Entry** | [`apps/web/src/main.tsx`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/web/src/main.tsx) |
| **API Config** | [`apps/api/src/config.ts`](file:///home/sarthaktripathy/Documents/Pramathi-new/modular-business-platform/apps/api/src/config.ts) |
