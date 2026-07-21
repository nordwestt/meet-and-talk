import Link from 'next/link'
import { TopicIcon } from '@/components/icons/topic-icon'
import { Badge } from '@/components/ui/badge'
import type { Topic } from '@/lib/types'

export function TopicCard({ topic }: { topic: Topic }) {
  const isSoon = topic.status === 'soon'

  return (
    <Link
      href={`/topics/${topic.slug}`}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border-2 border-border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div
        className="flex size-12 items-center justify-center rounded-xl"
        style={{ backgroundColor: topic.color, color: 'var(--primary-foreground)' }}
      >
        <TopicIcon name={topic.icon} className="size-6" />
      </div>
      <div className="flex items-center gap-2">
        <h3 className="font-display text-lg font-bold leading-tight">{topic.name}</h3>
        {isSoon ? (
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
            Soon
          </Badge>
        ) : null}
      </div>
      <p className="text-sm text-muted-foreground">{topic.tagline}</p>
    </Link>
  )
}
