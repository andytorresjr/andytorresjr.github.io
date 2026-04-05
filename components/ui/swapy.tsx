'use client'
import React, { useEffect, useRef } from 'react'
import { createSwapy } from 'swapy'
import { cn } from '@/lib/utils'

// ── SwapyLayout ──────────────────────────────────────────────────────────────

interface SwapyLayoutProps {
  children: React.ReactNode
  id?: string
  className?: string
  config?: Parameters<typeof createSwapy>[1]
  onSwap?: (event: { newSlotItemMap: { asArray: { slot: string; item: string | null }[] } }) => void
}

export function SwapyLayout({ children, id, className, config, onSwap }: SwapyLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const swapy = createSwapy(containerRef.current, config)
    if (onSwap) {
      swapy.onSwap(onSwap)
    }
    return () => {
      swapy.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={containerRef} id={id} className={className}>
      {children}
    </div>
  )
}

// ── SwapySlot ────────────────────────────────────────────────────────────────

interface SwapySlotProps {
  id: string
  children?: React.ReactNode
  className?: string
}

export function SwapySlot({ id, children, className }: SwapySlotProps) {
  return (
    <div data-swapy-slot={id} className={className}>
      {children}
    </div>
  )
}

// ── SwapyItem ────────────────────────────────────────────────────────────────

interface SwapyItemProps {
  id: string
  children: React.ReactNode
  className?: string
}

export function SwapyItem({ id, children, className }: SwapyItemProps) {
  return (
    <div data-swapy-item={id} className={cn('cursor-grab active:cursor-grabbing', className)}>
      {children}
    </div>
  )
}
