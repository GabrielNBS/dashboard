import type { NextConfig } from 'next';

const nextConfig: NextConfig = {

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },


  experimental: {
    optimizePackageImports: ['lucide-react', '@/components/ui', '@/components/dashboard', 'recharts'],
    optimizeCss: true,
  },

  // Desabilitar source maps em produção para bundle menor
  productionBrowserSourceMaps: false,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            recharts: {
              name: 'recharts',
              test: /[\\/]node_modules[\\/](recharts|d3-.*)[\\/]/,
              priority: 40,
              reuseExistingChunk: true,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },

  // Configuração de imagens
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/150',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/250',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/200',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/random/**',
        search: '',
      },
    ],
  },

  // Headers de cache e performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Compressão
  compress: true,

  // PoweredBy header
  poweredByHeader: false,

  // Strict mode
  reactStrictMode: true,
};

export default nextConfig;
