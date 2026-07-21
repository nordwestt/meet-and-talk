'use client'

import Link from 'next/link'
import { ArrowRight, MapPinPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/context'

export function CtaBand() {
  const { t } = useI18n()

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:py-20">
        <h2 className="text-balance font-display text-3xl font-extrabold sm:text-4xl">
          {t('cta.title')}
        </h2>
        <p className="max-w-xl text-pretty text-lg text-primary-foreground/85">
          {t('cta.subtitle')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" variant="secondary" className="gap-2 text-base">
            <Link href="/cities">
              {t('cta.primary')}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="gap-2 border-primary-foreground/30 bg-transparent text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Link href="/request-city">
              <MapPinPlus className="size-4" />
              {t('cta.secondary')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
