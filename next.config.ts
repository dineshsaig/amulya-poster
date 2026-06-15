import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Required for html2canvas cross-origin image support
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
        ],
      },
    ];
  },
};

export default nextConfig;
