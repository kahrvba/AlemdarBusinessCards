import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wnnwi3oglhsnvsed.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: false,
  },
};
export default nextConfig;
