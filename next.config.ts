import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Determine the backend URL (fallback to localhost for local dev)
    const backendUrl = process.env.NEXT_PUBLIC_API_URL 
      ? process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '') 
      : "http://localhost:5000";

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`, // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
