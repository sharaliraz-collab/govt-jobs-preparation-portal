/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
    outputFileTracingIncludes: {
      '/api/forms/pdf': [
        './node_modules/@sparticuz/chromium/bin/**',
        './src/app/forms/pension-papers/pension-print.css',
        './src/app/forms/fo2/fo2-print.css',
        './public/pk-emblem-fo2.jpg',
      ],
    },
  },
  webpack: (config, { isServer }) => {
    // Exclude old project folders from compilation
    config.watchOptions = {
      ignored: ['**/Govt_Jobs_Preppration/**', '**/Govt_Jobs_Prep/**', '**/Jobs-test-prep/**', '**/My_website/**']
    };
    return config;
  }
};

export default nextConfig;
