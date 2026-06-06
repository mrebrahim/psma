import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "uzhooqjvdafcrhgklhxx.supabase.co" },
    ],
  },
};

export default nextConfig;
