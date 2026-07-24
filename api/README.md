# Meet & Talk admin API (Go)

REST service for editing Turso/libSQL content and uploading photos.
Runs beside Next.js on the VPS; Caddy exposes it at `/admin-api`.

## Quick start (local)

```bash
cd api
export ADMIN_API_TOKEN=dev-secret
export TURSO_DATABASE_URL="file:../content/local.db"
export UPLOAD_DIR=./.uploads
export HTTP_ADDR=:3080
go run ./cmd/server
```

Health (no auth):

```bash
curl http://127.0.0.1:3080/v1/health
```

Via Caddy on production the same routes are under `/admin-api` (prefix stripped):

```bash
curl https://meetandtalk.eu/admin-api/v1/health
curl -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  https://meetandtalk.eu/admin-api/v1/cities
```

## Auth

All routes except `GET /v1/health` require:

```http
Authorization: Bearer <ADMIN_API_TOKEN>
```

## Resources

| Resource | Table |
|----------|--------|
| `cities` | cities |
| `venues` | venues |
| `topics` | topics |
| `organisers` | organisers |
| `events` | events |
| `testimonials` | testimonials |
| `faqs` | faqs |
| `press` | press_mentions |

```http
GET    /v1/{resource}
POST   /v1/{resource}
GET    /v1/{resource}/{id}
PUT    /v1/{resource}/{id}
PATCH  /v1/{resource}/{id}
DELETE /v1/{resource}/{id}
```

JSON uses camelCase (`cityId`, `countryFlag`, `memberCount`, …). Nested `social`, `gallery`, `languages` are JSON values.

### Junctions

```http
PUT /v1/cities/{id}/organisers     {"organiserIds":["gabriele"]}
PUT /v1/cities/{id}/topics         {"topicIds":["language-exchange"]}
PUT /v1/organisers/{id}/cities     {"cityIds":["trento"]}
PUT /v1/events/{id}/organisers     {"organiserIds":["gabriele"]}
```

### Photo upload (base64)

```bash
curl -X POST http://127.0.0.1:3080/v1/uploads \
  -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "folder": "cities",
    "filename": "trento-hero",
    "data": "data:image/jpeg;base64,/9j/4AAQ..."
  }'
```

Response:

```json
{"path":"/uploads/cities/trento-hero-a1b2c3d4.jpg","url":"/uploads/cities/trento-hero-a1b2c3d4.jpg"}
```

Then `PATCH` the city with `"image": "/uploads/cities/..."`.

Allowed folders: `cities`, `venues`, `people`, `community`, `misc`. Max 5 MiB. Types: jpeg, png, webp, gif.

## Environment

| Variable | Default | Notes |
|----------|---------|--------|
| `ADMIN_API_TOKEN` | required | Bearer token |
| `TURSO_DATABASE_URL` | `file:../content/local.db` | Turso URL or `file:…` |
| `TURSO_AUTH_TOKEN` | | Remote Turso only |
| `HTTP_ADDR` | `:3080` | Listen address |
| `UPLOAD_DIR` | `/var/meet-and-talk/uploads` | Persistent disk path |
| `UPLOAD_URL_PREFIX` | `/uploads` | Public URL prefix (Caddy) |
| `CONTENT_REVALIDATE_URL` | | e.g. `http://127.0.0.1:3000/api/revalidate-content` |
| `CONTENT_REVALIDATE_SECRET` | | Same as Next.js |

## Production (PM2)

```bash
sudo mkdir -p /var/meet-and-talk/uploads
sudo chown "$USER":"$USER" /var/meet-and-talk/uploads

cd /path/to/repo/api
go build -o meet-and-talk-api ./cmd/server

# ecosystem snippet (or pm2 start with env):
pm2 start ./meet-and-talk-api --name meet-and-talk-api \
  --env production
```

Ensure the process env includes `ADMIN_API_TOKEN`, Turso URL/token, `UPLOAD_DIR`, and ideally revalidate URL/secret.

Reload Caddy after updating the repo [`Caddyfile`](../Caddyfile):

```bash
sudo cp Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy
```
