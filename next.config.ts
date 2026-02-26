import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
