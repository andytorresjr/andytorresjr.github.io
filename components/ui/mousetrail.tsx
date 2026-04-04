// Adapted from UILayouts — ui-layouts/uilayouts
// Source: apps/ui-layout/components/ui/mousetrail.tsx
'use client'
import { cn } from '@/lib/utils'
import { createRef, ReactNode, useRef } from 'react'

interface ImageMouseTrailProps {
  items: string[]
  children?: ReactNode
  className?: string
  imgClass?: string
  distance?: number
  maxNumberOfImages?: number
  fadeAnimation?: boolean
}

export default function ImageMouseTrail({
  items,
  children,
  className,
  maxNumberOfImages = 5,
  imgClass = 'w-40 h-48',
  distance = 20,
  fadeAnimation = false,
}: ImageMouseTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const refs = useRef(items.map(() => createRef<HTMLImageElement>()))
  const currentZIndexRef = useRef(1)

  let globalIndex = 0
  let last = { x: 0, y: 0 }

  const activate = (image: HTMLImageElement, x: number, y: number) => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return
    const relativeX = x - containerRect.left
    const relativeY = y - containerRect.top
    image.style.left = `${relativeX}px`
    image.style.top = `${relativeY}px`

    if (currentZIndexRef.current > 40) {
      currentZIndexRef.current = 1
    }
    image.style.zIndex = String(currentZIndexRef.current)
    currentZIndexRef.current++

    image.dataset.status = 'active'
    if (fadeAnimation) {
      setTimeout(() => {
        image.dataset.status = 'inactive'
      }, 1500)
    }
    last = { x, y }
  }

  const distanceFromLast = (x: number, y: number) => {
    return Math.hypot(x - last.x, y - last.y)
  }

  const deactivate = (image: HTMLImageElement) => {
    image.dataset.status = 'inactive'
  }

  const handleOnMove = (e: { clientX: number; clientY: number }) => {
    if (distanceFromLast(e.clientX, e.clientY) > window.innerWidth / distance) {
      const lead = refs.current[globalIndex % refs.current.length].current
      const tail =
        refs.current[(globalIndex - maxNumberOfImages) % refs.current.length]
          ?.current

      if (lead) activate(lead, e.clientX, e.clientY)
      if (tail) deactivate(tail)
      globalIndex++
    }
  }

  return (
    <div
      onMouseMove={handleOnMove}
      onTouchMove={(e) => handleOnMove(e.touches[0])}
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden',
        className
      )}
    >
      {items.map((item, index) => (
        <img
          key={`${item}-${index}`}
          className={cn(
            "object-cover scale-0 opacity-0 data-[status='active']:scale-100 data-[status='active']:opacity-100 transition-all data-[status='active']:duration-500 duration-300 data-[status='active']:ease-out absolute -translate-y-[50%] -translate-x-[50%] rounded-lg pointer-events-none",
            imgClass
          )}
          data-index={index}
          data-status="inactive"
          src={item}
          alt=""
          aria-hidden="true"
          ref={refs.current[index]}
        />
      ))}
      {children}
    </div>
  )
}
