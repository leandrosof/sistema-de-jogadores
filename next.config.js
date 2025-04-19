/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true // Se não quiser usar a otimização de imagens no GitHub Pages
  }
};

module.exports = nextConfig;
