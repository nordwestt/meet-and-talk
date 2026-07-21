/**
 * Core domain model for Meet & Talk.
 *
 * Everything the platform renders is described by these configurable
 * entities. Today they are populated from typed config modules in
 * `lib/data`, but the shapes are designed to map cleanly onto database
 * rows and an admin CMS later — without changing any UI code.
 */

export type SocialPlatform =
  | 'whatsapp'
  | 'instagram'
  | 'telegram'
  | 'discord'
  | 'facebook'
  | 'meetup'
  | 'website'
  | 'email'

export type SocialLink = {
  platform: SocialPlatform
  /** Full URL, or mailto: for email */
  url: string
  /** Optional human label, e.g. "@meetandtalk.cph" */
  handle?: string
  /** Optional QR code image (used mainly for WhatsApp) */
  qrCode?: string
}

export type Organiser = {
  id: string
  name: string
  role?: string
  bio?: string
  avatar?: string
  cityIds: string[]
  social?: SocialLink[]
}

export type Venue = {
  id: string
  name: string
  cityId: string
  address: string
  description?: string
  capacity?: number
  image?: string
  social?: SocialLink[]
}

export type Topic = {
  id: string
  slug: string
  name: string
  /** short tagline */
  tagline: string
  description: string
  /** lucide-react icon name */
  icon: string
  /** tailwind-friendly accent, one of the theme chart tokens */
  color: string
  /** whether this topic is live yet or "coming soon" */
  status: 'live' | 'soon'
}

export type CityStatus = 'live' | 'planned'

export type City = {
  id: string
  slug: string
  name: string
  country: string
  countryFlag: string
  /** local language teaser */
  description: string
  /** live = active community; planned = launching soon */
  status: CityStatus
  image?: string
  gallery?: string[]
  memberCount?: number
  social: SocialLink[]
  organiserIds: string[]
  /** primary topics active in this city */
  topicIds: string[]
  /** timezone label, purely cosmetic */
  timezone?: string
}

export type EventLanguage = {
  code: string
  label: string
}

export type MeetEvent = {
  id: string
  slug: string
  title: string
  cityId: string
  venueId: string
  topicId: string
  organiserIds: string[]
  languages?: EventLanguage[]
  /** ISO date of the next occurrence */
  date: string
  /** e.g. "19:00" */
  time: string
  /** e.g. "Every Tuesday" */
  recurring?: string
  description: string
  capacity?: number
  /** how many have RSVP'd so far */
  going?: number
  image?: string
  price?: string
  social?: SocialLink[]
}

export type Testimonial = {
  id: string
  quote: string
  name: string
  role: string
  cityId?: string
  avatar?: string
}

export type FaqItem = {
  id: string
  question: string
  answer: string
}

export type PressMention = {
  id: string
  title: string
  excerpt: string
  url: string
  outlet: string
  author?: string
  /** ISO date or display string */
  date?: string
  cityId?: string
}
