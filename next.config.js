/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,

  images: {
    domains: ['edu.largifysolutions.com'],
    formats: ['image/avif', 'image/webp'],
    unoptimized: true
  },

};

module.exports = nextConfig