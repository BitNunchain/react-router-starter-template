/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost', 'unifiednun.com', 'blockchain.unifiednun.com', 'rpc.unifiednun.com'],
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_RPC_URL: process.env.NODE_ENV === 'production' 
      ? 'https://rpc.unifiednun.com' 
      : 'http://localhost:63886',
    NEXT_PUBLIC_CHAIN_ID: '2151908',
    NEXT_PUBLIC_CHAIN_NAME: 'UnifiedNun',
    NEXT_PUBLIC_CURRENCY_SYMBOL: 'NUN',
  },
  async rewrites() {
    return [
      {
        source: '/api/rpc/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'https://rpc.unifiednun.com/:path*'
          : 'http://localhost:63886/:path*'
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig