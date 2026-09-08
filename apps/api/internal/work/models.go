package work

import (
	"time"

	"github.com/google/uuid"
)

// WorkItemType enum
type WorkItemType string

const (
	TypeStockShortageReview            WorkItemType = "STOCK_SHORTAGE_REVIEW"
	TypeTransferRecommendationApproval WorkItemType = "TRANSFER_RECOMMENDATION_APPROVAL"
	TypeTransferDispatch               WorkItemType = "TRANSFER_DISPATCH"
	TypeTransferReceipt                WorkItemType = "TRANSFER_RECEIPT"
	TypeInventoryDiscrepancy           WorkItemType = "INVENTORY_DISCREPANCY"
	TypeExpiryRisk                     WorkItemType = "EXPIRY_RISK"
	TypeCapacityOverload               WorkItemType = "CAPACITY_OVERLOAD"
	TypeForecastAnomalyReview          WorkItemType = "FORECAST_ANOMALY_REVIEW"
	TypeDataQualityIssue               WorkItemType = "DATA_QUALITY_ISSUE"
	TypeCriticalAlertAcknowledgement   WorkItemType = "CRITICAL_ALERT_ACKNOWLEDGEMENT"
)

func (t WorkItemType) Valid() bool {
	switch t {
	case TypeStockShortageReview, TypeTransferRecommendationApproval, TypeTransferDispatch, TypeTransferReceipt,
		TypeInventoryDiscrepancy, TypeExpiryRisk, TypeCapacityOverload, TypeForecastAnomalyReview,
		TypeDataQualityIssue, TypeCriticalAlertAcknowledgement:
		return true
	}
	return false
}

// Priority enum
type Priority string

const (
	PriorityLow      Priority = "low"
	PriorityNormal   Priority = "normal"
	PriorityHigh     Priority = "high"
	PriorityUrgent   Priority = "urgent"
	PriorityCritical Priority = "critical"
)

func (p Priority) Valid() bool {
	switch p {
	case PriorityLow, PriorityNormal, PriorityHigh, PriorityUrgent, PriorityCritical:
		return true
	}
	return false
}

func (p Priority) Level() int {
	switch p {
	case PriorityLow:
		return 0
	case PriorityNormal:
		return 1
	case PriorityHigh:
		return 2
	case PriorityUrgent:
		return 3
	case PriorityCritical:
		return 4
	default:
		return 0
	}
}

// Status enum
type Status string

const (
	StatusWaiting    Status = "waiting"
	StatusAssigned   Status = "assigned"
	StatusInProgress Status = "in_progress"
	StatusCompleted  Status = "completed"
	StatusReturned   Status = "returned"
)

func (s Status) Valid() bool {
	switch s {
	case StatusWaiting, StatusAssigned, StatusInProgress, StatusCompleted, StatusReturned:
		return true
	}
	return false
}

func (s Status) IsTerminal() bool {
	return s == StatusCompleted
}

func (s Status) IsActive() bool {
	return s != StatusCompleted
}

// WorkItem entity
type WorkItem struct {
	ID               uuid.UUID
	Type             WorkItemType
	Priority         Priority
	Title            string
	Description      *string
	Status           Status
	CurrentTeamID    *uuid.UUID
	AssignedUserID   *uuid.UUID
	FacilityID       *uuid.UUID
	District         *string
	Source           string
	EntityKind       *string
	EntityID         *uuid.UUID
	ParentWorkItemID *uuid.UUID
	DueAt            *time.Time
	CreatedByUserID  *uuid.UUID
	CreatedBySystem  bool
	AcceptedAt       *time.Time
	StartedAt        *time.Time
	CompletedAt      *time.Time
	ReturnedAt       *time.Time
	Version          int
	CreatedAt        time.Time
	UpdatedAt        time.Time
}

// Assignment history record
type Assignment struct {
	ID               uuid.UUID
	WorkItemID       uuid.UUID
	FromUserID       *uuid.UUID
	ToUserID         *uuid.UUID
	AssignedByUserID *uuid.UUID
	Reason           *string
	CreatedAt        time.Time
}

// Handoff record
type Handoff struct {
	ID              uuid.UUID
	WorkItemID      uuid.UUID
	FromTeamID      *uuid.UUID
	ToTeamID        uuid.UUID
	FromUserID      *uuid.UUID
	ToUserID        *uuid.UUID
	Reason          string
	CreatedByUserID *uuid.UUID
	CreatedAt       time.Time
}

// Comment
type Comment struct {
	ID           uuid.UUID
	WorkItemID   uuid.UUID
	AuthorUserID uuid.UUID
	AuthorName   string // denormalized for display
	Body         string
	CreatedAt    time.Time
	UpdatedAt    *time.Time
	DeletedAt    *time.Time
}

// StatusHistory record
type StatusHistoryEntry struct {
	ID              uuid.UUID
	WorkItemID      uuid.UUID
	FromStatus      *Status
	ToStatus        Status
	ChangedByUserID *uuid.UUID
	ChangedByName   string // denormalized
	Reason          *string
	CreatedAt       time.Time
}

// DueDateHistory record
type DueDateHistoryEntry struct {
	ID              uuid.UUID
	WorkItemID      uuid.UUID
	PreviousDueAt   *time.Time
	NewDueAt        *time.Time
	ChangedByUserID *uuid.UUID
	Reason          *string
	CreatedAt       time.Time
}

// LinkedEntity for API responses
type LinkedEntity struct {
	Kind  string `json:"kind"`
	ID    string `json:"id"`
	Label string `json:"label"`
	Href  string `json:"href"`
}

// TimelineEvent for combined timeline
type TimelineEvent struct {
	ID        uuid.UUID `json:"id"`
	Type      string    `json:"type"` // "status_change", "assignment", "handoff", "comment", "due_date_change", "created"
	Actor     *string   `json:"actor,omitempty"`
	Summary   string    `json:"summary"`
	Detail    *string   `json:"detail,omitempty"`
	CreatedAt time.Time `json:"createdAt"`
}

// QueueCounts for badge numbers
type QueueCounts struct {
	MyWork    int `json:"myWork"`
	Team      int `json:"team"`
	Urgent    int `json:"urgent"`
	Overdue   int `json:"overdue"`
	Waiting   int `json:"waiting"`
	Completed int `json:"completed"`
}
