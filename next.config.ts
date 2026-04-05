import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // yahoo-finance2 bundles Deno test helpers that can't resolve in Node.
    // Stub them out so the build succeeds.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@std/testing/mock": false,
      "@std/testing/bdd": false,
      "@gadicc/fetch-mock-cache/runtimes/deno.ts": false,
      "@gadicc/fetch-mock-cache/stores/fs.ts": false,
    };
    return config;
  },
};

export default nextConfig;
