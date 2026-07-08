'use client'
// Resume page — ported from prod (main branch resume.html) into the redesign UI.
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TextAnimation from '@/components/ui/scroll-text'
import { Cpu, Code2, BarChart3, ArrowUpRight } from 'lucide-react'

const resumes = [
  {
    label: 'Hardware',
    title: 'Hardware Resume',
    description: 'Embedded systems, PCB design, FPGA & microcontroller work.',
    href: '/attachments/Torres_Resume_Hardware.pdf',
    icon: Cpu,
    accent: '#6366f1',
  },
  {
    label: 'Software',
    title: 'Software Resume',
    description: 'Full-stack development, systems programming & tooling.',
    href: '/attachments/Torres_Resume_Software.pdf',
    icon: Code2,
    accent: '#22d3ee',
  },
  {
    label: 'Data Analysis',
    title: 'Data Analysis Resume',
    description: 'Data pipelines, visualization & analytical projects.',
    href: '/attachments/Torres_Resume_Data.pdf',
    icon: BarChart3,
    accent: '#f472b6',
  },
]

export default function ResumePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-dvh bg-bg pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em] block mb-4">
            Curriculum Vitae
          </span>
          <TextAnimation
            as="h1"
            text="Resumes"
            direction="up"
            className="font-syne font-black text-4xl md:text-6xl text-text-primary mb-4"
          />
          <p className="font-inter text-base text-text-muted max-w-xl mb-14">
            Choose a resume tailored to the role you have in mind.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resumes.map((r, i) => {
              const Icon = r.icon
              return (
                <motion.a
                  key={r.label}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${r.title} PDF`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.45, ease: 'easeOut' }}
                  whileHover={{ y: -4 }}
                  className="group flex flex-col gap-4 p-7 rounded-xl bg-surface border border-border/60 hover:border-accent/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center"
                      style={{
                        background: `${r.accent}18`,
                        border: `1px solid ${r.accent}30`,
                      }}
                    >
                      <Icon size={20} style={{ color: r.accent }} />
                    </div>
                    <span className="font-mono text-[10px] text-text-muted/50 uppercase tracking-widest mt-1">
                      {r.label}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-space-grotesk font-bold text-lg text-text-primary mb-1.5 group-hover:text-accent transition-colors">
                      {r.title}
                    </h2>
                    <p className="font-inter text-sm text-text-muted leading-relaxed">
                      {r.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 font-space-grotesk text-xs font-semibold text-accent group-hover:text-accent-2 transition-colors">
                    Open PDF <ArrowUpRight size={12} />
                  </span>
                </motion.a>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
