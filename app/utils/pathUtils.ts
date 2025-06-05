'use client';

/**
 * Always return a root-relative path for assets, since the site is deployed at the root.
 */
export const getBasePath = (): string => '';

/**
 * Always return a root-relative path for assets, since the site is deployed at the root.
 */
export const getAssetPath = (assetPath: string): string => {
  // Ensure the path starts with a single leading slash
  if (!assetPath.startsWith('/')) {
    return '/' + assetPath.replace(/^\/+/,'');
  }
  return assetPath.replace(/\/+/g, '/');
}; 