'use client'

import { CalendarDays, Clock, MapPin, Repeat, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  formatEventDate,
  getCity,
  getTopic,
  getVenue,
} from '@/lib/data'
import { useI18n } from '@/lib/i18n/context'
import type { MeetEvent } from '@/lib/types'

export function EventCard({ event }: { event: MeetEvent }) {
  const { t } = useI18n()
  const city = getCity(event.cityId)
  const venue = getVenue(event.venueId)
  const topic = getTopic(event.topicId)

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="size-full bg-muted" />
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {topic ? (
            <Badge
              className="border-0 shadow-sm"
              style={{ backgroundColor: topic.color, color: 'var(--primary-foreground)' }}
            >
              {topic.name}
            </Badge>
          ) : null}
          {event.price ? (
            <Badge variant="secondary" className="shadow-sm">
              {event.price}
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="size-3.5" />
            {formatEventDate(event.date)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {event.time}
          </span>
        </div>

        <h3 className="text-balance font-display text-lg font-bold leading-snug">
          {event.title}
        </h3>

        <div className="mt-auto flex flex-col gap-1.5 text-sm text-muted-foreground">
          {venue && city ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0 text-primary" />
              {venue.name}, {city.name}
            </span>
          ) : null}
          {event.recurring ? (
            <span className="inline-flex items-center gap-1.5">
              <Repeat className="size-3.5 shrink-0 text-primary" />
              {event.recurring}
            </span>
          ) : null}
        </div>

        {typeof event.going === 'number' ? (
          <div className="flex items-center gap-1.5 border-t border-border pt-3 text-xs font-medium text-muted-foreground">
            <Users className="size-3.5 text-primary" />
            {event.going}
            {event.capacity ? ` / ${event.capacity}` : ''} {t('label.members')}
          </div>
        ) : null}
      </div>
    </Link>
  )
}
