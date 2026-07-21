'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cities } from '@/lib/data'
import { useI18n } from '@/lib/i18n/context'

export function Hero() {
  const { t } = useI18n()
  const liveCities = cities.filter(x=>x.status == 'live').length

  return (
    <section className="relative overflow-hidden border-b border-border bg-grain">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-border bg-card px-3 py-1 text-sm font-bold">
            <Sparkles className="size-4 text-accent" />
            {t('hero.badge')}
          </span>
          <h1 className="text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="max-w-xl text-pretty text-lg text-muted-foreground">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="gap-2 text-base">
              <Link href="/cities">
                {t('hero.cta.primary')}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 text-base">
              <Link href="/events">{t('hero.cta.secondary')}</Link>
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <MapPin className="size-4 text-primary" />
            {t('hero.cities.count').replace('{count}', String(liveCities))}
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border-2 border-border shadow-[8px_8px_0_0_hsl(var(--primary))]">
            <Image
              src="/images/hero-meetup.png"
              alt="Friends chatting and laughing together at a Meet & Talk meetup in a cozy bar"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 rotate-sticker rounded-2xl border-2 border-border bg-secondary px-4 py-2 text-secondary-foreground shadow-md">
            <p className="font-display text-sm font-bold">{t('hero.sticker')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
