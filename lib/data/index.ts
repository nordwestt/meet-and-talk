import { cities } from './cities'
import { events } from './events'
import { organisers } from './organisers'
import { topics } from './topics'
import { venues } from './venues'
import type {
  City,
  MeetEvent,
  Organiser,
  Topic,
  Venue,
} from '@/lib/types'

export { cities } from './cities'
export { events } from './events'
export { organisers } from './organisers'
export { topics } from './topics'
export { venues } from './venues'
export { testimonials, faqs } from './community'
export { pressMentions, getPressByCity } from './press'
export { siteConfig, mainNav } from './site'

/* ---------- lookups ---------- */

export function getCity(idOrSlug: string): City | undefined {
  return cities.find((c) => c.id === idOrSlug || c.slug === idOrSlug)
}

export function getTopic(idOrSlug: string): Topic | undefined {
  return topics.find((t) => t.id === idOrSlug || t.slug === idOrSlug)
}

export function getVenue(id: string): Venue | undefined {
  return venues.find((v) => v.id === id)
}

export function getOrganiser(id: string): Organiser | undefined {
  return organisers.find((o) => o.id === id)
}

export function getOrganisers(ids: string[]): Organiser[] {
  return ids.map(getOrganiser).filter((o): o is Organiser => Boolean(o))
}

export function getEvent(idOrSlug: string): MeetEvent | undefined {
  return events.find((e) => e.id === idOrSlug || e.slug === idOrSlug)
}

/* ---------- collections ---------- */

export function getLiveCities(): City[] {
  return cities.filter((c) => c.status === 'live')
}

export function getPlannedCities(): City[] {
  return cities.filter((c) => c.status === 'planned')
}

export function getSortedEvents(): MeetEvent[] {
  return [...events].sort((a, b) => a.date.localeCompare(b.date))
}

export function getEventsByCity(cityId: string): MeetEvent[] {
  return getSortedEvents().filter((e) => e.cityId === cityId)
}

export function getEventsByTopic(topicId: string): MeetEvent[] {
  return getSortedEvents().filter((e) => e.topicId === topicId)
}

export function getVenuesByCity(cityId: string): Venue[] {
  return venues.filter((v) => v.cityId === cityId)
}

export function getCitiesByTopic(topicId: string): City[] {
  return cities.filter((c) => c.topicIds.includes(topicId))
}

export function getUpcomingEvents(limit?: number): MeetEvent[] {
  const sorted = getSortedEvents()
  return typeof limit === 'number' ? sorted.slice(0, limit) : sorted
}

/* ---------- formatting ---------- */

export function formatEventDate(iso: string, locale = 'en-GB'): string {
  const date = new Date(`${iso}T00:00:00`)
  return date.toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function formatMemberCount(count?: number): string {
  if (!count) return '—'
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace('.0', '')}k`
  return String(count)
}
