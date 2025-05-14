import { BaseApiClient } from './baseClient';

// Server-specific API client that uses API tokens
export class ServerApiClient extends BaseApiClient {
  private apiToken: string | null = null;
  
  constructor(baseURL: string, apiToken?: string) {
    super(baseURL);
    
    if (apiToken) {
      this.setApiToken(apiToken);
    }
    
    // Add auth header on each request
    this.client.interceptors.request.use(
      (config) => {
        if (this.apiToken) {
          config.headers.Authorization = `Bearer ${this.apiToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }
  
  // Allow setting/updating the API token
  setApiToken(token: string): void {
    this.apiToken = token;
  }
}

// Create a server client
export const createServerClient = (
  baseURL = process.env.API_URL || 'http://localhost:1337', 
  apiToken = process.env.API_TOKEN
) => {
  return new ServerApiClient(baseURL, apiToken);
};