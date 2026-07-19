import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-6c6725674d9e493b9e62fa70cc59fd66.r2.dev",
      },
    ],
  },
};

export default nextConfig;
