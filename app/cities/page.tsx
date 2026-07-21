import type { Metadata } from 'next'
import { CitiesContent } from '@/components/cities/cities-content'

export const metadata: Metadata = {
  title: 'Cities',
  description:
    'Find Meet & Talk communities across European cities. Join local groups, discover events and meet new people.',
}

export default function CitiesPage() {
  return <CitiesContent />
}
