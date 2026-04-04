'use client'
import { Marquee } from '@/components/ui/marquee'

const row1 = [
  'Embedded C',
  'ARM Cortex-M',
  'MSPM0 LaunchPad',
  'Real-Time Systems',
  'Digital Logic',
  'FPGA · Verilog',
  'KiCad PCB Design',
  'Python',
]

const row2 = [
  'Signal Processing',
  'Finite State Machines',
  'Microcontrollers',
  'TM4C123',
  'Motor Control',
  'Power Electronics',
  'Technical Writing',
  'IEEE Member',
]

function SkillPill({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-3 font-mono text-xs text-text-muted border border-border/60 bg-surface/60 px-4 py-2 rounded-full whitespace-nowrap select-none">
      <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0" aria-hidden="true" />
      {text}
    </span>
  )
}

export default function SkillsMarquee() {
  return (
    <section
      aria-label="Core skills"
      className="py-10 bg-bg border-y border-border/40 overflow-hidden"
    >
      <div className="flex flex-col gap-3">
        {/* Row 1 — scrolls left */}
        <Marquee pauseOnHover className="[--duration:35s] [--gap:0.75rem]">
          {row1.map((skill) => (
            <SkillPill key={skill} text={skill} />
          ))}
        </Marquee>

        {/* Row 2 — scrolls right */}
        <Marquee reverse pauseOnHover className="[--duration:30s] [--gap:0.75rem]">
          {row2.map((skill) => (
            <SkillPill key={skill} text={skill} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}
