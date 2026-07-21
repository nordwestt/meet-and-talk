import type { City } from '@/lib/types'

export const cities: City[] = [
  {
    id: 'trento',
    slug: 'trento',
    name: 'Trento',
    country: 'Italy',
    countryFlag: '🇮🇹',
    status: 'live',
    description:
      'Where Meet & Talk began — a welcoming crowd of locals and internationals practising languages over aperitivo in the Dolomites\u2019 gateway city.',
    image: '/images/cities/trento.png',
    gallery: [
      '/images/community/trento-1.png',
      '/images/community/trento-2.png',
    ],
    memberCount: 515,
    timezone: 'CET',
    organiserIds: ['gabriele'],
    topicIds: ['language-exchange'],
    social: [
      {
        platform: 'whatsapp',
        url: 'https://chat.whatsapp.com/HTTpyIo9nfxKP9wMpUWd1D',
        handle: 'WhatsApp Trento',
      },
      { platform: 'instagram', url: 'https://www.instagram.com/meetandtalk.trento', handle: 'meetandtalk.trento' },
    ],
  },
  {
    id: 'copenhagen',
    slug: 'copenhagen',
    name: 'Copenhagen',
    country: 'Denmark',
    countryFlag: '🇩🇰',
    status: 'live',
    description:
      'Hygge meets hello — cozy bars, warm people, and dozens of languages around every table in our Danish home.',
    image: '/images/cities/copenhagen.png',
    gallery: [
      '/images/community/community-1.png',
      '/images/community/community-2.png',
      '/images/community/community-3.svg',
    ],
    memberCount: 34,
    timezone: 'CET',
    organiserIds: ['gabriele'],
    topicIds: ['language-exchange'],
    social: [
      {
        platform: 'whatsapp',
        url: 'https://chat.whatsapp.com/LZ1QrUMUyE3BzI1QTqzhGp',
        handle: 'WhatsApp Copenhagen',
      },
      { platform: 'instagram', url: 'https://instagram.com/', handle: '@meetandtalk.cph' },
      { platform: 'telegram', url: 'https://t.me/', handle: '@meetandtalkcph' },
    ],
  },
  {
    id: 'bolzano',
    slug: 'bolzano',
    name: 'Bolzano',
    country: 'Italy',
    countryFlag: '🇮🇹',
    status: 'planned',
    description:
      'We\u2019re building interest for a Bolzano language exchange — join the waitlist and be first to know when we launch.',
    image: '/images/cities/bolzano.png',
    timezone: 'CET',
    organiserIds: [],
    topicIds: ['language-exchange'],
    social: [
      {
        platform: 'whatsapp',
        url: 'https://chat.whatsapp.com/meetandtalk-bolzano-waitlist',
        handle: 'Bolzano waitlist',
      },
    ],
  },
  {
    id: 'barcelona',
    slug: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    countryFlag: '🇪🇸',
    status: 'planned',
    description:
      'Sun, sea and endless conversation — Barcelona is on the roadmap. Join the group to follow our progress.',
    image: '/images/cities/barcelona.png',
    timezone: 'CET',
    organiserIds: [],
    topicIds: ['language-exchange'],
    social: [
      {
        platform: 'whatsapp',
        url: 'https://chat.whatsapp.com/meetandtalk-bcn-waitlist',
        handle: 'Barcelona waitlist',
      },
    ],
  },
  {
    id: 'paris',
    slug: 'paris',
    name: 'Paris',
    country: 'France',
    countryFlag: '🇫🇷',
    status: 'planned',
    description:
      'Apéro by the canal, accents and new friends — Paris is coming. Join the waitlist to stay in the loop.',
    image: '/images/cities/paris.png',
    timezone: 'CET',
    organiserIds: [],
    topicIds: ['language-exchange'],
    social: [
      {
        platform: 'whatsapp',
        url: 'https://chat.whatsapp.com/meetandtalk-paris-waitlist',
        handle: 'Paris waitlist',
      },
    ],
  },
]
