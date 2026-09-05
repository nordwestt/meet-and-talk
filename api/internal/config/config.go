package config

import (
	"fmt"
	"os"
	"strings"
)

type Config struct {
	HTTPAddr               string
	AdminAPIToken          string
	TursoDatabaseURL       string
	TursoAuthToken         string
	UploadDir              string
	UploadURLPrefix        string
	ContentRevalidateURL   string
	ContentRevalidateSecret string
}

func Load() (Config, error) {
	cfg := Config{
		HTTPAddr:                getenv("HTTP_ADDR", ":3080"),
		AdminAPIToken:           os.Getenv("ADMIN_API_TOKEN"),
		TursoDatabaseURL:        getenv("TURSO_DATABASE_URL", "file:/var/meet-and-talk/content/local.db"),
		TursoAuthToken:          os.Getenv("TURSO_AUTH_TOKEN"),
		UploadDir:               getenv("UPLOAD_DIR", "/var/meet-and-talk/uploads"),
		UploadURLPrefix:         getenv("UPLOAD_URL_PREFIX", "/uploads"),
		ContentRevalidateURL:    os.Getenv("CONTENT_REVALIDATE_URL"),
		ContentRevalidateSecret: os.Getenv("CONTENT_REVALIDATE_SECRET"),
	}
	cfg.UploadURLPrefix = strings.TrimRight(cfg.UploadURLPrefix, "/")

	if cfg.AdminAPIToken == "" {
		return cfg, fmt.Errorf("ADMIN_API_TOKEN is required")
	}
	if cfg.TursoDatabaseURL == "" {
		return cfg, fmt.Errorf("TURSO_DATABASE_URL is required")
	}
	return cfg, nil
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
