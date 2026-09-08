package work

import "fmt"

type WorkError struct {
	Code    string
	Message string
	Status  int // HTTP status
}

func (e *WorkError) Error() string { return fmt.Sprintf("%s: %s", e.Code, e.Message) }

var (
	ErrWorkItemNotFound      = &WorkError{Code: "WORK_ITEM_NOT_FOUND", Message: "Work item not found", Status: 404}
	ErrInvalidTransition     = &WorkError{Code: "INVALID_WORK_TRANSITION", Message: "Invalid status transition", Status: 422}
	ErrAlreadyCompleted      = &WorkError{Code: "WORK_ITEM_ALREADY_COMPLETED", Message: "Work item is already completed", Status: 409}
	ErrVersionConflict       = &WorkError{Code: "WORK_ITEM_VERSION_CONFLICT", Message: "Work item has been modified by another user", Status: 409}
	ErrAssignmentForbidden   = &WorkError{Code: "WORK_ASSIGNMENT_FORBIDDEN", Message: "You do not have permission to assign this work item", Status: 403}
	ErrHandoffForbidden      = &WorkError{Code: "WORK_HANDOFF_FORBIDDEN", Message: "You do not have permission to handoff this work item", Status: 403}
	ErrInvalidAssignee       = &WorkError{Code: "INVALID_ASSIGNEE", Message: "Invalid assignee user", Status: 422}
	ErrInvalidTeam           = &WorkError{Code: "INVALID_TEAM", Message: "Invalid team", Status: 422}
	ErrIdempotencyConflict   = &WorkError{Code: "IDEMPOTENCY_CONFLICT", Message: "Request with this idempotency key already processed", Status: 409}
	ErrEntityNotFound        = &WorkError{Code: "WORK_ENTITY_NOT_FOUND", Message: "Linked entity not found", Status: 404}
	ErrScopeForbidden        = &WorkError{Code: "WORK_SCOPE_FORBIDDEN", Message: "You do not have access to this scope", Status: 403}
	ErrAcceptForbidden       = &WorkError{Code: "WORK_ACCEPT_FORBIDDEN", Message: "Only the assigned user can accept this work item", Status: 403}
	ErrCompleteForbidden     = &WorkError{Code: "WORK_COMPLETE_FORBIDDEN", Message: "You do not have permission to complete this work item", Status: 403}
	ErrReturnForbidden       = &WorkError{Code: "WORK_RETURN_FORBIDDEN", Message: "You do not have permission to return this work item", Status: 403}
	ErrMissingIdempotencyKey = &WorkError{Code: "MISSING_IDEMPOTENCY_KEY", Message: "Idempotency-Key header is required", Status: 400}
	ErrInvalidWorkType       = &WorkError{Code: "INVALID_WORK_TYPE", Message: "Invalid work item type", Status: 422}
	ErrInvalidPriority       = &WorkError{Code: "INVALID_PRIORITY", Message: "Invalid priority value", Status: 422}
	ErrDuplicateWorkItem     = &WorkError{Code: "DUPLICATE_WORK_ITEM", Message: "An active work item already exists for this entity", Status: 409}
)
