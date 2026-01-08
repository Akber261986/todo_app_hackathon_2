/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove experimental turbopack configuration as it's causing build issues
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;