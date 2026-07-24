# Content management (Turso + live reload)

Meetup content (cities, events, venues, topics, organisers, FAQs, testimonials, press)
lives in **Turso**. The running Next.js app reads Turso on the server and caches the
result briefly — **no rebuild or redeploy** after you edit rows.

```
Go admin API /admin-panel / SQL  →  Turso  →  Next.js (cached ~60s)  →  browser
```

**Ways to edit**

1. Browser UI at [`/admin-panel`](../app/admin-panel/page.tsx) (paste API token; not linked from the public nav)
2. Go REST API — [`api/README.md`](../api/README.md)
3. SQL client against the same Turso/libSQL database

Generated `lib/data/*.ts` files remain as an **offline / build fallback** when
`TURSO_DATABASE_URL` is not set on the Next server.

## One-time setup

1. Install the [Turso CLI](https://docs.turso.tech/cli) and sign in.
2. Create a database and copy [`.env.example`](../.env.example) values (`TURSO_*`, `ADMIN_API_TOKEN`, optional revalidate secrets).
3. `npm run content:seed`
4. Run the Go API and point Caddy at `/admin-api` + `/uploads` (see [`api/README.md`](../api/README.md)).

## Admin panel

Open `/admin-panel`, set:

- **API base URL** — `http://127.0.0.1:3080` locally, or `/admin-api` in production
- **Admin API token** — same as `ADMIN_API_TOKEN`

Token is stored in `localStorage` on that browser only. Page is `noindex`.

## Day-to-day

Edit via `/admin-panel` or the API. After writes, the Go service can call Next revalidate when configured; otherwise wait up to `CONTENT_REVALIDATE_SECONDS` (default 60).

Manual bust:

```bash
curl -X POST https://your-domain/api/revalidate-content \
  -H "Authorization: Bearer $CONTENT_REVALIDATE_SECRET"
```

## Optional codegen

```bash
npm run content:generate
npm run content:watch
```

## Tables

See [`content/schema.sql`](../content/schema.sql). Uploaded photos use `/uploads/...` on persistent disk (Caddy), not the Next release zip.
