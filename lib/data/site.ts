import type { SocialLink } from '@/lib/types'

export const siteConfig = {
  name: 'Meet & Talk',
  tagline: 'Come as you are. Meet someone new.',
  description:
    'A grassroots community that brings people together in bars and cafés to practice languages and make real friends.',
  founded: 2023,
  stats: {
    cities: '5+',
    members: '11k+',
    events: '40+',
  },
  /** Global social links (city pages override with their own) */
  social: [
    { platform: 'instagram', url: 'https://instagram.com/', handle: '@meetandtalk' },
    { platform: 'whatsapp', url: 'https://chat.whatsapp.com/meetandtalk', handle: 'Community chat' },
    { platform: 'telegram', url: 'https://t.me/', handle: '@meetandtalk' },
    { platform: 'email', url: 'mailto:hello@meetandtalk.community', handle: 'hello@meetandtalk.community' },
  ] satisfies SocialLink[],
}

export type NavItem = { key: string; href: string }

export const mainNav: NavItem[] = [
  { key: 'nav.cities', href: '/cities' },
  { key: 'nav.topics', href: '/topics' },
  { key: 'nav.events', href: '/events' },
  { key: 'nav.venues', href: '/venues' },
]
