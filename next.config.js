/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Disable custom Babel configuration
  experimental: {
    forceSwcTransforms: false,
  },
  webpack: (config, { isServer }) => {
    // Add path aliases
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    config.resolve.alias['@/lib'] = path.resolve(__dirname, 'src/lib');
    config.resolve.alias['@/components'] = path.resolve(__dirname, 'src/components');
    
    // Make sure the correct extensions are resolved
    config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', '.json', ...config.resolve.extensions];
    
    // Add src/ to the module directories
    config.resolve.modules = [path.resolve(__dirname, 'src'), 'node_modules', ...config.resolve.modules || []];

    return config;
  }
};

module.exports = nextConfig; 