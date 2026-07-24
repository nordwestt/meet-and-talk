import type {
  City,
  MeetEvent,
  Organiser,
  PressMention,
  Topic,
  Venue,
} from '@/lib/types'
import type { ContentBundle } from '@/lib/content/types'

export type ContentLookups = ContentBundle & {
  getCity: (idOrSlug: string) => City | undefined
  getTopic: (idOrSlug: string) => Topic | undefined
  getVenue: (id: string) => Venue | undefined
  getOrganiser: (id: string) => Organiser | undefined
  getOrganisers: (ids: string[]) => Organiser[]
  getEvent: (idOrSlug: string) => MeetEvent | undefined
  getLiveCities: () => City[]
  getPlannedCities: () => City[]
  getSortedEvents: () => MeetEvent[]
  getEventsByCity: (cityId: string) => MeetEvent[]
  getEventsByTopic: (topicId: string) => MeetEvent[]
  getVenuesByCity: (cityId: string) => Venue[]
  getCitiesByTopic: (topicId: string) => City[]
  getUpcomingEvents: (limit?: number) => MeetEvent[]
  getPressByCity: (cityId: string) => PressMention[]
}

export function createLookups(bundle: ContentBundle): ContentLookups {
  const getCity = (idOrSlug: string) =>
    bundle.cities.find((c) => c.id === idOrSlug || c.slug === idOrSlug)
  const getTopic = (idOrSlug: string) =>
    bundle.topics.find((t) => t.id === idOrSlug || t.slug === idOrSlug)
  const getVenue = (id: string) => bundle.venues.find((v) => v.id === id)
  const getOrganiser = (id: string) => bundle.organisers.find((o) => o.id === id)
  const getOrganisers = (ids: string[]) =>
    ids.map(getOrganiser).filter((o): o is Organiser => Boolean(o))
  const getEvent = (idOrSlug: string) =>
    bundle.events.find((e) => e.id === idOrSlug || e.slug === idOrSlug)
  const getLiveCities = () => bundle.cities.filter((c) => c.status === 'live')
  const getPlannedCities = () => bundle.cities.filter((c) => c.status === 'planned')
  const getSortedEvents = () =>
    [...bundle.events].sort((a, b) => a.date.localeCompare(b.date))
  const getEventsByCity = (cityId: string) =>
    getSortedEvents().filter((e) => e.cityId === cityId)
  const getEventsByTopic = (topicId: string) =>
    getSortedEvents().filter((e) => e.topicId === topicId)
  const getVenuesByCity = (cityId: string) =>
    bundle.venues.filter((v) => v.cityId === cityId)
  const getCitiesByTopic = (topicId: string) =>
    bundle.cities.filter((c) => c.topicIds.includes(topicId))
  const getUpcomingEvents = (limit?: number) => {
    const sorted = getSortedEvents()
    return typeof limit === 'number' ? sorted.slice(0, limit) : sorted
  }
  const getPressByCity = (cityId: string) =>
    bundle.pressMentions.filter((item) => item.cityId === cityId)

  return {
    ...bundle,
    getCity,
    getTopic,
    getVenue,
    getOrganiser,
    getOrganisers,
    getEvent,
    getLiveCities,
    getPlannedCities,
    getSortedEvents,
    getEventsByCity,
    getEventsByTopic,
    getVenuesByCity,
    getCitiesByTopic,
    getUpcomingEvents,
    getPressByCity,
  }
}
