'use client'

import { Store, TrendingUp, Users, Zap } from 'lucide-react'
import { VenueCard } from '@/components/cards/venue-card'
import { RequestForm } from '@/components/forms/request-form'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { venues } from '@/lib/data'
import { useI18n } from '@/lib/i18n/context'

const benefitIcons = [TrendingUp, Users, Zap, Store]

export default function VenuesPage() {
  const { t } = useI18n()

  const benefits = [1, 2, 3, 4].map((n, i) => ({
    icon: benefitIcons[i],
    title: t(`venues.benefit${n}.title` as 'venues.benefit1.title'),
    body: t(`venues.benefit${n}.body` as 'venues.benefit1.body'),
  }))

  const steps = [1, 2, 3].map((n) => ({
    title: t(`venues.how.step${n}.title` as 'venues.how.step1.title'),
    body: t(`venues.how.step${n}.body` as 'venues.how.step1.body'),
  }))

  return (
    <>
      <PageHero
        eyebrow={t('venues.hero.badge')}
        title={t('venues.hero.title')}
        subtitle={t('venues.hero.subtitle')}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <SectionHeading
          align="center"
          title={t('venues.benefits.title')}
          subtitle={t('venues.benefits.subtitle')}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, i) => (
            <div
              key={benefit.title}
              className="flex flex-col gap-3 rounded-2xl border-2 border-border bg-card p-5"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <benefit.icon className="size-6" />
              </div>
              <h3 className="font-display font-bold">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <SectionHeading align="center" title={t('venues.how.title')} />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="relative flex flex-col gap-3 rounded-2xl border-2 border-border bg-card p-6 text-center"
              >
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-accent-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-2 font-display font-bold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <SectionHeading title={t('venues.partners.title')} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-grain">
        <div className="mx-auto max-w-xl px-4 py-12 sm:py-16">
          <SectionHeading
            align="center"
            title={t('venues.form.title')}
            subtitle={t('venues.form.subtitle')}
          />
          <div className="mt-8 rounded-3xl border-2 border-border bg-card p-6 sm:p-8">
            <RequestForm variant="venue" />
          </div>
        </div>
      </section>
    </>
  )
}
