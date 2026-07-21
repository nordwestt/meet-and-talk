import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className,
  children,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        {eyebrow ? (
          <span className="font-display text-sm font-bold uppercase tracking-widest text-primary">
            {eyebrow}
          </span>
        ) : null}
        <h2 className="text-balance font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p
            className={cn(
              'text-pretty text-base text-muted-foreground',
              align === 'center' && 'mx-auto max-w-2xl',
            )}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  )
}
