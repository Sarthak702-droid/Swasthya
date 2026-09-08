-- name: CreateWorkItem :one
INSERT INTO work.work_items (
    type, priority, title, description, status, current_team_id, assigned_user_id, facility_id, district, source, entity_kind, entity_id, parent_work_item_id, due_at, created_by_user_id, created_by_system
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
) RETURNING *;

-- name: GetWorkItemByID :one
SELECT * FROM work.work_items WHERE id = $1 LIMIT 1;

-- name: ListWorkItemsByAssignedUser :many
SELECT * FROM work.work_items
WHERE assigned_user_id = $1 AND ($2::varchar IS NULL OR status = $2)
AND ($3::timestamptz IS NULL OR created_at < $3)
ORDER BY created_at DESC LIMIT $4;

-- name: ListWorkItemsByTeam :many
SELECT * FROM work.work_items
WHERE current_team_id = $1 AND status IN ('waiting', 'returned')
AND ($2::timestamptz IS NULL OR created_at < $2)
ORDER BY created_at DESC LIMIT $3;

-- name: ListWorkItemsUrgent :many
SELECT * FROM work.work_items
WHERE priority IN ('high','urgent','critical') AND status NOT IN ('completed')
AND ($1::timestamptz IS NULL OR created_at < $1)
ORDER BY created_at DESC LIMIT $2;

-- name: ListWorkItemsOverdue :many
SELECT * FROM work.work_items
WHERE due_at < now() AND status NOT IN ('completed')
AND ($1::timestamptz IS NULL OR created_at < $1)
ORDER BY created_at DESC LIMIT $2;

-- name: ListWorkItemsWaiting :many
SELECT * FROM work.work_items
WHERE status = 'waiting'
AND ($1::timestamptz IS NULL OR created_at < $1)
ORDER BY created_at DESC LIMIT $2;

-- name: ListWorkItemsCompleted :many
SELECT * FROM work.work_items
WHERE status = 'completed'
AND ($1::timestamptz IS NULL OR completed_at < $1)
ORDER BY completed_at DESC LIMIT $2;

-- name: ListWorkItemsByFacility :many
SELECT * FROM work.work_items
WHERE facility_id = $1
AND ($2::timestamptz IS NULL OR created_at < $2)
ORDER BY created_at DESC LIMIT $3;

-- name: UpdateWorkItemStatus :one
UPDATE work.work_items
SET status = $2, updated_at = now(), version = version + 1
WHERE id = $1 AND version = $3
RETURNING *;

-- name: UpdateWorkItemAssignee :one
UPDATE work.work_items
SET assigned_user_id = $2, updated_at = now(), version = version + 1
WHERE id = $1 AND version = $3
RETURNING *;

-- name: FindExistingActiveWorkForEntity :one
SELECT * FROM work.work_items
WHERE type = $1 AND entity_kind = $2 AND entity_id = $3 AND status NOT IN ('completed', 'returned')
LIMIT 1;

-- name: InsertAssignmentHistory :one
INSERT INTO work.work_item_assignments (
    work_item_id, from_user_id, to_user_id, assigned_by_user_id, reason
) VALUES ($1, $2, $3, $4, $5) RETURNING *;

-- name: InsertHandoff :one
INSERT INTO work.work_item_handoffs (
    work_item_id, from_team_id, to_team_id, from_user_id, to_user_id, reason, created_by_user_id
) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;

-- name: InsertComment :one
INSERT INTO work.work_item_comments (
    work_item_id, author_user_id, body
) VALUES ($1, $2, $3) RETURNING *;

-- name: ListCommentsByWorkItem :many
SELECT * FROM work.work_item_comments
WHERE work_item_id = $1
ORDER BY created_at ASC;

-- name: InsertStatusHistory :one
INSERT INTO work.work_item_status_history (
    work_item_id, from_status, to_status, changed_by_user_id, reason
) VALUES ($1, $2, $3, $4, $5) RETURNING *;

-- name: ListStatusHistoryByWorkItem :many
SELECT * FROM work.work_item_status_history
WHERE work_item_id = $1
ORDER BY created_at DESC;

-- name: InsertDueDateHistory :one
INSERT INTO work.work_item_due_date_history (
    work_item_id, previous_due_at, new_due_at, changed_by_user_id, reason
) VALUES ($1, $2, $3, $4, $5) RETURNING *;

-- name: ListDueDateHistoryByWorkItem :many
SELECT * FROM work.work_item_due_date_history
WHERE work_item_id = $1
ORDER BY created_at DESC;

-- name: ListHandoffsByWorkItem :many
SELECT * FROM work.work_item_handoffs
WHERE work_item_id = $1
ORDER BY created_at DESC;

-- name: ListAssignmentsByWorkItem :many
SELECT * FROM work.work_item_assignments
WHERE work_item_id = $1
ORDER BY created_at DESC;

-- name: UpdateWorkItemDueDate :one
UPDATE work.work_items
SET due_at = $2, updated_at = now(), version = version + 1
WHERE id = $1 AND version = $3
RETURNING *;

-- name: CompleteWorkItem :one
UPDATE work.work_items
SET status = 'completed', completed_at = now(), updated_at = now(), version = version + 1
WHERE id = $1 AND version = $2
RETURNING *;

-- name: ReturnWorkItem :one
UPDATE work.work_items
SET status = 'returned', returned_at = now(), updated_at = now(), version = version + 1
WHERE id = $1 AND version = $2
RETURNING *;

-- name: CheckIdempotencyKey :one
SELECT * FROM work.idempotency_keys
WHERE idempotency_key = $1 AND operation = $2 LIMIT 1;

-- name: InsertIdempotencyKey :one
INSERT INTO work.idempotency_keys (
    idempotency_key, operation, resource_id, response_status, response_body
) VALUES ($1, $2, $3, $4, $5) RETURNING *;

-- name: InsertAuditEvent :one
INSERT INTO audit.events (
    actor_user_id, facility_id, event_type, entity_type, entity_id, metadata
) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;

-- name: CountWorkItemsByStatus :one
SELECT count(*) FROM work.work_items
WHERE status = $1;
