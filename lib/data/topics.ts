import type { Topic } from '@/lib/types'

export const topics: Topic[] = [
  {
    id: 'language-exchange',
    slug: 'language-exchange',
    name: 'Language Exchange',
    tagline: 'Practice languages over a drink',
    description:
      'Our flagship. Meet locals and internationals to practice languages in a relaxed, no-pressure setting. Swap tables, swap tongues, make friends.',
    icon: 'MessagesSquare',
    color: 'var(--chart-1)',
    status: 'live',
  },
  {
    id: 'startups',
    slug: 'startups-entrepreneurship',
    name: 'Startups & Entrepreneurship',
    tagline: 'Founders, builders & dreamers',
    description:
      'Trade ideas, find co-founders, and swap war stories with local founders and creative builders over coffee or a cold one.',
    icon: 'Rocket',
    color: 'var(--chart-2)',
    status: 'soon',
  },
  {
    id: 'travel-culture',
    slug: 'travel-culture',
    name: 'Travel & Culture',
    tagline: 'Stories from the road',
    description:
      'For the curious and the nomadic. Share travel tales, cultural quirks, and hidden gems from around the world.',
    icon: 'Globe2',
    color: 'var(--chart-4)',
    status: 'soon',
  },
  {
    id: 'books',
    slug: 'books',
    name: 'Books',
    tagline: 'Readers unite',
    description:
      'A friendly book circle for people who love to read and to talk about what they read — across genres and languages.',
    icon: 'BookOpen',
    color: 'var(--chart-5)',
    status: 'soon',
  },
  {
    id: 'ai-tech',
    slug: 'ai-technology',
    name: 'AI & Technology',
    tagline: 'Nerd out, in good company',
    description:
      'From machine learning to the latest gadgets — a space for tech-curious minds to meet, demo and debate.',
    icon: 'Cpu',
    color: 'var(--chart-2)',
    status: 'soon',
  },
  {
    id: 'networking',
    slug: 'networking',
    name: 'Networking',
    tagline: 'Real connections, no lanyards',
    description:
      'Meet people across industries in a warm, human way. Career moves start with a good conversation.',
    icon: 'Handshake',
    color: 'var(--chart-1)',
    status: 'soon',
  },
  {
    id: 'board-games',
    slug: 'board-games',
    name: 'Board Games',
    tagline: 'Roll the dice, meet the table',
    description:
      'Casual games nights that break the ice fast. Bring a game or learn a new one with the group.',
    icon: 'Dices',
    color: 'var(--chart-4)',
    status: 'soon',
  },
  {
    id: 'photography',
    slug: 'photography',
    name: 'Photography',
    tagline: 'Photo walks & good light',
    description:
      'Explore the city through a lens with fellow photographers, from phone shooters to film purists.',
    icon: 'Camera',
    color: 'var(--chart-5)',
    status: 'soon',
  },
]
