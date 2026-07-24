import type { Client } from '@libsql/client'
import type {
  City,
  EventLanguage,
  FaqItem,
  MeetEvent,
  Organiser,
  PressMention,
  SocialLink,
  Testimonial,
  Topic,
  Venue,
} from '@/lib/types'
import type { ContentBundle } from '@/lib/content/types'

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null || value === '') return fallback
  if (typeof value === 'object') return value as T
  try {
    return JSON.parse(String(value)) as T
  } catch {
    return fallback
  }
}

function omitUndefined<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v
  }
  return out as T
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

/** Load the full content bundle from an open libSQL/Turso client. */
export async function fetchContentBundle(client: Client): Promise<ContentBundle> {
  const cityOrganisers = await groupIds(client, 'city_organisers', 'city_id', 'organiser_id')
  const cityTopics = await groupIds(client, 'city_topics', 'city_id', 'topic_id')
  const organiserCities = await groupIds(client, 'organiser_cities', 'organiser_id', 'city_id')
  const eventOrganisers = await groupIds(client, 'event_organisers', 'event_id', 'organiser_id')

  const topicsRs = await client.execute('SELECT * FROM topics ORDER BY rowid')
  const topics = topicsRs.rows.map((row) =>
    omitUndefined({
      id: String(row.id),
      slug: String(row.slug),
      name: String(row.name),
      tagline: String(row.tagline),
      description: String(row.description),
      icon: String(row.icon),
      color: String(row.color),
      status: String(row.status) as Topic['status'],
    }),
  )

  const organisersRs = await client.execute('SELECT * FROM organisers ORDER BY rowid')
  const organisers = organisersRs.rows.map((row) => {
    const social = parseJson<SocialLink[] | null>(row.social, null)
    return omitUndefined({
      id: String(row.id),
      name: String(row.name),
      role: row.role != null ? String(row.role) : undefined,
      bio: row.bio != null ? String(row.bio) : undefined,
      avatar: row.avatar != null ? String(row.avatar) : undefined,
      cityIds: organiserCities.get(String(row.id)) ?? [],
      social: social && social.length > 0 ? social : social === null ? undefined : [],
    }) as Organiser
  })

  const citiesRs = await client.execute('SELECT * FROM cities ORDER BY rowid')
  const cities = citiesRs.rows.map((row) => {
    const gallery = parseJson<string[] | null>(row.gallery, null)
    const social = parseJson<SocialLink[]>(row.social, [])
    return omitUndefined({
      id: String(row.id),
      slug: String(row.slug),
      name: String(row.name),
      country: String(row.country),
      countryFlag: String(row.country_flag),
      description: String(row.description),
      status: String(row.status) as City['status'],
      image: row.image != null ? String(row.image) : undefined,
      gallery: gallery && gallery.length > 0 ? gallery : undefined,
      memberCount: row.member_count != null ? Number(row.member_count) : undefined,
      social,
      organiserIds: cityOrganisers.get(String(row.id)) ?? [],
      topicIds: cityTopics.get(String(row.id)) ?? [],
      timezone: row.timezone != null ? String(row.timezone) : undefined,
    }) as City
  })

  const venuesRs = await client.execute('SELECT * FROM venues ORDER BY rowid')
  const venues = venuesRs.rows.map((row) => {
    const social = parseJson<SocialLink[] | null>(row.social, null)
    return omitUndefined({
      id: String(row.id),
      name: String(row.name),
      cityId: String(row.city_id),
      address: String(row.address),
      description: row.description != null ? String(row.description) : undefined,
      capacity: row.capacity != null ? Number(row.capacity) : undefined,
      image: row.image != null ? String(row.image) : undefined,
      social: social && social.length > 0 ? social : undefined,
    }) as Venue
  })

  const eventsRs = await client.execute('SELECT * FROM events ORDER BY rowid')
  const events = eventsRs.rows.map((row) => {
    const languages = parseJson<EventLanguage[] | null>(row.languages, null)
    const social = parseJson<SocialLink[] | null>(row.social, null)
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
    }) as MeetEvent
  })

  const testimonialsRs = await client.execute('SELECT * FROM testimonials ORDER BY rowid')
  const testimonials = testimonialsRs.rows.map((row) =>
    omitUndefined({
      id: String(row.id),
      quote: String(row.quote),
      name: String(row.name),
      role: String(row.role),
      cityId: row.city_id != null ? String(row.city_id) : undefined,
      avatar: row.avatar != null ? String(row.avatar) : undefined,
    }),
  ) as Testimonial[]

  const faqsRs = await client.execute('SELECT * FROM faqs ORDER BY sort_order, rowid')
  const faqs = faqsRs.rows.map((row) => ({
    id: String(row.id),
    question: String(row.question),
    answer: String(row.answer),
  })) as FaqItem[]

  const pressRs = await client.execute('SELECT * FROM press_mentions ORDER BY rowid')
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
  ) as PressMention[]

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
