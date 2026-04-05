'use client'
// Adapted from UILayouts DefaultSwapy — portfolio stats dashboard
import { useMemo, useState } from 'react'
import { utils } from 'swapy'
import { SwapyItem, SwapyLayout, SwapySlot } from '@/components/ui/swapy'
import TextAnimation from '@/components/ui/scroll-text'
import { Cpu, Layers, Users, MapPin, GraduationCap, Code2, Zap, BookOpen, Award } from 'lucide-react'

function StatCard({
  icon: Icon,
  value,
  label,
  sub,
  accent,
}: {
  icon: React.ElementType
  value: string
  label: string
  sub?: string
  accent: string
}) {
  return (
    <div className="h-full rounded-xl p-5 flex flex-col justify-between bg-surface border border-border/60 hover:border-border transition-colors">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
        style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
      >
        <Icon size={16} style={{ color: accent }} />
      </div>
      <div>
        <p
          className="font-syne font-black text-3xl leading-none mb-1"
          style={{ color: accent }}
        >
          {value}
        </p>
        <p className="font-space-grotesk text-sm font-semibold text-text-primary">{label}</p>
        {sub && <p className="font-mono text-[10px] text-text-muted/50 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

const cards = [
  {
    id: '1',
    icon: Cpu,
    value: '3+',
    label: 'Projects Built',
    sub: 'embedded & web',
    accent: '#6366f1',
    className: 'lg:col-span-4 sm:col-span-6 col-span-12',
  },
  {
    id: '2',
    icon: Code2,
    value: '5+',
    label: 'Languages',
    sub: 'C, Python, Verilog…',
    accent: '#22d3ee',
    className: 'lg:col-span-4 sm:col-span-6 col-span-12',
  },
  {
    id: '3',
    icon: GraduationCap,
    value: 'B.S.',
    label: 'ECE Degree',
    sub: 'UT Austin',
    accent: '#f472b6',
    className: 'lg:col-span-4 sm:col-span-6 col-span-12',
  },
  {
    id: '4',
    icon: Layers,
    value: 'Full',
    label: 'HW → SW Stack',
    sub: 'schematic to ship',
    accent: '#a78bfa',
    className: 'lg:col-span-4 sm:col-span-6 col-span-12',
  },
  {
    id: '5',
    icon: Award,
    value: 'IEEE',
    label: 'Member',
    sub: 'UT Austin chapter',
    accent: '#fbbf24',
    className: 'lg:col-span-4 sm:col-span-6 col-span-12',
  },
  {
    id: '6',
    icon: Users,
    value: 'STEM',
    label: 'Mentor',
    sub: 'Laredo → Austin',
    accent: '#34d399',
    className: 'lg:col-span-4 sm:col-span-6 col-span-12',
  },
  {
    id: '7',
    icon: Zap,
    value: 'RTOS',
    label: 'Real-Time Systems',
    sub: 'interrupt-driven I/O',
    accent: '#fb923c',
    className: 'lg:col-span-4 sm:col-span-6 col-span-12',
  },
  {
    id: '8',
    icon: BookOpen,
    value: '2026',
    label: 'Graduation',
    sub: 'expected Dec',
    accent: '#38bdf8',
    className: 'lg:col-span-4 sm:col-span-6 col-span-12',
  },
  {
    id: '9',
    icon: MapPin,
    value: 'ATX',
    label: 'Based In',
    sub: 'Austin, TX',
    accent: '#e879f9',
    className: 'lg:col-span-4 sm:col-span-12 col-span-12',
  },
]

export default function StatsSection() {
  const [slotItemMap, setSlotItemMap] = useState(
    utils.initSlotItemMap(cards, 'id')
  )
  const slottedItems = useMemo(
    () => utils.toSlottedItems(cards, 'id', slotItemMap),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [slotItemMap]
  )

  return (
    <section id="stats" className="py-24 bg-surface/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-10">
          <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em] block mb-3">
            06 / At a Glance
          </span>
          <TextAnimation
            as="h2"
            text="Quick Stats"
            direction="up"
            className="font-syne font-black text-3xl md:text-5xl text-text-primary"
          />
          <p className="font-inter text-sm text-text-muted/60 mt-2">
            Drag cards to rearrange — each one is a snapshot of the journey.
          </p>
        </div>

        <SwapyLayout
          id="stats-swapy"
          className="w-full"
          config={{ swapMode: 'hover' }}
          onSwap={(e) => setSlotItemMap(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            e.newSlotItemMap.asArray as any
          )}
        >
          <div className="grid w-full grid-cols-12 gap-3 md:gap-4">
            {slottedItems.map(({ slotId, itemId }) => {
              const card = cards.find((c) => c.id === itemId)
              if (!card) return null
              return (
                <SwapySlot
                  key={slotId}
                  id={slotId}
                  className={`h-40 rounded-xl ${card.className}`}
                >
                  <SwapyItem id={itemId!} className="w-full h-full rounded-xl">
                    <StatCard
                      icon={card.icon}
                      value={card.value}
                      label={card.label}
                      sub={card.sub}
                      accent={card.accent}
                    />
                  </SwapyItem>
                </SwapySlot>
              )
            })}
          </div>
        </SwapyLayout>
      </div>
    </section>
  )
}
