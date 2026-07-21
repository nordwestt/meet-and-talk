'use client'

import Link from 'next/link'
import { ArrowRight, Store } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/context'

export function VenueInvitation() {
  const { t } = useI18n()

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="grid items-center gap-8 rounded-3xl border-2 border-border bg-secondary/30 p-8 sm:grid-cols-[1fr_auto] sm:p-10">
        <div className="flex flex-col gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Store className="size-6" />
          </div>
          <SectionHeading
            title={t('section.venues.title')}
            subtitle={t('section.venues.subtitle')}
          />
        </div>
        <Button asChild size="lg" className="gap-2 shrink-0">
          <Link href="/venues">
            {t('cta.hostVenue')}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
