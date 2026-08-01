/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  cleanDistDir: true,
  onDemandEntries: {
    // Keep dev pages in memory longer to prevent 404 chunk errors on fast refresh
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return [
      // Admin Utility endpoints handled natively by Vercel serverless functions
      {
        source: '/api/admin/seed',
        destination: '/api/admin/seed',
      },
      {
        source: '/api/upload',
        destination: '/api/upload',
      },
      {
        source: '/api/coupons',
        destination: '/api/coupons',
      },
      // Backend core routes proxied to the Render Express backend
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
