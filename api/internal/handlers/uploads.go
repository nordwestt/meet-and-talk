package handlers

import (
	"net/http"

	"github.com/nordwestt/meet-and-talk/api/internal/upload"
)

func (a *API) Upload(w http.ResponseWriter, r *http.Request) {
	if a.Uploads == nil {
		writeError(w, http.StatusServiceUnavailable, "uploads not configured")
		return
	}
	var req upload.Request
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json")
		return
	}
	result, err := a.Uploads.Save(req)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, http.StatusCreated, result)
}
