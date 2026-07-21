'use client'

import { PressMentionCard } from '@/components/press-mention-card'
import { SectionHeading } from '@/components/section-heading'
import { pressMentions } from '@/lib/data'
import { useI18n } from '@/lib/i18n/context'

export function PressSection() {
  const { t } = useI18n()

  if (!pressMentions.length) return null

  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <SectionHeading
          align="center"
          eyebrow={t('press.eyebrow')}
          title={t('press.title')}
          subtitle={t('press.subtitle')}
        />
        <div className="mx-auto mt-10 grid max-w-2xl gap-5">
          {pressMentions.map((item) => (
            <PressMentionCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
