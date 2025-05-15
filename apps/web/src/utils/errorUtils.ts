export interface ApiError extends Error {
    code?: string;
    details?: any;
    isNetworkError?: boolean;
    originalError?: any;
  }
  
  // Convert any error to a user-friendly message
  export function getUserFriendlyErrorMessage(error: unknown): string {
    // Default error message
    let message = "An unexpected error occurred. Please try again.";
    
    if (!error) return message;
    
    // If it's our API error type
    if (error instanceof Error) {
      const apiError = error as ApiError;
      
      // Authentication errors
      if (apiError.code === 'unauthorized' || apiError.code === 'forbidden') {
        return "Invalid email or password.";
      }
      
      // Validation errors
      if (apiError.code === 'validation_error') {
        return "Please check your information and try again.";
      }
      
      // Network errors
      if (apiError.isNetworkError) {
        return "Unable to connect to the server. Please check your internet connection.";
      }
      
      // Use the message if it's presentable
      if (apiError.message && !apiError.message.includes('Error:') && 
          !apiError.message.includes('Exception:')) {
        return apiError.message;
      }
    }
    
    return message;
  }
  
  // Get technical error details for logging
  export function getTechnicalErrorDetails(error: unknown): string {
    if (!error) return "No error details available";
    
    if (error instanceof Error) {
      const apiError = error as ApiError;
      return JSON.stringify({
        message: apiError.message,
        code: apiError.code,
        stack: apiError.stack,
        details: apiError.details,
        isNetworkError: apiError.isNetworkError
      }, null, 2);
    }
    
    return String(error);
  }