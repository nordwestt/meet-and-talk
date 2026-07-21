import { cn } from '@/lib/utils'

export function PageHero({
  eyebrow,
  title,
  subtitle,
  className,
  children,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <section
      className={cn(
        'border-b border-border bg-grain',
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="flex max-w-3xl flex-col gap-4">
          {eyebrow ? (
            <span className="font-display text-sm font-bold uppercase tracking-widest text-primary">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="text-balance font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-pretty text-lg text-muted-foreground">{subtitle}</p>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  )
}
