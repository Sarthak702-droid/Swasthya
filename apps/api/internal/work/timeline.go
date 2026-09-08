package work

import (
	"fmt"
	"sort"
)

func BuildTimeline(item *WorkItem, statusHistory []StatusHistoryEntry, assignments []Assignment, handoffs []Handoff, comments []Comment) []TimelineEvent {
	var events []TimelineEvent

	// Add creation event
	events = append(events, TimelineEvent{
		ID:        item.ID,
		Type:      "created",
		Summary:   fmt.Sprintf("Work item created: %s", item.Title),
		CreatedAt: item.CreatedAt,
	})

	// Add status changes
	for _, sh := range statusHistory {
		actor := sh.ChangedByName
		if actor == "" {
			actor = "System"
		}
		var summary string
		if sh.FromStatus != nil {
			summary = fmt.Sprintf("Status changed from %s to %s", string(*sh.FromStatus), string(sh.ToStatus))
		} else {
			summary = fmt.Sprintf("Status set to %s", string(sh.ToStatus))
		}
		if sh.Reason != nil && *sh.Reason != "" {
			summary = fmt.Sprintf("%s (%s)", summary, *sh.Reason)
		}
		events = append(events, TimelineEvent{
			ID:        sh.ID,
			Type:      "status_change",
			Actor:     &actor,
			Summary:   summary,
			Detail:    sh.Reason,
			CreatedAt: sh.CreatedAt,
		})
	}

	// Add assignments
	for _, a := range assignments {
		summary := "Work item assigned"
		if a.Reason != nil && *a.Reason != "" {
			summary = fmt.Sprintf("Assigned: %s", *a.Reason)
		}
		events = append(events, TimelineEvent{
			ID:        a.ID,
			Type:      "assignment",
			Summary:   summary,
			Detail:    a.Reason,
			CreatedAt: a.CreatedAt,
		})
	}

	// Add handoffs
	for _, h := range handoffs {
		summary := fmt.Sprintf("Work handed off: %s", h.Reason)
		events = append(events, TimelineEvent{
			ID:        h.ID,
			Type:      "handoff",
			Summary:   summary,
			Detail:    &h.Reason,
			CreatedAt: h.CreatedAt,
		})
	}

	// Add comments
	for _, c := range comments {
		author := c.AuthorName
		body := c.Body
		events = append(events, TimelineEvent{
			ID:        c.ID,
			Type:      "comment",
			Actor:     &author,
			Summary:   fmt.Sprintf("Comment added by %s", author),
			Detail:    &body,
			CreatedAt: c.CreatedAt,
		})
	}

	// Sort chronologically ascending
	sort.Slice(events, func(i, j int) bool {
		return events[i].CreatedAt.Before(events[j].CreatedAt)
	})

	return events
}
