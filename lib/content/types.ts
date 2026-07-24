import type {
  City,
  FaqItem,
  MeetEvent,
  Organiser,
  PressMention,
  Testimonial,
  Topic,
  Venue,
} from '@/lib/types'

export type ContentBundle = {
  cities: City[]
  events: MeetEvent[]
  venues: Venue[]
  topics: Topic[]
  organisers: Organiser[]
  testimonials: Testimonial[]
  faqs: FaqItem[]
  pressMentions: PressMention[]
}
