'use client'

import { MessagesSquare } from 'lucide-react'
import Link from 'next/link'
import { SocialLinks } from '@/components/social-links'
import { cities, siteConfig, topics } from '@/lib/data'
import { useI18n } from '@/lib/i18n/context'

export function SiteFooter() {
  const { t } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-lg font-extrabold"
          >
            <span className="flex size-8 -rotate-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MessagesSquare className="size-5" />
            </span>
            Meet &amp; Talk
          </Link>
          <p className="max-w-xs text-pretty text-sm text-muted-foreground">
            {t('footer.tagline')}
          </p>
          <SocialLinks links={siteConfig.social} className="mt-1" />
        </div>

        <FooterColumn title={t('footer.explore')}>
          <FooterLink href="/cities">{t('nav.cities')}</FooterLink>
          <FooterLink href="/topics">{t('nav.topics')}</FooterLink>
          <FooterLink href="/events">{t('nav.events')}</FooterLink>
          <FooterLink href="/venues">{t('nav.venues')}</FooterLink>
        </FooterColumn>

        <FooterColumn title={t('footer.community')}>
          {cities.slice(0, 5).map((c) => (
            <FooterLink key={c.id} href={`/cities/${c.slug}`}>
              {c.name}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title={t('footer.getInvolved')}>
          <FooterLink href="/request-city">{t('cta.startCity')}</FooterLink>
          <FooterLink href="/venues">{t('cta.hostVenue')}</FooterLink>
          {topics.slice(0, 2).map((tp) => (
            <FooterLink key={tp.id} href={`/topics/${tp.slug}`}>
              {tp.name}
            </FooterLink>
          ))}
        </FooterColumn>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>
            &copy; {year} {siteConfig.name}. {t('footer.rights')}
          </p>
          <p>{siteConfig.tagline}</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-display text-sm font-bold uppercase tracking-wide">
        {title}
      </h3>
      <ul className="flex flex-col gap-2 text-sm">{children}</ul>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        {children}
      </Link>
    </li>
  )
}
