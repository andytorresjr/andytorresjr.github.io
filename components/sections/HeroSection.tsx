'use client'
import { motion, useReducedMotion } from 'framer-motion'
import ImageMouseTrail from '@/components/ui/mousetrail'
import { RandomizedTextEffect } from '@/components/ui/text-randomized'
import { ArrowDown } from 'lucide-react'

// Project thumbnails trail the cursor — replace with actual paths under public/attachments/
const trailImages = [
  '/attachments/319k-final-project-thumbnail.jpg',
  '/attachments/proj2-thumbnail.png',
  '/attachments/319k-final-project-thumbnail.jpg',
  '/attachments/proj2-thumbnail.png',
  '/attachments/319k-final-project-thumbnail.jpg',
]

const stats = [
  { label: 'Focus', value: 'Embedded Systems' },
  { label: 'University', value: 'UT Austin' },
  { label: 'Location', value: 'Austin, TX' },
]

export default function HeroSection() {
  const prefersReduced = useReducedMotion()

  return (
    <section id="home" aria-label="Introduction">
      <ImageMouseTrail
        items={trailImages}
        className="min-h-dvh w-full bg-bg block overflow-hidden"
        imgClass="w-44 h-56 object-cover rounded-md opacity-40 shadow-xl"
        fadeAnimation
        distance={18}
        maxNumberOfImages={5}
      >
        {/* Subtle radial gradient centered on page */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Grid lines overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col justify-center min-h-dvh px-6 md:px-12 lg:px-24 max-w-7xl mx-auto py-24">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 font-mono text-xs text-accent-2 border border-accent-2/25 bg-accent-2/5 px-3 py-1.5 rounded-full tracking-[0.2em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-2 animate-pulse" aria-hidden="true" />
              ECE_STUDENT @ UT_AUSTIN
            </span>
          </motion.div>

          {/* Name — RandomizedTextEffect on first load */}
          <h1 className="font-syne text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-black text-text-primary leading-[0.9] tracking-tight mb-6 max-w-4xl">
            {prefersReduced ? (
              'Andres Torres Jr.'
            ) : (
              <RandomizedTextEffect text="Andres Torres Jr." />
            )}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5, ease: 'easeOut' }}
            className="font-inter text-base md:text-lg text-text-muted max-w-xl leading-relaxed mb-10"
          >
            I build embedded systems and digital solutions that bring ideas from
            schematic to shipped product — from ARM Cortex-M firmware to KiCad
            PCB layouts.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
            className="flex gap-4 flex-wrap mb-16"
          >
            <a
              href="/attachments/RESUME-FALL2025.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-space-grotesk font-semibold text-sm bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              View Resume
            </a>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 font-space-grotesk font-semibold text-sm border border-border hover:border-text-muted text-text-muted hover:text-text-primary px-6 py-3 rounded transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Browse Projects
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="flex flex-wrap gap-8"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5">
                <dt className="font-mono text-[10px] text-text-muted/60 uppercase tracking-widest">
                  {stat.label}
                </dt>
                <dd className="font-space-grotesk text-sm font-semibold text-text-primary">
                  {stat.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <span className="font-mono text-[10px] text-text-muted/50 uppercase tracking-widest">
            scroll
          </span>
          <ArrowDown size={14} className="text-text-muted/50 animate-bounce" />
        </motion.div>
      </ImageMouseTrail>
    </section>
  )
}
