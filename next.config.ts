import path from "path";

/** @type {import("next").NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "src")],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "front-school.minio.ktsdev.ru",
      },
    ],
  },
  experimental: {
    turbo: {
      resolveAlias: {
        "@/*": "./src/*",
        "@styles/*": "./src/shared/styles/*",
      },
    },
  },
};

export default nextConfig;
