// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

// next.config.js
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ⚠️ Skips type checking errors
  },
  eslint: {
    ignoreDuringBuilds: true, // ⚠️ Skips ESLint errors
  },
};

module.exports = nextConfig;
