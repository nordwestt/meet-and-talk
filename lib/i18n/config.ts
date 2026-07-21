export const locales = [
  'en',
  'da',
  'it',
  'es',
  'de',
  'fr',
  'pt',
] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeMeta: Record<
  Locale,
  { label: string; flag: string; english: string }
> = {
  en: { label: 'English', flag: '🇬🇧', english: 'English' },
  da: { label: 'Dansk', flag: '🇩🇰', english: 'Danish' },
  it: { label: 'Italiano', flag: '🇮🇹', english: 'Italian' },
  es: { label: 'Español', flag: '🇪🇸', english: 'Spanish' },
  de: { label: 'Deutsch', flag: '🇩🇪', english: 'German' },
  fr: { label: 'Français', flag: '🇫🇷', english: 'French' },
  pt: { label: 'Português', flag: '🇵🇹', english: 'Portuguese' },
}
