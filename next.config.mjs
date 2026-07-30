/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Exclude old project folders from compilation
    config.watchOptions = {
      ignored: ['**/Govt_Jobs_Preppration/**', '**/Govt_Jobs_Prep/**', '**/Jobs-test-prep/**', '**/My_website/**']
    };
    return config;
  }
};

export default nextConfig;
