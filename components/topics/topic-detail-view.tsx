'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CityCard } from '@/components/cards/city-card'
import { EventCard } from '@/components/cards/event-card'
import { TopicIcon } from '@/components/icons/topic-icon'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n/context'
import type { City, MeetEvent, Topic } from '@/lib/types'

type TopicDetailViewProps = {
  topic: Topic
  cities: City[]
  events: MeetEvent[]
}

export function TopicDetailView({ topic, cities, events }: TopicDetailViewProps) {
  const { t, tc } = useI18n()
  const isSoon = topic.status === 'soon'
  const name = tc(`topic.${topic.id}.name`, topic.name)
  const tagline = tc(`topic.${topic.id}.tagline`, topic.tagline)
  const description = tc(`topic.${topic.id}.description`, topic.description)

  return (
    <>
      <section className="border-b border-border bg-grain">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <Link
            href="/topics"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {t('detail.backToTopics')}
          </Link>

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div
                className="flex size-16 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: topic.color,
                  color: 'var(--primary-foreground)',
                }}
              >
                <TopicIcon name={topic.icon} className="size-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
                    {name}
                  </h1>
                  {isSoon ? (
                    <Badge variant="secondary" className="uppercase">
                      {t('topics.comingSoon')}
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-lg text-muted-foreground">{tagline}</p>
              </div>
            </div>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {cities.length > 0 ? (
          <section className="mb-12">
            <h2 className="mb-6 font-display text-2xl font-bold">
              {t('topics.citiesRunning')}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((city) => (
                <CityCard key={city.id} city={city} />
              ))}
            </div>
          </section>
        ) : null}

        {events.length > 0 ? (
          <section>
            <h2 className="mb-6 font-display text-2xl font-bold">
              {t('label.nextEvents')}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        ) : (
          <p className="text-center text-muted-foreground">
            {isSoon ? t('topics.comingSoonBody') : t('topics.noEvents')}
          </p>
        )}
      </div>
    </>
  )
}
