/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@retail/shared', '@retail/ui'],
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://35.154.89.77:8000',
  },
}

module.exports = nextConfig
