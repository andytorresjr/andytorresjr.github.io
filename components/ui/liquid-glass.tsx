'use client'
import React from 'react'
import { cn } from '@/lib/utils'

interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  glowIntensity?: 'sm' | 'md' | 'lg'
  shadowIntensity?: 'sm' | 'md' | 'lg'
  blurIntensity?: 'sm' | 'md' | 'lg'
  borderRadius?: string
  draggable?: boolean
}

export function LiquidGlassCard({
  children,
  className,
  glowIntensity = 'md',
  shadowIntensity = 'md',
  blurIntensity = 'md',
  borderRadius = '12px',
  draggable = false,
  ...props
}: LiquidGlassCardProps) {
  const blurClass = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-xl',
  }[blurIntensity]

  const glow = {
    sm: '0 0 12px rgba(255,255,255,0.04)',
    md: '0 0 24px rgba(255,255,255,0.07)',
    lg: '0 0 48px rgba(255,255,255,0.12)',
  }[glowIntensity]

  const shadow = {
    sm: '0 2px 8px rgba(0,0,0,0.25)',
    md: '0 4px 20px rgba(0,0,0,0.35)',
    lg: '0 8px 40px rgba(0,0,0,0.5)',
  }[shadowIntensity]

  return (
    <div
      className={cn(
        'relative overflow-hidden border border-white/10 bg-white/5',
        blurClass,
        className
      )}
      style={{ borderRadius, boxShadow: `${glow}, ${shadow}` }}
      draggable={draggable}
      {...props}
    >
      {/* Inner highlight gradient */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.03) 100%)',
        }}
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
