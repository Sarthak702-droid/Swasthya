package work

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/ArogyaGrid/arogyagrid/internal/httpx"
	"github.com/ArogyaGrid/arogyagrid/internal/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Routes() chi.Router {
	r := chi.NewRouter()

	r.Post("/items", h.CreateWorkItem)
	r.Get("/items/{id}", h.GetWorkItem)
	r.Get("/queue", h.ListQueue)

	r.Post("/items/{id}/transitions/assign", h.AssignWorkItem)
	r.Post("/items/{id}/transitions/accept", h.AcceptWorkItem)
	r.Post("/items/{id}/transitions/reassign", h.ReassignWorkItem)
	r.Post("/items/{id}/transitions/complete", h.CompleteWorkItem)
	r.Post("/items/{id}/transitions/return", h.ReturnWorkItem)
	r.Post("/items/{id}/transitions/handoff", h.HandoffWorkItem)

	r.Get("/items/{id}/comments", h.ListComments)
	r.Post("/items/{id}/comments", h.AddComment)
	r.Get("/items/{id}/timeline", h.GetTimeline)
	r.Get("/items/{id}/history", h.GetStatusHistory)

	return r
}

func handleError(w http.ResponseWriter, err error) {
	var workErr *WorkError
	if errors.As(err, &workErr) {
		httpx.Error(w, workErr.Status, workErr.Code, workErr.Message)
		return
	}
	httpx.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
}

func parseUUID(r *http.Request, param string) (uuid.UUID, error) {
	raw := chi.URLParam(r, param)
	return uuid.Parse(raw)
}

func (h *Handler) CreateWorkItem(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUserFromContext(r.Context())
	var req CreateWorkItemRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid JSON payload")
		return
	}

	res, err := h.service.CreateWorkItem(r.Context(), user, req)
	if err != nil {
		handleError(w, err)
		return
	}
	httpx.JSON(w, http.StatusCreated, res)
}

func (h *Handler) GetWorkItem(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUserFromContext(r.Context())
	id, err := parseUUID(r, "id")
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid work item ID")
		return
	}

	res, err := h.service.GetWorkItem(r.Context(), user, id)
	if err != nil {
		handleError(w, err)
		return
	}
	httpx.JSON(w, http.StatusOK, res)
}

func (h *Handler) ListQueue(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUserFromContext(r.Context())
	q := r.URL.Query()

	view := q.Get("view")
	if view == "" {
		view = "my"
	}

	filter := QueueFilter{
		View: view,
	}

	if facIDStr := q.Get("facilityId"); facIDStr != "" {
		if facID, err := uuid.Parse(facIDStr); err == nil {
			filter.FacilityID = &facID
		}
	}
	if dist := q.Get("district"); dist != "" {
		filter.District = &dist
	}
	if tStr := q.Get("type"); tStr != "" {
		t := WorkItemType(tStr)
		filter.Type = &t
	}
	if pStr := q.Get("priority"); pStr != "" {
		p := Priority(pStr)
		filter.Priority = &p
	}
	if sStr := q.Get("status"); sStr != "" {
		s := Status(sStr)
		filter.Status = &s
	}
	if limitStr := q.Get("limit"); limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil {
			filter.Limit = l
		}
	}

	resp, err := h.service.ListQueue(r.Context(), user, filter)
	if err != nil {
		handleError(w, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(resp)
}

func (h *Handler) AssignWorkItem(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUserFromContext(r.Context())
	id, err := parseUUID(r, "id")
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid work item ID")
		return
	}

	var req AssignRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid JSON payload")
		return
	}

	res, err := h.service.AssignWorkItem(r.Context(), user, id, req)
	if err != nil {
		handleError(w, err)
		return
	}
	httpx.JSON(w, http.StatusOK, res)
}

func (h *Handler) AcceptWorkItem(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUserFromContext(r.Context())
	id, err := parseUUID(r, "id")
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid work item ID")
		return
	}

	var req AcceptRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid JSON payload")
		return
	}

	res, err := h.service.AcceptWorkItem(r.Context(), user, id, req)
	if err != nil {
		handleError(w, err)
		return
	}
	httpx.JSON(w, http.StatusOK, res)
}

func (h *Handler) ReassignWorkItem(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUserFromContext(r.Context())
	id, err := parseUUID(r, "id")
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid work item ID")
		return
	}

	var req ReassignRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid JSON payload")
		return
	}

	res, err := h.service.ReassignWorkItem(r.Context(), user, id, req)
	if err != nil {
		handleError(w, err)
		return
	}
	httpx.JSON(w, http.StatusOK, res)
}

func (h *Handler) CompleteWorkItem(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUserFromContext(r.Context())
	id, err := parseUUID(r, "id")
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid work item ID")
		return
	}

	var req CompleteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid JSON payload")
		return
	}

	res, err := h.service.CompleteWorkItem(r.Context(), user, id, req)
	if err != nil {
		handleError(w, err)
		return
	}
	httpx.JSON(w, http.StatusOK, res)
}

func (h *Handler) ReturnWorkItem(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUserFromContext(r.Context())
	id, err := parseUUID(r, "id")
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid work item ID")
		return
	}

	var req ReturnRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid JSON payload")
		return
	}

	res, err := h.service.ReturnWorkItem(r.Context(), user, id, req)
	if err != nil {
		handleError(w, err)
		return
	}
	httpx.JSON(w, http.StatusOK, res)
}

func (h *Handler) HandoffWorkItem(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUserFromContext(r.Context())
	id, err := parseUUID(r, "id")
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid work item ID")
		return
	}

	var req HandoffRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid JSON payload")
		return
	}

	res, err := h.service.HandoffWorkItem(r.Context(), user, id, req)
	if err != nil {
		handleError(w, err)
		return
	}
	httpx.JSON(w, http.StatusOK, res)
}

func (h *Handler) ListComments(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUserFromContext(r.Context())
	id, err := parseUUID(r, "id")
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid work item ID")
		return
	}

	res, err := h.service.GetComments(r.Context(), user, id)
	if err != nil {
		handleError(w, err)
		return
	}
	httpx.JSON(w, http.StatusOK, res.Data)
}

func (h *Handler) AddComment(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUserFromContext(r.Context())
	id, err := parseUUID(r, "id")
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid work item ID")
		return
	}

	var req AddCommentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid JSON payload")
		return
	}

	res, err := h.service.AddComment(r.Context(), user, id, req)
	if err != nil {
		handleError(w, err)
		return
	}
	httpx.JSON(w, http.StatusCreated, res)
}

func (h *Handler) GetTimeline(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUserFromContext(r.Context())
	id, err := parseUUID(r, "id")
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid work item ID")
		return
	}

	res, err := h.service.GetTimeline(r.Context(), user, id)
	if err != nil {
		handleError(w, err)
		return
	}
	httpx.JSON(w, http.StatusOK, res.Data)
}

func (h *Handler) GetStatusHistory(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUserFromContext(r.Context())
	id, err := parseUUID(r, "id")
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid work item ID")
		return
	}

	res, err := h.service.GetStatusHistory(r.Context(), user, id)
	if err != nil {
		handleError(w, err)
		return
	}
	httpx.JSON(w, http.StatusOK, res.Data)
}

