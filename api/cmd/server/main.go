package main

import (
	"log"
	"net/http"
	"os"

	"github.com/nordwestt/meet-and-talk/api/internal/auth"
	"github.com/nordwestt/meet-and-talk/api/internal/config"
	"github.com/nordwestt/meet-and-talk/api/internal/db"
	"github.com/nordwestt/meet-and-talk/api/internal/handlers"
	"github.com/nordwestt/meet-and-talk/api/internal/revalidate"
	"github.com/nordwestt/meet-and-talk/api/internal/upload"
)

func main() {
	logger := log.New(os.Stdout, "admin-api ", log.LstdFlags|log.Lmsgprefix)

	cfg, err := config.Load()
	if err != nil {
		logger.Fatalf("config: %v", err)
	}

	sqlDB, err := db.Open(cfg.TursoDatabaseURL, cfg.TursoAuthToken)
	if err != nil {
		logger.Fatalf("db: %v", err)
	}
	defer sqlDB.Close()

	if err := os.MkdirAll(cfg.UploadDir, 0o755); err != nil {
		logger.Fatalf("upload dir: %v", err)
	}

	api := &handlers.API{
		DB: sqlDB,
		Uploads: &upload.Service{
			Dir:       cfg.UploadDir,
			URLPrefix: cfg.UploadURLPrefix,
		},
		Revalidate: revalidate.New(cfg.ContentRevalidateURL, cfg.ContentRevalidateSecret),
		Log:        logger,
	}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /v1/health", api.Health)

	protected := http.NewServeMux()
	protected.HandleFunc("GET /v1/{resource}", api.List)
	protected.HandleFunc("POST /v1/{resource}", api.Create)
	protected.HandleFunc("GET /v1/{resource}/{id}", api.Get)
	protected.HandleFunc("PUT /v1/{resource}/{id}", api.Put)
	protected.HandleFunc("PATCH /v1/{resource}/{id}", api.Patch)
	protected.HandleFunc("DELETE /v1/{resource}/{id}", api.Delete)

	protected.HandleFunc("PUT /v1/cities/{id}/organisers", api.PutCityOrganisers)
	protected.HandleFunc("PUT /v1/cities/{id}/topics", api.PutCityTopics)
	protected.HandleFunc("PUT /v1/organisers/{id}/cities", api.PutOrganiserCities)
	protected.HandleFunc("PUT /v1/events/{id}/organisers", api.PutEventOrganisers)

	protected.HandleFunc("POST /v1/uploads", api.Upload)

	mux.Handle("/v1/", auth.Bearer(cfg.AdminAPIToken)(protected))

	logger.Printf("listening on %s (uploads=%s)", cfg.HTTPAddr, cfg.UploadDir)
	if err := http.ListenAndServe(cfg.HTTPAddr, withCORS(mux)); err != nil {
		logger.Fatal(err)
	}
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
