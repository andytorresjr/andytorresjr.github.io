'use client'
// Adapted from UILayouts SmoothScroll — wraps children in ReactLenis for silky scrolling
import { ReactLenis } from 'lenis/react'

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
