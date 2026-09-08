package work

import (
	"context"
	"github.com/google/uuid"
)

type Repository interface {
	// Work Items
	CreateWorkItem(ctx context.Context, item *WorkItem) (*WorkItem, error)
	GetWorkItemByID(ctx context.Context, id uuid.UUID) (*WorkItem, error)
	ListWorkItems(ctx context.Context, filter QueueFilter, userID uuid.UUID) ([]WorkItem, *string, error) // returns items, nextCursor, error
	UpdateWorkItemStatus(ctx context.Context, id uuid.UUID, status Status, version int, updates map[string]interface{}) (*WorkItem, error)
	UpdateWorkItemAssignee(ctx context.Context, id uuid.UUID, assigneeID *uuid.UUID, teamID *uuid.UUID, version int) (*WorkItem, error)
	FindExistingActiveWork(ctx context.Context, workType WorkItemType, entityKind string, entityID uuid.UUID) (*WorkItem, error)
	CountByStatus(ctx context.Context, userID uuid.UUID, teamIDs []uuid.UUID) (*QueueCounts, error)

	// Assignments
	InsertAssignment(ctx context.Context, assignment *Assignment) error
	ListAssignments(ctx context.Context, workItemID uuid.UUID) ([]Assignment, error)

	// Handoffs
	InsertHandoff(ctx context.Context, handoff *Handoff) error
	ListHandoffs(ctx context.Context, workItemID uuid.UUID) ([]Handoff, error)

	// Comments
	InsertComment(ctx context.Context, comment *Comment) error
	ListComments(ctx context.Context, workItemID uuid.UUID) ([]Comment, error)

	// Status History
	InsertStatusHistory(ctx context.Context, entry *StatusHistoryEntry) error
	ListStatusHistory(ctx context.Context, workItemID uuid.UUID) ([]StatusHistoryEntry, error)

	// Due Date History
	InsertDueDateHistory(ctx context.Context, entry *DueDateHistoryEntry) error
	ListDueDateHistory(ctx context.Context, workItemID uuid.UUID) ([]DueDateHistoryEntry, error)

	// Idempotency
	CheckIdempotencyKey(ctx context.Context, key string, operation string) (bool, error)
	InsertIdempotencyKey(ctx context.Context, key string, operation string, resourceID *uuid.UUID) error

	// Audit
	InsertAuditEvent(ctx context.Context, event AuditEvent) error

	// Transaction support
	WithTx(ctx context.Context, fn func(repo Repository) error) error
}

// AuditEvent for audit table
type AuditEvent struct {
	ActorUserID *uuid.UUID
	FacilityID  *uuid.UUID
	EventType   string
	EntityType  *string
	EntityID    *uuid.UUID
	Metadata    map[string]interface{}
}
