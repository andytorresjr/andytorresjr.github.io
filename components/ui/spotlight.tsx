// Adapted from UILayouts — ui-layouts/uilayouts
// Source: apps/ui-layout/components/ui/spotlight.tsx
'use client'
import { cn } from '@/lib/utils'
import React, {
  useRef,
  useState,
  MouseEvent,
  useContext,
  createContext,
} from 'react'

interface SpotlightProps {
  children: React.ReactNode
  className?: string
  ProximitySpotlight?: boolean
  HoverFocusSpotlight?: boolean
  CursorFlowGradient?: boolean
}
interface SpotlightItemProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

interface SpotLightContextType {
  ProximitySpotlight: boolean
  HoverFocusSpotlight: boolean
  CursorFlowGradient: boolean
}

const SpotLightContext = createContext<SpotLightContextType | undefined>(
  undefined
)

export const useSpotlight = () => {
  const context = useContext(SpotLightContext)
  if (!context) {
    throw new Error('useSpotlight must be used within a SpotlightProvider')
  }
  return context
}

export const Spotlight = ({
  children,
  className,
  ProximitySpotlight = true,
  HoverFocusSpotlight = false,
  CursorFlowGradient = true,
}: SpotlightProps) => {
  return (
    <SpotLightContext.Provider
      value={{ ProximitySpotlight, HoverFocusSpotlight, CursorFlowGradient }}
    >
      <div className={cn('group relative z-10 rounded-md', className)}>
        {children}
      </div>
    </SpotLightContext.Provider>
  )
}

export function SpotLightItem({ children, className, style }: SpotlightItemProps) {
  const { HoverFocusSpotlight, ProximitySpotlight, CursorFlowGradient } =
    useSpotlight()
  const boxWrapper = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = React.useState<{
    x: number | null
    y: number | null
  }>({ x: null, y: null })

  React.useEffect(() => {
    const updateMousePosition = (ev: globalThis.MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY })
    }
    window.addEventListener('mousemove', updateMousePosition)
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])

  const [overlayColor, setOverlayColor] = useState({ x: 0, y: 0 })
  const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect()
    setOverlayColor({ x: clientX - left, y: clientY - top })
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => CursorFlowGradient && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={boxWrapper}
      style={style}
      className={cn(
        className,
        'relative rounded-lg p-[1px] bg-[#ffffff08] overflow-hidden'
      )}
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute opacity-0 z-50 rounded-xl w-full h-full group-hover:opacity-100 transition duration-300"
          style={{
            background: `radial-gradient(250px circle at ${overlayColor.x}px ${overlayColor.y}px, rgba(99,102,241,0.15), transparent 80%)`,
          }}
        />
      )}
      {HoverFocusSpotlight && (
        <div
          className="absolute opacity-0 group-hover:opacity-100 z-10 inset-0 bg-fixed rounded-lg"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99,102,241,0.3) 0%, transparent 20%, transparent) fixed`,
          }}
        />
      )}
      {ProximitySpotlight && (
        <div
          className="absolute inset-0 z-0 bg-fixed rounded-lg"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99,102,241,0.12) 0%, transparent 20%, transparent) fixed`,
          }}
        />
      )}
      {children}
    </div>
  )
}
