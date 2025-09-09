/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true, // optional, but matches old config
  },
  eslint: {
    ignoreDuringBuilds: true, // optional, but matches old config
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s2.coinmarketcap.com",
        port: "",
        pathname: "/**", // allows all coin images
      },
    ],
  },
};

module.exports = nextConfig;
