import type { Venue } from '@/lib/types'

export const venues: Venue[] = [
  {
    id: 'green-bar-trento-centro',
    name: 'Green Bar',
    cityId: 'trento',
    address: 'Via Gocciadoro, 44, 38122 Trento TN',
    description: 'A green bar — our first home for Meet & Talk.',
    capacity: 70,
    image: '/images/venues/green-bar.png',
  },
  {
    id: 'the-living-room-cph',
    name: 'Paludan Bog&Café',
    cityId: 'copenhagen',
    address: 'Fiolstraede 10-12, Copenhagen, DK',
    description: 'A candle-lit café-bar with sofas made for long conversations.',
    capacity: 120,
    image: '/images/venues/paludan.png',
  },
]
