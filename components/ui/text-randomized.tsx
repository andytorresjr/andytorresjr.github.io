// Adapted from UILayouts — ui-layouts/uilayouts
// Source: apps/ui-layout/components/ui/text-randomized.tsx
'use client'

import React, { useEffect, useState, useCallback } from 'react'

const lettersAndSymbols = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*-_+=;:<>,'

interface AnimatedTextProps {
  text: string
  className?: string
}

export function RandomizedTextEffect({ text, className }: AnimatedTextProps) {
  const [animatedText, setAnimatedText] = useState('')

  const getRandomChar = useCallback(
    () =>
      lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)],
    []
  )

  const animateText = useCallback(async () => {
    const duration = 50
    const revealDuration = 80
    const initialRandomDuration = 400

    const generateRandomText = () =>
      text
        .split('')
        .map((char) => (char === ' ' ? ' ' : getRandomChar()))
        .join('')

    setAnimatedText(generateRandomText())

    const endTime = Date.now() + initialRandomDuration
    while (Date.now() < endTime) {
      await new Promise((resolve) => setTimeout(resolve, duration))
      setAnimatedText(generateRandomText())
    }

    for (let i = 0; i < text.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, revealDuration))
      setAnimatedText(
        (prevText) =>
          text.slice(0, i + 1) +
          prevText
            .slice(i + 1)
            .split('')
            .map((char) => (char === ' ' ? ' ' : getRandomChar()))
            .join('')
      )
    }
  }, [text, getRandomChar])

  useEffect(() => {
    animateText()
  }, [text, animateText])

  return (
    <span className={className} aria-label={text}>
      {animatedText}
    </span>
  )
}
