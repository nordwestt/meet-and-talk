import type { PressMention } from '@/lib/types'

export const pressMentions: PressMention[] = [
  {
    id: 'sanbaradio-trento-2026',
    title: 'Meet & Talk a Trento: è arrivato il Language Aperitivo!',
    excerpt:
      'Katia Divina writes about finally finding an informal place in Trento to meet people and practice English and German — born from the idea of Gabriele Casagranda and Paolo Pelizzari.',
    url: 'https://www.sanbaradio.it/meet-and-talk-trento/',
    outlet: 'SanbaRadio',
    author: 'Katia Divina',
    date: '2026-05-04',
    cityId: 'trento',
  },
]

export function getPressByCity(cityId: string): PressMention[] {
  return pressMentions.filter((item) => item.cityId === cityId)
}
