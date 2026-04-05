import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        'space-grotesk': ['var(--font-space-grotesk)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      colors: {
        bg: '#080808',
        surface: '#111111',
        'surface-2': '#1a1a1a',
        border: '#27272a',
        accent: '#6366f1',
        'accent-2': '#22d3ee',
        'text-primary': '#f4f4f5',
        'text-muted': '#71717a',
      },
      animation: {
        marquee: 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        'marquee-reverse': 'marquee var(--duration) linear infinite reverse',
        'marquee-vertical-reverse':
          'marquee-vertical var(--duration) linear infinite reverse',
        'bounce-x': 'bounce-x 1.2s ease-in-out infinite',
        'infinite-scroll': 'infinite-scroll 30s linear infinite',
        'infinite-scroll-reverse': 'infinite-scroll 30s linear infinite reverse',
        border: 'border-rotate 4s linear infinite',
        spin: 'spin 1s linear infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
        'bounce-x': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(6px)' },
        },
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'border-rotate': {
          to: { '--border-angle': '360deg' },
        },
      },
    },
  },
  plugins: [],
}

export default config
