/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["api-annual.uef.edu.vn"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api-annual.uef.edu.vn",
        pathname: "/**/*",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false, path: false };
    }
    return config;
  },
  experimental: {
    turbo: {
      resolveExtensions: [
        ".mdx",
        ".tsx",
        ".ts",
        ".jsx",
        ".js",
        ".mjs",
        ".json",
      ],
    },
  },
};

export default nextConfig;
