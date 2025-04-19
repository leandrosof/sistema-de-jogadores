const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true
});

module.exports = withPWA({
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**"
      }
    ]
  },
  experimental: {
    optimizeCss: true
  },
  output: "export" // Configure para exportação estática
});
