/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/receipts/:path*',
          destination: 'http://localhost:5000/receipts/:path*',
        },
      ],
    };
  },
}

module.exports = nextConfig
