import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: "bottom-right",
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  serverExternalPackages: [],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
