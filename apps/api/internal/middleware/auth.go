package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type contextKey string
const userContextKey = contextKey("userContext")

type UserContext struct {
	UserID      uuid.UUID
	Role        string
	FacilityID  *uuid.UUID
	District    string
	DisplayName string
}

func Auth(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				http.Error(w, "missing authorization header", http.StatusUnauthorized)
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				http.Error(w, "invalid authorization header", http.StatusUnauthorized)
				return
			}

			token, err := jwt.Parse(parts[1], func(token *jwt.Token) (interface{}, error) {
				return []byte(jwtSecret), nil
			})

			if err != nil || !token.Valid {
				http.Error(w, "invalid token", http.StatusUnauthorized)
				return
			}

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				http.Error(w, "invalid token claims", http.StatusUnauthorized)
				return
			}

			userID, err := uuid.Parse(claims["sub"].(string))
			if err != nil {
				http.Error(w, "invalid user id in token", http.StatusUnauthorized)
				return
			}

			var facilityID *uuid.UUID
			if fid, ok := claims["facility_id"].(string); ok && fid != "" {
				parsedFid, err := uuid.Parse(fid)
				if err == nil {
					facilityID = &parsedFid
				}
			}

			var district string
			if d, ok := claims["district"].(string); ok {
				district = d
			}
			var displayName string
			if dn, ok := claims["display_name"].(string); ok {
				displayName = dn
			}

			userCtx := UserContext{
				UserID:      userID,
				Role:        claims["role"].(string),
				FacilityID:  facilityID,
				District:    district,
				DisplayName: displayName,
			}

			ctx := context.WithValue(r.Context(), userContextKey, &userCtx)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// AuthOrDev allows authenticated requests or provides a default user in development mode.
func AuthOrDev(jwtSecret string) func(http.Handler) http.Handler {
	defaultUser := &UserContext{
		UserID:      uuid.MustParse("11111111-0000-0000-0000-000000000001"),
		Role:        "national_admin",
		District:    "Khurda",
		DisplayName: "Sarthak (Team Lead)",
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader != "" {
				parts := strings.Split(authHeader, " ")
				if len(parts) == 2 && parts[0] == "Bearer" {
					token, err := jwt.Parse(parts[1], func(token *jwt.Token) (interface{}, error) {
						return []byte(jwtSecret), nil
					})
					if err == nil && token.Valid {
						if claims, ok := token.Claims.(jwt.MapClaims); ok {
							if uid, err := uuid.Parse(claims["sub"].(string)); err == nil {
								u := &UserContext{
									UserID:      uid,
									Role:        claims["role"].(string),
									District:    claims["district"].(string),
									DisplayName: claims["display_name"].(string),
								}
								ctx := context.WithValue(r.Context(), userContextKey, u)
								next.ServeHTTP(w, r.WithContext(ctx))
								return
							}
						}
					}
				}
			}

			// In development or when requested with role override
			activeUser := *defaultUser
			if reqRole := r.Header.Get("X-User-Role"); reqRole != "" {
				activeUser.Role = reqRole
			}
			if reqUserID := r.Header.Get("X-User-Id"); reqUserID != "" {
				if parsedID, err := uuid.Parse(reqUserID); err == nil {
					activeUser.UserID = parsedID
				}
			}

			ctx := context.WithValue(r.Context(), userContextKey, &activeUser)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func GetUserFromContext(ctx context.Context) *UserContext {
	if val := ctx.Value(userContextKey); val != nil {
		if userPtr, ok := val.(*UserContext); ok {
			return userPtr
		}
		if user, ok := val.(UserContext); ok {
			return &user
		}
	}
	return nil
}

var roleHierarchy = map[string]int{
	"viewer":           1,
	"facility_manager": 2,
	"district_officer": 3,
	"state_admin":      4,
	"national_admin":   5,
}

func RequireRole(role string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user := GetUserFromContext(r.Context())
			if user == nil || user.Role != role {
				http.Error(w, "forbidden", http.StatusForbidden)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

func RequireMinRole(minRole string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user := GetUserFromContext(r.Context())
			if user == nil {
				http.Error(w, "unauthorized", http.StatusUnauthorized)
				return
			}
			if roleHierarchy[user.Role] < roleHierarchy[minRole] {
				http.Error(w, "forbidden", http.StatusForbidden)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
