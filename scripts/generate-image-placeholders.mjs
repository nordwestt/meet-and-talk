import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

/** Keep in sync with lib/image-placeholders.ts */
const imagePlaceholders = [
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
    description:
      'Friends toasting at a language exchange — candid joyful moment, warm bar lighting.',
  },
  {
    path: '/images/community/community-2.svg',
    aspect: 'square',
    description:
      'Café tables with name tags — language exchange conversation, welcoming group.',
  },
  {
    path: '/images/community/community-3.svg',
    aspect: 'square',
    description: 'Startup networking meetup in a Berlin bar — casual, founders chatting.',
  },
  {
    path: '/images/community/community-4.svg',
    aspect: 'square',
    description:
      'Italian aperitivo language exchange on a Verona terrace — spritz, evening light.',
  },
  {
    path: '/images/community/community-5.svg',
    aspect: 'square',
    description: 'Book club in a Paris café — people discussing books over coffee.',
  },
  {
    path: '/images/community/community-6.svg',
    aspect: 'square',
    description:
      'Barcelona terrace gathering — diverse international crowd, vibrant social energy.',
  },
  {
    path: '/images/venues/living-room.svg',
    aspect: 'square',
    description:
      'The Living Room, Copenhagen — candle-lit café-bar with sofas, Larsbjørnsstræde.',
  },
  {
    path: '/images/venues/osteria.svg',
    aspect: 'square',
    description:
      'Osteria del Corso, Verona — warm osteria interior, local wine, near the arena.',
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
    description:
      'Portrait — Sofia Lindqvist, city lead Copenhagen, friendly multilingual organiser.',
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

const publicDir = join(process.cwd(), 'public')

const dimensions = {
  square: { w: 800, h: 800 },
  landscape: { w: 1200, h: 900 },
  portrait: { w: 900, h: 1125 },
  hero: { w: 900, h: 1125 },
}

function wrapText(text, maxChars) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > maxChars && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines.slice(0, 6)
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function svgFor(placeholder) {
  const { path, description, aspect = 'landscape' } = placeholder
  const { w, h } = dimensions[aspect] ?? dimensions.landscape
  const filename = path.split('/').pop() ?? 'image.svg'
  const lines = wrapText(description, 42)
  const lineElements = lines
    .map(
      (line, i) =>
        `<tspan x="50%" dy="${i === 0 ? 0 : 22}">${escapeXml(line)}</tspan>`,
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeXml(description)}">
  <rect width="100%" height="100%" fill="#f4f3e7"/>
  <rect x="24" y="24" width="${w - 48}" height="${h - 48}" rx="24" fill="#e8f0e8" stroke="#2d5a3d" stroke-width="3" stroke-dasharray="8 6"/>
  <text x="50%" y="${h * 0.28}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#2d5a3d" letter-spacing="0.12em">IMAGE PLACEHOLDER</text>
  <text x="50%" y="${h * 0.36}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="20" font-weight="800" fill="#1a3328">${escapeXml(filename.replace('.svg', ''))}</text>
  <text x="50%" y="${h * 0.48}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" fill="#3d5c4a">${lineElements}</text>
  <text x="50%" y="${h - 56}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" fill="#6b8f7a">Replace with real photo · same filename</text>
</svg>`
}

for (const placeholder of imagePlaceholders) {
  const filePath = join(publicDir, placeholder.path.replace(/^\//, ''))
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, svgFor(placeholder), 'utf8')
  console.log('wrote', filePath)
}

console.log(`\n${imagePlaceholders.length} placeholders written.`)
