'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { SectionHeading } from '@/components/section-heading'
import { faqs } from '@/lib/data'
import { useI18n } from '@/lib/i18n/context'

export function FaqSection() {
  const { t } = useI18n()

  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
        <SectionHeading
          align="center"
          title={t('section.faq.title')}
          subtitle={t('section.faq.subtitle')}
        />
        <Accordion className="mt-10" defaultValue={['f1']}>
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="font-display text-base font-bold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
