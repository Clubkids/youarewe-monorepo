// Export all client types
export * from './types';
export * from './baseClient';
export * from './browserClient';
export * from './serverClient';

// Default export for browser environments
import { createBrowserClient } from './browserClient';
export const strapiClient = createBrowserClient();