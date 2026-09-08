package work

import "github.com/ArogyaGrid/arogyagrid/internal/middleware"

// matchDistrict compares user district (string) with work item district (*string)
func matchDistrict(userDistrict string, itemDistrict *string) bool {
	return userDistrict != "" && itemDistrict != nil && userDistrict == *itemDistrict
}

// CanViewWorkItem checks if user can view this work item based on scope
func CanViewWorkItem(user *middleware.UserContext, item *WorkItem) bool {
	switch user.Role {
	case "national_admin", "state_admin":
		return true
	case "district_officer":
		return matchDistrict(user.District, item.District)
	case "facility_manager":
		return user.FacilityID != nil && item.FacilityID != nil && *user.FacilityID == *item.FacilityID
	default:
		return false
	}
}

// CanAssignWorkItem checks if user has permission to assign
func CanAssignWorkItem(user *middleware.UserContext, item *WorkItem) bool {
	switch user.Role {
	case "national_admin", "state_admin":
		return true
	case "district_officer":
		return matchDistrict(user.District, item.District)
	case "facility_manager":
		return user.FacilityID != nil && item.FacilityID != nil && *user.FacilityID == *item.FacilityID
	default:
		return false
	}
}

// CanAcceptWorkItem - only assigned user can accept
func CanAcceptWorkItem(user *middleware.UserContext, item *WorkItem) bool {
	return item.AssignedUserID != nil && *item.AssignedUserID == user.UserID
}

// CanCompleteWorkItem - assigned user or manager with scope
func CanCompleteWorkItem(user *middleware.UserContext, item *WorkItem) bool {
	if item.AssignedUserID != nil && *item.AssignedUserID == user.UserID {
		return true
	}
	return CanAssignWorkItem(user, item)
}

// CanReturnWorkItem - assigned user or manager
func CanReturnWorkItem(user *middleware.UserContext, item *WorkItem) bool {
	if item.AssignedUserID != nil && *item.AssignedUserID == user.UserID {
		return true
	}
	return CanAssignWorkItem(user, item)
}

// CanHandoffWorkItem - only district_officer+ can handoff across teams
func CanHandoffWorkItem(user *middleware.UserContext, item *WorkItem) bool {
	switch user.Role {
	case "national_admin", "state_admin":
		return true
	case "district_officer":
		return matchDistrict(user.District, item.District)
	default:
		return false
	}
}

// CanCreateWorkItem checks if user role allows creating work items
func CanCreateWorkItem(user *middleware.UserContext) bool {
	return user.Role != "viewer"
}
