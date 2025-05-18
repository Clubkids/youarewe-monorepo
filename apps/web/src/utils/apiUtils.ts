/**
 * Utilities for handling API responses and errors
 */

/**
 * Formats API error messages in a user-friendly way
 */
export const formatApiError = (error: any): string => {
    console.error('API Error:', error);
    
    if (!error) {
      return 'An unknown error occurred';
    }
  
    // Handle Strapi error format
    if (error.response?.data?.error) {
      const strapiError = error.response.data.error;
      return strapiError.message || 'Server error';
    }
  
    // Handle Axios error with details
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return 'The requested resource was not found';
      } else if (status === 403) {
        return 'You do not have permission to access this resource';
      } else if (status === 401) {
        return 'Authentication required. Please log in again';
      } else if (status >= 500) {
        return 'Server error. Please try again later';
      }
    }
  
    // Handle network errors
    if (error.message === 'Network Error') {
      return 'Unable to connect to the server. Please check your internet connection';
    }
  
    // Handle custom error object
    if (error.message) {
      return error.message;
    }
  
    // Handle case where error is a string
    if (typeof error === 'string') {
      return error;
    }
  
    return 'An error occurred while fetching data';
  };
  
  /**
   * Extracts data from Strapi response with better logging and fallbacks
   * Improved to handle Strapi v5 response format correctly
   */
  export const extractStrapiData = <T>(response: any): T[] => {
    if (!response) {
      console.log('Empty response in extractStrapiData');
      return [];
    }
    
    // Log the response structure to help with debugging
    try {
      const responseSnippet = typeof response === 'object' 
        ? JSON.stringify(response, null, 2).substring(0, 300) + '...'
        : String(response).substring(0, 300);
      console.log('Response structure sample:', responseSnippet);
    } catch (e) {
      console.log('Could not stringify response for logging');
    }
  
    // Handle different response formats
    
    // Case 1: Direct array
    if (Array.isArray(response)) {
      return response as T[];
    }
    
    // Case 2: Strapi v5 format with data property
    if (response.data !== undefined) {
      // Case 2a: Array of data
      if (Array.isArray(response.data)) {
        return response.data as T[];
      }
      
      // Case 2b: Single object in data
      if (response.data !== null && typeof response.data === 'object') {
        return [response.data] as T[];
      }
      
      // Case 2c: Empty data
      if (response.data === null || response.data === undefined) {
        console.log('Null or undefined data property in Strapi response');
        return [];
      }
    }
    
    // Case 3: Non-standard structure but still an object
    if (response && typeof response === 'object' && !response.data) {
      // Check if it has expected Strapi keys
      if ('attributes' in response || 'id' in response) {
        return [response] as T[];
      }
      
      // If it's just a regular object with content
      if (Object.keys(response).length > 0) {
        return [response] as T[];
      }
    }
    
    // If we reach here, we couldn't extract the data properly
    console.warn('Could not extract data from response, returning empty array', 
      typeof response, Array.isArray(response), response?.data ? 'has data' : 'no data');
    return [];
  };
  
  /**
   * Helper to safely access nested properties in API responses
   * @example
   * // Instead of response?.data?.attributes?.title (which could throw if any part is undefined)
   * const title = safeGet(() => response.data.attributes.title, 'Default Title');
   */
  export const safeGet = <T>(accessor: () => T, defaultValue: T): T => {
    try {
      const value = accessor();
      return value !== undefined && value !== null ? value : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };
  
  /**
   * Creates URL with query parameters for API requests
   */
  export const createApiUrl = (endpoint: string, params: Record<string, any> = {}): string => {
    const url = new URL(endpoint, window.location.origin);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
    
    return url.toString();
  };
  
  /**
   * Creates a query string for Strapi v5 API filtering
   * Formats filters according to Strapi's expected format
   */
  export const createStrapiQueryString = (params: {
    filters?: Record<string, any>;
    sort?: string | string[];
    pagination?: { page?: number; pageSize?: number; limit?: number; start?: number };
    populate?: string | string[] | Record<string, any>;
  }): string => {
    const queryParts: string[] = [];
    
    // Process filters
    if (params.filters && Object.keys(params.filters).length > 0) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          // Handle operator filters like { field: { $eq: value } }
          Object.entries(value).forEach(([operator, operatorValue]) => {
            queryParts.push(`filters[${key}][${operator}]=${encodeURIComponent(String(operatorValue))}`);
          });
        } else {
          // Handle simple filters like { field: value }
          queryParts.push(`filters[${key}]=${encodeURIComponent(String(value))}`);
        }
      });
    }
    
    // Process sort
    if (params.sort) {
      if (Array.isArray(params.sort)) {
        params.sort.forEach((sortItem, index) => {
          queryParts.push(`sort[${index}]=${encodeURIComponent(sortItem)}`);
        });
      } else {
        queryParts.push(`sort=${encodeURIComponent(params.sort)}`);
      }
    }
    
    // Process pagination
    if (params.pagination) {
      Object.entries(params.pagination).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParts.push(`pagination[${key}]=${value}`);
        }
      });
    }
    
    // Process populate
    if (params.populate) {
      if (typeof params.populate === 'string') {
        queryParts.push(`populate=${encodeURIComponent(params.populate)}`);
      } else if (Array.isArray(params.populate)) {
        params.populate.forEach((item) => {
          queryParts.push(`populate[]=${encodeURIComponent(item)}`);
        });
      } else {
        // Handle complex populate objects
        Object.entries(params.populate).forEach(([key, value]) => {
          if (typeof value === 'object') {
            queryParts.push(`populate[${key}]=${encodeURIComponent(JSON.stringify(value))}`);
          } else {
            queryParts.push(`populate[${key}]=${encodeURIComponent(String(value))}`);
          }
        });
      }
    }
    
    return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  };
  
  /**
   * Utility to determine if a response is empty
   */
  export const isEmptyResponse = (response: any): boolean => {
    if (!response) return true;
    
    if (response.data === null || response.data === undefined) return true;
    
    if (Array.isArray(response.data) && response.data.length === 0) return true;
    
    return false;
  };