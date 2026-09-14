import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import './globals.css';

/** big jadeddelta, section titles, job titles, and headers */
const bagnard = localFont({
  src: '../../public/fonts/Bagnard.otf',
  variable: '--font-bagnard',
  display: 'swap',
  weight: '400',
  fallback: ['Iowan Old Style', 'Georgia', 'serif'],
});

/** texts */
const chivo = localFont({
  src: '../../public/fonts/Chivo-Variable.woff2',
  variable: '--font-chivo',
  display: 'swap',
  weight: '300 700',
  style: 'normal',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

/** navigation, section numbers, dates, tags, footer, sometimes secondary text */
const jetbrainsMono = localFont({
  src: '../../public/fonts/JetBrainsMono-Variable.woff2',
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: '100 800',
  style: 'normal',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
});

export const metadata: Metadata = {
  title: 'jade\'s code',
  description: 'portfolio for jadeddelta, a budding developer',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${bagnard.variable} ${chivo.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
