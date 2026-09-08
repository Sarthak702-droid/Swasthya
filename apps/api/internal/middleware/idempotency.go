package middleware

import (
	"context"
	"net/http"
)

func RequireIdempotencyKey(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		key := r.Header.Get("Idempotency-Key")
		if key == "" {
			http.Error(w, "missing Idempotency-Key header", http.StatusBadRequest)
			return
		}
		// In a real app we'd check the DB here and return cached response if it exists
		// For now we just ensure it's provided and let request through
		ctx := context.WithValue(r.Context(), "Idempotency-Key", key)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
