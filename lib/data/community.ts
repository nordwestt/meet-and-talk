import type { FaqItem, Testimonial } from '@/lib/types'

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote:
      'I moved to Copenhagen not knowing a soul. Three months of Meet & Talk later, these are my closest friends.',
    name: 'Ana',
    role: 'Member since 2024',
    cityId: 'copenhagen',
    avatar: '/images/people/sofia.svg',
  },
  {
    id: 't2',
    quote:
      'My English went from shy to confident, and I got a spritz out of every lesson. Unbeatable.',
    name: 'Giulia',
    role: 'Verona regular',
    cityId: 'verona',
    avatar: '/images/people/camille.svg',
  },
  {
    id: 't3',
    quote:
      'As a bar owner, Tuesday used to be dead. Now it\u2019s one of our best nights and the vibe is contagious.',
    name: 'Thomas',
    role: 'Venue partner, Berlin',
    cityId: 'berlin',
    avatar: '/images/people/noah.svg',
  },
  {
    id: 't4',
    quote:
      'It feels less like a language class and more like being welcomed into a big, messy, wonderful family.',
    name: 'Marc',
    role: 'Barcelona member',
    cityId: 'barcelona',
    avatar: '/images/people/diego.svg',
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
      'Request your city and we\u2019ll gauge interest. If enough people want it, we\u2019ll help you find a venue and launch your own.',
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
      'Language exchange is where we started, but the community is growing into startups, travel, books, tech and more. Every meetup is built around a shared interest.',
  },
]
