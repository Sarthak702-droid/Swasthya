package work

import "errors"

func ValidateCreateRequest(req CreateWorkItemRequest) error {
	if !req.Type.Valid() {
		return ErrInvalidWorkType
	}
	if !req.Priority.Valid() {
		return ErrInvalidPriority
	}
	if req.Title == "" {
		return errors.New("title cannot be empty")
	}
	if len(req.Title) > 255 {
		return errors.New("title too long")
	}
	return nil
}

func ValidateAssignRequest(req AssignRequest) error {
	if req.ToUserID == nil && req.ToTeamID == nil {
		return errors.New("must specify either toUserId or toTeamId")
	}
	if req.Version <= 0 {
		return errors.New("invalid version")
	}
	return nil
}

func ValidateHandoffRequest(req HandoffRequest) error {
	if req.ToTeamID == nil {
		return errors.New("must specify toTeamId")
	}
	if req.Reason == "" {
		return errors.New("must provide reason for handoff")
	}
	if req.Version <= 0 {
		return errors.New("invalid version")
	}
	return nil
}

func ValidateCompleteRequest(req CompleteRequest) error {
	if req.Version <= 0 {
		return errors.New("invalid version")
	}
	return nil
}

func ValidateReturnRequest(req ReturnRequest) error {
	if req.Version <= 0 {
		return errors.New("invalid version")
	}
	return nil
}

func ValidateCommentRequest(req AddCommentRequest) error {
	if req.Body == "" {
		return errors.New("comment body cannot be empty")
	}
	if len(req.Body) > 5000 {
		return errors.New("comment body too long")
	}
	return nil
}
