import { cn } from '@/lib/utils'
import type { SocialLink } from '@/lib/types'
import { SocialIcon, socialLabels } from '@/components/icons/social-icon'

export function SocialLinks({
  links,
  variant = 'icon',
  className,
}: {
  links: SocialLink[]
  variant?: 'icon' | 'labeled'
  className?: string
}) {
  if (!links?.length) return null

  if (variant === 'labeled') {
    return (
      <ul className={cn('flex flex-col gap-2', className)}>
        {links.map((link) => (
          <li key={`${link.platform}-${link.url}`}>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-muted"
            >
              <SocialIcon platform={link.platform} className="size-4 text-primary" />
              <span>{link.handle ?? socialLabels[link.platform]}</span>
            </a>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)}>
      {links.map((link) => (
        <li key={`${link.platform}-${link.url}`}>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            aria-label={link.handle ?? socialLabels[link.platform]}
            title={link.handle ?? socialLabels[link.platform]}
            className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <SocialIcon platform={link.platform} className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  )
}
