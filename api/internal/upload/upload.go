package upload

import (
	"encoding/base64"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/google/uuid"
)

const MaxBytes = 5 << 20 // 5 MiB

var (
	allowedFolders = map[string]bool{
		"cities": true, "venues": true, "people": true, "community": true, "misc": true,
	}
	extByType = map[string]string{
		"image/jpeg": ".jpg",
		"image/png":  ".png",
		"image/webp": ".webp",
		"image/gif":  ".gif",
	}
	safeName = regexp.MustCompile(`[^a-zA-Z0-9._-]+`)
)

type Request struct {
	Folder      string `json:"folder"`
	Filename    string `json:"filename"`
	Data        string `json:"data"`
	ContentType string `json:"contentType"`
}

type Result struct {
	Path string `json:"path"`
	URL  string `json:"url"`
}

type Service struct {
	Dir       string
	URLPrefix string
}

func (s *Service) Save(req Request) (Result, error) {
	folder := strings.TrimSpace(req.Folder)
	if folder == "" {
		folder = "misc"
	}
	if !allowedFolders[folder] {
		return Result{}, fmt.Errorf("folder must be one of: cities, venues, people, community, misc")
	}

	raw, contentType, err := decodePayload(req.Data, req.ContentType)
	if err != nil {
		return Result{}, err
	}
	if len(raw) == 0 {
		return Result{}, fmt.Errorf("empty image data")
	}
	if len(raw) > MaxBytes {
		return Result{}, fmt.Errorf("image exceeds %d bytes", MaxBytes)
	}
	ext, ok := extByType[contentType]
	if !ok {
		return Result{}, fmt.Errorf("unsupported content type %q", contentType)
	}

	base := strings.TrimSpace(req.Filename)
	if base == "" {
		base = "upload"
	}
	base = strings.TrimSuffix(base, filepath.Ext(base))
	base = safeName.ReplaceAllString(base, "-")
	base = strings.Trim(base, "-._")
	if base == "" {
		base = "upload"
	}
	short := strings.ReplaceAll(uuid.NewString(), "-", "")[:8]
	name := fmt.Sprintf("%s-%s%s", base, short, ext)

	dir := filepath.Join(s.Dir, folder)
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return Result{}, fmt.Errorf("mkdir: %w", err)
	}
	full := filepath.Join(dir, name)
	if err := os.WriteFile(full, raw, 0o644); err != nil {
		return Result{}, fmt.Errorf("write: %w", err)
	}

	path := s.URLPrefix + "/" + folder + "/" + name
	return Result{Path: path, URL: path}, nil
}

func decodePayload(data, contentType string) ([]byte, string, error) {
	data = strings.TrimSpace(data)
	if data == "" {
		return nil, "", fmt.Errorf("data is required")
	}

	if strings.HasPrefix(data, "data:") {
		// data:image/jpeg;base64,....
		comma := strings.IndexByte(data, ',')
		if comma < 0 {
			return nil, "", fmt.Errorf("invalid data URL")
		}
		meta := data[5:comma]
		payload := data[comma+1:]
		parts := strings.Split(meta, ";")
		ct := parts[0]
		if len(parts) < 2 || parts[1] != "base64" {
			return nil, "", fmt.Errorf("data URL must be base64")
		}
		raw, err := base64.StdEncoding.DecodeString(payload)
		if err != nil {
			return nil, "", fmt.Errorf("base64: %w", err)
		}
		return raw, ct, nil
	}

	ct := strings.TrimSpace(contentType)
	if ct == "" {
		return nil, "", fmt.Errorf("contentType required when data is raw base64")
	}
	raw, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		return nil, "", fmt.Errorf("base64: %w", err)
	}
	return raw, ct, nil
}
