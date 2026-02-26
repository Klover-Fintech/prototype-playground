import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  compiler: {
    styledComponents: true,
  },
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: "/prototypes/:path*/",
        destination: "/prototypes/:path*/index.html",
      },
    ];
  },
};

export default nextConfig;
