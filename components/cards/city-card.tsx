import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, MapPin } from 'lucide-react'
import type { City } from '@/lib/types'

export function CityCard({ city }: { city: City }) {
  return (
    <Link
      href={`/cities/${city.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-card transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={city.image || '/placeholder.svg'}
          alt={`Meet & Talk community in ${city.name}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-background">
          <MapPin className="size-4" aria-hidden="true" />
          <span className="text-sm font-medium">
            {city.countryFlag} {city.country}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-xl font-bold leading-tight">{city.name}</h3>
          <ArrowUpRight
            className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
            aria-hidden="true"
          />
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{city.description}</p>
        {city.memberCount ? (
          <div className="mt-auto flex items-center gap-3 pt-2 text-xs font-medium text-muted-foreground">
            <span>{city.memberCount.toLocaleString()} members</span>
          </div>
        ) : null}
      </div>
    </Link>
  )
}
