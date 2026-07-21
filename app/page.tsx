import { CtaBand } from '@/components/home/cta-band'
import { FaqSection } from '@/components/home/faq-section'
import { FeaturedCities } from '@/components/home/featured-cities'
import { Hero } from '@/components/home/hero'
import { HowItWorks } from '@/components/home/how-it-works'
import { InstagramSection } from '@/components/home/instagram-section'
import { NewsletterSection } from '@/components/home/newsletter-section'
import { Testimonials } from '@/components/home/testimonials'
import { TopicsSection } from '@/components/home/topics-section'
import { UpcomingEvents } from '@/components/home/upcoming-events'
import { VenueInvitation } from '@/components/home/venue-invitation'

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FeaturedCities />
      <TopicsSection />
      <UpcomingEvents />
      <VenueInvitation />
      <Testimonials />
      <InstagramSection />
      <FaqSection />
      <NewsletterSection />
      <CtaBand />
    </>
  )
}
