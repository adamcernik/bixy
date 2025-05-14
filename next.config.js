/** @type {import('next').NextConfig} */
const { execSync } = require('child_process');
const packageJson = require('./package.json');
const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
const buildDate = new Date().toISOString().replace('T', ' ').substring(0, 19);

const nextConfig = {
  env: {
    NEXT_PUBLIC_VERSION: packageJson.version,
    NEXT_PUBLIC_COMMIT: commitHash,
    NEXT_PUBLIC_BUILD_DATE: buildDate,
  },
  images: {
    unoptimized: true, // Optional: only if you want static images
  },
  reactStrictMode: true,
  trailingSlash: true, // Optional: if you want trailing slashes
};

module.exports = nextConfig; 