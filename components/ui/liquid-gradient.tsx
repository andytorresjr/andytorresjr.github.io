'use client'
import React from 'react'

interface LiquidProps {
  isHovered: boolean
  colors: Record<string, string>
}

export function Liquid({ isHovered, colors }: LiquidProps) {
  const colorValues = Object.values(colors).slice(0, 9)

  return (
    <div className="absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes liquid-a { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(8%,6%) scale(1.06)} }
        @keyframes liquid-b { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-6%,9%) scale(1.09)} }
        @keyframes liquid-c { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(7%,-8%) scale(1.05)} }
      `}</style>
      {colorValues.map((color, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            background: color,
            width: `${55 + (i % 3) * 18}%`,
            height: `${55 + (i % 2) * 18}%`,
            left: `${(i * 37) % 60 - 15}%`,
            top: `${(i * 41) % 60 - 15}%`,
            opacity: 0.75,
            filter: `blur(${16 + i * 3}px)`,
            transform: isHovered
              ? `scale(1.4) translate(${(i % 3 - 1) * 4}%, ${(i % 2 - 0.5) * 4}%)`
              : 'scale(1)',
            transition: `transform ${0.5 + i * 0.08}s ease`,
            animationName: ['liquid-a', 'liquid-b', 'liquid-c'][i % 3],
            animationDuration: `${4 + i * 0.6}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDirection: 'alternate',
          }}
        />
      ))}
    </div>
  )
}
