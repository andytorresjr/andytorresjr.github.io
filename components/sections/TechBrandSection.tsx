import React from 'react'

// Adapated from UILayouts InfinityBandScroll — replaced social icons with tech stack badges
const techStack = [
  { label: 'Embedded C', color: '#6366f1' },
  { label: 'ARM Cortex-M', color: '#22d3ee' },
  { label: 'Verilog', color: '#a78bfa' },
  { label: 'KiCad PCB', color: '#34d399' },
  { label: 'Python', color: '#fbbf24' },
  { label: 'MATLAB', color: '#f87171' },
  { label: 'FPGA', color: '#60a5fa' },
  { label: 'RTOS', color: '#c084fc' },
  { label: 'Next.js', color: '#f4f4f5' },
  { label: 'TypeScript', color: '#38bdf8' },
]

function TechBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 font-mono text-xs px-4 py-2.5 rounded-md border whitespace-nowrap select-none"
      style={{
        color,
        borderColor: `${color}33`,
        background: `${color}0d`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: color }}
        aria-hidden="true"
      />
      {label}
    </span>
  )
}

export default function TechBrandSection() {
  return (
    <section
      aria-label="Technology stack"
      className="py-12 bg-surface/20 border-y border-border/40 overflow-hidden"
    >
      <p className="font-mono text-[10px] text-text-muted/40 uppercase tracking-[0.3em] text-center mb-6">
        Technologies &amp; Tools
      </p>

      {/* Row 1 — scrolls left */}
      <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:linear-gradient(to_right,transparent_0,black_128px,black_calc(100%-128px),transparent_100%)] mb-3">
        <ul className="flex items-center gap-4 animate-infinite-scroll [&_li]:mx-1">
          {[...techStack, ...techStack].map((t, i) => (
            <li key={`a-${i}`}>
              <TechBadge label={t.label} color={t.color} />
            </li>
          ))}
        </ul>
        <ul className="flex items-center gap-4 animate-infinite-scroll [&_li]:mx-1" aria-hidden="true">
          {[...techStack, ...techStack].map((t, i) => (
            <li key={`a2-${i}`}>
              <TechBadge label={t.label} color={t.color} />
            </li>
          ))}
        </ul>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:linear-gradient(to_right,transparent_0,black_128px,black_calc(100%-128px),transparent_100%)]">
        <ul className="flex items-center gap-4 animate-infinite-scroll-reverse [&_li]:mx-1">
          {[...techStack].reverse().concat([...techStack].reverse()).map((t, i) => (
            <li key={`b-${i}`}>
              <TechBadge label={t.label} color={t.color} />
            </li>
          ))}
        </ul>
        <ul className="flex items-center gap-4 animate-infinite-scroll-reverse [&_li]:mx-1" aria-hidden="true">
          {[...techStack].reverse().concat([...techStack].reverse()).map((t, i) => (
            <li key={`b2-${i}`}>
              <TechBadge label={t.label} color={t.color} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
