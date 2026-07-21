'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CityCard } from '@/components/cards/city-card'
import { SectionHeading } from '@/components/section-heading'
import { Button } from '@/components/ui/button'
import { cities } from '@/lib/data'
import { useI18n } from '@/lib/i18n/context'

export function FeaturedCities() {
  const { t } = useI18n()
  const featured = cities.slice(0, 6)

  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <SectionHeading
          eyebrow={t('cities.eyebrow')}
          title={t('cities.title')}
          subtitle={t('cities.subtitle')}
        >
          <Button asChild variant="ghost" className="hidden gap-1 sm:inline-flex">
            <Link href="/cities">
              {t('cities.viewAll')}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </SectionHeading>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
        <div className="mt-8 flex justify-center sm:hidden">
          <Button asChild variant="outline" className="gap-1">
            <Link href="/cities">
              {t('cities.viewAll')}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
