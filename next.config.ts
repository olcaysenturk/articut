import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "150mb",
    },
  },
  images: {
    localPatterns: [
      {
        pathname: "/api/cms-media",
      },
      {
        pathname: "/api/cms-media/**",
      },
      {
        pathname: "/images/**",
      },
      {
        pathname: "/figma/**",
      },
      {
        pathname: "/uploads/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
};

export default nextConfig;
