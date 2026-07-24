package handlers

import (
	"fmt"
	"net/http"
)

func (a *API) PutCityOrganisers(w http.ResponseWriter, r *http.Request) {
	a.replaceJunction(w, r, "cities", "id", "city_organisers", "city_id", "organiser_id", "organiserIds")
}

func (a *API) PutCityTopics(w http.ResponseWriter, r *http.Request) {
	a.replaceJunction(w, r, "cities", "id", "city_topics", "city_id", "topic_id", "topicIds")
}

func (a *API) PutOrganiserCities(w http.ResponseWriter, r *http.Request) {
	a.replaceJunction(w, r, "organisers", "id", "organiser_cities", "organiser_id", "city_id", "cityIds")
}

func (a *API) PutEventOrganisers(w http.ResponseWriter, r *http.Request) {
	a.replaceJunction(w, r, "events", "id", "event_organisers", "event_id", "organiser_id", "organiserIds")
}

func (a *API) replaceJunction(
	w http.ResponseWriter,
	r *http.Request,
	parentTable, parentCol, junctionTable, parentFK, childFK, bodyKey string,
) {
	id := r.PathValue("id")
	var exists int
	err := a.DB.QueryRowContext(
		r.Context(),
		fmt.Sprintf("SELECT 1 FROM %s WHERE %s = ? LIMIT 1", parentTable, parentCol),
		id,
	).Scan(&exists)
	if isNoRows(err) {
		writeError(w, http.StatusNotFound, "not found")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	var body map[string]any
	if err := decodeJSON(r, &body); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json")
		return
	}
	raw, ok := body[bodyKey]
	if !ok {
		writeError(w, http.StatusBadRequest, "missing "+bodyKey)
		return
	}
	ids, err := asStringSlice(raw)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	tx, err := a.DB.BeginTx(r.Context(), nil)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer tx.Rollback()

	if _, err := tx.ExecContext(
		r.Context(),
		fmt.Sprintf("DELETE FROM %s WHERE %s = ?", junctionTable, parentFK),
		id,
	); err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	ins := fmt.Sprintf("INSERT INTO %s (%s, %s) VALUES (?, ?)", junctionTable, parentFK, childFK)
	for _, child := range ids {
		if _, err := tx.ExecContext(r.Context(), ins, id, child); err != nil {
			writeError(w, http.StatusBadRequest, err.Error())
			return
		}
	}
	if err := tx.Commit(); err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	a.afterWrite(r.Context())
	writeJSON(w, http.StatusOK, map[string]any{bodyKey: ids})
}

func asStringSlice(v any) ([]string, error) {
	arr, ok := v.([]any)
	if !ok {
		return nil, fmt.Errorf("expected string array")
	}
	out := make([]string, 0, len(arr))
	for _, item := range arr {
		s, ok := item.(string)
		if !ok || s == "" {
			return nil, fmt.Errorf("expected string array")
		}
		out = append(out, s)
	}
	return out, nil
}
