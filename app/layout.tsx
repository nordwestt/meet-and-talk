import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { I18nProvider } from '@/lib/i18n/context'
import './globals.css'

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700', '800'],
})

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://meetandtalk.community'),
  title: {
    default: 'Meet & Talk — Meet people. Practice languages. Discover cities.',
    template: '%s · Meet & Talk',
  },
  description:
    'Meet & Talk is a grassroots community that brings people together in bars and cafés to practice languages and make real friends across European cities.',
  keywords: [
    'language exchange',
    'meetup',
    'community',
    'social events',
    'practice languages',
    'Copenhagen',
    'Verona',
    'Berlin',
    'Barcelona',
  ],
  openGraph: {
    title: 'Meet & Talk',
    description: 'Come as you are. Meet someone new.',
    type: 'website',
    siteName: 'Meet & Talk',
  },
  manifest: '/manifest.webmanifest',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f3e7' },
    { media: '(prefers-color-scheme: dark)', color: '#141c17' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
            <Toaster position="top-center" />
          </I18nProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
