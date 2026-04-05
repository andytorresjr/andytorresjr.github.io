'use client'
import React, { createContext, useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'

// ── Contexts ────────────────────────────────────────────────────────────────

interface AccordionCtx {
  value: string | null
  onChange: (v: string) => void
}
const AccordionContext = createContext<AccordionCtx>({ value: null, onChange: () => {} })

interface ItemCtx {
  value: string
  isOpen: boolean
}
const ItemContext = createContext<ItemCtx>({ value: '', isOpen: false })

// ── Accordion (root) ────────────────────────────────────────────────────────

interface AccordionProps {
  children: React.ReactNode
  defaultValue?: string
  className?: string
}

export function Accordion({ children, defaultValue, className }: AccordionProps) {
  const [active, setActive] = useState<string | null>(defaultValue ?? null)

  function onChange(v: string) {
    setActive((prev) => (prev === v ? null : v))
  }

  return (
    <AccordionContext.Provider value={{ value: active, onChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

// ── AccordionItem ────────────────────────────────────────────────────────────

interface AccordionItemProps {
  children: React.ReactNode
  value: string
  className?: string
}

export function AccordionItem({ children, value, className }: AccordionItemProps) {
  const { value: active } = useContext(AccordionContext)
  const isOpen = active === value

  return (
    <ItemContext.Provider value={{ value, isOpen }}>
      <div className={cn('border-b border-border/60', className)}>{children}</div>
    </ItemContext.Provider>
  )
}

// ── AccordionHeader ──────────────────────────────────────────────────────────

export function AccordionHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { value, isOpen } = useContext(ItemContext)
  const { onChange } = useContext(AccordionContext)

  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={cn(
        'flex w-full items-center justify-between py-4 text-left font-space-grotesk font-semibold text-text-primary hover:text-accent transition-colors',
        className
      )}
      aria-expanded={isOpen}
    >
      <span>{children}</span>
      <motion.span
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
        className="shrink-0 text-text-muted"
      >
        <Plus size={16} />
      </motion.span>
    </button>
  )
}

// ── AccordionPanel ───────────────────────────────────────────────────────────

export function AccordionPanel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { isOpen } = useContext(ItemContext)

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className={cn('pb-4 font-inter text-sm text-text-muted leading-relaxed', className)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Layout helpers (match UILayouts API) ─────────────────────────────────────

export function AccordionContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('grid gap-4', className)}>{children}</div>
}

export function AccordionWrapper({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('w-full', className)}>{children}</div>
}
