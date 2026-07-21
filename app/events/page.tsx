'use client'

import { useMemo, useState } from 'react'
import { EventCard } from '@/components/cards/event-card'
import { PageHero } from '@/components/page-hero'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cities, getSortedEvents, topics } from '@/lib/data'
import { useI18n } from '@/lib/i18n/context'

export default function EventsPage() {
  const { t } = useI18n()
  const [cityFilter, setCityFilter] = useState('all')
  const [topicFilter, setTopicFilter] = useState('all')

  const events = useMemo(() => {
    return getSortedEvents().filter((event) => {
      const cityMatch = cityFilter === 'all' || event.cityId === cityFilter
      const topicMatch = topicFilter === 'all' || event.topicId === topicFilter
      return cityMatch && topicMatch
    })
  }, [cityFilter, topicFilter])

  return (
    <>
      <PageHero
        eyebrow={t('events.eyebrow')}
        title={t('events.title')}
        subtitle={t('events.subtitle')}
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="mb-8 flex flex-wrap gap-4">
          <div className="flex flex-col gap-2">
            <Label>{t('events.filter.all')}</Label>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-48 border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('events.filter.all')}</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>{t('events.filter.allTopics')}</Label>
            <Select value={topicFilter} onValueChange={setTopicFilter}>
              <SelectTrigger className="w-48 border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('events.filter.allTopics')}</SelectItem>
                {topics
                  .filter((topic) => topic.status === 'live')
                  .map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {events.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">{t('label.noEvents')}</p>
        )}
      </section>
    </>
  )
}
