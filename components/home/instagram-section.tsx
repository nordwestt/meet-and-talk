'use client'

import Image from 'next/image'
import Link from 'next/link'
import { SocialIcon } from '@/components/icons/social-icon'
import { SectionHeading } from '@/components/section-heading'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/lib/data'
import { useI18n } from '@/lib/i18n/context'

const galleryImages = [
  '/images/community/community-1.png',
  '/images/community/community-2.png',
  '/images/community/community-3.svg',
  '/images/community/community-4.svg',
  '/images/community/community-5.svg',
  '/images/community/community-6.svg',
]

export function InstagramSection() {
  const { t } = useI18n()
  const instagram = siteConfig.social.find((s) => s.platform === 'instagram')

  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <SectionHeading
          align="center"
          title={t('section.instagram.title')}
          subtitle={t('section.instagram.subtitle')}
        />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {galleryImages.map((src, i) => (
            <div
              key={src}
              className={`relative aspect-square overflow-hidden rounded-2xl border-2 border-border ${
                i % 2 === 0 ? 'rotate-sticker' : '-rotate-sticker'
              }`}
            >
              <Image
                src={src}
                alt={`Meet & Talk community moment ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 16vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
        {instagram ? (
          <div className="mt-8 flex justify-center">
            <Button asChild variant="outline" className="gap-2">
              <Link href={instagram.url} target="_blank" rel="noreferrer">
                <SocialIcon platform="instagram" className="size-4" />
                {instagram.handle}
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
