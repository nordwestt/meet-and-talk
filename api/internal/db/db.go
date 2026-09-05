package db

import (
	"database/sql"
	"fmt"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
	_ "modernc.org/sqlite"
)

// Open connects to Turso/libSQL (remote) or a local SQLite file.
func Open(databaseURL, authToken string) (*sql.DB, error) {
	dsn, driver, err := buildDSN(databaseURL, authToken)
	if err != nil {
		return nil, fmt.Errorf("open db: %w", err)
	}
	db, err := sql.Open(driver, dsn)
	if err != nil {
		return nil, fmt.Errorf("open db: %w", err)
	}
	if err := db.Ping(); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("ping db: %w", err)
	}
	if _, err := db.Exec("PRAGMA foreign_keys = ON"); err != nil {
		// remote libsql may ignore pragma; non-fatal
		_ = err
	}
	return db, nil
}

func buildDSN(databaseURL, authToken string) (dsn, driver string, err error) {
	u := strings.TrimSpace(databaseURL)
	if u == "" {
		return "", "", fmt.Errorf("empty database url")
	}

	// Local SQLite file — pure Go driver
	if strings.HasPrefix(u, "file:") {
		path := strings.TrimPrefix(u, "file:")
		// Strip URI query (e.g. file:foo.db?mode=rwc)
		if i := strings.IndexAny(path, "?#"); i >= 0 {
			path = path[:i]
		}
		if !filepath.IsAbs(path) {
			abs, absErr := filepath.Abs(path)
			if absErr != nil {
				return "", "", fmt.Errorf("resolve db path: %w", absErr)
			}
			path = abs
		}
		if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
			return "", "", fmt.Errorf("create db directory: %w", err)
		}
		return path, "sqlite", nil
	}

	// Remote Turso / sqld
	driver = "libsql"
	dsn = u
	if authToken != "" {
		sep := "?"
		if strings.Contains(u, "?") {
			sep = "&"
		}
		dsn = u + sep + "authToken=" + url.QueryEscape(authToken)
	}
	return dsn, driver, nil
}
