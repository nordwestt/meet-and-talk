'use client'

import { TopicCard } from '@/components/cards/topic-card'
import { PageHero } from '@/components/page-hero'
import { topics } from '@/lib/data'
import { useI18n } from '@/lib/i18n/context'

export default function TopicsPage() {
  const { t } = useI18n()
  const live = topics.filter((topic) => topic.status === 'live')
  const soon = topics.filter((topic) => topic.status === 'soon')

  return (
    <>
      <PageHero
        eyebrow={t('topics.eyebrow')}
        title={t('topics.title')}
        subtitle={t('topics.subtitle')}
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="mb-6 font-display text-xl font-bold">{t('topics.live')}</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {live.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>

        {soon.length > 0 ? (
          <>
            <h2 className="mb-6 mt-12 font-display text-xl font-bold">
              {t('topics.comingSoon')}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {soon.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          </>
        ) : null}
      </section>
    </>
  )
}
