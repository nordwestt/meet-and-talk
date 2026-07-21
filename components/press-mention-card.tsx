'use client'

import Link from 'next/link'
import { ExternalLink, Newspaper } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n/context'
import type { PressMention } from '@/lib/types'

export function PressMentionCard({
  item,
  compact = false,
}: {
  item: PressMention
  compact?: boolean
}) {
  const { t } = useI18n()
  const formattedDate = item.date
    ? new Date(`${item.date}T00:00:00`).toLocaleDateString('en-GB', {
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col gap-4 rounded-2xl border-2 border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <Newspaper className="size-5" aria-hidden="true" />
        </div>
        <Badge variant="outline" className="shrink-0 gap-1">
          {item.outlet}
          <ExternalLink className="size-3 opacity-60" aria-hidden="true" />
        </Badge>
      </div>

      <div className="flex flex-col gap-2">
        <h3
          className={`font-display font-bold leading-snug group-hover:text-primary ${compact ? 'text-lg' : 'text-xl'}`}
        >
          {item.title}
        </h3>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          {item.excerpt}
        </p>
      </div>

      <p className="mt-auto text-xs font-medium text-muted-foreground">
        {item.author ? `${item.author}` : null}
        {item.author && formattedDate ? ' · ' : null}
        {formattedDate}
      </p>

      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
        {t('press.readArticle')}
        <ExternalLink className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </a>
  )
}

/** Inline callout for city pages */
export function PressCallout({ item }: { item: PressMention }) {
  return (
    <div className="rounded-2xl border-2 border-border bg-secondary/25 p-5">
      <p className="mb-2 font-display text-sm font-bold uppercase tracking-widest text-primary">
        In the press
      </p>
      <p className="mb-3 text-pretty text-sm leading-relaxed text-muted-foreground">
        &ldquo;{item.excerpt}&rdquo;
      </p>
      <Link
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
      >
        {item.outlet} — {item.title}
        <ExternalLink className="size-3.5" aria-hidden="true" />
      </Link>
    </div>
  )
}
