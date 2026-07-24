import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { createClient } from '@libsql/client'
import { unstable_cache } from 'next/cache'
import { cities } from '@/lib/data/cities'
import { testimonials, faqs } from '@/lib/data/community'
import { events } from '@/lib/data/events'
import { organisers } from '@/lib/data/organisers'
import { pressMentions } from '@/lib/data/press'
import { topics } from '@/lib/data/topics'
import { venues } from '@/lib/data/venues'
import { fetchContentBundle } from '@/lib/content/query'
import type { ContentBundle } from '@/lib/content/types'

const DEFAULT_REVALIDATE_SECONDS = 60

function revalidateSeconds(): number {
  const raw = process.env.CONTENT_REVALIDATE_SECONDS
  if (raw == null || raw === '') return DEFAULT_REVALIDATE_SECONDS
  const n = Number(raw)
  return Number.isFinite(n) && n >= 0 ? n : DEFAULT_REVALIDATE_SECONDS
}

function staticBundle(): ContentBundle {
  return {
    cities,
    events,
    venues,
    topics,
    organisers,
    testimonials,
    faqs,
    pressMentions,
  }
}

/** Same default DB the Go admin API uses when TURSO_DATABASE_URL is unset. */
function resolveDatabaseUrl(): string | null {
  if (process.env.TURSO_DATABASE_URL) return process.env.TURSO_DATABASE_URL
  const localPath = join(process.cwd(), 'content', 'local.db')
  if (existsSync(localPath)) return `file:${localPath}`
  return null
}

async function loadFromDatabase(url: string): Promise<ContentBundle> {
  const client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  })
  try {
    return await fetchContentBundle(client)
  } finally {
    client.close()
  }
}

/**
 * Content for the site.
 * 1. `TURSO_DATABASE_URL` if set (remote Turso / sqld)
 * 2. else `content/local.db` if present (matches Go API default)
 * 3. else generated `lib/data` modules
 */
export async function getContentBundle(): Promise<ContentBundle> {
  const url = resolveDatabaseUrl()
  if (!url) return staticBundle()

  const cached = unstable_cache(
    () => loadFromDatabase(url),
    ['content-bundle', url],
    {
      revalidate: revalidateSeconds(),
      tags: ['content'],
    },
  )
  return cached()
}
