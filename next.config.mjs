/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'cdni.iconscout.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        // When you call /api/auth/..., Next.js sends it to localhost:8000
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*', 
      },
    ];
  },
};

export default nextConfig;
