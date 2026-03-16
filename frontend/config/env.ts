// Environment configuration with type safety
// IMPORTANT: NEXT_PUBLIC_* variables must be referenced directly (not via dynamic lookup)
// for Next.js to inline them at build time

export const env = {
  // API - Direct reference required for build-time inlining
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  
  // App
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'eSports Hub',
  NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'The ultimate eSports platform',
  
  // Environment
  NODE_ENV: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
} as const;
