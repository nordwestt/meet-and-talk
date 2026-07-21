import type { Metadata } from 'next'
import { CityCard } from '@/components/cards/city-card'
import { PageHero } from '@/components/page-hero'
import { cities } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Cities',
  description:
    'Find Meet & Talk communities across European cities. Join local groups, discover events and meet new people.',
}

export default function CitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Cities"
        title="Meet & Talk cities"
        subtitle="Pick a city to see upcoming events, organisers and how to join."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </section>
    </>
  )
}
