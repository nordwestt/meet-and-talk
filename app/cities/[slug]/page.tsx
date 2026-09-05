import { notFound } from 'next/navigation'
import { CityDetailView } from '@/components/cities/city-detail-view'
import { getContentBundle } from '@/lib/content/load'
import { createLookups } from '@/lib/content/lookups'

export async function generateStaticParams() {
  const { cities } = await getContentBundle()
  return cities.map((city) => ({ slug: city.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { getCity } = createLookups(await getContentBundle())
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
  const {
    getCity,
    getEventsByCity,
    getOrganisers,
    getPressByCity,
    getTopic,
  } = createLookups(await getContentBundle())
  const city = getCity(slug)
  if (!city) notFound()

  const events = getEventsByCity(city.id)
  const organisers = getOrganisers(city.organiserIds)
  const topics = city.topicIds
    .map(getTopic)
    .filter((topic): topic is NonNullable<typeof topic> => Boolean(topic))
  const press = getPressByCity(city.id)

  return (
    <CityDetailView
      city={city}
      events={events}
      organisers={organisers}
      topics={topics}
      press={press}
    />
  )
}
