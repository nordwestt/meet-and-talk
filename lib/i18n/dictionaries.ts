import type { Locale } from './config'

/**
 * Translation dictionary.
 *
 * English is fully populated. Every other locale is defined as a
 * Partial<Dictionary>, so untranslated keys automatically fall back to
 * English via the `t()` helper in the i18n context. To localise the site,
 * simply fill in keys for the relevant locale below — no other code changes
 * are required.
 */
export const en = {
  'nav.cities': 'Cities',
  'nav.topics': 'Topics',
  'nav.events': 'Events',
  'nav.venues': 'For Venues',
  'nav.requestCity': 'Request your city',
  'nav.joinWhatsapp': 'Join WhatsApp',

  'cta.joinCity': 'Join your city',
  'cta.findEvent': 'Find an event',
  'cta.joinWhatsapp': 'Join WhatsApp',
  'cta.startCity': 'Start Meet & Talk in my city',
  'cta.hostVenue': 'Host Meet & Talk at my venue',
  'cta.viewAll': 'View all',
  'cta.title': "Don't see your city yet?",
  'cta.subtitle':
    "Tell us where you are and we'll help you bring Meet & Talk to your neighbourhood.",
  'cta.primary': 'Browse cities',
  'cta.secondary': 'Request your city',

  'testimonials.eyebrow': 'Community',
  'testimonials.title': 'People, not profiles',

  'press.eyebrow': 'In the press',
  'press.title': 'Real community, real stories',
  'press.subtitle':
    'Local media have already noticed what\u2019s happening at our tables.',
  'press.readArticle': 'Read the article',
  'press.inThePress': 'In the press',

  'hero.badge': 'Come as you are. Meet someone new.',
  'hero.title': 'Meet people. Practice languages. Discover your city.',
  'hero.subtitle':
    'Meet & Talk brings people together in bars and cafés to practice languages and make real friends. No classrooms, no pressure — just good company and great conversation.',
  'hero.cta.primary': 'Join your city',
  'hero.cta.secondary': 'Find an event',
  'hero.cities.count': '{count} cities and growing',
  'hero.sticker': 'Every Tuesday · Free entry',
  'hero.stat.cities': 'Cities',
  'hero.stat.members': 'Members',
  'hero.stat.events': 'Events / month',

  'how.eyebrow': 'How it works',
  'how.title': 'Three steps to your first meetup',
  'how.subtitle': 'No sign-up forms, no membership cards. Just show up.',
  'how.step1.title': 'Pick your city',
  'how.step1.body': 'Browse our cities and join the local WhatsApp group to stay in the loop.',
  'how.step2.title': 'Find an event',
  'how.step2.body': 'Check the calendar for language exchanges, startup nights, book circles and more.',
  'how.step3.title': 'Show up & say hello',
  'how.step3.body': 'Grab a drink, find a table, and start talking. Everyone was new once.',

  'section.events.title': 'Upcoming events',
  'section.events.subtitle': 'Grab a drink and join the conversation this week.',
  'section.cities.title': 'Find your city',
  'section.cities.subtitle':
    'From Trento to Copenhagen — live now, with more cities on the way.',
  'section.topics.title': 'Pick a topic',
  'section.topics.subtitle':
    'Language exchange is just the start. Meet around what you love.',
  'section.venues.title': 'Own a bar or café?',
  'section.venues.subtitle':
    'Fill quiet nights with a lively, recurring crowd — for free.',
  'section.testimonials.title': 'People, not profiles',
  'section.testimonials.subtitle': 'What our community says.',
  'section.instagram.title': 'From the community',
  'section.instagram.subtitle': 'Follow the moments on Instagram.',
  'section.faq.title': 'Good questions',
  'section.faq.subtitle': 'Everything you were wondering.',
  'section.newsletter.title': 'Never miss a meetup',
  'section.newsletter.subtitle':
    'Get events in your city delivered to your inbox.',
  'section.requestCity.title': "Don't see your city?",
  'section.requestCity.subtitle':
    "Tell us where you are and we'll help you start one.",

  'newsletter.placeholder': 'you@email.com',
  'newsletter.button': 'Subscribe',
  'newsletter.success': "You're in! Check your inbox to confirm.",

  'label.free': 'Free',
  'label.upcoming': 'Upcoming',
  'label.recurring': 'Recurring',
  'label.organiser': 'Organiser',
  'label.organisers': 'Organisers',
  'label.venue': 'Venue',
  'label.capacity': 'Capacity',
  'label.languages': 'Languages',
  'label.members': 'members',
  'label.spots': 'spots',
  'label.connect': 'Connect',
  'label.gallery': 'Gallery',
  'label.about': 'About',
  'label.nextEvents': 'Next events',
  'label.noEvents': 'No events scheduled yet — join the group to be the first to know.',

  'cities.eyebrow': 'Cities',
  'cities.title': 'Meet & Talk cities',
  'cities.subtitle':
    'Pick a city to see upcoming events, organisers and how to join.',
  'cities.viewAll': 'View all cities',
  'cities.joinGroup': 'Join the group',
  'cities.activeTopics': 'Active topics',
  'cities.live': 'Live now',
  'cities.liveBadge': 'Live',
  'cities.plannedSection': 'Planned cities',
  'cities.plannedBadge': 'Planned',
  'cities.plannedHint':
    'Not in your city yet? Join the WhatsApp waitlist and we\u2019ll let you know when we launch.',
  'cities.joinWaitlist': 'Join WhatsApp waitlist',

  'topics.eyebrow': 'Topics',
  'topics.title': 'Meet & Talk topics',
  'topics.subtitle':
    'Every community starts with a shared interest. Choose yours.',
  'topics.live': 'Live now',
  'topics.comingSoon': 'Coming soon',
  'topics.citiesRunning': 'Cities running this topic',

  'events.eyebrow': 'Events',
  'events.title': 'Upcoming events',
  'events.subtitle': 'Find your next conversation across all our cities.',
  'events.viewAll': 'View all events',
  'events.filter.all': 'All cities',
  'events.filter.allTopics': 'All topics',

  'venues.hero.badge': 'For bars, cafés & venues',
  'venues.hero.title': 'Turn quiet nights into your busiest.',
  'venues.hero.subtitle':
    'Host a recurring Meet & Talk and welcome a friendly, international crowd — with almost zero effort on your side.',
  'venues.benefits.title': 'Why host Meet & Talk?',
  'venues.benefits.subtitle': 'More customers, livelier atmosphere, zero hassle.',
  'venues.benefit1.title': 'More customers',
  'venues.benefit1.body': 'Fill quiet weekday nights with a recurring, thirsty crowd that keeps coming back.',
  'venues.benefit2.title': 'Lively atmosphere',
  'venues.benefit2.body': 'International conversations, laughter and energy — the kind of vibe people tell their friends about.',
  'venues.benefit3.title': 'Almost zero effort',
  'venues.benefit3.body': 'We handle promotion, the group chat and the community. You just provide the space.',
  'venues.benefit4.title': 'Community visibility',
  'venues.benefit4.body': 'Featured on our site, social channels and city pages — free marketing for your venue.',
  'venues.how.title': 'How it works',
  'venues.how.step1.title': 'Tell us about your venue',
  'venues.how.step1.body': 'Fill in the form with capacity, preferred days and a few photos.',
  'venues.how.step2.title': 'We match you with an organiser',
  'venues.how.step2.body': 'A local city lead will reach out to plan the first event together.',
  'venues.how.step3.title': 'Your first Meet & Talk goes live',
  'venues.how.step3.body': 'We promote it, the crowd shows up, and you see the difference on your quietest night.',
  'venues.partners.title': 'Venues already hosting',
  'venues.form.title': 'Request to host',
  'venues.form.subtitle':
    "Tell us about your venue and we'll be in touch within a few days.",

  'detail.backToCities': 'All cities',
  'detail.backToTopics': 'All topics',
  'detail.backToEvents': 'All events',
  'detail.rsvp': 'Join this event',
  'detail.joinWhatsapp': 'Join WhatsApp group',
  'detail.scanQr': 'Scan to join',

  'form.name': 'Your name',
  'form.email': 'Email',
  'form.city': 'City',
  'form.venueName': 'Venue name',
  'form.capacity': 'Capacity',
  'form.weekdays': 'Preferred weekdays',
  'form.message': 'Anything else?',
  'form.phone': 'Phone (optional)',
  'form.submit': 'Send request',
  'form.venueSuccess': "Thanks! We've received your venue request.",
  'form.citySuccess': "Thanks! We'll let you know when Meet & Talk reaches you.",

  'requestCity.title': 'Bring Meet & Talk to your city',
  'requestCity.subtitle':
    "No Meet & Talk near you yet? Tell us where you are — if there's interest, we'll help you launch one.",
  'requestCity.form.title': 'Request your city',

  'footer.tagline': 'Come as you are. Meet someone new.',
  'footer.explore': 'Explore',
  'footer.community': 'Community',
  'footer.getInvolved': 'Get involved',
  'footer.rights': 'A grassroots community project.',

  'theme.toggle': 'Toggle theme',
  'lang.toggle': 'Change language',
} as const

export type Dictionary = typeof en
export type TranslationKey = keyof Dictionary

// Other locales fall back to English for any missing key.
export const da: Partial<Dictionary> = {
  'nav.cities': 'Byer',
  'nav.topics': 'Emner',
  'nav.events': 'Begivenheder',
  'nav.venues': 'For steder',
  'hero.badge': 'Kom som du er. Mød nogen ny.',
  'footer.tagline': 'Kom som du er. Mød nogen ny.',
}

export const it: Partial<Dictionary> = {
  'nav.cities': 'Città',
  'nav.topics': 'Temi',
  'nav.events': 'Eventi',
  'nav.venues': 'Per i locali',
  'hero.badge': 'Vieni come sei. Incontra qualcuno di nuovo.',
  'footer.tagline': 'Vieni come sei. Incontra qualcuno di nuovo.',
}

export const es: Partial<Dictionary> = {
  'nav.cities': 'Ciudades',
  'nav.topics': 'Temas',
  'nav.events': 'Eventos',
  'nav.venues': 'Para locales',
  'hero.badge': 'Ven como eres. Conoce a alguien nuevo.',
  'footer.tagline': 'Ven como eres. Conoce a alguien nuevo.',
}

export const de: Partial<Dictionary> = {
  'nav.cities': 'Städte',
  'nav.topics': 'Themen',
  'nav.events': 'Veranstaltungen',
  'nav.venues': 'Für Locations',
  'hero.badge': 'Komm wie du bist. Lerne jemanden kennen.',
  'footer.tagline': 'Komm wie du bist. Lerne jemanden kennen.',
}

export const fr: Partial<Dictionary> = {
  'nav.cities': 'Villes',
  'nav.topics': 'Thèmes',
  'nav.events': 'Événements',
  'nav.venues': 'Pour les lieux',
  'hero.badge': "Viens comme tu es. Rencontre quelqu'un.",
  'footer.tagline': "Viens comme tu es. Rencontre quelqu'un.",
}

export const pt: Partial<Dictionary> = {
  'nav.cities': 'Cidades',
  'nav.topics': 'Temas',
  'nav.events': 'Eventos',
  'nav.venues': 'Para locais',
  'hero.badge': 'Vem como és. Conhece alguém novo.',
  'footer.tagline': 'Vem como és. Conhece alguém novo.',
}

export const dictionaries: Record<Locale, Partial<Dictionary>> = {
  en,
  da,
  it,
  es,
  de,
  fr,
  pt,
}
