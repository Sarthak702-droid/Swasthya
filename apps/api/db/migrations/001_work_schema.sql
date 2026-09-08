-- ArogyaGrid Work/Epic System Schema
-- Migration: 001_work_schema.sql

BEGIN;

-- Create schemas
CREATE SCHEMA IF NOT EXISTS iam;
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS work;
CREATE SCHEMA IF NOT EXISTS audit;

-- ============================================
-- IAM Schema (minimal for work system)
-- ============================================

CREATE TABLE IF NOT EXISTS iam.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(512) NOT NULL,
    role VARCHAR(64) NOT NULL DEFAULT 'viewer',
    facility_id UUID,
    district VARCHAR(255),
    state VARCHAR(255),
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_user_role CHECK (role IN ('national_admin', 'state_admin', 'district_officer', 'facility_manager', 'viewer'))
);

CREATE TABLE IF NOT EXISTS iam.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    team_type VARCHAR(64) NOT NULL,
    facility_id UUID,
    district VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS iam.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES iam.teams(id),
    user_id UUID NOT NULL REFERENCES iam.users(id),
    role VARCHAR(64) NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(team_id, user_id)
);

CREATE TABLE IF NOT EXISTS iam.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES iam.users(id),
    token_hash VARCHAR(512) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    revoked_at TIMESTAMPTZ
);

-- ============================================
-- Core Schema (minimal for work system)
-- ============================================

CREATE TABLE IF NOT EXISTS core.facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    facility_type VARCHAR(64) NOT NULL DEFAULT 'phc',
    district VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL DEFAULT 'Odisha',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    bed_capacity INTEGER DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Work Schema
-- ============================================

CREATE TABLE work.work_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(64) NOT NULL,
    priority VARCHAR(16) NOT NULL DEFAULT 'normal',
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'waiting',

    current_team_id UUID REFERENCES iam.teams(id),
    assigned_user_id UUID REFERENCES iam.users(id),

    facility_id UUID REFERENCES core.facilities(id),
    district VARCHAR(255),

    source VARCHAR(64) NOT NULL DEFAULT 'system',

    entity_kind VARCHAR(64),
    entity_id UUID,

    parent_work_item_id UUID REFERENCES work.work_items(id),

    due_at TIMESTAMPTZ,

    created_by_user_id UUID REFERENCES iam.users(id),
    created_by_system BOOLEAN NOT NULL DEFAULT false,

    accepted_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    returned_at TIMESTAMPTZ,

    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_work_type CHECK (type IN (
        'STOCK_SHORTAGE_REVIEW', 'TRANSFER_RECOMMENDATION_APPROVAL',
        'TRANSFER_DISPATCH', 'TRANSFER_RECEIPT', 'INVENTORY_DISCREPANCY',
        'EXPIRY_RISK', 'CAPACITY_OVERLOAD', 'FORECAST_ANOMALY_REVIEW',
        'DATA_QUALITY_ISSUE', 'CRITICAL_ALERT_ACKNOWLEDGEMENT'
    )),
    CONSTRAINT chk_priority CHECK (priority IN ('low', 'normal', 'high', 'urgent', 'critical')),
    CONSTRAINT chk_status CHECK (status IN ('waiting', 'assigned', 'in_progress', 'completed', 'returned'))
);

CREATE TABLE work.work_item_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_item_id UUID NOT NULL REFERENCES work.work_items(id) ON DELETE CASCADE,
    from_user_id UUID REFERENCES iam.users(id),
    to_user_id UUID REFERENCES iam.users(id),
    assigned_by_user_id UUID REFERENCES iam.users(id),
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE work.work_item_handoffs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_item_id UUID NOT NULL REFERENCES work.work_items(id) ON DELETE CASCADE,
    from_team_id UUID REFERENCES iam.teams(id),
    to_team_id UUID NOT NULL REFERENCES iam.teams(id),
    from_user_id UUID REFERENCES iam.users(id),
    to_user_id UUID REFERENCES iam.users(id),
    reason TEXT NOT NULL,
    created_by_user_id UUID REFERENCES iam.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE work.work_item_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_item_id UUID NOT NULL REFERENCES work.work_items(id) ON DELETE CASCADE,
    author_user_id UUID NOT NULL REFERENCES iam.users(id),
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE work.work_item_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_item_id UUID NOT NULL REFERENCES work.work_items(id) ON DELETE CASCADE,
    from_status VARCHAR(32),
    to_status VARCHAR(32) NOT NULL,
    changed_by_user_id UUID REFERENCES iam.users(id),
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE work.work_item_due_date_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_item_id UUID NOT NULL REFERENCES work.work_items(id) ON DELETE CASCADE,
    previous_due_at TIMESTAMPTZ,
    new_due_at TIMESTAMPTZ,
    changed_by_user_id UUID REFERENCES iam.users(id),
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE work.idempotency_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idempotency_key VARCHAR(255) NOT NULL,
    operation VARCHAR(64) NOT NULL,
    resource_id UUID,
    response_status INTEGER,
    response_body JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '24 hours'),
    UNIQUE(idempotency_key, operation)
);

-- ============================================
-- Audit Schema
-- ============================================

CREATE TABLE audit.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID,
    facility_id UUID,
    event_type VARCHAR(64) NOT NULL,
    entity_type VARCHAR(64),
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Indexes
-- ============================================

-- Work Items indexes
CREATE INDEX idx_work_items_status_due ON work.work_items(status, due_at);
CREATE INDEX idx_work_items_assigned_status ON work.work_items(assigned_user_id, status);
CREATE INDEX idx_work_items_team_status ON work.work_items(current_team_id, status);
CREATE INDEX idx_work_items_facility_status ON work.work_items(facility_id, status);
CREATE INDEX idx_work_items_priority_status ON work.work_items(priority, status);
CREATE INDEX idx_work_items_entity ON work.work_items(entity_kind, entity_id);
CREATE INDEX idx_work_items_created ON work.work_items(created_at DESC);
CREATE INDEX idx_work_items_parent ON work.work_items(parent_work_item_id) WHERE parent_work_item_id IS NOT NULL;

-- Deduplication: prevent duplicate active work items for same entity
CREATE UNIQUE INDEX idx_work_items_dedup_active
    ON work.work_items(type, entity_kind, entity_id)
    WHERE status NOT IN ('completed', 'returned');

-- Assignment indexes
CREATE INDEX idx_work_assignments_item ON work.work_item_assignments(work_item_id, created_at DESC);

-- Handoff indexes
CREATE INDEX idx_work_handoffs_item ON work.work_item_handoffs(work_item_id, created_at DESC);

-- Comment indexes
CREATE INDEX idx_work_comments_item ON work.work_item_comments(work_item_id, created_at);

-- Status history indexes
CREATE INDEX idx_work_status_history_item ON work.work_item_status_history(work_item_id, created_at DESC);

-- Due date history indexes
CREATE INDEX idx_work_due_history_item ON work.work_item_due_date_history(work_item_id, created_at DESC);

-- Idempotency indexes
CREATE INDEX idx_idempotency_expires ON work.idempotency_keys(expires_at);

-- Audit indexes
CREATE INDEX idx_audit_entity ON audit.events(entity_type, entity_id, created_at DESC);
CREATE INDEX idx_audit_type ON audit.events(event_type, created_at DESC);
CREATE INDEX idx_audit_actor ON audit.events(actor_user_id, created_at DESC);

COMMIT;
