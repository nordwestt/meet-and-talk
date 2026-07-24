package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

// Resource describes a content table CRUD surface.
type Resource struct {
	Name       string
	Table      string
	IDColumn   string
	ListSQL    string
	// Columns for INSERT/PUT in camelCase JSON → snake_case DB
	Fields []Field
}

type Field struct {
	JSON    string
	Column  string
	JSONCol bool // store as JSON text
	Required bool
}

func (a *API) resources() map[string]Resource {
	return map[string]Resource{
		"topics": {
			Name: "topics", Table: "topics", IDColumn: "id",
			ListSQL: "SELECT * FROM topics ORDER BY rowid",
			Fields: []Field{
				{JSON: "id", Column: "id", Required: true},
				{JSON: "slug", Column: "slug", Required: true},
				{JSON: "name", Column: "name", Required: true},
				{JSON: "tagline", Column: "tagline", Required: true},
				{JSON: "description", Column: "description", Required: true},
				{JSON: "icon", Column: "icon", Required: true},
				{JSON: "color", Column: "color", Required: true},
				{JSON: "status", Column: "status", Required: true},
			},
		},
		"organisers": {
			Name: "organisers", Table: "organisers", IDColumn: "id",
			ListSQL: "SELECT * FROM organisers ORDER BY rowid",
			Fields: []Field{
				{JSON: "id", Column: "id", Required: true},
				{JSON: "name", Column: "name", Required: true},
				{JSON: "role", Column: "role"},
				{JSON: "bio", Column: "bio"},
				{JSON: "avatar", Column: "avatar"},
				{JSON: "social", Column: "social", JSONCol: true},
			},
		},
		"cities": {
			Name: "cities", Table: "cities", IDColumn: "id",
			ListSQL: "SELECT * FROM cities ORDER BY rowid",
			Fields: []Field{
				{JSON: "id", Column: "id", Required: true},
				{JSON: "slug", Column: "slug", Required: true},
				{JSON: "name", Column: "name", Required: true},
				{JSON: "country", Column: "country", Required: true},
				{JSON: "countryFlag", Column: "country_flag", Required: true},
				{JSON: "description", Column: "description", Required: true},
				{JSON: "status", Column: "status", Required: true},
				{JSON: "image", Column: "image"},
				{JSON: "gallery", Column: "gallery", JSONCol: true},
				{JSON: "memberCount", Column: "member_count"},
				{JSON: "social", Column: "social", JSONCol: true},
				{JSON: "timezone", Column: "timezone"},
			},
		},
		"venues": {
			Name: "venues", Table: "venues", IDColumn: "id",
			ListSQL: "SELECT * FROM venues ORDER BY rowid",
			Fields: []Field{
				{JSON: "id", Column: "id", Required: true},
				{JSON: "name", Column: "name", Required: true},
				{JSON: "cityId", Column: "city_id", Required: true},
				{JSON: "address", Column: "address", Required: true},
				{JSON: "description", Column: "description"},
				{JSON: "capacity", Column: "capacity"},
				{JSON: "image", Column: "image"},
				{JSON: "social", Column: "social", JSONCol: true},
			},
		},
		"events": {
			Name: "events", Table: "events", IDColumn: "id",
			ListSQL: "SELECT * FROM events ORDER BY rowid",
			Fields: []Field{
				{JSON: "id", Column: "id", Required: true},
				{JSON: "slug", Column: "slug", Required: true},
				{JSON: "title", Column: "title", Required: true},
				{JSON: "cityId", Column: "city_id", Required: true},
				{JSON: "venueId", Column: "venue_id", Required: true},
				{JSON: "topicId", Column: "topic_id", Required: true},
				{JSON: "languages", Column: "languages", JSONCol: true},
				{JSON: "date", Column: "date", Required: true},
				{JSON: "time", Column: "time", Required: true},
				{JSON: "recurring", Column: "recurring"},
				{JSON: "description", Column: "description", Required: true},
				{JSON: "capacity", Column: "capacity"},
				{JSON: "going", Column: "going"},
				{JSON: "image", Column: "image"},
				{JSON: "price", Column: "price"},
				{JSON: "social", Column: "social", JSONCol: true},
			},
		},
		"testimonials": {
			Name: "testimonials", Table: "testimonials", IDColumn: "id",
			ListSQL: "SELECT * FROM testimonials ORDER BY rowid",
			Fields: []Field{
				{JSON: "id", Column: "id", Required: true},
				{JSON: "quote", Column: "quote", Required: true},
				{JSON: "name", Column: "name", Required: true},
				{JSON: "role", Column: "role", Required: true},
				{JSON: "cityId", Column: "city_id"},
				{JSON: "avatar", Column: "avatar"},
			},
		},
		"faqs": {
			Name: "faqs", Table: "faqs", IDColumn: "id",
			ListSQL: "SELECT * FROM faqs ORDER BY sort_order, rowid",
			Fields: []Field{
				{JSON: "id", Column: "id", Required: true},
				{JSON: "question", Column: "question", Required: true},
				{JSON: "answer", Column: "answer", Required: true},
				{JSON: "sortOrder", Column: "sort_order"},
			},
		},
		"press": {
			Name: "press", Table: "press_mentions", IDColumn: "id",
			ListSQL: "SELECT * FROM press_mentions ORDER BY rowid",
			Fields: []Field{
				{JSON: "id", Column: "id", Required: true},
				{JSON: "title", Column: "title", Required: true},
				{JSON: "excerpt", Column: "excerpt", Required: true},
				{JSON: "url", Column: "url", Required: true},
				{JSON: "outlet", Column: "outlet", Required: true},
				{JSON: "author", Column: "author"},
				{JSON: "date", Column: "date"},
				{JSON: "cityId", Column: "city_id"},
			},
		},
	}
}

func (a *API) Health(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (a *API) List(w http.ResponseWriter, r *http.Request) {
	res, ok := a.resources()[r.PathValue("resource")]
	if !ok {
		writeError(w, http.StatusNotFound, "unknown resource")
		return
	}
	rows, err := a.DB.QueryContext(r.Context(), res.ListSQL)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()
	items, err := scanMap(rows)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	for i := range items {
		items[i] = toAPIShape(items[i])
	}
	writeJSON(w, http.StatusOK, map[string]any{"data": items})
}

func (a *API) Get(w http.ResponseWriter, r *http.Request) {
	res, ok := a.resources()[r.PathValue("resource")]
	if !ok {
		writeError(w, http.StatusNotFound, "unknown resource")
		return
	}
	id := r.PathValue("id")
	row, err := a.fetchOne(r.Context(), res, id)
	if isNoRows(err) {
		writeError(w, http.StatusNotFound, "not found")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, toAPIShape(row))
}

func (a *API) Create(w http.ResponseWriter, r *http.Request) {
	res, ok := a.resources()[r.PathValue("resource")]
	if !ok {
		writeError(w, http.StatusNotFound, "unknown resource")
		return
	}
	var body map[string]any
	if err := decodeJSON(r, &body); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json")
		return
	}
	cols, vals, err := buildInsert(res, body, true)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	placeholders := make([]string, len(cols))
	for i := range cols {
		placeholders[i] = "?"
	}
	q := fmt.Sprintf(
		"INSERT INTO %s (%s) VALUES (%s)",
		res.Table,
		strings.Join(cols, ", "),
		strings.Join(placeholders, ", "),
	)
	if _, err := a.DB.ExecContext(r.Context(), q, vals...); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	id, _ := body["id"].(string)
	row, err := a.fetchOne(r.Context(), res, id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	a.afterWrite(r.Context())
	writeJSON(w, http.StatusCreated, toAPIShape(row))
}

func (a *API) Put(w http.ResponseWriter, r *http.Request) {
	a.write(w, r, true)
}

func (a *API) Patch(w http.ResponseWriter, r *http.Request) {
	a.write(w, r, false)
}

func (a *API) write(w http.ResponseWriter, r *http.Request, replace bool) {
	res, ok := a.resources()[r.PathValue("resource")]
	if !ok {
		writeError(w, http.StatusNotFound, "unknown resource")
		return
	}
	id := r.PathValue("id")
	if _, err := a.fetchOne(r.Context(), res, id); isNoRows(err) {
		writeError(w, http.StatusNotFound, "not found")
		return
	} else if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	var body map[string]any
	if err := decodeJSON(r, &body); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json")
		return
	}
	delete(body, "id") // path is source of truth
	sets, vals, err := buildUpdate(res, body, replace)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	if len(sets) == 0 {
		writeError(w, http.StatusBadRequest, "no fields to update")
		return
	}
	vals = append(vals, id)
	q := fmt.Sprintf(
		"UPDATE %s SET %s, updated_at = datetime('now') WHERE %s = ?",
		res.Table,
		strings.Join(sets, ", "),
		res.IDColumn,
	)
	if _, err := a.DB.ExecContext(r.Context(), q, vals...); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	row, err := a.fetchOne(r.Context(), res, id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	a.afterWrite(r.Context())
	writeJSON(w, http.StatusOK, toAPIShape(row))
}

func (a *API) Delete(w http.ResponseWriter, r *http.Request) {
	res, ok := a.resources()[r.PathValue("resource")]
	if !ok {
		writeError(w, http.StatusNotFound, "unknown resource")
		return
	}
	id := r.PathValue("id")
	result, err := a.DB.ExecContext(
		r.Context(),
		fmt.Sprintf("DELETE FROM %s WHERE %s = ?", res.Table, res.IDColumn),
		id,
	)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	n, _ := result.RowsAffected()
	if n == 0 {
		writeError(w, http.StatusNotFound, "not found")
		return
	}
	a.afterWrite(r.Context())
	w.WriteHeader(http.StatusNoContent)
}

func (a *API) fetchOne(ctx context.Context, res Resource, id string) (map[string]any, error) {
	rows, err := a.DB.QueryContext(
		ctx,
		fmt.Sprintf("SELECT * FROM %s WHERE %s = ? LIMIT 1", res.Table, res.IDColumn),
		id,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items, err := scanMap(rows)
	if err != nil {
		return nil, err
	}
	if len(items) == 0 {
		return nil, sql.ErrNoRows
	}
	return items[0], nil
}

func buildInsert(res Resource, body map[string]any, requireRequired bool) (cols []string, vals []any, err error) {
	byJSON := map[string]Field{}
	for _, f := range res.Fields {
		byJSON[f.JSON] = f
	}
	if requireRequired {
		for _, f := range res.Fields {
			if f.Required {
				if _, ok := body[f.JSON]; !ok {
					return nil, nil, fmt.Errorf("missing field %s", f.JSON)
				}
			}
		}
	}
	for k, v := range body {
		f, ok := byJSON[k]
		if !ok {
			continue
		}
		val, err := normalizeValue(f, v)
		if err != nil {
			return nil, nil, err
		}
		cols = append(cols, f.Column)
		vals = append(vals, val)
	}
	if len(cols) == 0 {
		return nil, nil, fmt.Errorf("no valid fields")
	}
	return cols, vals, nil
}

func buildUpdate(res Resource, body map[string]any, replace bool) (sets []string, vals []any, err error) {
	byJSON := map[string]Field{}
	for _, f := range res.Fields {
		byJSON[f.JSON] = f
	}
	if replace {
		for _, f := range res.Fields {
			if f.Column == res.IDColumn {
				continue
			}
			v, ok := body[f.JSON]
			if !ok {
				if f.Required {
					return nil, nil, fmt.Errorf("missing field %s", f.JSON)
				}
				sets = append(sets, f.Column+" = ?")
				vals = append(vals, nil)
				continue
			}
			val, err := normalizeValue(f, v)
			if err != nil {
				return nil, nil, err
			}
			sets = append(sets, f.Column+" = ?")
			vals = append(vals, val)
		}
		return sets, vals, nil
	}
	for k, v := range body {
		f, ok := byJSON[k]
		if !ok || f.Column == res.IDColumn {
			continue
		}
		val, err := normalizeValue(f, v)
		if err != nil {
			return nil, nil, err
		}
		sets = append(sets, f.Column+" = ?")
		vals = append(vals, val)
	}
	return sets, vals, nil
}

func normalizeValue(f Field, v any) (any, error) {
	if f.JSONCol {
		return jsonText(v)
	}
	if v == nil {
		return nil, nil
	}
	switch f.Column {
	case "member_count", "capacity", "going", "sort_order":
		switch t := v.(type) {
		case float64:
			return int64(t), nil
		case json.Number:
			return t.Int64()
		default:
			return v, nil
		}
	default:
		return nullStr(v), nil
	}
}

func toAPIShape(row map[string]any) map[string]any {
	out := make(map[string]any, len(row))
	for k, v := range row {
		out[snakeToCamel(k)] = v
	}
	return out
}

func snakeToCamel(s string) string {
	parts := strings.Split(s, "_")
	if len(parts) == 1 {
		return s
	}
	var b strings.Builder
	b.WriteString(parts[0])
	for _, p := range parts[1:] {
		if p == "" {
			continue
		}
		b.WriteString(strings.ToUpper(p[:1]))
		b.WriteString(p[1:])
	}
	return b.String()
}
