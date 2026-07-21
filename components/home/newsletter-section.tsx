'use client'

import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import { toast } from 'sonner'
import { SectionHeading } from '@/components/section-heading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/lib/i18n/context'

export function NewsletterSection() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    toast.success(t('newsletter.success'))
    setEmail('')
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-card p-8 sm:p-12">
        <div className="absolute -right-8 -top-8 size-32 rounded-full bg-secondary/60 blur-2xl" />
        <div className="relative flex flex-col items-center gap-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Mail className="size-7" />
          </div>
          <SectionHeading
            align="center"
            title={t('section.newsletter.title')}
            subtitle={t('section.newsletter.subtitle')}
          />
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
          >
            <Input
              type="email"
              required
              placeholder={t('newsletter.placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 flex-1 border-2"
            />
            <Button type="submit" size="lg" className="gap-2">
              {t('newsletter.button')}
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
