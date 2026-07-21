import type { City } from '@/lib/types'

export const cities: City[] = [
  {
    id: 'copenhagen',
    slug: 'copenhagen',
    name: 'Copenhagen',
    country: 'Denmark',
    countryFlag: '🇩🇰',
    description:
      'Hygge meets hello. Copenhagen was where Meet & Talk began — cozy bars, warm people, and dozens of languages around every table.',
    image: '/images/cities/copenhagen.svg',
    gallery: [
      '/images/community/community-1.svg',
      '/images/community/community-2.svg',
      '/images/community/community-3.svg',
    ],
    memberCount: 2400,
    timezone: 'CET',
    organiserIds: ['sofia', 'noah'],
    topicIds: ['language-exchange', 'startups', 'books'],
    social: [
      {
        platform: 'whatsapp',
        url: 'https://chat.whatsapp.com/meetandtalk-cph',
        handle: 'Copenhagen group',
      },
      { platform: 'instagram', url: 'https://instagram.com/', handle: '@meetandtalk.cph' },
      { platform: 'telegram', url: 'https://t.me/', handle: '@meetandtalkcph' },
      { platform: 'facebook', url: 'https://facebook.com/', handle: 'Meet & Talk Copenhagen' },
    ],
  },
  {
    id: 'verona',
    slug: 'verona',
    name: 'Verona',
    country: 'Italy',
    countryFlag: '🇮🇹',
    description:
      'From Juliet\u2019s balcony to buzzing osterie — Verona brings a warm Italian welcome to every language lover.',
    image: '/images/cities/verona.svg',
    gallery: [
      '/images/community/community-4.svg',
      '/images/community/community-5.svg',
      '/images/community/community-6.svg',
    ],
    memberCount: 980,
    timezone: 'CET',
    organiserIds: ['marco'],
    topicIds: ['language-exchange', 'travel-culture'],
    social: [
      {
        platform: 'whatsapp',
        url: 'https://chat.whatsapp.com/meetandtalk-verona',
        handle: 'Verona group',
      },
      { platform: 'instagram', url: 'https://instagram.com/', handle: '@meetandtalk.verona' },
    ],
  },
  {
    id: 'berlin',
    slug: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    countryFlag: '🇩🇪',
    description:
      'Loud, free and endlessly international. Berlin\u2019s Meet & Talk crowd spills across Kreuzberg\u2019s best bars every week.',
    image: '/images/cities/berlin.svg',
    gallery: [
      '/images/community/community-2.svg',
      '/images/community/community-6.svg',
      '/images/community/community-1.svg',
    ],
    memberCount: 3100,
    timezone: 'CET',
    organiserIds: ['lena'],
    topicIds: ['language-exchange', 'startups', 'travel-culture'],
    social: [
      {
        platform: 'whatsapp',
        url: 'https://chat.whatsapp.com/meetandtalk-berlin',
        handle: 'Berlin group',
      },
      { platform: 'instagram', url: 'https://instagram.com/', handle: '@meetandtalk.berlin' },
      { platform: 'discord', url: 'https://discord.gg/', handle: 'Meet & Talk Berlin' },
    ],
  },
  {
    id: 'barcelona',
    slug: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    countryFlag: '🇪🇸',
    description:
      'Sun, sea and endless conversation. Barcelona\u2019s tables mix Catalan, Spanish, English and everything in between.',
    image: '/images/cities/barcelona.svg',
    gallery: [
      '/images/community/community-3.svg',
      '/images/community/community-5.svg',
      '/images/community/community-4.svg',
    ],
    memberCount: 2650,
    timezone: 'CET',
    organiserIds: ['diego'],
    topicIds: ['language-exchange', 'travel-culture', 'books'],
    social: [
      {
        platform: 'whatsapp',
        url: 'https://chat.whatsapp.com/meetandtalk-bcn',
        handle: 'Barcelona group',
      },
      { platform: 'instagram', url: 'https://instagram.com/', handle: '@meetandtalk.bcn' },
    ],
  },
  {
    id: 'paris',
    slug: 'paris',
    name: 'Paris',
    country: 'France',
    countryFlag: '🇫🇷',
    description:
      'Apéro, accents and new friends by the canal. Paris turns language practice into an art de vivre.',
    image: '/images/cities/paris.svg',
    gallery: [
      '/images/community/community-1.svg',
      '/images/community/community-4.svg',
      '/images/community/community-6.svg',
    ],
    memberCount: 1870,
    timezone: 'CET',
    organiserIds: ['camille'],
    topicIds: ['language-exchange', 'books'],
    social: [
      {
        platform: 'whatsapp',
        url: 'https://chat.whatsapp.com/meetandtalk-paris',
        handle: 'Paris group',
      },
      { platform: 'instagram', url: 'https://instagram.com/', handle: '@meetandtalk.paris' },
    ],
  },
]
