import Image from 'next/image'
import { MapPin, Users } from 'lucide-react'
import { getCity } from '@/lib/data'
import type { Venue } from '@/lib/types'

export function VenueCard({ venue }: { venue: Venue }) {
  const city = getCity(venue.cityId)

  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
        {venue.image ? (
          <Image
            src={venue.image}
            alt={venue.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-display font-bold leading-tight">{venue.name}</h3>
        <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0 text-primary" />
          {venue.address}
          {city ? `, ${city.name}` : ''}
        </p>
        {venue.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{venue.description}</p>
        ) : null}
        {venue.capacity ? (
          <p className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Users className="size-3.5 text-primary" />
            Up to {venue.capacity}
          </p>
        ) : null}
      </div>
    </div>
  )
}
