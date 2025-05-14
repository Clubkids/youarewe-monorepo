export interface StrapiResponse<T> {
    data: T;
    meta?: {
      pagination?: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  }
  
  export interface StrapiUser {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
  }
  
  export interface StrapiAuthResponse {
    jwt: string;
    user: StrapiUser;
  }
  
  export interface StrapiError {
    data: null;
    error: {
      status: number;
      name: string;
      message: string;
      details?: any;
    };
  }
  
  export interface ErrorResponse {
    code: string;
    message: string;
    details?: any;
    isNetworkError?: boolean;
  }