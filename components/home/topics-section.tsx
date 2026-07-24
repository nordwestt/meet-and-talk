'use client'

import { TopicCard } from '@/components/cards/topic-card'
import { SectionHeading } from '@/components/section-heading'
import { useContent } from '@/lib/content/context'
import { useI18n } from '@/lib/i18n/context'

export function TopicsSection() {
  const { t } = useI18n()
  const { topics } = useContent()

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <SectionHeading
        align="center"
        eyebrow={t('topics.eyebrow')}
        title={t('topics.title')}
        subtitle={t('topics.subtitle')}
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </section>
  )
}
