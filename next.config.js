/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Optional: only if you want static images
  },
  reactStrictMode: true,
  trailingSlash: true, // Optional: if you want trailing slashes
};

module.exports = nextConfig; 