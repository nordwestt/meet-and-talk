'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { createLookups, type ContentLookups } from '@/lib/content/lookups'
import type { ContentBundle } from '@/lib/content/types'

const ContentContext = createContext<ContentLookups | null>(null)

export function ContentProvider({
  bundle,
  children,
}: {
  bundle: ContentBundle
  children: ReactNode
}) {
  const value = useMemo(() => createLookups(bundle), [bundle])
  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  )
}

export function useContent(): ContentLookups {
  const ctx = useContext(ContentContext)
  if (!ctx) {
    throw new Error('useContent must be used within ContentProvider')
  }
  return ctx
}
