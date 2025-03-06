/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  typescript: {
    // !! WARN !!
    // Disabling type checking for build performance in production
    // This is not ideal but helps with Vercel deployment issues
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disabling ESLint for build performance
    ignoreDuringBuilds: true,
  },
  swcMinify: false,
  experimental: {
    // Disable incremental builds to avoid cache issues
    incrementalCacheHandlerPath: false,
    // Use SWC transforms
    forceSwcTransforms: true,
  }
};

module.exports = nextConfig; 