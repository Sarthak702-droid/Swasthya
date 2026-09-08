package work

import "time"

// SLAPolicy defines due-date rules per priority
type SLAPolicy struct {
	Critical time.Duration
	Urgent   time.Duration
	High     time.Duration
	Normal   time.Duration
	Low      time.Duration
}

var DefaultSLAPolicy = SLAPolicy{
	Critical: 2 * time.Hour,
	Urgent:   8 * time.Hour,
	High:     24 * time.Hour,
	Normal:   72 * time.Hour,
	Low:      7 * 24 * time.Hour,
}

// CalculateDueDate returns due date based on priority
func (p SLAPolicy) CalculateDueDate(priority Priority) time.Time {
	now := time.Now()
	switch priority {
	case PriorityCritical:
		return now.Add(p.Critical)
	case PriorityUrgent:
		return now.Add(p.Urgent)
	case PriorityHigh:
		return now.Add(p.High)
	case PriorityNormal:
		return now.Add(p.Normal)
	case PriorityLow:
		return now.Add(p.Low)
	default:
		return now.Add(p.Normal)
	}
}

// DeterminePriority calculates priority from domain context
func DeterminePriority(workType WorkItemType, riskLevel string, daysOfCover float64) Priority {
	switch {
	case riskLevel == "CRITICAL" || daysOfCover < 2:
		return PriorityCritical
	case riskLevel == "HIGH" || daysOfCover < 4:
		return PriorityHigh
	case riskLevel == "MEDIUM" || daysOfCover < 7:
		return PriorityNormal
	default:
		return PriorityLow
	}
}
