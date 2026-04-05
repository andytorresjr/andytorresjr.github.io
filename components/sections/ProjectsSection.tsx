'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Spotlight, SpotLightItem } from '@/components/ui/spotlight'
import TextAnimation from '@/components/ui/scroll-text'
import ScrollElement from '@/components/ui/scroll-animation'
import { ExternalLink, ArrowRight } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  image: string
  href: string
  status: 'live' | 'coming-soon'
}

const projects: Project[] = [
  {
    id: 'space-invaders',
    title: 'Space Invaders on the TM4C',
    description:
      'Designed and implemented a full game loop on the MSPM0 LaunchPad with custom graphics and audio drivers. Real-time interrupt-driven rendering at 30 fps with sound effects via DAC output.',
    tags: ['ARM Cortex-M4', 'Embedded C', 'Real-Time Systems', 'DAC Audio'],
    image: '/attachments/319k-final-project-thumbnail.jpg',
    href: 'https://www.linkedin.com/posts/andres-torres-jr-45a56a283_embeddedsystems-programming-microcontrollers-activity-7284749293800800256-m4ea',
    status: 'live',
  },
  {
    id: 'fsm-traffic',
    title: 'FSM Traffic Light Controller',
    description:
      'Created a traffic management system using finite state machines and simulated sensors to optimize traffic flow and pedestrian safety. Implemented on FPGA with Verilog HDL.',
    tags: ['Digital Logic', 'Finite State Machines', 'Verilog', 'Systems Design'],
    image: '/attachments/proj2-thumbnail.png',
    href: 'https://www.linkedin.com/posts/andres-torres-jr-45a56a283_reflecting-on-one-of-my-favorite-projects-activity-7326713346961932288-Mnkl',
    status: 'live',
  },
  {
    id: 'robotics-pcb',
    title: 'Robotics PCB Control Hub',
    description:
      'Engineering a modular PCB platform that unifies motor control, sensor fusion, and power delivery for autonomous marine robotics builds. Designed from scratch in KiCad.',
    tags: ['PCB Design', 'KiCad', 'Motor Control', 'Embedded Systems'],
    image: '',
    href: '#',
    status: 'coming-soon',
  },
]

function ProjectCard({ project }: { project: Project }) {
  return (
    // Gradient border card — adapted from UILayouts GradientBorder
    <article
      className="flex flex-col h-full rounded-lg overflow-hidden"
      style={{
        background:
          'linear-gradient(45deg,#111111,#1a1a1a 50%,#111111) padding-box, conic-gradient(from var(--border-angle),#27272a80 80%,#6366f1 86%,#818cf8 90%,#6366f1 94%,#27272a80) border-box',
        border: '1px solid transparent',
        animation: 'border-rotate 6s linear infinite',
      }}
    >
      {/* Image */}
      <div className="relative h-48 bg-surface-2 shrink-0 overflow-hidden">
        {project.status === 'coming-soon' || !project.image ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="font-mono text-[10px] text-accent border border-accent/30 px-2 py-1 rounded uppercase tracking-widest">
              Coming Soon
            </span>
            <span className="font-space-grotesk text-sm font-semibold text-text-muted/60 text-center px-4">
              {project.title}
            </span>
          </div>
        ) : (
          <img
            src={project.image}
            alt={`${project.title} preview`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-space-grotesk font-bold text-base text-text-primary mb-2 leading-snug">
          {project.title}
        </h3>
        <p className="font-inter text-sm text-text-muted leading-relaxed flex-1 mb-4">
          {project.description}
        </p>

        {/* Tags */}
        <ul className="flex flex-wrap gap-1.5 mb-5" aria-label="Technologies used">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="font-mono text-[10px] text-text-muted/70 bg-bg border border-border/60 px-2 py-0.5 rounded"
            >
              {tag}
            </li>
          ))}
        </ul>

        {/* Link */}
        {project.status === 'live' ? (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-space-grotesk text-xs font-semibold text-accent hover:text-accent-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            aria-label={`View ${project.title} on LinkedIn`}
          >
            See project <ExternalLink size={11} />
          </a>
        ) : (
          <span className="font-space-grotesk text-xs text-text-muted/40 cursor-not-allowed">
            In progress…
          </span>
        )}
      </div>
    </article>
  )
}

export default function ProjectsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollXProgress } = useScroll({ container: scrollRef })
  const progressWidth = useTransform(scrollXProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="projects" className="py-24 bg-bg">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em] block mb-3">
              02 / Selected Work
            </span>
            <TextAnimation
              as="h2"
              text="Selected Projects"
              direction="up"
              className="font-syne font-black text-3xl md:text-5xl text-text-primary"
            />
          </div>

          {/* Scroll affordance */}
          <div
            className="flex items-center gap-2 text-text-muted/60 shrink-0"
            aria-hidden="true"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest">
              Drag to explore
            </span>
            <ArrowRight size={12} className="animate-bounce-x" />
          </div>
        </div>

        {/* Horizontal scroll track — ref on the outer div for useScroll */}
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing pb-4"
          style={{ scrollSnapType: 'x mandatory' } as React.CSSProperties}
        >
          <Spotlight className="flex gap-5 w-max">
            {projects.map((project, i) => (
              <SpotLightItem
                key={project.id}
                className="shrink-0 w-[320px] sm:w-[360px] group"
                style={{ scrollSnapAlign: 'start' } as React.CSSProperties}
              >
                <ScrollElement
                  viewport={{ once: true, amount: 0.2, margin: '0px' }}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
                    },
                  }}
                  className="h-full"
                >
                  <ProjectCard project={project} />
                </ScrollElement>
              </SpotLightItem>
            ))}
          </Spotlight>
        </div>

        {/* Scroll progress bar */}
        <div
          className="mt-4 h-px bg-border/60 relative overflow-hidden rounded-full"
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-y-0 left-0 bg-accent/60 rounded-full"
            style={{ width: progressWidth }}
          />
        </div>
      </div>
    </section>
  )
}
