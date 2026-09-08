package work

import (
	"context"

	"github.com/google/uuid"
)

type WorkGenerator struct {
	service *Service
}

func NewWorkGenerator(service *Service) *WorkGenerator {
	return &WorkGenerator{service: service}
}

type EnsureWorkItemInput struct {
	Type        WorkItemType
	Priority    Priority
	Title       string
	Description *string
	EntityKind  string
	EntityID    uuid.UUID
	FacilityID  *uuid.UUID
	District    *string
	TeamID      *uuid.UUID
	Source      string
	ParentID    *uuid.UUID
}

func (g *WorkGenerator) EnsureWorkItem(ctx context.Context, input EnsureWorkItemInput) (*WorkItem, error) {
	existing, err := g.service.repo.FindExistingActiveWork(ctx, input.Type, input.EntityKind, input.EntityID)
	if err != nil {
		return nil, err
	}

	if existing != nil {
		return existing, nil
	}

	dueAt := g.service.slaPolicy.CalculateDueDate(input.Priority)

	item := &WorkItem{
		ID:               uuid.New(),
		Type:             input.Type,
		Priority:         input.Priority,
		Title:            input.Title,
		Description:      input.Description,
		Status:           StatusWaiting,
		CurrentTeamID:    input.TeamID,
		FacilityID:       input.FacilityID,
		District:         input.District,
		Source:           input.Source,
		EntityKind:       &input.EntityKind,
		EntityID:         &input.EntityID,
		ParentWorkItemID: input.ParentID,
		DueAt:            &dueAt,
		CreatedBySystem:  true,
	}

	created, err := g.service.repo.CreateWorkItem(ctx, item)
	if err != nil {
		return nil, err
	}

	return created, nil
}

func (g *WorkGenerator) OnRiskDetected(ctx context.Context, riskAlertID uuid.UUID, facilityID uuid.UUID, district string, medicineName string, riskLevel string, daysOfCover float64) error {
	return nil
}
func (g *WorkGenerator) OnRecommendationGenerated(ctx context.Context, recommendationID uuid.UUID, facilityID uuid.UUID, district string, description string) error {
	return nil
}
func (g *WorkGenerator) OnTransferApproved(ctx context.Context, transferID uuid.UUID, sourceFacilityID uuid.UUID, district string) error {
	return nil
}
func (g *WorkGenerator) OnTransferDispatched(ctx context.Context, transferID uuid.UUID, destFacilityID uuid.UUID, district string) error {
	return nil
}
