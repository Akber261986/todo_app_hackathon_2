/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: {
      root: process.cwd(),
    },
  },
};

module.exports = nextConfig;