'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Repeat,
  Users,
} from 'lucide-react'
import { OrganiserCard } from '@/components/cards/organiser-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatEventDate } from '@/lib/data'
import { intlLocales } from '@/lib/i18n/config'
import { useI18n } from '@/lib/i18n/context'
import type { City, MeetEvent, Organiser, Topic, Venue } from '@/lib/types'

type EventDetailViewProps = {
  event: MeetEvent
  city?: City
  venue?: Venue
  topic?: Topic
  organisers: Organiser[]
}

export function EventDetailView({
  event,
  city,
  venue,
  topic,
  organisers,
}: EventDetailViewProps) {
  const { t, tc, locale } = useI18n()
  const whatsapp = city?.social.find((s) => s.platform === 'whatsapp')
  const topicName = topic ? tc(`topic.${topic.id}.name`, topic.name) : null
  const price = event.price ? tc(`price.${event.price}`, event.price) : null
  const recurring = event.recurring
    ? tc(`weekday.${event.recurring}`, event.recurring)
    : null

  return (
    <>
      <section className="border-b border-border bg-grain">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <Link
            href="/events"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {t('detail.backToEvents')}
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap gap-2">
                {topic && topicName ? (
                  <Badge
                    className="border-0"
                    style={{
                      backgroundColor: topic.color,
                      color: 'var(--primary-foreground)',
                    }}
                  >
                    {topicName}
                  </Badge>
                ) : null}
                {price ? <Badge variant="secondary">{price}</Badge> : null}
              </div>

              <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
                {event.title}
              </h1>

              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="size-4 text-primary" />
                  {formatEventDate(event.date, intlLocales[locale])}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  {event.time}
                </span>
                {recurring ? (
                  <span className="inline-flex items-center gap-2">
                    <Repeat className="size-4 text-primary" />
                    {recurring}
                  </span>
                ) : null}
                {venue && city ? (
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="size-4 text-primary" />
                    {venue.name}, {city.name}
                  </span>
                ) : null}
                {typeof event.going === 'number' ? (
                  <span className="inline-flex items-center gap-2">
                    <Users className="size-4 text-primary" />
                    {event.going}
                    {event.capacity ? ` / ${event.capacity}` : ''}{' '}
                    {t('label.going')}
                  </span>
                ) : null}
              </div>

              <p className="text-pretty text-lg leading-relaxed">{event.description}</p>

              {event.languages && event.languages.length > 0 ? (
                <div>
                  <p className="mb-2 text-sm font-bold">{t('label.languages')}</p>
                  <div className="flex flex-wrap gap-2">
                    {event.languages.map((lang) => (
                      <Badge key={lang.code} variant="outline">
                        {tc(`lang.${lang.code}`, lang.label)}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              {whatsapp ? (
                <Button asChild size="lg" className="mt-2 w-fit">
                  <a href={whatsapp.url} target="_blank" rel="noreferrer">
                    {t('detail.joinWhatsapp')}
                  </a>
                </Button>
              ) : null}
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border-2 border-border shadow-[8px_8px_0_0_hsl(var(--primary))]">
              <Image
                src={event.image || '/placeholder.svg'}
                alt={event.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          {venue ? (
            <section>
              <h2 className="mb-4 font-display text-2xl font-bold">
                {t('label.venue')}
              </h2>
              <div className="rounded-2xl border-2 border-border bg-card p-5">
                <h3 className="font-display text-lg font-bold">{venue.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{venue.address}</p>
                {venue.description ? (
                  <p className="mt-3 text-sm">{venue.description}</p>
                ) : null}
                {venue.capacity ? (
                  <p className="mt-3 text-sm font-medium text-muted-foreground">
                    {t('detail.capacity', { count: venue.capacity })}
                  </p>
                ) : null}
              </div>
            </section>
          ) : null}

          {organisers.length > 0 ? (
            <section>
              <h2 className="mb-4 font-display text-2xl font-bold">
                {t('label.organisers')}
              </h2>
              <div className="flex flex-col gap-4">
                {organisers.map((organiser) => (
                  <OrganiserCard key={organiser.id} organiser={organiser} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        {city ? (
          <div className="mt-8">
            <Link
              href={`/cities/${city.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <MapPin className="size-4" />
              {t('detail.moreEventsIn', { name: city.name })}
            </Link>
          </div>
        ) : null}
      </div>
    </>
  )
}
