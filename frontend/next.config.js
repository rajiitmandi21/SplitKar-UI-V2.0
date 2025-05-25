/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
    NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND: process.env.NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND || "true",
  },
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
}

module.exports = nextConfig
