/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // ESLint runs during `next build` unless explicitly skipped (transition escape hatch).
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_IGNORE_ESLINT_BUILD === 'true',
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
