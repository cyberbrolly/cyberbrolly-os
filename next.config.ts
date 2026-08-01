import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.86.115.49"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
