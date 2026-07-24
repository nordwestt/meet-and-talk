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

function hasTursoConfig(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL)
}

async function loadFromTurso(): Promise<ContentBundle> {
  const url = process.env.TURSO_DATABASE_URL
  if (!url) return staticBundle()

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
 * Content for the site. When `TURSO_DATABASE_URL` is set, reads Turso and
 * caches for `CONTENT_REVALIDATE_SECONDS` (default 60). Otherwise uses the
 * generated `lib/data` modules (no redeploy-free updates).
 */
export async function getContentBundle(): Promise<ContentBundle> {
  if (!hasTursoConfig()) return staticBundle()

  const cached = unstable_cache(loadFromTurso, ['content-bundle'], {
    revalidate: revalidateSeconds(),
    tags: ['content'],
  })
  return cached()
}
