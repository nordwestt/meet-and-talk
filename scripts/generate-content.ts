/**
 * Content tooling: seed Turso/libSQL and generate lib/data/*.ts from it.
 *
 * Usage:
 *   npx tsx scripts/generate-content.ts generate
 *   npx tsx scripts/generate-content.ts watch
 *   npx tsx scripts/generate-content.ts seed
 */

import { createClient, type Client } from '@libsql/client'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const CONTENT_DIR = join(ROOT, 'content')
const DATA_DIR = join(ROOT, 'lib', 'data')
const LOCAL_DB = join(CONTENT_DIR, 'local.db')

const GENERATED_HEADER = `// AUTO-GENERATED — do not edit by hand.
// Source: Turso / libSQL via \`npm run content:generate\`
`

type Row = Record<string, unknown>

function loadEnvFile(path: string) {
  if (!existsSync(path)) return
  const text = readFileSync(path, 'utf8')
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = value
  }
}

function resolveDbUrl(): string {
  return process.env.TURSO_DATABASE_URL ?? `file:${LOCAL_DB}`
}

function connect(): Client {
  loadEnvFile(join(ROOT, '.env.local'))
  loadEnvFile(join(ROOT, '.env'))

  const url = resolveDbUrl()
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (url.startsWith('file:')) {
    const filePath = url.slice('file:'.length)
    const abs = filePath.startsWith('/') ? filePath : resolve(ROOT, filePath)
    mkdirSync(dirname(abs), { recursive: true })
  }

  return createClient({
    url,
    authToken: authToken || undefined,
  })
}

function localDbPathFromUrl(url: string): string | null {
  if (!url.startsWith('file:')) return null
  const filePath = url.slice('file:'.length)
  return filePath.startsWith('/') ? filePath : resolve(ROOT, filePath)
}

async function ensureLocalDbSeeded(client: Client) {
  const url = resolveDbUrl()
  const localPath = localDbPathFromUrl(url)
  if (!localPath) return

  const rs = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='cities'",
  )
  if (rs.rows.length === 0) {
    console.log('Local DB empty — applying schema + seed…')
    await executeSqlFile(client, join(CONTENT_DIR, 'schema.sql'))
    await executeSqlFile(client, join(CONTENT_DIR, 'seed.sql'))
  }
}

/** Split SQL into statements, keeping BEGIN…END trigger bodies intact. */
function splitSqlStatements(sql: string): string[] {
  const statements: string[] = []
  let current = ''
  let inTriggerBody = false

  for (const rawLine of sql.split('\n')) {
    const line = rawLine
    const trimmed = line.trim()

    if (!inTriggerBody && trimmed.startsWith('--') && !current.trim()) {
      continue
    }

    current += `${line}\n`

    if (/\bBEGIN\b/i.test(trimmed)) {
      inTriggerBody = true
    }

    if (inTriggerBody) {
      if (/^END\s*;?\s*$/i.test(trimmed)) {
        inTriggerBody = false
        statements.push(current.trim())
        current = ''
      }
      continue
    }

    if (trimmed.endsWith(';')) {
      statements.push(current.trim())
      current = ''
    }
  }

  if (current.trim()) statements.push(current.trim())
  return statements.filter(Boolean)
}

async function executeSqlFile(client: Client, path: string) {
  const sql = readFileSync(path, 'utf8')
  for (const statement of splitSqlStatements(sql)) {
    const cleaned = statement
      .split('\n')
      .filter((l) => !l.trim().startsWith('--'))
      .join('\n')
      .trim()
    if (!cleaned) continue
    await client.execute(cleaned.endsWith(';') ? cleaned : `${cleaned};`)
  }
}

async function seed() {
  const client = connect()
  const url = resolveDbUrl()
  console.log(`Seeding ${url.startsWith('file:') ? 'local SQLite' : 'Turso'}…`)
  await executeSqlFile(client, join(CONTENT_DIR, 'schema.sql'))
  await executeSqlFile(client, join(CONTENT_DIR, 'seed.sql'))
  console.log('Seed complete.')
  client.close()
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null || value === '') return fallback
  if (typeof value === 'object') return value as T
  try {
    return JSON.parse(String(value)) as T
  } catch {
    return fallback
  }
}

function omitUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v
  }
  return out as Partial<T>
}

function formatTsValue(value: unknown, indent = 0): string {
  const pad = '  '.repeat(indent)
  const padIn = '  '.repeat(indent + 1)

  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const items = value.map((item) => `${padIn}${formatTsValue(item, indent + 1)}`).join(',\n')
    return `[\n${items},\n${pad}]`
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) return '{}'
    const fields = entries
      .map(([k, v]) => `${padIn}${k}: ${formatTsValue(v, indent + 1)}`)
      .join(',\n')
    return `{\n${fields},\n${pad}}`
  }

  return JSON.stringify(value)
}

function writeDataModule(
  filename: string,
  typeNames: string,
  declarations: string,
) {
  const path = join(DATA_DIR, filename)
  const content = `${GENERATED_HEADER}
import type { ${typeNames} } from '@/lib/types'

${declarations}
`
  writeFileSync(path, content, 'utf8')
  console.log(`  wrote lib/data/${filename}`)
}

async function groupIds(
  client: Client,
  table: string,
  keyCol: string,
  valueCol: string,
): Promise<Map<string, string[]>> {
  const rs = await client.execute(`SELECT ${keyCol}, ${valueCol} FROM ${table}`)
  const map = new Map<string, string[]>()
  for (const row of rs.rows) {
    const key = String(row[keyCol])
    const val = String(row[valueCol])
    const list = map.get(key) ?? []
    list.push(val)
    map.set(key, list)
  }
  return map
}

async function contentFingerprint(client: Client): Promise<string> {
  const tables = [
    'topics',
    'organisers',
    'cities',
    'venues',
    'events',
    'testimonials',
    'faqs',
    'press_mentions',
  ]
  const parts: string[] = []
  for (const table of tables) {
    const rs = await client.execute(
      `SELECT COUNT(*) AS c, COALESCE(MAX(updated_at), '') AS m FROM ${table}`,
    )
    const row = rs.rows[0] as Row
    parts.push(`${table}:${row.c}:${row.m}`)
  }
  // Junctions lack updated_at — include counts so link edits still trigger regen
  for (const table of [
    'city_organisers',
    'city_topics',
    'organiser_cities',
    'event_organisers',
  ]) {
    const rs = await client.execute(`SELECT COUNT(*) AS c FROM ${table}`)
    parts.push(`${table}:${(rs.rows[0] as Row).c}`)
  }
  return parts.join('|')
}

async function generate(client?: Client) {
  const owned = !client
  const db = client ?? connect()
  await ensureLocalDbSeeded(db)
  console.log('Generating lib/data from database…')

  const cityOrganisers = await groupIds(db, 'city_organisers', 'city_id', 'organiser_id')
  const cityTopics = await groupIds(db, 'city_topics', 'city_id', 'topic_id')
  const organiserCities = await groupIds(db, 'organiser_cities', 'organiser_id', 'city_id')
  const eventOrganisers = await groupIds(db, 'event_organisers', 'event_id', 'organiser_id')

  const topicsRs = await db.execute('SELECT * FROM topics ORDER BY rowid')
  const topics = topicsRs.rows.map((row) =>
    omitUndefined({
      id: String(row.id),
      slug: String(row.slug),
      name: String(row.name),
      tagline: String(row.tagline),
      description: String(row.description),
      icon: String(row.icon),
      color: String(row.color),
      status: String(row.status) as 'live' | 'soon',
    }),
  )

  const organisersRs = await db.execute('SELECT * FROM organisers ORDER BY rowid')
  const organisers = organisersRs.rows.map((row) => {
    const social = parseJson<unknown[] | null>(row.social, null)
    return omitUndefined({
      id: String(row.id),
      name: String(row.name),
      role: row.role != null ? String(row.role) : undefined,
      bio: row.bio != null ? String(row.bio) : undefined,
      avatar: row.avatar != null ? String(row.avatar) : undefined,
      cityIds: organiserCities.get(String(row.id)) ?? [],
      social: social && social.length > 0 ? social : social === null ? undefined : [],
    })
  })

  const citiesRs = await db.execute('SELECT * FROM cities ORDER BY rowid')
  const cities = citiesRs.rows.map((row) => {
    const gallery = parseJson<string[] | null>(row.gallery, null)
    const social = parseJson<unknown[]>(row.social, [])
    return omitUndefined({
      id: String(row.id),
      slug: String(row.slug),
      name: String(row.name),
      country: String(row.country),
      countryFlag: String(row.country_flag),
      description: String(row.description),
      status: String(row.status) as 'live' | 'planned',
      image: row.image != null ? String(row.image) : undefined,
      gallery: gallery && gallery.length > 0 ? gallery : undefined,
      memberCount: row.member_count != null ? Number(row.member_count) : undefined,
      social,
      organiserIds: cityOrganisers.get(String(row.id)) ?? [],
      topicIds: cityTopics.get(String(row.id)) ?? [],
      timezone: row.timezone != null ? String(row.timezone) : undefined,
    })
  })

  const venuesRs = await db.execute('SELECT * FROM venues ORDER BY rowid')
  const venues = venuesRs.rows.map((row) => {
    const social = parseJson<unknown[] | null>(row.social, null)
    return omitUndefined({
      id: String(row.id),
      name: String(row.name),
      cityId: String(row.city_id),
      address: String(row.address),
      description: row.description != null ? String(row.description) : undefined,
      capacity: row.capacity != null ? Number(row.capacity) : undefined,
      image: row.image != null ? String(row.image) : undefined,
      social: social && social.length > 0 ? social : undefined,
    })
  })

  const eventsRs = await db.execute('SELECT * FROM events ORDER BY rowid')
  const events = eventsRs.rows.map((row) => {
    const languages = parseJson<unknown[] | null>(row.languages, null)
    const social = parseJson<unknown[] | null>(row.social, null)
    return omitUndefined({
      id: String(row.id),
      slug: String(row.slug),
      title: String(row.title),
      cityId: String(row.city_id),
      venueId: String(row.venue_id),
      topicId: String(row.topic_id),
      organiserIds: eventOrganisers.get(String(row.id)) ?? [],
      languages: languages && languages.length > 0 ? languages : undefined,
      date: String(row.date),
      time: String(row.time),
      recurring: row.recurring != null ? String(row.recurring) : undefined,
      description: String(row.description),
      capacity: row.capacity != null ? Number(row.capacity) : undefined,
      going: row.going != null ? Number(row.going) : undefined,
      image: row.image != null ? String(row.image) : undefined,
      price: row.price != null ? String(row.price) : undefined,
      social: social && social.length > 0 ? social : undefined,
    })
  })

  const testimonialsRs = await db.execute('SELECT * FROM testimonials ORDER BY rowid')
  const testimonials = testimonialsRs.rows.map((row) =>
    omitUndefined({
      id: String(row.id),
      quote: String(row.quote),
      name: String(row.name),
      role: String(row.role),
      cityId: row.city_id != null ? String(row.city_id) : undefined,
      avatar: row.avatar != null ? String(row.avatar) : undefined,
    }),
  )

  const faqsRs = await db.execute('SELECT * FROM faqs ORDER BY sort_order, rowid')
  const faqs = faqsRs.rows.map((row) => ({
    id: String(row.id),
    question: String(row.question),
    answer: String(row.answer),
  }))

  const pressRs = await db.execute('SELECT * FROM press_mentions ORDER BY rowid')
  const pressMentions = pressRs.rows.map((row) =>
    omitUndefined({
      id: String(row.id),
      title: String(row.title),
      excerpt: String(row.excerpt),
      url: String(row.url),
      outlet: String(row.outlet),
      author: row.author != null ? String(row.author) : undefined,
      date: row.date != null ? String(row.date) : undefined,
      cityId: row.city_id != null ? String(row.city_id) : undefined,
    }),
  )

  writeDataModule(
    'topics.ts',
    'Topic',
    `export const topics: Topic[] = ${formatTsValue(topics)}\n`,
  )
  writeDataModule(
    'organisers.ts',
    'Organiser',
    `export const organisers: Organiser[] = ${formatTsValue(organisers)}\n`,
  )
  writeDataModule(
    'cities.ts',
    'City',
    `export const cities: City[] = ${formatTsValue(cities)}\n`,
  )
  writeDataModule(
    'venues.ts',
    'Venue',
    `export const venues: Venue[] = ${formatTsValue(venues)}\n`,
  )
  writeDataModule(
    'events.ts',
    'MeetEvent',
    `export const events: MeetEvent[] = ${formatTsValue(events)}\n`,
  )
  writeDataModule(
    'community.ts',
    'FaqItem, Testimonial',
    `export const testimonials: Testimonial[] = ${formatTsValue(testimonials)}

export const faqs: FaqItem[] = ${formatTsValue(faqs)}
`,
  )
  writeDataModule(
    'press.ts',
    'PressMention',
    `export const pressMentions: PressMention[] = ${formatTsValue(pressMentions)}

export function getPressByCity(cityId: string): PressMention[] {
  return pressMentions.filter((item) => item.cityId === cityId)
}
`,
  )

  console.log('Generate complete.')
  if (owned) db.close()
}

async function watch() {
  const client = connect()
  await ensureLocalDbSeeded(client)
  let last = await contentFingerprint(client)
  console.log('Watching for content changes (every 5s). Ctrl+C to stop.')
  await generate(client)

  const interval = setInterval(async () => {
    try {
      const next = await contentFingerprint(client)
      if (next !== last) {
        console.log(`[${new Date().toISOString()}] change detected — regenerating`)
        last = next
        await generate(client)
      }
    } catch (err) {
      console.error('Watch poll failed:', err)
    }
  }, 5000)

  const stop = () => {
    clearInterval(interval)
    client.close()
    process.exit(0)
  }
  process.on('SIGINT', stop)
  process.on('SIGTERM', stop)
}

async function main() {
  const cmd = process.argv[2] ?? 'generate'
  if (cmd === 'seed') await seed()
  else if (cmd === 'generate') await generate()
  else if (cmd === 'watch') await watch()
  else {
    console.error(`Unknown command: ${cmd}`)
    console.error('Usage: generate | watch | seed')
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
