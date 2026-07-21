import type { MeetEvent } from '@/lib/types'

export const events: MeetEvent[] = [

  {
    id: 'cph-lang-tue',
    slug: 'copenhagen-language-exchange-tuesday',
    title: 'Wednesday Language Exchange',
    cityId: 'copenhagen',
    venueId: 'the-living-room-cph',
    topicId: 'language-exchange',
    organiserIds: ['gabriele'],
    languages: [
      { code: 'en', label: 'English' },
      { code: 'it', label: 'Italian' },
      { code: 'da', label: 'Danish' },
      { code: 'es', label: 'Spanish' },
      { code: 'de', label: 'German' },
      { code: 'fr', label: 'French' },

    ],
    date: '2026-07-22',
    time: '18:30',
    recurring: 'Wednesday',
    description:
      'Grab a name tag, find a table by language level, and switch every 20 minutes. Newcomers always welcome.',
    capacity: 60,
    going: 47,
    image: '/images/community/community-1.png',
    price: 'Free',
  },
  {
    id: 'tre-lang-tue',
    slug: 'trento-language-exchange-tuesday',
    title: 'Tuesday Travel and Culture',
    cityId: 'trento',
    venueId: 'green-bar-trento-centro',
    topicId: 'travel-culture',
    organiserIds: ['gabriele'],
    languages: [
      { code: 'en', label: 'English' },
      { code: 'it', label: 'Italian' },
      { code: 'da', label: 'Danish' },
      { code: 'es', label: 'Spanish' },
      { code: 'de', label: 'German' },
      { code: 'fr', label: 'French' },

    ],
    date: '2026-07-28',
    time: '18:30',
    recurring: 'Tuesday',
    description:
      'Grab a name tag, find a table by language level, and switch every 20 minutes. Newcomers always welcome.',
    capacity: 60,
    going: 54,
    image: '/images/community/community-2.png',
    price: 'Free',
  },
  {
    id: 'cph-lang-fri',
    slug: 'copenhagen-language-exchange-tuesday',
    title: 'Friday Language Exchange',
    cityId: 'copenhagen',
    venueId: 'the-living-room-cph',
    topicId: 'language-exchange',
    organiserIds: ['gabriele'],
    languages: [
      { code: 'en', label: 'English' },
      { code: 'it', label: 'Italian' },
      { code: 'da', label: 'Danish' },
      { code: 'es', label: 'Spanish' },
      { code: 'de', label: 'German' },
      { code: 'fr', label: 'French' },

    ],
    date: '2026-07-24',
    time: '18:30',
    recurring: 'Friday',
    description:
      'Grab a name tag, find a table by language level, and switch every 20 minutes. Newcomers always welcome.',
    capacity: 60,
    going: 31,
    image: '/images/venues/paludan.png',
    price: 'Free',
  },
]
