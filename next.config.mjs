/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/notrust',
        destination: '/NoTrust',
        permanent: true,
      },
      {
        source: '/NOTRUST',
        destination: '/NoTrust',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.staticflickr.com',
      },
      {
        protocol: 'https',
        hostname: 'live.staticflickr.com',
      },
      {
        protocol: 'https',
        hostname: 'www.cthousegop.com',
      },
      {
        protocol: 'https',
        hostname: 'cthousegop.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com', // YouTube thumbnails
      },
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com', // Instagram content
      },
      {
        protocol: 'https',
        hostname: 'scontent-iad3-1.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: 'scontent-iad3-2.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      }
    ],
    unoptimized: true, // Assuming this was intentional from your previous config
  },
};

export default nextConfig;
