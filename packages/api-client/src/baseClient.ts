import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { ErrorResponse } from './types';

// Create a base API client with common configuration and error handling
export class BaseApiClient {
  protected client: AxiosInstance;
  
  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Common error handling
    this.client.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        const errorResponse: ErrorResponse = {
          code: 'unknown_error',
          message: 'An unknown error occurred',
        };

        if (error.response) {
          // Server responded with error
          const responseData = error.response.data as any; // Use 'any' for flexibility with response format
          const strapiError = responseData?.error;
          if (strapiError) {
            errorResponse.code = strapiError.name || `error_${error.response.status}`;
            errorResponse.message = strapiError.message || 'Server error';
            errorResponse.details = strapiError.details;
          } else {
            errorResponse.code = `http_error_${error.response.status}`;
            errorResponse.message = `HTTP error ${error.response.status}`;
          }
        } else if (error.request) {
          // No response received
          errorResponse.code = 'network_error';
          errorResponse.message = 'Network error - no response received';
          errorResponse.isNetworkError = true;
        } else {
          // Error setting up request
          errorResponse.code = 'request_setup_error';
          errorResponse.message = error.message;
        }

        // Create a new error with the formatted details
        const formattedError = new Error(errorResponse.message);
        (formattedError as any).code = errorResponse.code;
        (formattedError as any).details = errorResponse.details;
        (formattedError as any).isNetworkError = errorResponse.isNetworkError;
        (formattedError as any).originalError = error;
        
        return Promise.reject(formattedError);
      }
    );
  }
  
  async get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(path, config);
    return response.data;
  }
  
  async post<T>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(path, data, config);
    return response.data;
  }
  
  async put<T>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(path, data, config);
    return response.data;
  }
  
  async delete<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(path, config);
    return response.data;
  }
}