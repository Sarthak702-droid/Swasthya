package work

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresRepository struct {
	pool *pgxpool.Pool
	tx   pgx.Tx
}

func NewPostgresRepository(pool *pgxpool.Pool) *PostgresRepository {
	return &PostgresRepository{pool: pool}
}

func (r *PostgresRepository) getExec(ctx context.Context) PgxExec {
	if r.tx != nil {
		return r.tx
	}
	return r.pool
}

type PgxExec interface {
	Exec(ctx context.Context, sql string, arguments ...any) (pgconn.CommandTag, error)
	Query(ctx context.Context, sql string, args ...any) (pgx.Rows, error)
	QueryRow(ctx context.Context, sql string, args ...any) pgx.Row
}

func (r *PostgresRepository) WithTx(ctx context.Context, fn func(repo Repository) error) error {
	if r.tx != nil {
		return fn(r)
	}

	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin transaction: %w", err)
	}

	txRepo := &PostgresRepository{pool: r.pool, tx: tx}
	err = fn(txRepo)
	if err != nil {
		_ = tx.Rollback(ctx)
		return err
	}

	return tx.Commit(ctx)
}

const workItemColumns = `
	id, type, priority, title, description, status,
	current_team_id, assigned_user_id, facility_id, district,
	source, entity_kind, entity_id, parent_work_item_id, due_at,
	created_by_user_id, created_by_system, accepted_at, started_at,
	completed_at, returned_at, version, created_at, updated_at
`

func scanWorkItemRow(row pgx.Row) (*WorkItem, error) {
	var item WorkItem
	var itemType, priority, status string

	err := row.Scan(
		&item.ID,
		&itemType,
		&priority,
		&item.Title,
		&item.Description,
		&status,
		&item.CurrentTeamID,
		&item.AssignedUserID,
		&item.FacilityID,
		&item.District,
		&item.Source,
		&item.EntityKind,
		&item.EntityID,
		&item.ParentWorkItemID,
		&item.DueAt,
		&item.CreatedByUserID,
		&item.CreatedBySystem,
		&item.AcceptedAt,
		&item.StartedAt,
		&item.CompletedAt,
		&item.ReturnedAt,
		&item.Version,
		&item.CreatedAt,
		&item.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	item.Type = WorkItemType(itemType)
	item.Priority = Priority(priority)
	item.Status = Status(status)
	return &item, nil
}

func scanWorkItemsRows(rows pgx.Rows) ([]WorkItem, error) {
	defer rows.Close()
	items := []WorkItem{}
	for rows.Next() {
		var item WorkItem
		var itemType, priority, status string

		err := rows.Scan(
			&item.ID,
			&itemType,
			&priority,
			&item.Title,
			&item.Description,
			&status,
			&item.CurrentTeamID,
			&item.AssignedUserID,
			&item.FacilityID,
			&item.District,
			&item.Source,
			&item.EntityKind,
			&item.EntityID,
			&item.ParentWorkItemID,
			&item.DueAt,
			&item.CreatedByUserID,
			&item.CreatedBySystem,
			&item.AcceptedAt,
			&item.StartedAt,
			&item.CompletedAt,
			&item.ReturnedAt,
			&item.Version,
			&item.CreatedAt,
			&item.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		item.Type = WorkItemType(itemType)
		item.Priority = Priority(priority)
		item.Status = Status(status)
		items = append(items, item)
	}
	return items, rows.Err()
}

func (r *PostgresRepository) CreateWorkItem(ctx context.Context, item *WorkItem) (*WorkItem, error) {
	exec := r.getExec(ctx)
	if item.ID == uuid.Nil {
		item.ID = uuid.New()
	}

	query := `
		INSERT INTO work.work_items (
			id, type, priority, title, description, status,
			current_team_id, assigned_user_id, facility_id, district,
			source, entity_kind, entity_id, parent_work_item_id, due_at,
			created_by_user_id, created_by_system, accepted_at, started_at,
			completed_at, returned_at, version, created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6,
			$7, $8, $9, $10,
			$11, $12, $13, $14, $15,
			$16, $17, $18, $19,
			$20, $21, $22, now(), now()
		) RETURNING ` + workItemColumns

	row := exec.QueryRow(ctx, query,
		item.ID, string(item.Type), string(item.Priority), item.Title, item.Description, string(item.Status),
		item.CurrentTeamID, item.AssignedUserID, item.FacilityID, item.District,
		item.Source, item.EntityKind, item.EntityID, item.ParentWorkItemID, item.DueAt,
		item.CreatedByUserID, item.CreatedBySystem, item.AcceptedAt, item.StartedAt,
		item.CompletedAt, item.ReturnedAt, 1,
	)

	return scanWorkItemRow(row)
}

func (r *PostgresRepository) GetWorkItemByID(ctx context.Context, id uuid.UUID) (*WorkItem, error) {
	exec := r.getExec(ctx)
	query := `SELECT ` + workItemColumns + ` FROM work.work_items WHERE id = $1 LIMIT 1`
	row := exec.QueryRow(ctx, query, id)
	return scanWorkItemRow(row)
}

func (r *PostgresRepository) ListWorkItems(ctx context.Context, filter QueueFilter, userID uuid.UUID) ([]WorkItem, *string, error) {
	exec := r.getExec(ctx)
	limit := filter.Limit
	if limit <= 0 || limit > 100 {
		limit = 30
	}

	var baseQuery string
	var args []any
	argIdx := 1

	switch filter.View {
	case "my":
		baseQuery = `SELECT ` + workItemColumns + ` FROM work.work_items WHERE assigned_user_id = $` + fmt.Sprint(argIdx) + ` AND status != 'completed'`
		args = append(args, userID)
		argIdx++
	case "team":
		if filter.TeamID != nil {
			baseQuery = `SELECT ` + workItemColumns + ` FROM work.work_items WHERE current_team_id = $` + fmt.Sprint(argIdx) + ` AND status IN ('waiting', 'returned')`
			args = append(args, *filter.TeamID)
			argIdx++
		} else {
			baseQuery = `SELECT ` + workItemColumns + ` FROM work.work_items WHERE status IN ('waiting', 'returned')`
		}
	case "urgent":
		baseQuery = `SELECT ` + workItemColumns + ` FROM work.work_items WHERE priority IN ('high', 'urgent', 'critical') AND status != 'completed'`
	case "overdue":
		baseQuery = `SELECT ` + workItemColumns + ` FROM work.work_items WHERE due_at < now() AND status != 'completed'`
	case "waiting":
		baseQuery = `SELECT ` + workItemColumns + ` FROM work.work_items WHERE status = 'waiting'`
	case "completed":
		baseQuery = `SELECT ` + workItemColumns + ` FROM work.work_items WHERE status = 'completed'`
	case "facility":
		if filter.FacilityID != nil {
			baseQuery = `SELECT ` + workItemColumns + ` FROM work.work_items WHERE facility_id = $` + fmt.Sprint(argIdx)
			args = append(args, *filter.FacilityID)
			argIdx++
		} else {
			baseQuery = `SELECT ` + workItemColumns + ` FROM work.work_items WHERE 1=1`
		}
	default:
		baseQuery = `SELECT ` + workItemColumns + ` FROM work.work_items WHERE 1=1`
	}

	if filter.FacilityID != nil && filter.View != "facility" {
		baseQuery += ` AND facility_id = $` + fmt.Sprint(argIdx)
		args = append(args, *filter.FacilityID)
		argIdx++
	}
	if filter.District != nil && *filter.District != "" {
		baseQuery += ` AND district = $` + fmt.Sprint(argIdx)
		args = append(args, *filter.District)
		argIdx++
	}
	if filter.Status != nil {
		baseQuery += ` AND status = $` + fmt.Sprint(argIdx)
		args = append(args, string(*filter.Status))
		argIdx++
	}
	if filter.Priority != nil {
		baseQuery += ` AND priority = $` + fmt.Sprint(argIdx)
		args = append(args, string(*filter.Priority))
		argIdx++
	}
	if filter.Type != nil {
		baseQuery += ` AND type = $` + fmt.Sprint(argIdx)
		args = append(args, string(*filter.Type))
		argIdx++
	}

	if filter.View == "completed" {
		baseQuery += ` ORDER BY completed_at DESC NULLS LAST, created_at DESC LIMIT $` + fmt.Sprint(argIdx)
	} else {
		baseQuery += ` ORDER BY created_at DESC LIMIT $` + fmt.Sprint(argIdx)
	}
	args = append(args, limit+1)

	rows, err := exec.Query(ctx, baseQuery, args...)
	if err != nil {
		return nil, nil, fmt.Errorf("list work items: %w", err)
	}

	items, err := scanWorkItemsRows(rows)
	if err != nil {
		return nil, nil, err
	}

	var nextCursor *string
	if len(items) > limit {
		items = items[:limit]
		c := items[len(items)-1].CreatedAt.Format(time.RFC3339Nano)
		nextCursor = &c
	}

	return items, nextCursor, nil
}

func (r *PostgresRepository) UpdateWorkItemStatus(ctx context.Context, id uuid.UUID, status Status, version int, updates map[string]interface{}) (*WorkItem, error) {
	exec := r.getExec(ctx)

	acceptedAt := updates["accepted_at"]
	startedAt := updates["started_at"]
	completedAt := updates["completed_at"]
	returnedAt := updates["returned_at"]

	query := `
		UPDATE work.work_items
		SET status = $2,
		    accepted_at = COALESCE($3, accepted_at),
		    started_at = COALESCE($4, started_at),
		    completed_at = COALESCE($5, completed_at),
		    returned_at = COALESCE($6, returned_at),
		    version = version + 1,
		    updated_at = now()
		WHERE id = $1 AND version = $7
		RETURNING ` + workItemColumns

	row := exec.QueryRow(ctx, query, id, string(status), acceptedAt, startedAt, completedAt, returnedAt, version)
	item, err := scanWorkItemRow(row)
	if err != nil {
		return nil, err
	}
	if item == nil {
		return nil, ErrVersionConflict
	}
	return item, nil
}

func (r *PostgresRepository) UpdateWorkItemAssignee(ctx context.Context, id uuid.UUID, assigneeID *uuid.UUID, teamID *uuid.UUID, version int) (*WorkItem, error) {
	exec := r.getExec(ctx)

	query := `
		UPDATE work.work_items
		SET assigned_user_id = $2,
		    current_team_id = COALESCE($3, current_team_id),
		    status = CASE WHEN status = 'waiting' THEN 'assigned' ELSE status END,
		    version = version + 1,
		    updated_at = now()
		WHERE id = $1 AND version = $4
		RETURNING ` + workItemColumns

	row := exec.QueryRow(ctx, query, id, assigneeID, teamID, version)
	item, err := scanWorkItemRow(row)
	if err != nil {
		return nil, err
	}
	if item == nil {
		return nil, ErrVersionConflict
	}
	return item, nil
}

func (r *PostgresRepository) FindExistingActiveWork(ctx context.Context, workType WorkItemType, entityKind string, entityID uuid.UUID) (*WorkItem, error) {
	exec := r.getExec(ctx)
	query := `
		SELECT ` + workItemColumns + `
		FROM work.work_items
		WHERE type = $1 AND entity_kind = $2 AND entity_id = $3 AND status NOT IN ('completed')
		LIMIT 1`
	row := exec.QueryRow(ctx, query, string(workType), entityKind, entityID)
	return scanWorkItemRow(row)
}

func (r *PostgresRepository) CountByStatus(ctx context.Context, userID uuid.UUID, teamIDs []uuid.UUID) (*QueueCounts, error) {
	exec := r.getExec(ctx)
	counts := &QueueCounts{}

	_ = exec.QueryRow(ctx, `SELECT COUNT(*) FROM work.work_items WHERE assigned_user_id = $1 AND status != 'completed'`, userID).Scan(&counts.MyWork)
	_ = exec.QueryRow(ctx, `SELECT COUNT(*) FROM work.work_items WHERE status IN ('waiting', 'returned')`).Scan(&counts.Team)
	_ = exec.QueryRow(ctx, `SELECT COUNT(*) FROM work.work_items WHERE priority IN ('high', 'urgent', 'critical') AND status != 'completed'`).Scan(&counts.Urgent)
	_ = exec.QueryRow(ctx, `SELECT COUNT(*) FROM work.work_items WHERE due_at < now() AND status != 'completed'`).Scan(&counts.Overdue)
	_ = exec.QueryRow(ctx, `SELECT COUNT(*) FROM work.work_items WHERE status = 'waiting'`).Scan(&counts.Waiting)
	_ = exec.QueryRow(ctx, `SELECT COUNT(*) FROM work.work_items WHERE status = 'completed'`).Scan(&counts.Completed)

	return counts, nil
}

func (r *PostgresRepository) InsertAssignment(ctx context.Context, assignment *Assignment) error {
	exec := r.getExec(ctx)
	if assignment.ID == uuid.Nil {
		assignment.ID = uuid.New()
	}
	query := `
		INSERT INTO work.work_item_assignments (id, work_item_id, from_user_id, to_user_id, assigned_by_user_id, reason, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, now())`
	_, err := exec.Exec(ctx, query, assignment.ID, assignment.WorkItemID, assignment.FromUserID, assignment.ToUserID, assignment.AssignedByUserID, assignment.Reason)
	return err
}

func (r *PostgresRepository) ListAssignments(ctx context.Context, workItemID uuid.UUID) ([]Assignment, error) {
	exec := r.getExec(ctx)
	query := `
		SELECT id, work_item_id, from_user_id, to_user_id, assigned_by_user_id, reason, created_at
		FROM work.work_item_assignments
		WHERE work_item_id = $1
		ORDER BY created_at DESC`
	rows, err := exec.Query(ctx, query, workItemID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var assignments []Assignment
	for rows.Next() {
		var a Assignment
		if err := rows.Scan(&a.ID, &a.WorkItemID, &a.FromUserID, &a.ToUserID, &a.AssignedByUserID, &a.Reason, &a.CreatedAt); err != nil {
			return nil, err
		}
		assignments = append(assignments, a)
	}
	return assignments, rows.Err()
}

func (r *PostgresRepository) InsertHandoff(ctx context.Context, handoff *Handoff) error {
	exec := r.getExec(ctx)
	if handoff.ID == uuid.Nil {
		handoff.ID = uuid.New()
	}
	query := `
		INSERT INTO work.work_item_handoffs (id, work_item_id, from_team_id, to_team_id, from_user_id, to_user_id, reason, created_by_user_id, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())`
	_, err := exec.Exec(ctx, query, handoff.ID, handoff.WorkItemID, handoff.FromTeamID, handoff.ToTeamID, handoff.FromUserID, handoff.ToUserID, handoff.Reason, handoff.CreatedByUserID)
	return err
}

func (r *PostgresRepository) ListHandoffs(ctx context.Context, workItemID uuid.UUID) ([]Handoff, error) {
	exec := r.getExec(ctx)
	query := `
		SELECT id, work_item_id, from_team_id, to_team_id, from_user_id, to_user_id, reason, created_by_user_id, created_at
		FROM work.work_item_handoffs
		WHERE work_item_id = $1
		ORDER BY created_at DESC`
	rows, err := exec.Query(ctx, query, workItemID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var handoffs []Handoff
	for rows.Next() {
		var h Handoff
		if err := rows.Scan(&h.ID, &h.WorkItemID, &h.FromTeamID, &h.ToTeamID, &h.FromUserID, &h.ToUserID, &h.Reason, &h.CreatedByUserID, &h.CreatedAt); err != nil {
			return nil, err
		}
		handoffs = append(handoffs, h)
	}
	return handoffs, rows.Err()
}

func (r *PostgresRepository) InsertComment(ctx context.Context, comment *Comment) error {
	exec := r.getExec(ctx)
	if comment.ID == uuid.Nil {
		comment.ID = uuid.New()
	}
	query := `
		INSERT INTO work.work_item_comments (id, work_item_id, author_user_id, body, created_at)
		VALUES ($1, $2, $3, $4, now())`
	_, err := exec.Exec(ctx, query, comment.ID, comment.WorkItemID, comment.AuthorUserID, comment.Body)
	return err
}

func (r *PostgresRepository) ListComments(ctx context.Context, workItemID uuid.UUID) ([]Comment, error) {
	exec := r.getExec(ctx)
	query := `
		SELECT c.id, c.work_item_id, c.author_user_id, COALESCE(u.display_name, 'System User') as author_name, c.body, c.created_at, c.updated_at, c.deleted_at
		FROM work.work_item_comments c
		LEFT JOIN iam.users u ON c.author_user_id = u.id
		WHERE c.work_item_id = $1 AND c.deleted_at IS NULL
		ORDER BY c.created_at ASC`
	rows, err := exec.Query(ctx, query, workItemID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []Comment
	for rows.Next() {
		var c Comment
		if err := rows.Scan(&c.ID, &c.WorkItemID, &c.AuthorUserID, &c.AuthorName, &c.Body, &c.CreatedAt, &c.UpdatedAt, &c.DeletedAt); err != nil {
			return nil, err
		}
		comments = append(comments, c)
	}
	return comments, rows.Err()
}

func (r *PostgresRepository) InsertStatusHistory(ctx context.Context, entry *StatusHistoryEntry) error {
	exec := r.getExec(ctx)
	if entry.ID == uuid.Nil {
		entry.ID = uuid.New()
	}
	var fromStatus *string
	if entry.FromStatus != nil {
		s := string(*entry.FromStatus)
		fromStatus = &s
	}
	query := `
		INSERT INTO work.work_item_status_history (id, work_item_id, from_status, to_status, changed_by_user_id, reason, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, now())`
	_, err := exec.Exec(ctx, query, entry.ID, entry.WorkItemID, fromStatus, string(entry.ToStatus), entry.ChangedByUserID, entry.Reason)
	return err
}

func (r *PostgresRepository) ListStatusHistory(ctx context.Context, workItemID uuid.UUID) ([]StatusHistoryEntry, error) {
	exec := r.getExec(ctx)
	query := `
		SELECT h.id, h.work_item_id, h.from_status, h.to_status, h.changed_by_user_id, COALESCE(u.display_name, 'System') as changed_by_name, h.reason, h.created_at
		FROM work.work_item_status_history h
		LEFT JOIN iam.users u ON h.changed_by_user_id = u.id
		WHERE h.work_item_id = $1
		ORDER BY h.created_at DESC`
	rows, err := exec.Query(ctx, query, workItemID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var history []StatusHistoryEntry
	for rows.Next() {
		var h StatusHistoryEntry
		var fromStatus *string
		var toStatus string
		if err := rows.Scan(&h.ID, &h.WorkItemID, &fromStatus, &toStatus, &h.ChangedByUserID, &h.ChangedByName, &h.Reason, &h.CreatedAt); err != nil {
			return nil, err
		}
		if fromStatus != nil {
			fs := Status(*fromStatus)
			h.FromStatus = &fs
		}
		h.ToStatus = Status(toStatus)
		history = append(history, h)
	}
	return history, rows.Err()
}

func (r *PostgresRepository) InsertDueDateHistory(ctx context.Context, entry *DueDateHistoryEntry) error {
	exec := r.getExec(ctx)
	if entry.ID == uuid.Nil {
		entry.ID = uuid.New()
	}
	query := `
		INSERT INTO work.work_item_due_date_history (id, work_item_id, previous_due_at, new_due_at, changed_by_user_id, reason, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, now())`
	_, err := exec.Exec(ctx, query, entry.ID, entry.WorkItemID, entry.PreviousDueAt, entry.NewDueAt, entry.ChangedByUserID, entry.Reason)
	return err
}

func (r *PostgresRepository) ListDueDateHistory(ctx context.Context, workItemID uuid.UUID) ([]DueDateHistoryEntry, error) {
	exec := r.getExec(ctx)
	query := `
		SELECT id, work_item_id, previous_due_at, new_due_at, changed_by_user_id, reason, created_at
		FROM work.work_item_due_date_history
		WHERE work_item_id = $1
		ORDER BY created_at DESC`
	rows, err := exec.Query(ctx, query, workItemID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var entries []DueDateHistoryEntry
	for rows.Next() {
		var e DueDateHistoryEntry
		if err := rows.Scan(&e.ID, &e.WorkItemID, &e.PreviousDueAt, &e.NewDueAt, &e.ChangedByUserID, &e.Reason, &e.CreatedAt); err != nil {
			return nil, err
		}
		entries = append(entries, e)
	}
	return entries, rows.Err()
}

func (r *PostgresRepository) CheckIdempotencyKey(ctx context.Context, key string, operation string) (bool, error) {
	exec := r.getExec(ctx)
	var count int
	err := exec.QueryRow(ctx, `SELECT COUNT(*) FROM work.idempotency_keys WHERE idempotency_key = $1 AND operation = $2 AND expires_at > now()`, key, operation).Scan(&count)
	return count > 0, err
}

func (r *PostgresRepository) InsertIdempotencyKey(ctx context.Context, key string, operation string, resourceID *uuid.UUID) error {
	exec := r.getExec(ctx)
	query := `
		INSERT INTO work.idempotency_keys (idempotency_key, operation, resource_id)
		VALUES ($1, $2, $3)
		ON CONFLICT (idempotency_key, operation) DO NOTHING`
	_, err := exec.Exec(ctx, query, key, operation, resourceID)
	return err
}

func (r *PostgresRepository) InsertAuditEvent(ctx context.Context, event AuditEvent) error {
	exec := r.getExec(ctx)
	metaJSON, err := json.Marshal(event.Metadata)
	if err != nil {
		metaJSON = []byte("{}")
	}
	query := `
		INSERT INTO audit.events (id, actor_user_id, facility_id, event_type, entity_type, entity_id, metadata, created_at)
		VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, now())`
	_, err = exec.Exec(ctx, query, event.ActorUserID, event.FacilityID, event.EventType, event.EntityType, event.EntityID, metaJSON)
	return err
}

