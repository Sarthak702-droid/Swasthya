package work

import (
	"testing"
)

func TestValidTransitions(t *testing.T) {
	tests := []struct {
		current Status
		action  TransitionAction
		next    Status
	}{
		{StatusWaiting, ActionAssign, StatusAssigned},
		{StatusAssigned, ActionAccept, StatusInProgress},
		{StatusAssigned, ActionReturn, StatusReturned},
		{StatusAssigned, ActionReassign, StatusAssigned},
		{StatusInProgress, ActionComplete, StatusCompleted},
		{StatusInProgress, ActionReturn, StatusReturned},
		{StatusInProgress, ActionReassign, StatusAssigned},
		{StatusInProgress, ActionHandoff, StatusAssigned},
		{StatusReturned, ActionAssign, StatusAssigned},
	}

	for _, tt := range tests {
		t.Run(string(tt.current)+"_"+string(tt.action), func(t *testing.T) {
			next, err := ValidateTransition(tt.current, tt.action)
			if err != nil {
				t.Fatalf("expected no error, got %v", err)
			}
			if next != tt.next {
				t.Errorf("expected %v, got %v", tt.next, next)
			}
		})
	}
}

func TestInvalidTransitions(t *testing.T) {
	tests := []struct {
		current Status
		action  TransitionAction
	}{
		{StatusWaiting, ActionComplete},
		{StatusCompleted, ActionAssign},
		{StatusReturned, ActionComplete},
	}

	for _, tt := range tests {
		t.Run(string(tt.current)+"_"+string(tt.action), func(t *testing.T) {
			_, err := ValidateTransition(tt.current, tt.action)
			if err == nil {
				t.Fatal("expected error, got none")
			}
		})
	}
}

func TestGetAllowedActions(t *testing.T) {
	actions := GetAllowedActions(StatusWaiting)
	if len(actions) != 1 || actions[0] != ActionAssign {
		t.Errorf("unexpected actions for waiting: %v", actions)
	}
}

func TestTerminalStatus(t *testing.T) {
	actions := GetAllowedActions(StatusCompleted)
	if len(actions) != 0 {
		t.Errorf("expected no actions for completed, got %v", actions)
	}
}
