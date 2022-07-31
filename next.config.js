/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['2.bp.blogspot.com'],
    deviceSizes: [160, 320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  rewrites: async () => {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: `/sitemap-:index(\\d+).xml`,
        destination: '/api/sitemap?index=:index',
      },
      {
        source: '/all-comics',
        destination: '/all-comics/0/0',
      },
      {
        source: '/all-comics/:letter',
        destination: '/all-comics/:letter/0',
      },
      {
        source: '/tag/:tag',
        destination: '/tag/:tag/0',
      },
    ];
  },
};

module.exports = nextConfig;
