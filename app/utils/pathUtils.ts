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
 * Get the full path for an asset, considering the base path
 */
export const getAssetPath = (assetPath: string): string => {
  const basePath = getBasePath();
  
  // First, normalize the incoming path to remove any incorrect prefixes
  let cleanPath = assetPath;

  // If we're in development mode and the path starts with '/bixy/', remove it
  if (!basePath && cleanPath.startsWith('/bixy/')) {
    console.debug(`[getAssetPath] Development mode: Removing "/bixy" prefix from path: ${assetPath}`);
    cleanPath = cleanPath.substring(5); // Remove '/bixy' prefix
  }
  
  // If we already have a production path with /bixy and are in production, avoid duplicating
  if (basePath && cleanPath.startsWith(`${basePath}/`)) {
    console.debug(`[getAssetPath] Production: Path already has correct prefix: ${assetPath}`);
    return cleanPath; // No need to modify - already has correct prefix
  }
  
  // Remove leading slash from assetPath if basePath has a trailing slash
  // or if assetPath has a leading slash and basePath is not empty
  if (cleanPath.startsWith('/') && (basePath.endsWith('/') || basePath !== '')) {
    cleanPath = cleanPath.substring(1);
  }
  
  // Construct the final path
  const finalPath = basePath 
    ? `${basePath}/${cleanPath}`.replace(/\/+/g, '/') // Add base path in production
    : `/${cleanPath}`.replace(/\/+/g, '/');          // Just ensure a leading slash in development
  
  console.debug(`[getAssetPath] Original: "${assetPath}", Clean: "${cleanPath}", Final: "${finalPath}"`);
  return finalPath;
}; 