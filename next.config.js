/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**" // ou especifique ex: 'images.unsplash.com'
      }
    ]
  },
  // Se estiver usando PWA, mantenha isso também:
  experimental: {
    optimizeCss: true
  }
};

module.exports = nextConfig;
