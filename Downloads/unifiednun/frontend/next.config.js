/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'unifiednun.com', 'blockchain.unifiednun.com', 'rpc.unifiednun.com'],
    unoptimized: true
  },
  env: {
    UNIFIEDNUN_CHAIN_ID: '2151908',
    UNIFIEDNUN_RPC_URL: process.env.NODE_ENV === 'production' 
      ? 'https://rpc.unifiednun.com' 
      : 'http://127.0.0.1:63886',
    UNIFIEDNUN_L1_RPC_URL: 'http://127.0.0.1:8545',
    UNIFIEDNUN_CHAIN_NAME: 'UnifiedNun',
    UNIFIEDNUN_TOKEN_SYMBOL: 'NUN',
    UNIFIEDNUN_TOKEN_NAME: 'UnifiedNun Token',
    UNIFIEDNUN_EXPLORER_URL: process.env.NODE_ENV === 'production' 
      ? 'https://unifiednun.com/explorer' 
      : '',
    UNIFIEDNUN_BRIDGE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://unifiednun.com/bridge' 
      : '',
  },
  async rewrites() {
    return [
      {
        source: '/api/rpc/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'https://rpc.unifiednun.com/:path*'
          : 'http://127.0.0.1:63886/:path*'
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