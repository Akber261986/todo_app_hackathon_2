/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export to enable server-side rendering and API routes
  output: undefined, // Use default output (server-side rendering)
  trailingSlash: false, // Default behavior
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // API proxy rewrites for development and production
  async rewrites() {
    let apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.BACKEND_URL || 'http://localhost:8000';

    // Ensure the URL has a protocol
    if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
      apiUrl = `http://${apiUrl}`;
    }

    // Remove trailing slash if present to avoid double slashes with /api/:path*
    if (apiUrl.endsWith('/')) {
      apiUrl = apiUrl.slice(0, -1);
    }

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;