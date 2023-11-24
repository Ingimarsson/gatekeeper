/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_MOCKING: process.env.NEXT_MOCKING,
  },
  async rewrites() {
    return [
      { source: "/auth/:path*", destination: "/api/auth/:path*" },
      { source: "/auth-check", destination: "/api/check" },
    ];
  },
};

module.exports = nextConfig;
