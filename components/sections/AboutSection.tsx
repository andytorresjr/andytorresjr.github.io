'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import TextAnimation from '@/components/ui/scroll-text'
import { AnimatedBeam, Circle } from '@/components/ui/animated-beam'
import { cn } from '@/lib/utils'

// Animated beam tech diagram — nodes connected to center "AT" node
function TechConnections() {
  const containerRef = useRef<HTMLDivElement>(null)
  const centerRef = useRef<HTMLDivElement>(null)
  const refEmbeddedC = useRef<HTMLDivElement>(null)
  const refARM = useRef<HTMLDivElement>(null)
  const refKiCad = useRef<HTMLDivElement>(null)
  const refFPGA = useRef<HTMLDivElement>(null)
  const refPython = useRef<HTMLDivElement>(null)
  const refIEEE = useRef<HTMLDivElement>(null)

  const nodeClass =
    'font-mono text-[9px] text-text-muted/80 tracking-tight text-center leading-tight w-14 h-14'

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className="relative w-full h-72 select-none"
      aria-hidden="true"
    >
      {/* Left column */}
      <Circle
        ref={refEmbeddedC}
        className={cn(nodeClass, 'absolute top-4 left-4 border-border/80 bg-surface')}
      >
        Embedded C
      </Circle>
      <Circle
        ref={refPython}
        className={cn(nodeClass, 'absolute top-1/2 -translate-y-1/2 left-2 border-border/80 bg-surface')}
      >
        Python
      </Circle>
      <Circle
        ref={refKiCad}
        className={cn(nodeClass, 'absolute bottom-4 left-4 border-border/80 bg-surface')}
      >
        KiCad PCB
      </Circle>

      {/* Center */}
      <Circle
        ref={centerRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 font-syne font-black text-base text-text-primary border-accent/60 bg-surface shadow-[0_0_30px_rgba(99,102,241,0.2)]"
      >
        AT
      </Circle>

      {/* Right column */}
      <Circle
        ref={refARM}
        className={cn(nodeClass, 'absolute top-4 right-4 border-border/80 bg-surface')}
      >
        ARM M4
      </Circle>
      <Circle
        ref={refFPGA}
        className={cn(nodeClass, 'absolute top-1/2 -translate-y-1/2 right-2 border-border/80 bg-surface')}
      >
        FPGA
      </Circle>
      <Circle
        ref={refIEEE}
        className={cn(nodeClass, 'absolute bottom-4 right-4 border-border/80 bg-surface')}
      >
        IEEE
      </Circle>

      {/* Beams — all from peripheral to center */}
      <AnimatedBeam
        containerRef={containerRef as React.RefObject<HTMLElement>}
        fromRef={refEmbeddedC as React.RefObject<HTMLElement>}
        toRef={centerRef as React.RefObject<HTMLElement>}
        gradientStartColor="#6366f1"
        gradientStopColor="#22d3ee"
        curvature={-20}
        duration={5}
        delay={0}
      />
      <AnimatedBeam
        containerRef={containerRef as React.RefObject<HTMLElement>}
        fromRef={refPython as React.RefObject<HTMLElement>}
        toRef={centerRef as React.RefObject<HTMLElement>}
        gradientStartColor="#22d3ee"
        gradientStopColor="#6366f1"
        duration={6}
        delay={0.5}
      />
      <AnimatedBeam
        containerRef={containerRef as React.RefObject<HTMLElement>}
        fromRef={refKiCad as React.RefObject<HTMLElement>}
        toRef={centerRef as React.RefObject<HTMLElement>}
        gradientStartColor="#6366f1"
        gradientStopColor="#818cf8"
        curvature={20}
        duration={5.5}
        delay={1}
      />
      <AnimatedBeam
        containerRef={containerRef as React.RefObject<HTMLElement>}
        fromRef={refARM as React.RefObject<HTMLElement>}
        toRef={centerRef as React.RefObject<HTMLElement>}
        gradientStartColor="#22d3ee"
        gradientStopColor="#6366f1"
        curvature={-20}
        duration={4.5}
        delay={0.3}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef as React.RefObject<HTMLElement>}
        fromRef={refFPGA as React.RefObject<HTMLElement>}
        toRef={centerRef as React.RefObject<HTMLElement>}
        gradientStartColor="#6366f1"
        gradientStopColor="#22d3ee"
        duration={6.5}
        delay={0.8}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef as React.RefObject<HTMLElement>}
        fromRef={refIEEE as React.RefObject<HTMLElement>}
        toRef={centerRef as React.RefObject<HTMLElement>}
        gradientStartColor="#818cf8"
        gradientStopColor="#22d3ee"
        curvature={20}
        duration={5}
        delay={1.2}
        reverse
      />
    </div>
  )
}

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-surface/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div>
            <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em] block mb-4">
              03 / About Me
            </span>
            <TextAnimation
              as="h2"
              text="Hardware intuition. Software craft."
              direction="up"
              className="font-syne font-black text-3xl md:text-4xl text-text-primary mb-8 max-w-md"
            />

            <div className="space-y-5">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="font-inter text-sm md:text-base text-text-muted leading-relaxed"
              >
                I&apos;m an electrical and computer engineering student at UT Austin,
                raised in Laredo, TX. From early robotics clubs to rigorous ECE
                coursework, I found my purpose in solving complex problems with
                thoughtful hardware and software design.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
                className="font-inter text-sm md:text-base text-text-muted leading-relaxed"
              >
                My work spans the full stack of embedded development — from ARM
                assembly and real-time OS design to PCB layout in KiCad and
                FPGA prototyping in Verilog. I&apos;m energized by problems that live
                at the intersection of hardware and software.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
                className="font-inter text-sm md:text-base text-text-muted leading-relaxed"
              >
                Beyond the lab, I mentor the next generation of STEM students
                and stay connected to the engineering community through IEEE. I
                believe teamwork — on the field or in an engineering sprint — is
                rooted in communication and mutual respect.
              </motion.p>
            </div>

            {/* Quick facts */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8 grid grid-cols-2 gap-4"
            >
              {[
                ['Degree', 'B.S. ECE'],
                ['Class', '2026'],
                ['Org', 'IEEE'],
                ['Role', 'Mentor'],
              ].map(([label, value]) => (
                <div key={label} className="border border-border/60 rounded p-3 bg-surface/60">
                  <dt className="font-mono text-[9px] text-text-muted/50 uppercase tracking-widest mb-1">
                    {label}
                  </dt>
                  <dd className="font-space-grotesk text-sm font-semibold text-text-primary">
                    {value}
                  </dd>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — AnimatedBeam tech diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="rounded-xl border border-border/60 bg-surface/40 p-6"
          >
            <p className="font-mono text-[10px] text-text-muted/50 uppercase tracking-widest mb-4 text-center">
              Core Stack
            </p>
            <TechConnections />
            <p className="font-mono text-[10px] text-text-muted/30 text-center mt-4">
              Live animated signal paths
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
