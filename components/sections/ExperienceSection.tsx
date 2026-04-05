// Adapted from UILayouts PortfolioExperience block
'use client'
import { motion } from 'framer-motion'
import TextAnimation from '@/components/ui/scroll-text'
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
} from '@/components/ui/accordion'

interface ExperienceItem {
  org: string
  tagline: string
  period: string
  role: string
  location: string
  domain: string
  metrics?: string[]
  stack?: string[]
  description: string[]
}

const experiences: ExperienceItem[] = [
  {
    org: 'UT Austin ECE',
    tagline: 'Electrical & Computer Engineering',
    period: '2022 — Present',
    role: 'B.S. Student',
    location: 'Austin, TX',
    domain: 'Academia / Engineering',
    metrics: ['Top-tier program', 'ECE Core'],
    stack: ['C', 'ARM Assembly', 'Verilog', 'MATLAB', 'Python'],
    description: [
      'Pursuing a Bachelor of Science in Electrical and Computer Engineering at one of the top ECE programs in the nation. Coursework spans digital logic design, computer architecture, embedded systems, signal processing, and real-time OS design.',
      'Completed major projects including a fully interrupt-driven Space Invaders game on the TM4C123 microcontroller and an FPGA-based FSM traffic controller — both requiring deep integration of hardware and firmware.',
    ],
  },
  {
    org: 'IEEE UT Austin',
    tagline: 'Institute of Electrical & Electronics Engineers',
    period: '2023 — Present',
    role: 'Student Member',
    location: 'Austin, TX',
    domain: 'Professional Organization',
    metrics: ['Active chapter', 'Networking & workshops'],
    stack: ['Leadership', 'Networking', 'Technical Workshops'],
    description: [
      'Active member of the UT Austin IEEE student chapter. Participate in technical workshops, networking events, and cross-disciplinary collaboration sessions with peers working in hardware, software, and systems engineering.',
      'The chapter experience has sharpened communication skills and connected me with industry mentors and internship pathways in embedded systems and hardware design.',
    ],
  },
  {
    org: 'STEM Mentorship',
    tagline: 'Community & Outreach',
    period: '2022 — Present',
    role: 'Volunteer Mentor',
    location: 'Laredo & Austin, TX',
    domain: 'Education / Community',
    metrics: ['Students mentored', 'STEM pipeline'],
    stack: ['Mentorship', 'Curriculum Design', 'Public Speaking'],
    description: [
      'Volunteer mentor for students from Laredo, TX navigating their path into STEM fields. Drawing on my own experience transitioning from a small border city to UT Austin, I help students build academic confidence and understand engineering pathways.',
      'I believe the next generation of engineers becomes strongest when they have mentors who reflect their backgrounds and genuinely invest in their success.',
    ],
  },
]

function ExperienceRow({ item, index }: { item: ExperienceItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-16 border-t border-border/60"
    >
      {/* Col 1 — Org + period */}
      <div className="md:col-span-3 space-y-3">
        <h3 className="font-syne font-black text-2xl md:text-3xl text-text-primary leading-tight">
          {item.org}
        </h3>
        <div className="space-y-1">
          <p className="font-mono text-[10px] text-accent uppercase tracking-widest">
            {item.tagline}
          </p>
          <p className="font-mono text-xs text-text-muted/60 tabular-nums">
            {item.period}
          </p>
        </div>
        {item.metrics && (
          <div className="pt-2 space-y-2">
            {item.metrics.map((m) => (
              <div key={m} className="flex flex-col border-l-2 border-accent/25 pl-3">
                <span className="text-[9px] font-mono text-text-muted/50 uppercase tracking-wider">
                  Note
                </span>
                <span className="text-sm font-space-grotesk font-semibold text-text-primary">
                  {m}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Col 2 — Metadata + stack */}
      <div className="md:col-span-4 space-y-6">
        <div className="grid grid-cols-2 gap-y-5">
          {[
            ['Role', item.role],
            ['Location', item.location],
            ['Domain', item.domain],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="font-mono text-[9px] text-text-muted/50 uppercase tracking-wider">
                {label}
              </span>
              <span className="font-space-grotesk text-sm font-semibold text-text-primary">
                {value}
              </span>
            </div>
          ))}
        </div>

        {item.stack && (
          <div>
            <span className="font-mono text-[9px] text-text-muted/50 uppercase tracking-wider block mb-2">
              Key Areas
            </span>
            <div className="flex flex-wrap gap-1.5">
              {item.stack.map((s) => (
                <span
                  key={s}
                  className="font-mono text-[10px] text-text-muted/70 bg-bg border border-border/60 px-2 py-0.5 rounded"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Col 3 — Description with accordion — from UILayouts Accordion */}
      <div className="md:col-span-5">
        <Accordion defaultValue="para-0">
          {item.description.map((para, i) => (
            <AccordionItem key={i} value={`para-${i}`}>
              <AccordionHeader className="text-sm">
                {i === 0 ? 'Overview' : 'Details'}
              </AccordionHeader>
              <AccordionPanel className="text-sm">{para}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </motion.div>
  )
}

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-24 bg-bg">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <header className="mb-4 space-y-4">
          <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em] block">
            04 / Experience
          </span>
          <TextAnimation
            as="h2"
            text="Engineering Journey"
            direction="up"
            className="font-syne font-black text-3xl md:text-5xl lg:text-6xl text-text-primary uppercase leading-none"
          />
        </header>

        {/* Rows */}
        {experiences.map((item, i) => (
          <ExperienceRow key={item.org} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}
