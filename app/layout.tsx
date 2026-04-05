import type { Metadata } from 'next'
import { Syne, Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import SmoothScrollProvider from '@/components/SmoothScrollProvider'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Andres Torres Jr. — ECE Student & Engineer',
  description:
    'Portfolio of Andres Torres Jr., ECE student at UT Austin passionate about embedded systems, PCB design, and hardware engineering.',
  keywords: [
    'Andres Torres Jr',
    'Andy Torres Jr',
    'ECE',
    'embedded systems',
    'UT Austin',
    'portfolio',
    'electrical engineering',
    'PCB design',
    'KiCad',
    'ARM Cortex-M',
  ],
  authors: [{ name: 'Andres Torres Jr.' }],
  openGraph: {
    title: 'Andres Torres Jr. — ECE Student & Engineer',
    description:
      'Embedded systems, PCB design, and hardware engineering. UT Austin ECE.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="bg-bg text-text-primary font-inter antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  )
}
