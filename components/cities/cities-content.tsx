'use client'

import { CityCard } from '@/components/cards/city-card'
import { PageHero } from '@/components/page-hero'
import { getLiveCities, getPlannedCities } from '@/lib/data'
import { useI18n } from '@/lib/i18n/context'

export function CitiesContent() {
  const { t } = useI18n()
  const live = getLiveCities()
  const planned = getPlannedCities()

  return (
    <>
      <PageHero
        eyebrow={t('cities.eyebrow')}
        title={t('cities.title')}
        subtitle={t('cities.subtitle')}
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="mb-6 font-display text-xl font-bold">{t('cities.live')}</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {live.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>

        {planned.length > 0 ? (
          <>
            <h2 className="mb-6 mt-12 font-display text-xl font-bold">{t('cities.plannedSection')}</h2>
            <p className="mb-6 max-w-2xl text-muted-foreground">{t('cities.plannedHint')}</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {planned.map((city) => (
                <CityCard key={city.id} city={city} />
              ))}
            </div>
          </>
        ) : null}
      </section>
    </>
  )
}
