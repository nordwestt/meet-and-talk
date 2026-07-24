package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/nordwestt/meet-and-talk/api/internal/revalidate"
	"github.com/nordwestt/meet-and-talk/api/internal/upload"
)

type API struct {
	DB         *sql.DB
	Uploads    *upload.Service
	Revalidate *revalidate.Client
	Log        *log.Logger
}

func (a *API) afterWrite(ctx context.Context) {
	if a.Revalidate == nil || !a.Revalidate.Enabled() {
		return
	}
	if err := a.Revalidate.Bust(ctx); err != nil && a.Log != nil {
		a.Log.Printf("revalidate: %v", err)
	}
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	enc := json.NewEncoder(w)
	enc.SetEscapeHTML(false)
	_ = enc.Encode(v)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}

func decodeJSON(r *http.Request, dst any) error {
	defer r.Body.Close()
	dec := json.NewDecoder(r.Body)
	dec.UseNumber()
	return dec.Decode(dst)
}

func nullStr(v any) any {
	if v == nil {
		return nil
	}
	switch t := v.(type) {
	case string:
		if t == "" {
			return nil
		}
		return t
	case json.Number:
		return t.String()
	default:
		return v
	}
}

func jsonText(v any) (any, error) {
	if v == nil {
		return nil, nil
	}
	switch t := v.(type) {
	case string:
		return t, nil
	default:
		b, err := json.Marshal(t)
		if err != nil {
			return nil, err
		}
		return string(b), nil
	}
}

func scanMap(rows *sql.Rows) ([]map[string]any, error) {
	cols, err := rows.Columns()
	if err != nil {
		return nil, err
	}
	var out []map[string]any
	for rows.Next() {
		raw := make([]any, len(cols))
		ptrs := make([]any, len(cols))
		for i := range raw {
			ptrs[i] = &raw[i]
		}
		if err := rows.Scan(ptrs...); err != nil {
			return nil, err
		}
		row := make(map[string]any, len(cols))
		for i, c := range cols {
			row[c] = coerceSQL(raw[i])
		}
		out = append(out, row)
	}
	if out == nil {
		out = []map[string]any{}
	}
	return out, rows.Err()
}

func coerceSQL(v any) any {
	switch t := v.(type) {
	case nil:
		return nil
	case []byte:
		s := string(t)
		var js any
		if json.Unmarshal(t, &js) == nil {
			return js
		}
		return s
	default:
		return t
	}
}

func isNoRows(err error) bool {
	return errors.Is(err, sql.ErrNoRows)
}
