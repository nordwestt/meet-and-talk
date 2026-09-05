'use client'

import Image from 'next/image'
import { SocialLinks } from '@/components/social-links'
import { useI18n } from '@/lib/i18n/context'
import type { Organiser } from '@/lib/types'

export function OrganiserCard({ organiser }: { organiser: Organiser }) {
  const { tc } = useI18n()
  const role = organiser.role
    ? tc(`organiser.${organiser.id}.role`, organiser.role)
    : null
  const bio = organiser.bio
    ? tc(`organiser.${organiser.id}.bio`, organiser.bio)
    : null

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
        {role ? <p className="text-sm text-primary">{role}</p> : null}
        {bio ? <p className="text-sm text-muted-foreground">{bio}</p> : null}
        {organiser.social?.length ? (
          <SocialLinks links={organiser.social} className="mt-2" />
        ) : null}
      </div>
    </div>
  )
}
