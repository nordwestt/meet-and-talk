# Content management (Turso + live reload)

Meetup content (cities, events, venues, topics, organisers, FAQs, testimonials, press)
lives in **Turso**. The running Next.js app reads Turso on the server and caches the
result briefly — **no rebuild or redeploy** after you edit rows.

```
SQL client  →  Turso  →  Next.js (cached ~60s)  →  browser
```

Generated `lib/data/*.ts` files remain as an **offline / build fallback** when
`TURSO_DATABASE_URL` is not set on the server.

## One-time setup

1. Install the [Turso CLI](https://docs.turso.tech/cli) and sign in.
2. Create a database:

   ```bash
   turso db create meet-and-talk
   turso db show meet-and-talk --url
   turso db tokens create meet-and-talk
   ```

3. Copy [`.env.example`](../.env.example) to `.env.local` (and on the VPS, into the
   PM2 / process env):

   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - Optional: `CONTENT_REVALIDATE_SECONDS` (default `60`)
   - Optional: `CONTENT_REVALIDATE_SECRET` for instant cache bust

4. Apply schema + seed once:

   ```bash
   npm run content:seed
   ```

## Day-to-day editing (no redeploy)

1. Edit tables with Beekeeper / TablePlus / `turso db shell`.
2. Wait up to `CONTENT_REVALIDATE_SECONDS` (default 60), then refresh the site.

### Instant refresh

After editing, call:

```bash
curl -X POST https://your-domain/api/revalidate-content \
  -H "Authorization: Bearer $CONTENT_REVALIDATE_SECRET"
```

That clears the content cache so the next page load hits Turso immediately.

## Optional codegen

Still useful for local offline work or baking a snapshot into git:

```bash
npm run content:generate   # DB → lib/data/*.ts
npm run content:watch      # regenerate while editing
```

`npm run build` runs generate via `prebuild` (fallback data). Production with Turso
env vars ignores those files at runtime.

## Desktop SQL clients

| Client | Notes |
|--------|--------|
| [Beekeeper Studio](https://www.beekeeperstudio.io/) | libSQL / Turso |
| [TablePlus](https://tableplus.com/) | libSQL / Turso driver |
| Turso CLI | `turso db shell meet-and-talk` |

## Tables

| Table | Entity |
|-------|--------|
| `topics` | topics |
| `organisers` | organisers |
| `cities` | cities |
| `venues` | venues |
| `events` | events |
| `testimonials`, `faqs` | community |
| `press_mentions` | press |
| Junction tables | `city_organisers`, `city_topics`, `organiser_cities`, `event_organisers` |

Nested fields (`social`, `gallery`, `languages`) are JSON text. Schema:
[`content/schema.sql`](../content/schema.sql).
