'use client'

import { CalendarCheck, MapPin, PartyPopper } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { useI18n } from '@/lib/i18n/context'

export function HowItWorks() {
  const { t } = useI18n()

  const steps = [
    {
      icon: MapPin,
      title: t('how.step1.title'),
      body: t('how.step1.body'),
    },
    {
      icon: CalendarCheck,
      title: t('how.step2.title'),
      body: t('how.step2.body'),
    },
    {
      icon: PartyPopper,
      title: t('how.step3.title'),
      body: t('how.step3.body'),
    },
  ]

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <SectionHeading
        align="center"
        eyebrow={t('how.eyebrow')}
        title={t('how.title')}
        subtitle={t('how.subtitle')}
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="relative flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-card p-6 text-center"
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground">
              {i + 1}
            </span>
            <div className="mt-2 flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
              <step.icon className="size-7" />
            </div>
            <h3 className="font-display text-lg font-bold">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
