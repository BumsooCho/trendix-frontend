import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    qualities: [100, 75],
  },
}

export default nextConfig
