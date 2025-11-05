/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['pdsfruupgjezqzigncjv.supabase.co'],
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
  // Proxy API requests to Express backend (if running separately)
  async rewrites() {
    return [
      {
        source: '/api/express/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
