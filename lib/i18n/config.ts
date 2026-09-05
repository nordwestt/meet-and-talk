export const locales = ['en', 'da', 'it'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeMeta: Record<
  Locale,
  { label: string; flag: string; english: string }
> = {
  en: { label: 'English', flag: '🇬🇧', english: 'English' },
  da: { label: 'Dansk', flag: '🇩🇰', english: 'Danish' },
  it: { label: 'Italiano', flag: '🇮🇹', english: 'Italian' },
}
