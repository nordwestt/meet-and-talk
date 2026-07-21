'use client'

import { QRCodeSVG } from 'qrcode.react'
import { useI18n } from '@/lib/i18n/context'
import type { SocialLink } from '@/lib/types'

export function WhatsappJoin({
  link,
}: {
  link: SocialLink
}) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-border bg-card p-6 sm:flex-row sm:items-start">
      <div className="rounded-xl border-2 border-border bg-white p-3">
        <QRCodeSVG value={link.url} size={128} />
      </div>
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <p className="font-display text-lg font-bold">{t('detail.scanQr')}</p>
        <p className="text-sm text-muted-foreground">{link.handle}</p>
        <a
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {t('detail.joinWhatsapp')}
        </a>
      </div>
    </div>
  )
}
