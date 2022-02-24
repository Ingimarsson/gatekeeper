/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_MOCKING: process.env.NEXT_MOCKING
  }
};

module.exports = nextConfig;
