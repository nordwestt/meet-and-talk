'use client'

import { Menu, MessagesSquare, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LanguageSwitcher } from '@/components/language-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import { buttonVariants } from '@/components/ui/button'
import { mainNav } from '@/lib/data/site'
import { useI18n } from '@/lib/i18n/context'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const { t } = useI18n()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight"
        >
          <span className="flex size-8 -rotate-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MessagesSquare className="size-5" />
          </span>
          Meet &amp; Talk
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {mainNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                  active && 'bg-muted text-foreground',
                )}
              >
                {t(item.key as never)}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LanguageSwitcher />
          <Link
            href="/cities"
            className={cn(
              buttonVariants({ variant: 'default' }),
              'ml-1 hidden h-9 rounded-full px-4 sm:inline-flex',
            )}
          >
            {t('cta.joinCity')}
          </Link>
          <button
            type="button"
            className="ml-1 flex size-9 items-center justify-center rounded-full text-foreground hover:bg-muted md:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          className="border-t border-border bg-background px-4 py-3 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  {t(item.key as never)}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/cities"
                className={cn(
                  buttonVariants({ variant: 'default' }),
                  'h-10 w-full rounded-full',
                )}
              >
                {t('cta.joinCity')}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
