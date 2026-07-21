import Image from 'next/image'
import { SocialLinks } from '@/components/social-links'
import type { Organiser } from '@/lib/types'

export function OrganiserCard({ organiser }: { organiser: Organiser }) {
  return (
    <div className="flex gap-4 rounded-2xl border-2 border-border bg-card p-4">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-muted">
        {organiser.avatar ? (
          <Image
            src={organiser.avatar}
            alt={organiser.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-display font-bold">{organiser.name}</h3>
        {organiser.role ? (
          <p className="text-sm text-primary">{organiser.role}</p>
        ) : null}
        {organiser.bio ? (
          <p className="text-sm text-muted-foreground">{organiser.bio}</p>
        ) : null}
        {organiser.social?.length ? (
          <SocialLinks links={organiser.social} className="mt-2" />
        ) : null}
      </div>
    </div>
  )
}
