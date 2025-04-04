import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.module.rules.push({
      test: /\.worker\.js$/,
      loader: "worker-loader",
      options: {
        esModule: false, // Important for Next.js compatibility
      },
    });

    return config;
  },
};

export default nextConfig;
