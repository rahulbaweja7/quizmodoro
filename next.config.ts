import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // This disables ESM externals so dynamic import (like pdfjs worker) works in a Webpack environment
  experimental: {
    esmExternals: false,
  },

  // Optional: add mime types if needed for the worker
  webpack(config) {
    config.module.rules.push({
      test: /\.worker\.js$/,
      use: { loader: 'worker-loader' },
    });
    return config;
  },
};

export default nextConfig;
