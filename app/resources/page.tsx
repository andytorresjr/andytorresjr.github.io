'use client'
// Resources page — ported from prod (main branch resources.html) into the
// redesign UI.
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TextAnimation from '@/components/ui/scroll-text'
import { ArrowUpRight } from 'lucide-react'

const resources = [
  {
    title: "Paul's Online Math Notes",
    href: 'https://tutorial.math.lamar.edu/',
    description:
      "The closest thing to perfect notetaking. I've filled entire notebooks with his explanations.",
  },
  {
    title: 'HyperMath',
    href: 'http://hyperphysics.phy-astr.gsu.edu/hbase/hmat.html#hmath',
    description:
      "Another solid math resource I used early on. It's less extensive but good for introductory material.",
  },
  {
    title: 'HyperPhysics',
    href: 'http://hyperphysics.phy-astr.gsu.edu/hbase/hframe.html',
    description:
      'This site CARRIED me through physics. Great conceptual breakdowns and visual aids for EM, mechanics, and semiconductors.',
  },
]

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-dvh bg-bg pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em] block mb-4">
            Curated Links
          </span>
          <TextAnimation
            as="h1"
            text="Resources"
            direction="up"
            className="font-syne font-black text-4xl md:text-6xl text-text-primary mb-4"
          />
          <p className="font-inter text-base text-text-muted max-w-xl mb-14">
            Sites and tools I&apos;ve actually used and continue to rely on
            throughout my engineering journey.
          </p>

          <ul className="space-y-4 max-w-3xl">
            {resources.map((r, i) => (
              <motion.li
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.45, ease: 'easeOut' }}
              >
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-2 p-6 rounded-xl bg-surface border border-border/60 hover:border-accent/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span className="inline-flex items-center gap-2 font-space-grotesk font-bold text-lg text-text-primary group-hover:text-accent transition-colors">
                    {r.title}
                    <ArrowUpRight
                      size={15}
                      className="text-text-muted/50 group-hover:text-accent-2 transition-colors"
                    />
                  </span>
                  <p className="font-inter text-sm text-text-muted leading-relaxed">
                    {r.description}
                  </p>
                </a>
              </motion.li>
            ))}
          </ul>

          <p className="font-inter text-sm text-text-muted/60 mt-10 max-w-xl">
            These are just a few of the resources I&apos;ve used and continue to
            rely on during my engineering journey. I&apos;ll keep adding more as
            I find new favorites.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
