import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Silence workspace root warning when a parent package-lock.json exists
  outputFileTracingRoot: path.join(__dirname),
}

export default nextConfig
