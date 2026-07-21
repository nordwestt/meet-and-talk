import type { FaqItem, Testimonial } from '@/lib/types'

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote:
      'I moved to Trento not knowing a soul. A few months of Meet & Talk later, these are my closest friends.',
    name: 'Thomas',
    role: 'Expat',
    cityId: 'trento',
    avatar: '/images/people/sofia.svg',
  },
  {
    id: 't2',
    quote:
      'My English went from shy to confident, and I got a spritz out of every lesson. This is where Meet & Talk started for me.',
    name: 'Giulia',
    role: 'Trento regular',
    cityId: 'trento',
    avatar: '/images/people/camille.svg',
  },
]

export const faqs: FaqItem[] = [
  {
    id: 'f1',
    question: 'Is it really free?',
    answer:
      'Yes. Joining a Meet & Talk event is always free. You only pay for whatever you choose to eat or drink at the venue.',
  },
  {
    id: 'f2',
    question: 'Do I need to speak the language well?',
    answer:
      'Not at all. We have tables for every level, from absolute beginner to fluent. The only requirement is a willingness to say hello.',
  },
  {
    id: 'f3',
    question: 'How do I join?',
    answer:
      'Pick your city, join the WhatsApp group, and just show up to the next event. There\u2019s no sign-up form or membership card.',
  },
  {
    id: 'f4',
    question: 'What if there is no Meet & Talk in my city?',
    answer:
      'Check our planned cities — you can join the WhatsApp waitlist to stay updated. Or request your city and we\u2019ll gauge interest together.',
  },
  {
    id: 'f5',
    question: 'I own a bar or café. How does hosting work?',
    answer:
      'You give us a corner and a regular slot; we bring a friendly, thirsty crowd. There\u2019s no cost and almost no effort on your side. Head to the For Venues page to request hosting.',
  },
  {
    id: 'f6',
    question: 'Is Meet & Talk only about languages?',
    answer:
      'Right now we focus on language exchange — it\u2019s what we do best. More topics like startups, travel and books are on the horizon as the community grows.',
  },
]
