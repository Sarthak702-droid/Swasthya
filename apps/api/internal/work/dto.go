package work

import (
	"time"

	"github.com/google/uuid"
)

// === Requests ===

type CreateWorkItemRequest struct {
	Type             WorkItemType `json:"type"`
	Priority         Priority     `json:"priority"`
	Title            string       `json:"title"`
	Description      *string      `json:"description,omitempty"`
	CurrentTeamID    *uuid.UUID   `json:"currentTeamId,omitempty"`
	AssignedUserID   *uuid.UUID   `json:"assignedUserId,omitempty"`
	FacilityID       *uuid.UUID   `json:"facilityId,omitempty"`
	District         *string      `json:"district,omitempty"`
	EntityKind       *string      `json:"entityKind,omitempty"`
	EntityID         *uuid.UUID   `json:"entityId,omitempty"`
	ParentWorkItemID *uuid.UUID   `json:"parentWorkItemId,omitempty"`
	DueAt            *time.Time   `json:"dueAt,omitempty"`
	Source           string       `json:"source"`
}

type AssignRequest struct {
	ToUserID *uuid.UUID `json:"toUserId"`
	ToTeamID *uuid.UUID `json:"toTeamId,omitempty"`
	Reason   *string    `json:"reason,omitempty"`
	Version  int        `json:"version"`
}

type AcceptRequest struct {
	Version int `json:"version"`
}

type ReassignRequest struct {
	ToUserID *uuid.UUID `json:"toUserId"`
	Reason   *string    `json:"reason,omitempty"`
	Version  int        `json:"version"`
}

type CompleteRequest struct {
	Reason  *string `json:"reason,omitempty"`
	Version int     `json:"version"`
}

type ReturnRequest struct {
	Reason  *string `json:"reason,omitempty"`
	Version int     `json:"version"`
}

type HandoffRequest struct {
	ToTeamID *uuid.UUID `json:"toTeamId"`
	ToUserID *uuid.UUID `json:"toUserId,omitempty"`
	Reason   string     `json:"reason"`
	Version  int        `json:"version"`
}

type AddCommentRequest struct {
	Body string `json:"body"`
}

type QueueFilter struct {
	View           string // "my", "team", "urgent", "overdue", "waiting", "completed", "facility", "district"
	FacilityID     *uuid.UUID
	District       *string
	Type           *WorkItemType
	Priority       *Priority
	Status         *Status
	AssignedUserID *uuid.UUID
	TeamID         *uuid.UUID
	DueBefore      *time.Time
	DueAfter       *time.Time
	Limit          int
	Cursor         *string
}

// === Responses ===

type WorkItemResponse struct {
	ID               uuid.UUID          `json:"id"`
	Type             WorkItemType       `json:"type"`
	Priority         Priority           `json:"priority"`
	Title            string             `json:"title"`
	Description      *string            `json:"description,omitempty"`
	Status           Status             `json:"status"`
	CurrentTeamID    *uuid.UUID         `json:"currentTeamId,omitempty"`
	AssignedUserID   *uuid.UUID         `json:"assignedUserId,omitempty"`
	AssignedUserName *string            `json:"assignedUserName,omitempty"`
	FacilityID       *uuid.UUID         `json:"facilityId,omitempty"`
	FacilityName     *string            `json:"facilityName,omitempty"`
	District         *string            `json:"district,omitempty"`
	Source           string             `json:"source"`
	Entity           *LinkedEntity      `json:"entity,omitempty"`
	ParentWorkItemID *uuid.UUID         `json:"parentWorkItemId,omitempty"`
	DueAt            *time.Time         `json:"dueAt,omitempty"`
	CreatedBySystem  bool               `json:"createdBySystem"`
	AcceptedAt       *time.Time         `json:"acceptedAt,omitempty"`
	StartedAt        *time.Time         `json:"startedAt,omitempty"`
	CompletedAt      *time.Time         `json:"completedAt,omitempty"`
	ReturnedAt       *time.Time         `json:"returnedAt,omitempty"`
	AllowedActions   []TransitionAction `json:"allowedActions"`
	Version          int                `json:"version"`
	CreatedAt        time.Time          `json:"createdAt"`
	UpdatedAt        time.Time          `json:"updatedAt"`
}

type WorkQueueResponse struct {
	Data   []WorkItemResponse `json:"data"`
	Meta   PaginationMeta     `json:"meta"`
	Counts *QueueCounts       `json:"counts,omitempty"`
}

type PaginationMeta struct {
	NextCursor *string `json:"nextCursor,omitempty"`
	HasMore    bool    `json:"hasMore"`
}

type WorkItemDetailResponse struct {
	WorkItemResponse
	Comments []Comment       `json:"comments,omitempty"`
	Timeline []TimelineEvent `json:"timeline,omitempty"`
}

type TimelineResponse struct {
	Data []TimelineEvent `json:"data"`
}

type CommentsResponse struct {
	Data []CommentResponse `json:"data"`
}

type CommentResponse struct {
	ID           uuid.UUID  `json:"id"`
	AuthorUserID uuid.UUID  `json:"authorUserId"`
	AuthorName   string     `json:"authorName"`
	Body         string     `json:"body"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    *time.Time `json:"updatedAt,omitempty"`
}

type StatusHistoryResponse struct {
	Data []StatusHistoryEntryResponse `json:"data"`
}

type StatusHistoryEntryResponse struct {
	ID            uuid.UUID `json:"id"`
	FromStatus    *Status   `json:"fromStatus,omitempty"`
	ToStatus      Status    `json:"toStatus"`
	ChangedByName *string   `json:"changedByName,omitempty"`
	Reason        *string   `json:"reason,omitempty"`
	CreatedAt     time.Time `json:"createdAt"`
}

func lookupUserName(id *uuid.UUID) *string {
	if id == nil {
		return nil
	}
	switch id.String() {
	case "11111111-0000-0000-0000-000000000001":
		s := "Sarthak"
		return &s
	case "11111111-0000-0000-0000-000000000002":
		s := "Vaishnavi"
		return &s
	case "11111111-0000-0000-0000-000000000003":
		s := "Riya"
		return &s
	case "11111111-0000-0000-0000-000000000004":
		s := "Shneanjali"
		return &s
	default:
		s := "Officer " + id.String()[:8]
		return &s
	}
}

func lookupFacilityName(id *uuid.UUID) *string {
	if id == nil {
		return nil
	}
	switch id.String() {
	case "00000000-0000-0000-0000-000000000001":
		s := "PHC Nayapalli"
		return &s
	case "00000000-0000-0000-0000-000000000002":
		s := "PHC Saheed Nagar"
		return &s
	case "00000000-0000-0000-0000-000000000003":
		s := "PHC Bhubaneswar Central"
		return &s
	case "00000000-0000-0000-0000-000000000004":
		s := "District Hospital Cuttack"
		return &s
	default:
		return nil
	}
}

func ToWorkItemResponse(item *WorkItem, allowedActions []TransitionAction) WorkItemResponse {
	var entity *LinkedEntity
	if item.EntityKind != nil && item.EntityID != nil {
		entity = &LinkedEntity{
			Kind: *item.EntityKind,
			ID:   item.EntityID.String(),
		}
	}
	return WorkItemResponse{
		ID:               item.ID,
		Type:             item.Type,
		Priority:         item.Priority,
		Title:            item.Title,
		Description:      item.Description,
		Status:           item.Status,
		CurrentTeamID:    item.CurrentTeamID,
		AssignedUserID:   item.AssignedUserID,
		AssignedUserName: lookupUserName(item.AssignedUserID),
		FacilityID:       item.FacilityID,
		FacilityName:     lookupFacilityName(item.FacilityID),
		District:         item.District,
		Source:           item.Source,
		Entity:           entity,
		ParentWorkItemID: item.ParentWorkItemID,
		DueAt:            item.DueAt,
		CreatedBySystem:  item.CreatedBySystem,
		AcceptedAt:       item.AcceptedAt,
		StartedAt:        item.StartedAt,
		CompletedAt:      item.CompletedAt,
		ReturnedAt:       item.ReturnedAt,
		AllowedActions:   allowedActions,
		Version:          item.Version,
		CreatedAt:        item.CreatedAt,
		UpdatedAt:        item.UpdatedAt,
	}
}
