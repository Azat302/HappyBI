import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Убрано buildActivity (не поддерживается в новой версии Next.js)
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
