// Adapted from UILayouts — ui-layouts/uilayouts
// Source: apps/ui-layout/components/ui/scroll-text.tsx
'use client'

import React, { type JSX } from 'react'
import { motion, HTMLMotionProps, Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

type Direction = 'up' | 'down' | 'left' | 'right'

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const generateVariants = (direction: Direction): Variants => {
  const isX = direction === 'left' || direction === 'right'
  const value = direction === 'right' || direction === 'down' ? 60 : -60

  return {
    hidden: {
      filter: 'blur(8px)',
      opacity: 0,
      x: isX ? value : 0,
      y: isX ? 0 : value,
    },
    visible: {
      filter: 'blur(0px)',
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.45,
        ease: 'easeOut',
      },
    },
  }
}

const defaultViewport = { amount: 0.3, margin: '0px', once: true }

interface TextAnimationProps {
  text: string
  className?: string
  as?: keyof JSX.IntrinsicElements
  viewport?: { amount?: number; margin?: string; once?: boolean }
  direction?: Direction
  letterAnime?: boolean
  lineAnime?: boolean
}

const TextAnimation = ({
  as = 'h2',
  text,
  className = '',
  viewport = defaultViewport,
  direction = 'up',
  letterAnime = false,
  lineAnime = false,
}: TextAnimationProps) => {
  const baseVariants = generateVariants(direction)

  const MotionComponent = motion[
    as as keyof typeof motion
  ] as React.ComponentType<HTMLMotionProps<'div'>>

  return (
    <MotionComponent
      whileInView="visible"
      initial="hidden"
      variants={containerVariants}
      viewport={viewport}
      className={cn('inline-block', className)}
    >
      {lineAnime ? (
        <motion.span className="inline-block" variants={baseVariants}>
          {text}
        </motion.span>
      ) : (
        <>
          {text.split(' ').map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              className="inline-block"
              variants={letterAnime ? {} : baseVariants}
            >
              {letterAnime ? (
                <>
                  {word.split('').map((letter, letterIndex) => (
                    <motion.span
                      key={letterIndex}
                      className="inline-block"
                      variants={baseVariants}
                    >
                      {letter}
                    </motion.span>
                  ))}
                  &nbsp;
                </>
              ) : (
                <>{word}&nbsp;</>
              )}
            </motion.span>
          ))}
        </>
      )}
    </MotionComponent>
  )
}

export default TextAnimation
