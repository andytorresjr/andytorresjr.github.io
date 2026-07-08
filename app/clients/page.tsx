'use client'
// Client portal — ported from prod (main branch clients.html) into the
// redesign UI. Service cards link straight to Stripe checkout.
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TextAnimation from '@/components/ui/scroll-text'
import { RandomizedTextEffect } from '@/components/ui/text-randomized'
import { LiquidGlassCard } from '@/components/ui/liquid-glass'
import { Mail, Linkedin, ArrowUpRight } from 'lucide-react'

// Same rotating phrases as prod's scramble hero (script.js)
const PHRASES = [
  'Embedded Systems',
  'Web Development',
  'ECE Tutoring',
  'Custom Firmware',
  'Portfolio Websites',
  'Digital Logic',
  'Microcontroller Builds',
]

const services = [
  {
    label: 'Tutoring',
    title: '1-on-1 Tutoring Session',
    description:
      'Personalized tutoring in ECE, embedded systems, digital logic, or computer architecture. Virtual or in-person at UT Austin.',
    price: '$45',
    unit: '/ hour',
    href: 'https://buy.stripe.com/28E8wOfPu7uj0dA2jq9Ve01',
  },
  {
    label: 'Tutoring',
    title: 'Tutoring Package (4 Sessions)',
    description:
      'Four 1-hour sessions bundled at a discount. Best for ongoing support through a course or project.',
    price: '$160',
    unit: '/ 4 sessions',
    href: 'https://buy.stripe.com/aFa6oG9r629Z0dA6zG9Ve02',
  },
  {
    label: 'Web Development',
    title: 'Starter Site',
    description:
      'A clean, responsive personal or portfolio website. Up to 3 pages, contact section, and basic SEO. Delivered within 2 weeks.',
    price: '$350',
    unit: 'flat rate',
    href: 'https://buy.stripe.com/00waEWfPu7uj0dA2jq9Ve03',
  },
  {
    label: 'Web Development',
    title: 'Custom Project',
    description:
      'Custom scope project with pricing determined after a free 30-minute consultation. Invoiced in milestones.',
    price: 'Custom',
    unit: 'quote',
    href: 'https://buy.stripe.com/eVq8wO1YE29Z1hEcY49Ve04',
  },
]

const steps = [
  {
    title: 'Reach Out',
    text: "Contact me via email or LinkedIn to discuss your needs. For custom web projects, we'll schedule a free 30-minute consultation.",
  },
  {
    title: 'Receive Your Invoice',
    text: "Once we agree on scope, I'll send a Stripe invoice directly to your email with a clear breakdown of services and pricing.",
  },
  {
    title: 'Pay Securely',
    text: 'Pay via the link in your email or by clicking a service card above. Stripe accepts major credit cards and bank transfers.',
  },
  {
    title: 'We Get to Work',
    text: 'Once payment is confirmed, we kick off the session or project. Simple as that.',
  },
]

function ScrambleHero() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % PHRASES.length), 3200)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="mb-24">
      <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em] block mb-4">
        What are you building?
      </span>
      <h1 className="font-syne font-black text-3xl md:text-5xl text-text-primary leading-tight">
        Looking for help with
        <br />
        <RandomizedTextEffect
          text={PHRASES[idx]}
          className="text-accent-2 font-mono"
        />
      </h1>
    </div>
  )
}

export default function ClientsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-dvh bg-bg pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <ScrambleHero />

          {/* ── Services ── */}
          <section aria-labelledby="services-heading" className="mb-24">
            <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em] block mb-4">
              Client Portal
            </span>
            <TextAnimation
              as="h2"
              text="Services Offered"
              direction="up"
              className="font-syne font-black text-3xl md:text-5xl text-text-primary mb-4"
            />
            <p className="font-inter text-base text-text-muted max-w-xl mb-12">
              Click any service below to go directly to checkout. Payments are
              processed securely by Stripe.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {services.map((s, i) => (
                <motion.a
                  key={s.title}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.08, duration: 0.45, ease: 'easeOut' }}
                  whileHover={{ y: -4 }}
                  className="group flex flex-col gap-3 p-7 rounded-xl bg-surface border border-border/60 hover:border-accent/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span className="font-mono text-[10px] text-accent-2 uppercase tracking-widest">
                    {s.label}
                  </span>
                  <h3 className="font-space-grotesk font-bold text-xl text-text-primary group-hover:text-accent transition-colors">
                    {s.title}
                  </h3>
                  <p className="font-inter text-sm text-text-muted leading-relaxed flex-1">
                    {s.description}
                  </p>
                  <div className="flex items-end justify-between pt-2">
                    <p className="font-syne font-black text-2xl text-text-primary">
                      {s.price}{' '}
                      <span className="font-inter font-normal text-sm text-text-muted/60">
                        {s.unit}
                      </span>
                    </p>
                    <span className="inline-flex items-center gap-1 font-space-grotesk text-xs font-semibold text-accent group-hover:text-accent-2 transition-colors">
                      Checkout <ArrowUpRight size={12} />
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </section>

          {/* ── How it works ── */}
          <section aria-labelledby="how-heading" className="mb-24">
            <TextAnimation
              as="h2"
              text="How It Works"
              direction="up"
              className="font-syne font-black text-3xl md:text-4xl text-text-primary mb-4"
            />
            <p className="font-inter text-base text-text-muted max-w-xl mb-12">
              A simple, transparent process from start to payment.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.08, duration: 0.45, ease: 'easeOut' }}
                  className="flex flex-col gap-3 p-6 rounded-xl bg-surface/60 border border-border/60"
                >
                  <span className="font-syne font-black text-3xl text-accent/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-space-grotesk font-bold text-base text-text-primary">
                    {step.title}
                  </h3>
                  <p className="font-inter text-sm text-text-muted leading-relaxed">
                    {step.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Questions ── */}
          <section aria-labelledby="questions-heading">
            <TextAnimation
              as="h2"
              text="Questions?"
              direction="up"
              className="font-syne font-black text-3xl md:text-4xl text-text-primary mb-4"
            />
            <p className="font-inter text-base text-text-muted max-w-xl mb-10">
              If you have questions about an invoice or want to book a service,
              get in touch — I&apos;ll get back to you within 24 hours.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              {[
                {
                  label: 'Email',
                  value: 'andrestorresjr@utexas.edu',
                  href: 'mailto:andrestorresjr@utexas.edu',
                  icon: Mail,
                },
                {
                  label: 'LinkedIn',
                  value: '/in/andres-torres-jr',
                  href: 'https://www.linkedin.com/in/andres-torres-jr',
                  icon: Linkedin,
                },
              ].map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('mailto') ? undefined : '_blank'}
                    rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                    className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-[10px]"
                  >
                    <LiquidGlassCard
                      glowIntensity="sm"
                      shadowIntensity="sm"
                      blurIntensity="sm"
                      borderRadius="10px"
                      className="bg-surface/40 group-hover:bg-surface/60 transition-colors"
                    >
                      <div className="flex items-center gap-4 p-5">
                        <div className="w-10 h-10 rounded-lg bg-bg border border-border/60 flex items-center justify-center group-hover:border-accent/40 transition-colors shrink-0">
                          <Icon
                            size={18}
                            className="text-text-muted group-hover:text-accent transition-colors"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-mono text-[10px] text-text-muted/40 uppercase tracking-widest">
                            {link.label}
                          </p>
                          <p className="font-mono text-xs text-accent truncate">
                            {link.value}
                          </p>
                        </div>
                      </div>
                    </LiquidGlassCard>
                  </a>
                )
              })}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
