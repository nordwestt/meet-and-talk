/**
 * Sync helpers kept for formatting + site config.
 * Meetup content (cities, events, …) comes from Turso via
 * `getContentBundle` / `useContent` — see `lib/content`.
 */

export { siteConfig, mainNav } from './site'

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
