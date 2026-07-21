'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { EventCard } from '@/components/cards/event-card'
import { SectionHeading } from '@/components/section-heading'
import { Button } from '@/components/ui/button'
import { getUpcomingEvents } from '@/lib/data'
import { useI18n } from '@/lib/i18n/context'

export function UpcomingEvents() {
  const { t } = useI18n()
  const events = getUpcomingEvents(6)

  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <SectionHeading
          eyebrow={t('events.eyebrow')}
          title={t('events.title')}
          subtitle={t('events.subtitle')}
        >
          <Button asChild variant="ghost" className="hidden gap-1 sm:inline-flex">
            <Link href="/events">
              {t('events.viewAll')}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </SectionHeading>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        <div className="mt-8 flex justify-center sm:hidden">
          <Button asChild variant="outline" className="gap-1">
            <Link href="/events">
              {t('events.viewAll')}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
