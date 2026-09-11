import type { NextConfig } from "next";

/**
 * Allow `next/image` to load product photos from the Appwrite storage
 * endpoint. We derive the host from the configured endpoint and also
 * allow the common Appwrite Cloud hosts so previews work out of the box.
 */
function appwriteImagePatterns() {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
    { protocol: "https", hostname: "*.cloud.appwrite.io" },
    { protocol: "https", hostname: "cloud.appwrite.io" },
  ];

  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  if (endpoint) {
    try {
      const { hostname, protocol } = new URL(endpoint);
      const proto = protocol.replace(":", "");
      if (
        (proto === "https" || proto === "http") &&
        !patterns.some((p) => p.hostname === hostname)
      ) {
        patterns.push({ protocol: proto as "http" | "https", hostname });
      }
    } catch {
      // Ignore an unparseable endpoint; the defaults above still apply.
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: appwriteImagePatterns(),
  },
};

export default nextConfig;
