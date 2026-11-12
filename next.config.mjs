/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'github.com',
      'avatars.githubusercontent.com',
      'urxmhcwxawknhbeokhdv.supabase.co'
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  async redirects() {
    return [
      {
        source: '/admin/:path*',
        destination: '/haunted/:path*',
        permanent: false,
      },
      {
        source: '/admin',
        destination: '/haunted',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
