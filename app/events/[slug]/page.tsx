import { notFound } from 'next/navigation'
import { EventDetailView } from '@/components/events/event-detail-view'
import { getContentBundle } from '@/lib/content/load'
import { createLookups } from '@/lib/content/lookups'

export async function generateStaticParams() {
  const { events } = await getContentBundle()
  return events.map((event) => ({ slug: event.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { getEvent } = createLookups(await getContentBundle())
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
  const { getCity, getEvent, getOrganisers, getTopic, getVenue } = createLookups(
    await getContentBundle(),
  )
  const event = getEvent(slug)
  if (!event) notFound()

  return (
    <EventDetailView
      event={event}
      city={getCity(event.cityId)}
      venue={getVenue(event.venueId)}
      topic={getTopic(event.topicId)}
      organisers={getOrganisers(event.organiserIds)}
    />
  )
}
