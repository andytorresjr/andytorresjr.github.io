'use client'
// Adapted from UILayouts Framer Stacking — shows Andy's key tech domains
import { useRef } from 'react'
import { useTransform, motion, useScroll } from 'framer-motion'
import { ReactLenis } from 'lenis/react'
import TextAnimation from '@/components/ui/scroll-text'

const areas = [
  {
    title: 'Embedded Systems',
    description:
      'Writing firmware for ARM Cortex-M microcontrollers using embedded C. Designing interrupt-driven I/O, real-time scheduling, and peripheral drivers from the register level.',
    tags: ['ARM Cortex-M', 'Embedded C', 'RTOS', 'MSPM0', 'TM4C123'],
    color: '#0f1f3d',
    accent: '#6366f1',
  },
  {
    title: 'Digital Design',
    description:
      'Implementing finite state machines and combinational logic in Verilog HDL. Targeting FPGAs for synthesis and simulation, from truth tables through timing closure.',
    tags: ['Verilog', 'FPGA', 'FSM', 'Synthesis', 'ModelSim'],
    color: '#0c2318',
    accent: '#22d3ee',
  },
  {
    title: 'PCB Engineering',
    description:
      'Designing two- and four-layer boards in KiCad — from schematic capture through DRC-clean layout. Emphasis on power delivery, decoupling, and signal integrity.',
    tags: ['KiCad', 'Schematic', 'PCB Layout', 'DRC', 'Power Design'],
    color: '#2a0c1e',
    accent: '#f472b6',
  },
  {
    title: 'Signal Processing',
    description:
      'Analyzing and filtering signals using MATLAB and Python. Applied DSP concepts including FFTs, FIR/IIR filters, and frequency-domain analysis to real sensor data.',
    tags: ['MATLAB', 'Python', 'DSP', 'FFT', 'NumPy'],
    color: '#18102a',
    accent: '#a78bfa',
  },
  {
    title: 'Web Engineering',
    description:
      'Building modern portfolios and tooling with React and Next.js. TypeScript-first, performance-aware, and comfortable with full design-system workflows.',
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Framer Motion'],
    color: '#1a1200',
    accent: '#fbbf24',
  },
]

interface CardProps {
  i: number
  area: (typeof areas)[0]
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  range: [number, number]
  targetScale: number
}

function AreaCard({ i, area, progress, range, targetScale }: CardProps) {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  })
  const scale = useTransform(progress, range, [1, targetScale])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 1])

  return (
    <div
      ref={container}
      className="h-screen flex items-center justify-center sticky top-0"
    >
      <motion.div
        style={{
          backgroundColor: area.color,
          scale,
          top: `calc(-5vh + ${i * 22}px)`,
          opacity,
        }}
        className="relative flex flex-col h-[420px] w-[85%] max-w-3xl rounded-2xl p-8 lg:p-10 origin-top border border-white/10"
      >
        {/* Accent line */}
        <div
          className="absolute left-0 top-8 bottom-8 w-[3px] rounded-full"
          style={{ background: area.accent }}
        />

        <div className="flex flex-col lg:flex-row h-full gap-8 pl-5">
          {/* Left */}
          <div className="lg:w-[45%] flex flex-col justify-between">
            <div>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.25em] mb-3 block"
                style={{ color: area.accent }}
              >
                {String(i + 1).padStart(2, '0')} / Tech Domain
              </span>
              <h3 className="font-syne font-black text-2xl lg:text-3xl text-text-primary mb-4 leading-tight">
                {area.title}
              </h3>
              <p className="font-inter text-sm text-text-muted/80 leading-relaxed">
                {area.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-4">
              {area.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] px-2 py-0.5 rounded border"
                  style={{ color: area.accent, borderColor: `${area.accent}40`, background: `${area.accent}10` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right — decorative grid pattern */}
          <div className="lg:w-[55%] relative rounded-xl overflow-hidden">
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${area.accent}20 0%, transparent 70%)`,
              }}
            />
            <div
              className="absolute inset-0 opacity-20 rounded-xl"
              style={{
                backgroundImage: `linear-gradient(${area.accent}40 1px, transparent 1px), linear-gradient(90deg, ${area.accent}40 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
              }}
            />
            {/* Center monogram */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="font-syne font-black text-[8rem] leading-none select-none"
                style={{ color: `${area.accent}18` }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function TechAreasSection() {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.4 }}>
      <section id="tech-areas" aria-label="Technical areas" ref={container} className="bg-bg">
        {/* Header */}
        <div className="sticky top-0 z-20 py-8 px-6 md:px-12 max-w-7xl mx-auto pointer-events-none">
          <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em] block mb-2">
            05 / Tech Areas
          </span>
          <TextAnimation
            as="h2"
            text="Core Disciplines"
            direction="up"
            className="font-syne font-black text-3xl md:text-4xl text-text-primary"
          />
        </div>

        {areas.map((area, i) => {
          const targetScale = 1 - (areas.length - i) * 0.04
          return (
            <AreaCard
              key={area.title}
              i={i}
              area={area}
              progress={scrollYProgress}
              range={[i * 0.2, 1]}
              targetScale={targetScale}
            />
          )
        })}
      </section>
    </ReactLenis>
  )
}
