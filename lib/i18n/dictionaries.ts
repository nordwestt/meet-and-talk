import type { Locale } from './config'
import en from './locales/en.json'
import da from './locales/da.json'
import it from './locales/it.json'

/**
 * Translation dictionaries loaded from JSON locale files.
 *
 * English is the source of truth for keys. Other locales fall back to
 * English via the `t()` helper in the i18n context for any missing key.
 */
export { en }

export type Dictionary = typeof en
export type TranslationKey = keyof Dictionary

export const dictionaries: Record<Locale, Partial<Dictionary>> = {
  en,
  da,
  it,
}
