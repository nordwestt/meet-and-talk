import { notFound } from 'next/navigation'
import { TopicDetailView } from '@/components/topics/topic-detail-view'
import { getContentBundle } from '@/lib/content/load'
import { createLookups } from '@/lib/content/lookups'

export async function generateStaticParams() {
  const { topics } = await getContentBundle()
  return topics.map((topic) => ({ slug: topic.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { getTopic } = createLookups(await getContentBundle())
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
  const { getCitiesByTopic, getEventsByTopic, getTopic } = createLookups(
    await getContentBundle(),
  )
  const topic = getTopic(slug)
  if (!topic) notFound()

  return (
    <TopicDetailView
      topic={topic}
      cities={getCitiesByTopic(topic.id)}
      events={getEventsByTopic(topic.id)}
    />
  )
}
