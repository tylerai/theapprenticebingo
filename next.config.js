/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Disable custom Babel configuration
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig; 