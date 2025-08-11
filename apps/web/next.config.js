/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@retail/shared', '@retail/ui'],
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://ecs-netware-view-lb-949622788.ap-south-1.elb.amazonaws.com',
  },
}

module.exports = nextConfig
