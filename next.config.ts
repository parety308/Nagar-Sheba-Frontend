import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000/api/v1";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/api/v1/:path*", destination: `${BACKEND_URL}/:path*` },
    ];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;