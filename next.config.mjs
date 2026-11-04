/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  cleanDistDir: true,
  serverExternalPackages: ['mongoose', 'cloudinary'],
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
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
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return [];
    }
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
