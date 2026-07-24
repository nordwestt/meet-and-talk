package revalidate

import (
	"bytes"
	"context"
	"fmt"
	"net/http"
	"time"
)

// Client optionally busts the Next.js content cache after admin writes.
type Client struct {
	URL    string
	Secret string
	HTTP   *http.Client
}

func New(url, secret string) *Client {
	if url == "" || secret == "" {
		return &Client{}
	}
	return &Client{
		URL:    url,
		Secret: secret,
		HTTP:   &http.Client{Timeout: 5 * time.Second},
	}
}

func (c *Client) Enabled() bool {
	return c != nil && c.URL != "" && c.Secret != ""
}

func (c *Client) Bust(ctx context.Context) error {
	if !c.Enabled() {
		return nil
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.URL, bytes.NewReader(nil))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+c.Secret)
	res, err := c.HTTP.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()
	if res.StatusCode >= 300 {
		return fmt.Errorf("revalidate status %d", res.StatusCode)
	}
	return nil
}
