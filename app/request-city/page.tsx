'use client'

import { RequestForm } from '@/components/forms/request-form'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { useI18n } from '@/lib/i18n/context'

export default function RequestCityPage() {
  const { t } = useI18n()

  return (
    <>
      <PageHero
        eyebrow={t('nav.requestCity')}
        title={t('requestCity.title')}
        subtitle={t('requestCity.subtitle')}
      />

      <section className="mx-auto max-w-xl px-4 py-12 sm:py-16">
        <SectionHeading align="center" title={t('requestCity.form.title')} />
        <div className="mt-8 rounded-3xl border-2 border-border bg-card p-6 sm:p-8">
          <RequestForm variant="city" />
        </div>
      </section>
    </>
  )
}
