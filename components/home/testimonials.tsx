'use client'

import Image from 'next/image'
import { Quote } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { getCity, testimonials } from '@/lib/data'
import { useI18n } from '@/lib/i18n/context'

export function Testimonials() {
  const { t } = useI18n()

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <SectionHeading
        align="center"
        eyebrow={t('testimonials.eyebrow')}
        title={t('testimonials.title')}
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item, i) => {
          const city = item.cityId ? getCity(item.cityId) : undefined
          return (
            <figure
              key={item.id}
              className={`flex flex-col gap-4 rounded-2xl border-2 border-border bg-card p-6 ${
                i % 2 === 0 ? '-rotate-sticker' : 'rotate-sticker'
              }`}
            >
              <Quote className="size-6 text-accent" />
              <blockquote className="text-pretty text-base leading-relaxed">
                {item.quote}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-2">
                <div className="relative size-10 overflow-hidden rounded-full bg-muted">
                  {item.avatar ? (
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <p className="font-display text-sm font-bold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.role}
                    {city ? ` · ${city.name}` : ''}
                  </p>
                </div>
              </figcaption>
            </figure>
          )
        })}
      </div>
    </section>
  )
}
