import type { Venue } from '@/lib/types'

export const venues: Venue[] = [
  {
    id: 'the-living-room-cph',
    name: 'The Living Room',
    cityId: 'copenhagen',
    address: 'Larsbjørnsstræde 17, 1454 København',
    description: 'A candle-lit café-bar with sofas made for long conversations.',
    capacity: 60,
    image: '/images/venues/living-room.svg',
  },
  {
    id: 'osteria-del-corso',
    name: 'Osteria del Corso',
    cityId: 'verona',
    address: 'Corso Porta Borsari 32, 37121 Verona',
    description: 'A warm osteria pouring local wine steps from the arena.',
    capacity: 45,
    image: '/images/venues/osteria.svg',
  },
  {
    id: 'zur-kneipe',
    name: 'Zur Kneipe',
    cityId: 'berlin',
    address: 'Oranienstraße 4, 10997 Berlin',
    description: 'A Kreuzberg institution with cheap beer and big tables.',
    capacity: 80,
    image: '/images/venues/kneipe.svg',
  },
  {
    id: 'bar-marsella',
    name: 'Bar del Born',
    cityId: 'barcelona',
    address: 'Passeig del Born 19, 08003 Barcelona',
    description: 'Tiled walls, vermouth on tap, and a buzzing terrace.',
    capacity: 55,
    image: '/images/venues/bar-born.svg',
  },
  {
    id: 'cafe-canal',
    name: 'Café du Canal',
    cityId: 'paris',
    address: 'Quai de Valmy 55, 75010 Paris',
    description: 'A canal-side café where the apéro hour never really ends.',
    capacity: 50,
    image: '/images/venues/cafe-canal.svg',
  },
]
