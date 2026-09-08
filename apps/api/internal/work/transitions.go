package work

import "fmt"

// TransitionAction represents a named workflow action
type TransitionAction string

const (
	ActionAssign   TransitionAction = "assign"
	ActionAccept   TransitionAction = "accept"
	ActionReassign TransitionAction = "reassign"
	ActionComplete TransitionAction = "complete"
	ActionReturn   TransitionAction = "return"
	ActionHandoff  TransitionAction = "handoff"
)

// allowedTransitions defines the state machine
var allowedTransitions = map[Status]map[TransitionAction]Status{
	StatusWaiting: {
		ActionAssign: StatusAssigned,
	},
	StatusAssigned: {
		ActionAccept:   StatusInProgress,
		ActionReturn:   StatusReturned,
		ActionReassign: StatusAssigned,
	},
	StatusInProgress: {
		ActionComplete: StatusCompleted,
		ActionReturn:   StatusReturned,
		ActionReassign: StatusAssigned,
		ActionHandoff:  StatusAssigned,
	},
	StatusReturned: {
		ActionAssign: StatusAssigned,
	},
}

// ValidateTransition checks if a transition is allowed
func ValidateTransition(currentStatus Status, action TransitionAction) (Status, error) {
	actions, ok := allowedTransitions[currentStatus]
	if !ok {
		return "", ErrInvalidTransition
	}
	nextStatus, ok := actions[action]
	if !ok {
		return "", fmt.Errorf("%w: cannot %s from %s", ErrInvalidTransition, action, currentStatus)
	}
	return nextStatus, nil
}

// GetAllowedActions returns actions available for a given status
func GetAllowedActions(status Status) []TransitionAction {
	actionsMap, ok := allowedTransitions[status]
	if !ok {
		return nil
	}
	var actions []TransitionAction
	for action := range actionsMap {
		actions = append(actions, action)
	}
	return actions
}
