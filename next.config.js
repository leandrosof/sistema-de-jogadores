/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configuração otimizada para a versão 13+
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" // Remove consoles em produção
  },
  images: {
    domains: ["localhost"]
  },
  // Configuração PWA alternativa (usando plugin externo)
  experimental: {
    optimizeCss: true // Otimização CSS automática
  }
};

// Configuração PWA separada (opcional)
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true
});

module.exports = withPWA(nextConfig);
