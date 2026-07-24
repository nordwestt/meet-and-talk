# Content management (Turso + static codegen)

Meet & Talk keeps **runtime content static** (`lib/data/*.ts`) for a fast VPS deploy.
**Turso** (or a local SQLite file) is the editable source of truth. After you change rows,
regenerate the TypeScript modules and redeploy.

```
SQL client / turso shell  →  Turso DB  →  npm run content:generate  →  lib/data/*.ts  →  build / release
```

## One-time setup

1. Install the [Turso CLI](https://docs.turso.tech/cli) and sign in.
2. Create a database:

   ```bash
   turso db create meet-and-talk
   turso db show meet-and-talk --url
   turso db tokens create meet-and-talk
   ```

3. Copy [`.env.example`](../.env.example) to `.env.local` and fill in:

   - `TURSO_DATABASE_URL` — from `turso db show … --url`
   - `TURSO_AUTH_TOKEN` — from `turso db tokens create …`

4. Apply schema + current site seed:

   ```bash
   npm run content:seed
   ```

### Offline / no Turso

Omit the env vars. Commands use `content/local.db` (gitignored). First generate/seed creates it automatically.

## Day-to-day editing

1. Connect a SQL client (see below) and edit tables (`cities`, `events`, `venues`, …).
2. Regenerate modules:

   ```bash
   npm run content:generate
   ```

   Or keep a watcher running while you edit:

   ```bash
   npm run content:watch
   ```

3. Commit the updated `lib/data/*.ts` files (optional if CI has Turso credentials and runs `prebuild`).
4. Deploy as usual (release zip / `./deploy.sh`). The VPS never talks to Turso.

`npm run build` runs `content:generate` via `prebuild`. With Turso env set, the build bakes the latest remote content into the bundle.

For GitHub Releases, add repository secrets `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` so the release workflow regenerates from Turso. If those secrets are unset, the build falls back to a local DB seeded from `content/seed.sql`.

## Desktop SQL clients

Use the same URL + token as in `.env.local`.

| Client | Notes |
|--------|--------|
| [Beekeeper Studio](https://www.beekeeperstudio.io/) | libSQL / Turso connection type |
| [TablePlus](https://tableplus.com/) | libSQL / Turso driver |
| [Outerbase](https://outerbase.com/) / libSQL Studio | browser-based |
| Turso CLI | `turso db shell meet-and-talk` |

For a **local** file DB, open `content/local.db` as a normal SQLite file (no token).

## Tables

| Table | Maps to |
|-------|---------|
| `topics` | `lib/data/topics.ts` |
| `organisers` | `lib/data/organisers.ts` |
| `cities` | `lib/data/cities.ts` |
| `venues` | `lib/data/venues.ts` |
| `events` | `lib/data/events.ts` |
| `testimonials`, `faqs` | `lib/data/community.ts` |
| `press_mentions` | `lib/data/press.ts` |
| `city_organisers`, `city_topics`, `organiser_cities`, `event_organisers` | ID arrays on the entities above |

Nested fields (`social`, `gallery`, `languages`) are stored as JSON text. Junction rows must be updated when you add organisers/topics to a city or event.

Do **not** hand-edit generated `lib/data/*.ts` files (except `site.ts` / `index.ts`, which stay manual). Schema lives in [`content/schema.sql`](../content/schema.sql); reset data with [`content/seed.sql`](../content/seed.sql) via `npm run content:seed`.
