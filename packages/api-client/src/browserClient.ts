import { getSession } from 'next-auth/react';
import { BaseApiClient } from './baseClient';

// Define the session structure for TypeScript
interface NextAuthSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    jwt: string;
  };
}

// Browser-specific API client that uses NextAuth session
export class BrowserApiClient extends BaseApiClient {
  constructor(baseURL: string) {
    super(baseURL);
    
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      this.client.interceptors.request.use(
        async (config) => {
          const session = await getSession() as NextAuthSession | null;
          if (session?.user?.jwt) {
            config.headers.Authorization = `Bearer ${session.user.jwt}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );
    }
  }
}

// Create a singleton browser client
export const createBrowserClient = (baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337') => {
  return new BrowserApiClient(baseURL);
};