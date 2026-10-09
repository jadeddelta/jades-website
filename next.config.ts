import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    // ties year to when the website was last built, rather than manually setting it.
    BUILD_YEAR: String(new Date().getFullYear()),
  },
}

export default nextConfig
