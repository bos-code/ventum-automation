import type { NextConfig } from "next";

const appwriteEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const appwriteHostname = appwriteEndpoint
  ? new URL(appwriteEndpoint).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: appwriteHostname
      ? [
          {
            protocol: "https",
            hostname: appwriteHostname,
            pathname: "/v1/storage/buckets/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
