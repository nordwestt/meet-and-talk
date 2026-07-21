import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { CityCard } from '@/components/cards/city-card'
import { EventCard } from '@/components/cards/event-card'
import { TopicIcon } from '@/components/icons/topic-icon'
import { Badge } from '@/components/ui/badge'
import {
  getCitiesByTopic,
  getEventsByTopic,
  getTopic,
  topics,
} from '@/lib/data'

export function generateStaticParams() {
  return topics.map((topic) => ({ slug: topic.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const topic = getTopic(slug)
  if (!topic) return {}
  return {
    title: topic.name,
    description: topic.description,
  }
}

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const topic = getTopic(slug)
  if (!topic) notFound()

  const cities = getCitiesByTopic(topic.id)
  const events = getEventsByTopic(topic.id)
  const isSoon = topic.status === 'soon'

  return (
    <>
      <section className="border-b border-border bg-grain">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <Link
            href="/topics"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            All topics
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
                    {topic.name}
                  </h1>
                  {isSoon ? (
                    <Badge variant="secondary" className="uppercase">
                      Coming soon
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-lg text-muted-foreground">{topic.tagline}</p>
              </div>
            </div>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed">
              {topic.description}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {cities.length > 0 ? (
          <section className="mb-12">
            <h2 className="mb-6 font-display text-2xl font-bold">
              Cities running this topic
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
            <h2 className="mb-6 font-display text-2xl font-bold">Upcoming events</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        ) : isSoon ? (
          <p className="text-center text-muted-foreground">
            This topic is coming soon. Request your city to help us launch it.
          </p>
        ) : (
          <p className="text-center text-muted-foreground">
            No events scheduled yet for this topic.
          </p>
        )}
      </div>
    </>
  )
}
