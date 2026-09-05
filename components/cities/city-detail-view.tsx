'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Users } from 'lucide-react'
import { EventCard } from '@/components/cards/event-card'
import { OrganiserCard } from '@/components/cards/organiser-card'
import { TopicIcon } from '@/components/icons/topic-icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PressCallout } from '@/components/press-mention-card'
import { SocialLinks } from '@/components/social-links'
import { WhatsappJoin } from '@/components/whatsapp-join'
import { useI18n } from '@/lib/i18n/context'
import { formatMemberCount } from '@/lib/data'
import type { City, MeetEvent, Organiser, PressMention, Topic } from '@/lib/types'

type CityDetailViewProps = {
  city: City
  events: MeetEvent[]
  organisers: Organiser[]
  topics: Topic[]
  press: PressMention[]
}

export function CityDetailView({
  city,
  events,
  organisers,
  topics,
  press,
}: CityDetailViewProps) {
  const { t, tc } = useI18n()
  const isPlanned = city.status === 'planned'
  const whatsapp = city.social.find((s) => s.platform === 'whatsapp')
  const description = tc(`city.${city.id}.description`, city.description)
  const country = tc(`country.${city.country}`, city.country)

  return (
    <>
      <section className="relative border-b border-border bg-grain">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <Link
            href="/cities"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {t('detail.backToCities')}
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="size-4 text-primary" />
                  {city.countryFlag} {country}
                </div>
                <Badge variant={isPlanned ? 'secondary' : 'default'}>
                  {isPlanned ? t('cities.plannedBadge') : t('cities.liveBadge')}
                </Badge>
              </div>
              <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
                {city.name}
              </h1>
              <p className="text-pretty text-lg text-muted-foreground">
                {description}
              </p>
              {!isPlanned && city.memberCount ? (
                <p className="inline-flex items-center gap-1.5 text-sm font-medium">
                  <Users className="size-4 text-primary" />
                  {formatMemberCount(city.memberCount)} {t('label.members')}
                </p>
              ) : null}
              {!isPlanned ? (
                <SocialLinks links={city.social} variant="labeled" className="max-w-xs" />
              ) : null}
              {isPlanned && whatsapp ? (
                <Button asChild size="lg" className="mt-2 w-fit gap-2">
                  <a href={whatsapp.url} target="_blank" rel="noreferrer">
                    {t('cities.joinWaitlist')}
                  </a>
                </Button>
              ) : null}
              {press[0] ? <PressCallout item={press[0]} /> : null}
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border-2 border-border shadow-[8px_8px_0_0_hsl(var(--primary))]">
              <Image
                src={city.image || '/placeholder.svg'}
                alt={`Meet & Talk in ${city.name}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-cover ${isPlanned ? 'opacity-85 saturate-[0.85]' : ''}`}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {isPlanned ? (
          <div className="mx-auto flex max-w-xl flex-col gap-6 text-center">
            <h2 className="font-display text-2xl font-bold">
              {t('cities.comingSoonTitle', { name: city.name })}
            </h2>
            <p className="text-muted-foreground">
              {t('cities.comingSoonBody', { name: city.name })}
            </p>
            {whatsapp ? <WhatsappJoin link={whatsapp} /> : null}
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            <div className="flex flex-col gap-12">
              {events.length > 0 ? (
                <section>
                  <h2 className="mb-6 font-display text-2xl font-bold">
                    {t('label.nextEvents')}
                  </h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {events.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </section>
              ) : (
                <p className="text-muted-foreground">{t('label.noEvents')}</p>
              )}

              {organisers.length > 0 ? (
                <section>
                  <h2 className="mb-6 font-display text-2xl font-bold">
                    {t('label.organisers')}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {organisers.map((organiser) => (
                      <OrganiserCard key={organiser.id} organiser={organiser} />
                    ))}
                  </div>
                </section>
              ) : null}

              {city.gallery && city.gallery.length > 0 ? (
                <section>
                  <h2 className="mb-6 font-display text-2xl font-bold">
                    {t('label.gallery')}
                  </h2>
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
                  <h3 className="mb-4 font-display font-bold">
                    {t('cities.activeTopics')}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {topics.map((topic) => (
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
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>
        )}
      </div>
    </>
  )
}
