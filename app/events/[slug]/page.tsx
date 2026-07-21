import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
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
import {
  events,
  formatEventDate,
  getCity,
  getEvent,
  getOrganisers,
  getTopic,
  getVenue,
} from '@/lib/data'

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = getEvent(slug)
  if (!event) return {}
  return {
    title: event.title,
    description: event.description,
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = getEvent(slug)
  if (!event) notFound()

  const city = getCity(event.cityId)
  const venue = getVenue(event.venueId)
  const topic = getTopic(event.topicId)
  const organisers = getOrganisers(event.organiserIds)
  const whatsapp = city?.social.find((s) => s.platform === 'whatsapp')

  return (
    <>
      <section className="border-b border-border bg-grain">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <Link
            href="/events"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            All events
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap gap-2">
                {topic ? (
                  <Badge
                    className="border-0"
                    style={{
                      backgroundColor: topic.color,
                      color: 'var(--primary-foreground)',
                    }}
                  >
                    {topic.name}
                  </Badge>
                ) : null}
                {event.price ? <Badge variant="secondary">{event.price}</Badge> : null}
              </div>

              <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
                {event.title}
              </h1>

              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="size-4 text-primary" />
                  {formatEventDate(event.date)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  {event.time}
                </span>
                {event.recurring ? (
                  <span className="inline-flex items-center gap-2">
                    <Repeat className="size-4 text-primary" />
                    {event.recurring}
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
                    {event.capacity ? ` / ${event.capacity}` : ''} going
                  </span>
                ) : null}
              </div>

              <p className="text-pretty text-lg leading-relaxed">{event.description}</p>

              {event.languages && event.languages.length > 0 ? (
                <div>
                  <p className="mb-2 text-sm font-bold">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {event.languages.map((lang) => (
                      <Badge key={lang.code} variant="outline">
                        {lang.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              {whatsapp ? (
                <Button asChild size="lg" className="mt-2 w-fit">
                  <a href={whatsapp.url} target="_blank" rel="noreferrer">
                    Join WhatsApp group
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
              <h2 className="mb-4 font-display text-2xl font-bold">Venue</h2>
              <div className="rounded-2xl border-2 border-border bg-card p-5">
                <h3 className="font-display text-lg font-bold">{venue.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{venue.address}</p>
                {venue.description ? (
                  <p className="mt-3 text-sm">{venue.description}</p>
                ) : null}
                {venue.capacity ? (
                  <p className="mt-3 text-sm font-medium text-muted-foreground">
                    Capacity: {venue.capacity}
                  </p>
                ) : null}
              </div>
            </section>
          ) : null}

          {organisers.length > 0 ? (
            <section>
              <h2 className="mb-4 font-display text-2xl font-bold">Organisers</h2>
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
              More events in {city.name}
            </Link>
          </div>
        ) : null}
      </div>
    </>
  )
}
