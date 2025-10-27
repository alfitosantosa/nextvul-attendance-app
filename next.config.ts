import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "file.pasarjaya.cloud",
        pathname: "/storage/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
        pathname: "/oauth_google/**",
      },
   
      {
        protocol: "https",
        hostname: "www.gravatar.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "icons.veryicon.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
