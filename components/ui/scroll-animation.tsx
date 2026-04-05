'use client'
import React from 'react'
import { motion, Variants } from 'framer-motion'

interface ScrollElementProps {
  children: React.ReactNode
  className?: string
  viewport?: {
    once?: boolean
    amount?: number
    margin?: string
  }
  variants?: Variants
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function ScrollElement({
  children,
  className,
  viewport = { once: true, amount: 0.5, margin: '0px 0px 0px 0px' },
  variants = defaultVariants,
}: ScrollElementProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}
