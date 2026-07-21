import type { Organiser } from '@/lib/types'

export const organisers: Organiser[] = [
  {
    id: 'gabriele',
    name: 'Gabriele',
    role: 'City lead · Trento',
    bio: 'Born and raised in Trentino. Started Meet & Talk here and believes the best idea and the best way to learn languages is with good company and an aperitivo.',
    avatar: '/images/people/gabriele.png',
    cityIds: ['trento'],
    social: [
    ],
  },
  {
    id: 'sofia',
    name: 'Sofia Lindqvist',
    role: 'City lead · Copenhagen',
    bio: 'Swedish-Danish, fluent in four languages and always hunting for the coziest bars in town.',
    avatar: '/images/people/sofia.svg',
    cityIds: ['copenhagen'],
    social: [
      { platform: 'instagram', url: 'https://instagram.com/', handle: '@sofia.talks' },
    ],
  },
  {
    id: 'noah',
    name: 'Noah Andersen',
    role: 'Co-organiser · Copenhagen',
    bio: 'The friendly face at the door making sure nobody stands alone.',
    avatar: '/images/people/noah.svg',
    cityIds: ['copenhagen'],
  },
]
