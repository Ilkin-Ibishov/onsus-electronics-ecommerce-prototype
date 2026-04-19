/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  basePath: '/onsus-electronics-ecommerce-prototype',
  images: { unoptimized: true },
};

module.exports = nextConfig;
