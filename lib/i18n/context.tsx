'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { defaultLocale, locales, type Locale } from './config'
import { dictionaries, en, type TranslationKey } from './dictionaries'

type Replacements = Record<string, string | number>

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  /** Look up a typed UI string; supports `{name}` placeholders. */
  t: (key: TranslationKey, replacements?: Replacements) => string
  /**
   * Look up a content string by free-form key (e.g. `city.trento.description`),
   * falling back to the CMS/default value when untranslated.
   */
  tc: (key: string, fallback: string, replacements?: Replacements) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const STORAGE_KEY = 'mt-locale'

function applyReplacements(value: string, replacements?: Replacements) {
  if (!replacements) return value
  return Object.entries(replacements).reduce(
    (text, [token, next]) => text.replaceAll(`{${token}}`, String(next)),
    value,
  )
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored && locales.includes(stored)) {
      setLocaleState(stored)
    }
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
    document.documentElement.lang = next
  }, [])

  const t = useCallback(
    (key: TranslationKey, replacements?: Replacements) => {
      const value = dictionaries[locale]?.[key] ?? en[key] ?? key
      return applyReplacements(value, replacements)
    },
    [locale],
  )

  const tc = useCallback(
    (key: string, fallback: string, replacements?: Replacements) => {
      const dict = dictionaries[locale] as Record<string, string | undefined>
      const english = en as Record<string, string | undefined>
      const value = dict[key] ?? english[key] ?? fallback
      return applyReplacements(value, replacements)
    },
    [locale],
  )

  const value = useMemo(
    () => ({ locale, setLocale, t, tc }),
    [locale, setLocale, t, tc],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return ctx
}
