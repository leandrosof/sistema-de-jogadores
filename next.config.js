/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true // Necessary for static exports
  }
};

module.exports = nextConfig;
