'use client'
import React, { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'

function wrap(min: number, max: number, v: number): number {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

interface ScrollBaseAnimationProps {
  children: React.ReactNode
  baseVelocity?: number
  clasname?: string
  delay?: number
}

export default function ScrollBaseAnimation({
  children,
  baseVelocity = -3,
  clasname = '',
}: ScrollBaseAnimationProps) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  })

  const x = useTransform(baseX, (v) => `${wrap(-100 / 4, 0, v)}%`)
  const directionFactor = useRef<number>(1)

  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get()
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap">
      <motion.div
        className={`flex whitespace-nowrap flex-nowrap ${clasname}`}
        style={{ x }}
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="block mr-8">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
