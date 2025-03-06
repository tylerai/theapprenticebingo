/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  transpilePackages: ['@/lib', '@/components']
};

module.exports = nextConfig; 