import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin, Users } from 'lucide-react'
import { EventCard } from '@/components/cards/event-card'
import { OrganiserCard } from '@/components/cards/organiser-card'
import { TopicIcon } from '@/components/icons/topic-icon'
import { SocialLinks } from '@/components/social-links'
import { WhatsappJoin } from '@/components/whatsapp-join'
import {
  cities,
  formatMemberCount,
  getCity,
  getEventsByCity,
  getOrganisers,
  getTopic,
} from '@/lib/data'

export function generateStaticParams() {
  return cities.map((city) => ({ slug: city.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const city = getCity(slug)
  if (!city) return {}
  return {
    title: `${city.name} · Meet & Talk`,
    description: city.description,
  }
}

export default async function CityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const city = getCity(slug)
  if (!city) notFound()

  const events = getEventsByCity(city.id)
  const organisers = getOrganisers(city.organiserIds)
  const topics = city.topicIds.map(getTopic).filter(Boolean)
  const whatsapp = city.social.find((s) => s.platform === 'whatsapp')

  return (
    <>
      <section className="relative border-b border-border bg-grain">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <Link
            href="/cities"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            All cities
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="size-4 text-primary" />
                {city.countryFlag} {city.country}
              </div>
              <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
                {city.name}
              </h1>
              <p className="text-pretty text-lg text-muted-foreground">
                {city.description}
              </p>
              {city.memberCount ? (
                <p className="inline-flex items-center gap-1.5 text-sm font-medium">
                  <Users className="size-4 text-primary" />
                  {formatMemberCount(city.memberCount)} members
                </p>
              ) : null}
              <SocialLinks links={city.social} variant="labeled" className="max-w-xs" />
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border-2 border-border shadow-[8px_8px_0_0_hsl(var(--primary))]">
              <Image
                src={city.image || '/placeholder.svg'}
                alt={`Meet & Talk in ${city.name}`}
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
        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-12">
            {events.length > 0 ? (
              <section>
                <h2 className="mb-6 font-display text-2xl font-bold">Next events</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            ) : (
              <p className="text-muted-foreground">
                No events scheduled yet — join the group to be the first to know.
              </p>
            )}

            {organisers.length > 0 ? (
              <section>
                <h2 className="mb-6 font-display text-2xl font-bold">Organisers</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {organisers.map((organiser) => (
                    <OrganiserCard key={organiser.id} organiser={organiser} />
                  ))}
                </div>
              </section>
            ) : null}

            {city.gallery && city.gallery.length > 0 ? (
              <section>
                <h2 className="mb-6 font-display text-2xl font-bold">Gallery</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {city.gallery.map((src, i) => (
                    <div
                      key={src}
                      className="relative aspect-square overflow-hidden rounded-2xl border-2 border-border"
                    >
                      <Image
                        src={src}
                        alt={`${city.name} community ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="flex flex-col gap-6">
            {whatsapp ? <WhatsappJoin link={whatsapp} /> : null}

            {topics.length > 0 ? (
              <div className="rounded-2xl border-2 border-border bg-card p-5">
                <h3 className="mb-4 font-display font-bold">Active topics</h3>
                <ul className="flex flex-col gap-3">
                  {topics.map((topic) =>
                    topic ? (
                      <li key={topic.id}>
                        <Link
                          href={`/topics/${topic.slug}`}
                          className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                        >
                          <div
                            className="flex size-9 items-center justify-center rounded-lg"
                            style={{
                              backgroundColor: topic.color,
                              color: 'var(--primary-foreground)',
                            }}
                          >
                            <TopicIcon name={topic.icon} className="size-4" />
                          </div>
                          <span className="text-sm font-medium">{topic.name}</span>
                        </Link>
                      </li>
                    ) : null,
                  )}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </>
  )
}
