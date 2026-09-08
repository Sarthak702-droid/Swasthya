package work

import (
	"context"
	"fmt"
	"time"

	"github.com/ArogyaGrid/arogyagrid/internal/middleware"
	"github.com/google/uuid"
)

type Service struct {
	repo      Repository
	slaPolicy SLAPolicy
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo, slaPolicy: DefaultSLAPolicy}
}

func (s *Service) CreateWorkItem(ctx context.Context, user *middleware.UserContext, req CreateWorkItemRequest) (*WorkItemResponse, error) {
	if user != nil && !CanCreateWorkItem(user) {
		return nil, ErrScopeForbidden
	}

	if !req.Type.Valid() {
		return nil, ErrInvalidWorkType
	}
	if !req.Priority.Valid() {
		return nil, ErrInvalidPriority
	}

	dueAt := req.DueAt
	if dueAt == nil {
		calculated := s.slaPolicy.CalculateDueDate(req.Priority)
		dueAt = &calculated
	}

	item := &WorkItem{
		ID:               uuid.New(),
		Type:             req.Type,
		Priority:         req.Priority,
		Title:            req.Title,
		Description:      req.Description,
		Status:           StatusWaiting,
		CurrentTeamID:    req.CurrentTeamID,
		AssignedUserID:   req.AssignedUserID,
		FacilityID:       req.FacilityID,
		District:         req.District,
		Source:           req.Source,
		EntityKind:       req.EntityKind,
		EntityID:         req.EntityID,
		ParentWorkItemID: req.ParentWorkItemID,
		DueAt:            dueAt,
		CreatedBySystem:  user == nil,
	}

	if user != nil {
		item.CreatedByUserID = &user.UserID
	}

	if item.AssignedUserID != nil {
		item.Status = StatusAssigned
	}

	var created *WorkItem
	err := s.repo.WithTx(ctx, func(txRepo Repository) error {
		var err error
		created, err = txRepo.CreateWorkItem(ctx, item)
		if err != nil {
			return err
		}

		// Record status history
		sh := &StatusHistoryEntry{
			WorkItemID: created.ID,
			ToStatus:   created.Status,
			CreatedAt:  time.Now(),
		}
		if user != nil {
			sh.ChangedByUserID = &user.UserID
		}
		if err := txRepo.InsertStatusHistory(ctx, sh); err != nil {
			return err
		}

		// If initial assignee was set, record assignment
		if created.AssignedUserID != nil {
			assign := &Assignment{
				WorkItemID: created.ID,
				ToUserID:   created.AssignedUserID,
				CreatedAt:  time.Now(),
			}
			if user != nil {
				assign.AssignedByUserID = &user.UserID
			}
			if err := txRepo.InsertAssignment(ctx, assign); err != nil {
				return err
			}
		}

		// Audit event
		var actorID *uuid.UUID
		if user != nil {
			actorID = &user.UserID
		}
		return txRepo.InsertAuditEvent(ctx, AuditEvent{
			ActorUserID: actorID,
			FacilityID:  created.FacilityID,
			EventType:   "WORK_ITEM_CREATED",
			EntityType:  created.EntityKind,
			EntityID:    created.EntityID,
			Metadata: map[string]interface{}{
				"workItemId": created.ID.String(),
				"type":       string(created.Type),
				"priority":   string(created.Priority),
				"title":      created.Title,
			},
		})
	})
	if err != nil {
		return nil, err
	}

	allowed := GetAllowedActions(created.Status)
	resp := ToWorkItemResponse(created, allowed)
	return &resp, nil
}

func (s *Service) GetWorkItem(ctx context.Context, user *middleware.UserContext, id uuid.UUID) (*WorkItemDetailResponse, error) {
	item, err := s.repo.GetWorkItemByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if item == nil {
		return nil, ErrWorkItemNotFound
	}

	if user != nil && !CanViewWorkItem(user, item) {
		return nil, ErrScopeForbidden
	}

	comments, _ := s.repo.ListComments(ctx, id)
	timelineEvents, _ := s.loadFullTimeline(ctx, item)

	allowed := GetAllowedActions(item.Status)
	baseResp := ToWorkItemResponse(item, allowed)

	return &WorkItemDetailResponse{
		WorkItemResponse: baseResp,
		Comments:         comments,
		Timeline:         timelineEvents,
	}, nil
}

func (s *Service) ListQueue(ctx context.Context, user *middleware.UserContext, filter QueueFilter) (*WorkQueueResponse, error) {
	var uid uuid.UUID
	if user != nil {
		uid = user.UserID
		if user.Role == "facility_manager" && user.FacilityID != nil {
			filter.FacilityID = user.FacilityID
		} else if user.Role == "district_officer" && user.District != "" {
			filter.District = &user.District
		}
	}

	items, nextCursor, err := s.repo.ListWorkItems(ctx, filter, uid)
	if err != nil {
		return nil, err
	}

	var teamIDs []uuid.UUID
	counts, _ := s.repo.CountByStatus(ctx, uid, teamIDs)

	data := []WorkItemResponse{}
	for _, it := range items {
		allowed := GetAllowedActions(it.Status)
		data = append(data, ToWorkItemResponse(&it, allowed))
	}

	return &WorkQueueResponse{
		Data: data,
		Meta: PaginationMeta{
			NextCursor: nextCursor,
			HasMore:    nextCursor != nil,
		},
		Counts: counts,
	}, nil
}

func (s *Service) AssignWorkItem(ctx context.Context, user *middleware.UserContext, id uuid.UUID, req AssignRequest) (*WorkItemResponse, error) {
	item, err := s.repo.GetWorkItemByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if item == nil {
		return nil, ErrWorkItemNotFound
	}

	if user != nil && !CanAssignWorkItem(user, item) {
		return nil, ErrAssignmentForbidden
	}

	nextStatus, err := ValidateTransition(item.Status, ActionAssign)
	if err != nil {
		return nil, err
	}

	var updated *WorkItem
	err = s.repo.WithTx(ctx, func(txRepo Repository) error {
		var err error
		updated, err = txRepo.UpdateWorkItemAssignee(ctx, id, req.ToUserID, req.ToTeamID, req.Version)
		if err != nil {
			return err
		}

		if item.Status != nextStatus {
			updated, err = txRepo.UpdateWorkItemStatus(ctx, id, nextStatus, updated.Version, map[string]interface{}{})
			if err != nil {
				return err
			}
		}

		// Assignment history
		var assignedBy *uuid.UUID
		if user != nil {
			assignedBy = &user.UserID
		}
		if err := txRepo.InsertAssignment(ctx, &Assignment{
			WorkItemID:       id,
			FromUserID:       item.AssignedUserID,
			ToUserID:         req.ToUserID,
			AssignedByUserID: assignedBy,
			Reason:           req.Reason,
		}); err != nil {
			return err
		}

		// Status history
		fromStatus := item.Status
		if err := txRepo.InsertStatusHistory(ctx, &StatusHistoryEntry{
			WorkItemID:      id,
			FromStatus:      &fromStatus,
			ToStatus:        nextStatus,
			ChangedByUserID: assignedBy,
			Reason:          req.Reason,
		}); err != nil {
			return err
		}

		return txRepo.InsertAuditEvent(ctx, AuditEvent{
			ActorUserID: assignedBy,
			FacilityID:  item.FacilityID,
			EventType:   "WORK_ITEM_ASSIGNED",
			EntityType:  item.EntityKind,
			EntityID:    item.EntityID,
			Metadata: map[string]interface{}{
				"workItemId": id.String(),
				"toUserId":   req.ToUserID,
				"reason":     req.Reason,
			},
		})
	})
	if err != nil {
		return nil, err
	}

	allowed := GetAllowedActions(updated.Status)
	resp := ToWorkItemResponse(updated, allowed)
	return &resp, nil
}

func (s *Service) AcceptWorkItem(ctx context.Context, user *middleware.UserContext, id uuid.UUID, req AcceptRequest) (*WorkItemResponse, error) {
	item, err := s.repo.GetWorkItemByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if item == nil {
		return nil, ErrWorkItemNotFound
	}

	if user != nil && !CanAcceptWorkItem(user, item) {
		return nil, ErrAcceptForbidden
	}

	nextStatus, err := ValidateTransition(item.Status, ActionAccept)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	var updated *WorkItem
	err = s.repo.WithTx(ctx, func(txRepo Repository) error {
		var err error
		updated, err = txRepo.UpdateWorkItemStatus(ctx, id, nextStatus, req.Version, map[string]interface{}{
			"accepted_at": now,
			"started_at":  now,
		})
		if err != nil {
			return err
		}

		var actorID *uuid.UUID
		if user != nil {
			actorID = &user.UserID
		}
		fromStatus := item.Status
		reason := "Accepted by assigned officer"
		if err := txRepo.InsertStatusHistory(ctx, &StatusHistoryEntry{
			WorkItemID:      id,
			FromStatus:      &fromStatus,
			ToStatus:        nextStatus,
			ChangedByUserID: actorID,
			Reason:          &reason,
		}); err != nil {
			return err
		}

		return txRepo.InsertAuditEvent(ctx, AuditEvent{
			ActorUserID: actorID,
			FacilityID:  item.FacilityID,
			EventType:   "WORK_ITEM_ACCEPTED",
			EntityType:  item.EntityKind,
			EntityID:    item.EntityID,
			Metadata: map[string]interface{}{
				"workItemId": id.String(),
			},
		})
	})
	if err != nil {
		return nil, err
	}

	allowed := GetAllowedActions(updated.Status)
	resp := ToWorkItemResponse(updated, allowed)
	return &resp, nil
}

func (s *Service) ReassignWorkItem(ctx context.Context, user *middleware.UserContext, id uuid.UUID, req ReassignRequest) (*WorkItemResponse, error) {
	item, err := s.repo.GetWorkItemByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if item == nil {
		return nil, ErrWorkItemNotFound
	}

	if user != nil && !CanAssignWorkItem(user, item) {
		return nil, ErrAssignmentForbidden
	}

	_, err = ValidateTransition(item.Status, ActionReassign)
	if err != nil {
		return nil, err
	}

	var updated *WorkItem
	err = s.repo.WithTx(ctx, func(txRepo Repository) error {
		var err error
		updated, err = txRepo.UpdateWorkItemAssignee(ctx, id, req.ToUserID, item.CurrentTeamID, req.Version)
		if err != nil {
			return err
		}

		var actorID *uuid.UUID
		if user != nil {
			actorID = &user.UserID
		}
		if err := txRepo.InsertAssignment(ctx, &Assignment{
			WorkItemID:       id,
			FromUserID:       item.AssignedUserID,
			ToUserID:         req.ToUserID,
			AssignedByUserID: actorID,
			Reason:           req.Reason,
		}); err != nil {
			return err
		}

		return txRepo.InsertAuditEvent(ctx, AuditEvent{
			ActorUserID: actorID,
			FacilityID:  item.FacilityID,
			EventType:   "WORK_ITEM_REASSIGNED",
			EntityType:  item.EntityKind,
			EntityID:    item.EntityID,
			Metadata: map[string]interface{}{
				"workItemId": id.String(),
				"toUserId":   req.ToUserID,
				"reason":     req.Reason,
			},
		})
	})
	if err != nil {
		return nil, err
	}

	allowed := GetAllowedActions(updated.Status)
	resp := ToWorkItemResponse(updated, allowed)
	return &resp, nil
}

func (s *Service) CompleteWorkItem(ctx context.Context, user *middleware.UserContext, id uuid.UUID, req CompleteRequest) (*WorkItemResponse, error) {
	item, err := s.repo.GetWorkItemByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if item == nil {
		return nil, ErrWorkItemNotFound
	}
	if item.Status == StatusCompleted {
		return nil, ErrAlreadyCompleted
	}

	if user != nil && !CanCompleteWorkItem(user, item) {
		return nil, ErrCompleteForbidden
	}

	nextStatus, err := ValidateTransition(item.Status, ActionComplete)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	var updated *WorkItem
	err = s.repo.WithTx(ctx, func(txRepo Repository) error {
		var err error
		updated, err = txRepo.UpdateWorkItemStatus(ctx, id, nextStatus, req.Version, map[string]interface{}{
			"completed_at": now,
		})
		if err != nil {
			return err
		}

		var actorID *uuid.UUID
		if user != nil {
			actorID = &user.UserID
		}
		fromStatus := item.Status
		if err := txRepo.InsertStatusHistory(ctx, &StatusHistoryEntry{
			WorkItemID:      id,
			FromStatus:      &fromStatus,
			ToStatus:        nextStatus,
			ChangedByUserID: actorID,
			Reason:          req.Reason,
		}); err != nil {
			return err
		}

		return txRepo.InsertAuditEvent(ctx, AuditEvent{
			ActorUserID: actorID,
			FacilityID:  item.FacilityID,
			EventType:   "WORK_ITEM_COMPLETED",
			EntityType:  item.EntityKind,
			EntityID:    item.EntityID,
			Metadata: map[string]interface{}{
				"workItemId": id.String(),
				"reason":     req.Reason,
			},
		})
	})
	if err != nil {
		return nil, err
	}

	allowed := GetAllowedActions(updated.Status)
	resp := ToWorkItemResponse(updated, allowed)
	return &resp, nil
}

func (s *Service) ReturnWorkItem(ctx context.Context, user *middleware.UserContext, id uuid.UUID, req ReturnRequest) (*WorkItemResponse, error) {
	item, err := s.repo.GetWorkItemByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if item == nil {
		return nil, ErrWorkItemNotFound
	}

	if user != nil && !CanReturnWorkItem(user, item) {
		return nil, ErrReturnForbidden
	}

	nextStatus, err := ValidateTransition(item.Status, ActionReturn)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	var updated *WorkItem
	err = s.repo.WithTx(ctx, func(txRepo Repository) error {
		var err error
		updated, err = txRepo.UpdateWorkItemStatus(ctx, id, nextStatus, req.Version, map[string]interface{}{
			"returned_at": now,
		})
		if err != nil {
			return err
		}

		var actorID *uuid.UUID
		if user != nil {
			actorID = &user.UserID
		}
		fromStatus := item.Status
		if err := txRepo.InsertStatusHistory(ctx, &StatusHistoryEntry{
			WorkItemID:      id,
			FromStatus:      &fromStatus,
			ToStatus:        nextStatus,
			ChangedByUserID: actorID,
			Reason:          req.Reason,
		}); err != nil {
			return err
		}

		return txRepo.InsertAuditEvent(ctx, AuditEvent{
			ActorUserID: actorID,
			FacilityID:  item.FacilityID,
			EventType:   "WORK_ITEM_RETURNED",
			EntityType:  item.EntityKind,
			EntityID:    item.EntityID,
			Metadata: map[string]interface{}{
				"workItemId": id.String(),
				"reason":     req.Reason,
			},
		})
	})
	if err != nil {
		return nil, err
	}

	allowed := GetAllowedActions(updated.Status)
	resp := ToWorkItemResponse(updated, allowed)
	return &resp, nil
}

func (s *Service) HandoffWorkItem(ctx context.Context, user *middleware.UserContext, id uuid.UUID, req HandoffRequest) (*WorkItemResponse, error) {
	item, err := s.repo.GetWorkItemByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if item == nil {
		return nil, ErrWorkItemNotFound
	}

	if user != nil && !CanHandoffWorkItem(user, item) {
		return nil, ErrHandoffForbidden
	}

	_, err = ValidateTransition(item.Status, ActionHandoff)
	if err != nil {
		return nil, err
	}

	var updated *WorkItem
	err = s.repo.WithTx(ctx, func(txRepo Repository) error {
		var err error
		updated, err = txRepo.UpdateWorkItemAssignee(ctx, id, req.ToUserID, req.ToTeamID, req.Version)
		if err != nil {
			return err
		}

		var actorID *uuid.UUID
		if user != nil {
			actorID = &user.UserID
		}
		if req.ToTeamID != nil {
			if err := txRepo.InsertHandoff(ctx, &Handoff{
				WorkItemID:      id,
				FromTeamID:      item.CurrentTeamID,
				ToTeamID:        *req.ToTeamID,
				FromUserID:      item.AssignedUserID,
				ToUserID:        req.ToUserID,
				Reason:          req.Reason,
				CreatedByUserID: actorID,
			}); err != nil {
				return err
			}
		}

		fromStatus := item.Status
		reason := fmt.Sprintf("Handed off: %s", req.Reason)
		if err := txRepo.InsertStatusHistory(ctx, &StatusHistoryEntry{
			WorkItemID:      id,
			FromStatus:      &fromStatus,
			ToStatus:        StatusAssigned,
			ChangedByUserID: actorID,
			Reason:          &reason,
		}); err != nil {
			return err
		}

		return txRepo.InsertAuditEvent(ctx, AuditEvent{
			ActorUserID: actorID,
			FacilityID:  item.FacilityID,
			EventType:   "WORK_ITEM_HANDED_OFF",
			EntityType:  item.EntityKind,
			EntityID:    item.EntityID,
			Metadata: map[string]interface{}{
				"workItemId": id.String(),
				"toTeamId":   req.ToTeamID,
				"toUserId":   req.ToUserID,
				"reason":     req.Reason,
			},
		})
	})
	if err != nil {
		return nil, err
	}

	allowed := GetAllowedActions(updated.Status)
	resp := ToWorkItemResponse(updated, allowed)
	return &resp, nil
}

func (s *Service) AddComment(ctx context.Context, user *middleware.UserContext, id uuid.UUID, req AddCommentRequest) (*CommentResponse, error) {
	item, err := s.repo.GetWorkItemByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if item == nil {
		return nil, ErrWorkItemNotFound
	}

	var authorID uuid.UUID
	authorName := "System User"
	if user != nil {
		authorID = user.UserID
		authorName = user.DisplayName
	} else {
		authorID = uuid.New()
	}

	comment := &Comment{
		ID:           uuid.New(),
		WorkItemID:   id,
		AuthorUserID: authorID,
		AuthorName:   authorName,
		Body:         req.Body,
		CreatedAt:    time.Now(),
	}

	if err := s.repo.InsertComment(ctx, comment); err != nil {
		return nil, err
	}

	_ = s.repo.InsertAuditEvent(ctx, AuditEvent{
		ActorUserID: &authorID,
		FacilityID:  item.FacilityID,
		EventType:   "WORK_COMMENT_ADDED",
		EntityType:  item.EntityKind,
		EntityID:    item.EntityID,
		Metadata: map[string]interface{}{
			"workItemId": id.String(),
			"commentId":  comment.ID.String(),
		},
	})

	return &CommentResponse{
		ID:           comment.ID,
		AuthorUserID: comment.AuthorUserID,
		AuthorName:   comment.AuthorName,
		Body:         comment.Body,
		CreatedAt:    comment.CreatedAt,
	}, nil
}

func (s *Service) GetTimeline(ctx context.Context, user *middleware.UserContext, id uuid.UUID) (*TimelineResponse, error) {
	item, err := s.repo.GetWorkItemByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if item == nil {
		return nil, ErrWorkItemNotFound
	}

	events, err := s.loadFullTimeline(ctx, item)
	if err != nil {
		return nil, err
	}

	return &TimelineResponse{Data: events}, nil
}

func (s *Service) loadFullTimeline(ctx context.Context, item *WorkItem) ([]TimelineEvent, error) {
	statusHist, _ := s.repo.ListStatusHistory(ctx, item.ID)
	assignments, _ := s.repo.ListAssignments(ctx, item.ID)
	handoffs, _ := s.repo.ListHandoffs(ctx, item.ID)
	comments, _ := s.repo.ListComments(ctx, item.ID)

	events := BuildTimeline(item, statusHist, assignments, handoffs, comments)
	return events, nil
}

func (s *Service) GetComments(ctx context.Context, user *middleware.UserContext, id uuid.UUID) (*CommentsResponse, error) {
	comments, err := s.repo.ListComments(ctx, id)
	if err != nil {
		return nil, err
	}

	var data []CommentResponse
	for _, c := range comments {
		data = append(data, CommentResponse{
			ID:           c.ID,
			AuthorUserID: c.AuthorUserID,
			AuthorName:   c.AuthorName,
			Body:         c.Body,
			CreatedAt:    c.CreatedAt,
			UpdatedAt:    c.UpdatedAt,
		})
	}

	return &CommentsResponse{Data: data}, nil
}

func (s *Service) GetStatusHistory(ctx context.Context, user *middleware.UserContext, id uuid.UUID) (*StatusHistoryResponse, error) {
	history, err := s.repo.ListStatusHistory(ctx, id)
	if err != nil {
		return nil, err
	}

	var data []StatusHistoryEntryResponse
	for _, h := range history {
		name := h.ChangedByName
		data = append(data, StatusHistoryEntryResponse{
			ID:            h.ID,
			FromStatus:    h.FromStatus,
			ToStatus:      h.ToStatus,
			ChangedByName: &name,
			Reason:        h.Reason,
			CreatedAt:     h.CreatedAt,
		})
	}

	return &StatusHistoryResponse{Data: data}, nil
}

