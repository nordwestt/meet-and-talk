import type { Organiser } from '@/lib/types'

export const organisers: Organiser[] = [
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
    id: 'marco',
    name: 'Marco Bellini',
    role: 'City lead · Verona',
    bio: 'Born and raised in Verona. Believes the best way to learn a language is with a spritz in hand.',
    avatar: '/images/people/marco.svg',
    cityIds: ['verona'],
    social: [
      { platform: 'instagram', url: 'https://instagram.com/', handle: '@marco.verona' },
    ],
  },
  {
    id: 'lena',
    name: 'Lena Hoffmann',
    role: 'City lead · Berlin',
    bio: 'Berliner by choice. Runs three meetups a week and still has energy for karaoke afterward.',
    avatar: '/images/people/lena.svg',
    cityIds: ['berlin'],
  },
  {
    id: 'diego',
    name: 'Diego Herrera',
    role: 'City lead · Barcelona',
    bio: 'Catalan host who turns strangers into a table full of friends within minutes.',
    avatar: '/images/people/diego.svg',
    cityIds: ['barcelona'],
  },
  {
    id: 'camille',
    name: 'Camille Laurent',
    role: 'City lead · Paris',
    bio: 'Parisian language nerd. Speaks with her hands as much as her words.',
    avatar: '/images/people/camille.svg',
    cityIds: ['paris'],
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
