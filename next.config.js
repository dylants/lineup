/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: [
    // `.page.tsx` for pages
    'page.tsx',
    // `.api.ts` for APIs
    'api.ts',
  ],
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
