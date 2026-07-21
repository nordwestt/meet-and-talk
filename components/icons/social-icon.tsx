import { Globe, Mail, Users } from 'lucide-react'
import type { SocialPlatform } from '@/lib/types'

type IconProps = { className?: string }

/* Minimal, recognizable brand glyphs (lucide dropped brand icons). */

function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.69 8.24-8.06 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  )
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
    </svg>
  )
}

function TelegramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.94 4.6 18.9 19.02c-.23 1.01-.83 1.26-1.68.79l-4.64-3.42-2.24 2.16c-.25.25-.46.46-.94.46l.33-4.73 8.62-7.79c.37-.33-.08-.52-.58-.19l-10.66 6.71-4.59-1.44c-1-.31-1.02-1 .21-1.48l17.94-6.92c.83-.31 1.56.2 1.29 1.42Z" />
    </svg>
  )
}

function DiscordIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.32 4.94A17.9 17.9 0 0 0 15.9 3.6l-.22.4c1.5.37 2.19.9 2.92 1.56a12.7 12.7 0 0 0-4.6-1.02c-1.5-.03-3 .1-4.55.53-.9.28-2.15.72-3.55 1.79 0 0 1.14-1.07 3.04-1.71l-.16-.19s-1.86.06-3.87 1.57c0 0-2.01 3.64-2.01 8.13 0 0 1.17 2.02 4.26 2.12 0 0 .52-.62.94-1.15-1.77-.53-2.44-1.65-2.44-1.65s.14.1.39.24l.06.04c1.9 1.06 4.62 1.4 7.1.42.44-.16.92-.4 1.44-.74 0 0-.7 1.15-2.53 1.66.42.53.93 1.13.93 1.13 3.1-.1 4.29-2.12 4.29-2.11 0-4.49-2.01-8.13-2.01-8.13ZM9.68 13.6c-.79 0-1.44-.72-1.44-1.61 0-.89.63-1.61 1.44-1.61.8 0 1.45.72 1.44 1.61 0 .89-.64 1.61-1.44 1.61Zm4.75 0c-.79 0-1.44-.72-1.44-1.61 0-.89.63-1.61 1.44-1.61.8 0 1.45.72 1.44 1.61 0 .89-.64 1.61-1.44 1.61Z" />
    </svg>
  )
}

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.9 3.78-3.9 1.09 0 2.24.19 2.24.19v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94Z" />
    </svg>
  )
}

const brandMap: Partial<Record<SocialPlatform, (p: IconProps) => React.ReactNode>> = {
  whatsapp: WhatsAppIcon,
  instagram: InstagramIcon,
  telegram: TelegramIcon,
  discord: DiscordIcon,
  facebook: FacebookIcon,
}

export function SocialIcon({
  platform,
  className,
}: {
  platform: SocialPlatform
  className?: string
}) {
  const Brand = brandMap[platform]
  if (Brand) return <>{Brand({ className })}</>
  if (platform === 'email') return <Mail className={className} aria-hidden="true" />
  if (platform === 'meetup') return <Users className={className} aria-hidden="true" />
  return <Globe className={className} aria-hidden="true" />
}

export const socialLabels: Record<SocialPlatform, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  telegram: 'Telegram',
  discord: 'Discord',
  facebook: 'Facebook',
  meetup: 'Meetup',
  website: 'Website',
  email: 'Email',
}
