import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['img.youtube.com', 'admin.bestfashionllc.com'], // Add ecom.jtbsocial.com here
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.bestfashionllc.com', // Make sure this is listed here as well
      },
      {
        protocol: 'https',
        hostname: 'd1up4ebiscsd6l.cloudfront.net',
      },
    ],
  },
};

export default nextConfig;



// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     domains: ['img.youtube.com'],
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'd1up4ebiscsd6l.cloudfront.net',
//       },
//     ],
//   },
// };

// export default nextConfig;

