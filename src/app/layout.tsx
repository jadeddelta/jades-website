import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Chivo, JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

/** big jadeddelta, section titles, job titles, and headers */
const bagnard = localFont({
  src: '../../public/fonts/Bagnard.otf',
  variable: '--font-bagnard',
  display: 'swap',
  fallback: ['Iowan Old Style', 'Georgia', 'serif'],
})

/** texts */
const chivo = Chivo({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-chivo',
  display: 'swap',
})

/** navigation, section numbers, dates, tags, footer, sometimes secondary text */
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'jade\'s code',
  description: 'portfolio for jadeddelta, a budding developer',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${bagnard.variable} ${chivo.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
