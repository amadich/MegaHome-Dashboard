

const nextConfig = {
  output: 'export',
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
    autoPrerender: false,
  },
  images: {
    domains: ['ui-avatars.com'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
