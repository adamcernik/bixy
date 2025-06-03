'use client';

/**
 * Get the base path for assets based on environment
 * In production (GitHub Pages), this will be /bixy
 * In development, this will be an empty string
 */
export const getBasePath = (): string => {
  // When rendered on the client
  if (typeof window !== 'undefined') {
    // Check if we're on GitHub Pages by URL
    const isGitHubPages = window.location.hostname.includes('github.io');
    const basePath = isGitHubPages ? '/bixy' : '';
    console.debug(`[getBasePath] Using base path: "${basePath}" (isGitHubPages: ${isGitHubPages})`);
    return basePath;
  }
  
  // When rendered on the server
  const basePath = process.env.NODE_ENV === 'production' ? '/bixy' : '';
  console.debug(`[getBasePath] Using base path: "${basePath}" (server side, NODE_ENV: ${process.env.NODE_ENV})`);
  return basePath;
};

/**
 * Always return a root-relative path for assets, since the site is deployed at the root.
 */
export const getAssetPath = (assetPath: string): string => {
  // Ensure the path starts with a single leading slash
  if (!assetPath.startsWith('/')) {
    return '/' + assetPath.replace(/^\/+/, '');
  }
  return assetPath.replace(/\/+/g, '/');
}; 