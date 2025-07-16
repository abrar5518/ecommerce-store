import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['img.youtube.com', 'admin.bestfashionllc.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.bestfashionllc.com', 
      },
      {
        protocol: 'https',
        hostname: 'd1up4ebiscsd6l.cloudfront.net',
      },
    ],
  },
};

export default nextConfig;

