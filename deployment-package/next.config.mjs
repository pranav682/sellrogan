// Modify Next.js config for better static export compatibility
export default {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure all API routes are properly handled
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*.json',
      },
    ];
  },
  // Disable server components for static export
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: [],
  },
  // Ensure proper hydration
  webpack: (config) => {
    return config;
  },
};
