'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useI18n } from '@/lib/i18n/context'

type RequestFormProps = {
  variant: 'city' | 'venue'
}

export function RequestForm({ variant }: RequestFormProps) {
  const { t } = useI18n()
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 600))
    toast.success(
      variant === 'city' ? t('form.citySuccess') : t('form.venueSuccess'),
    )
    setSubmitting(false)
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">{t('form.name')}</Label>
          <Input id="name" name="name" required className="border-2" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{t('form.email')}</Label>
          <Input id="email" name="email" type="email" required className="border-2" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="city">{t('form.city')}</Label>
          <Input id="city" name="city" required className="border-2" />
        </div>
        {variant === 'venue' ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="venueName">{t('form.venueName')}</Label>
            <Input id="venueName" name="venueName" required className="border-2" />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">{t('form.phone')}</Label>
            <Input id="phone" name="phone" type="tel" className="border-2" />
          </div>
        )}
      </div>

      {variant === 'venue' ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="capacity">{t('form.capacity')}</Label>
            <Input id="capacity" name="capacity" type="number" min={1} className="border-2" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="weekdays">{t('form.weekdays')}</Label>
            <Input id="weekdays" name="weekdays" placeholder="e.g. Tuesday, Thursday" className="border-2" />
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">{t('form.message')}</Label>
        <Textarea id="message" name="message" rows={4} className="border-2" />
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="w-fit">
        {t('form.submit')}
      </Button>
    </form>
  )
}
