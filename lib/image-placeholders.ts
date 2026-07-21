/**
 * Image placeholder registry.
 * Replace each SVG in public/images/ with a real photo using the same filename.
 */

export type ImagePlaceholder = {
  path: string
  description: string
  aspect?: 'square' | 'landscape' | 'portrait' | 'hero'
}

export const imagePlaceholders: ImagePlaceholder[] = [
  {
    path: '/images/hero-meetup.svg',
    aspect: 'portrait',
    description:
      'Warm cozy bar meetup at night — diverse group laughing over drinks at wooden tables, amber lighting, urban European café-bar.',
  },
  {
    path: '/images/cities/copenhagen.svg',
    aspect: 'landscape',
    description:
      'Copenhagen golden hour — Nyhavn colourful houses, cozy café terraces, hygge community vibe.',
  },
  {
    path: '/images/cities/verona.svg',
    aspect: 'landscape',
    description:
      'Verona old town — charming osteria terrace, warm Italian evening, aperitivo atmosphere.',
  },
  {
    path: '/images/cities/berlin.svg',
    aspect: 'landscape',
    description:
      'Berlin Kreuzberg — street bar at night, international crowd, urban gritty-but-warm energy.',
  },
  {
    path: '/images/cities/barcelona.svg',
    aspect: 'landscape',
    description:
      'Barcelona Gothic Quarter — terrace bar at sunset, tiled walls, vermouth, lively terrace.',
  },
  {
    path: '/images/cities/paris.svg',
    aspect: 'landscape',
    description:
      'Paris Canal Saint-Martin — café terrace at golden hour, apéro hour, outdoor tables.',
  },
  {
    path: '/images/community/community-1.svg',
    aspect: 'square',
    description: 'Friends toasting at a language exchange — candid joyful moment, warm bar lighting.',
  },
  {
    path: '/images/community/community-2.svg',
    aspect: 'square',
    description: 'Café tables with name tags — language exchange conversation, welcoming group.',
  },
  {
    path: '/images/community/community-3.svg',
    aspect: 'square',
    description: 'Startup networking meetup in a Berlin bar — casual, founders chatting.',
  },
  {
    path: '/images/community/community-4.svg',
    aspect: 'square',
    description: 'Italian aperitivo language exchange on a Verona terrace — spritz, evening light.',
  },
  {
    path: '/images/community/community-5.svg',
    aspect: 'square',
    description: 'Book club in a Paris café — people discussing books over coffee.',
  },
  {
    path: '/images/community/community-6.svg',
    aspect: 'square',
    description: 'Barcelona terrace gathering — diverse international crowd, vibrant social energy.',
  },
  {
    path: '/images/venues/living-room.svg',
    aspect: 'square',
    description: 'The Living Room, Copenhagen — candle-lit café-bar with sofas, Larsbjørnsstræde.',
  },
  {
    path: '/images/venues/osteria.svg',
    aspect: 'square',
    description: 'Osteria del Corso, Verona — warm osteria interior, local wine, near the arena.',
  },
  {
    path: '/images/venues/kneipe.svg',
    aspect: 'square',
    description: 'Zur Kneipe, Berlin Kreuzberg — classic kneipe, big tables, cheap beer.',
  },
  {
    path: '/images/venues/bar-born.svg',
    aspect: 'square',
    description: 'Bar del Born, Barcelona — tiled walls, vermouth on tap, buzzing terrace.',
  },
  {
    path: '/images/venues/cafe-canal.svg',
    aspect: 'square',
    description: 'Café du Canal, Paris — canal-side café, apéro hour, Quai de Valmy.',
  },
  {
    path: '/images/people/sofia.svg',
    aspect: 'square',
    description: 'Portrait — Sofia Lindqvist, city lead Copenhagen, friendly multilingual organiser.',
  },
  {
    path: '/images/people/marco.svg',
    aspect: 'square',
    description: 'Portrait — Marco Bellini, city lead Verona, warm Italian host.',
  },
  {
    path: '/images/people/lena.svg',
    aspect: 'square',
    description: 'Portrait — Lena Hoffmann, city lead Berlin, energetic community organiser.',
  },
  {
    path: '/images/people/diego.svg',
    aspect: 'square',
    description: 'Portrait — Diego Herrera, city lead Barcelona, welcoming Catalan host.',
  },
  {
    path: '/images/people/camille.svg',
    aspect: 'square',
    description: 'Portrait — Camille Laurent, city lead Paris, expressive language enthusiast.',
  },
  {
    path: '/images/people/noah.svg',
    aspect: 'square',
    description: 'Portrait — Noah Andersen, co-organiser Copenhagen, friendly door greeter.',
  },
]
