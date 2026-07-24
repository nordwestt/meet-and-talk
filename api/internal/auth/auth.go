package auth

import (
	"crypto/subtle"
	"net/http"
	"strings"
)

// Bearer middleware requires Authorization: Bearer <token>.
func Bearer(token string) func(http.Handler) http.Handler {
	want := []byte(token)
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			h := r.Header.Get("Authorization")
			const prefix = "Bearer "
			if !strings.HasPrefix(h, prefix) {
				http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
				return
			}
			got := []byte(strings.TrimSpace(h[len(prefix):]))
			if subtle.ConstantTimeCompare(got, want) != 1 {
				http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
