import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  // Keep precache light — skip oversized build assets / data dumps.
  maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
  additionalPrecacheEntries: [{ url: "/~offline", revision: "hsl-offline-v1" }],
});

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/beacon-bookshelf",
        destination: "/lighthouse-library",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default withSerwist(nextConfig);
