/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static HTML export
  basePath: process.env.NODE_ENV === 'production' ? '/bixy' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/bixy' : '',
  images: {
    unoptimized: true, // Required for static export
  },
  // Disable certain features that aren't needed for static export
  reactStrictMode: true,
  trailingSlash: true, // Required for GitHub Pages
}

module.exports = nextConfig 