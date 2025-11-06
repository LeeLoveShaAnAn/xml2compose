/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/blog.html',
        destination: '/blog',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

