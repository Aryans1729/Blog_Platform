import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import {
  User,
  Post,
  CreateUserRequest,
  LoginRequest,
  CreatePostRequest,
  UpdatePostRequest,
  AuthResponse,
  PostListResponse,
  PostResponse,
  ErrorResponse,
  API_ENDPOINTS,
  HTTP_STATUS
} from '@/types';

// API Client Class
// This class encapsulates all communication with our backend API
// Think of it as a "service layer" that provides a clean interface for HTTP operations
// By centralizing API logic here, we can easily modify request handling without touching components

class ApiClient {
  private axios: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Get the base URL from environment variables or use a default
    // This allows us to easily switch between development and production APIs
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    
    // Create an Axios instance with default configuration
    // This is like setting up a "template" for all our HTTP requests
    this.axios = axios.create({
      baseURL: this.baseURL,
      timeout: 10000, // 10 second timeout prevents hanging requests
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Include credentials (cookies) with requests for session management
      withCredentials: true
    });

    // Set up request and response interceptors
    // Interceptors are like "middleware" for HTTP requests - they run before/after each request
    this.setupInterceptors();
  }

  // Configure interceptors for automatic token handling and error processing
  private setupInterceptors(): void {
    // Request interceptor - runs before every request is sent
    // This automatically adds the authentication token to requests
    this.axios.interceptors.request.use(
      (config) => {
        // Get the auth token from cookies
        const token = Cookies.get('auth_token');
        
        if (token) {
          // Add the Bearer token to the Authorization header
          // This tells our backend that this request is from an authenticated user
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log the request for debugging (only in development)
        if (process.env.NODE_ENV === 'development') {
          console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
      },
      (error) => {
        // Handle request configuration errors
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - runs after every response is received
    // This handles common response processing and error scenarios
    this.axios.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log successful responses in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        }
        return response;
      },
      (error: AxiosError) => {
        // Handle common HTTP error scenarios
        return this.handleResponseError(error);
      }
    );
  }

  // Centralized error handling for consistent error processing
  private handleResponseError(error: AxiosError): Promise<never> {
    const response = error.response;
    
    // Log errors for debugging
    console.error('API Error:', {
      status: response?.status,
      message: error.message,
      url: error.config?.url
    });

    // Handle specific HTTP status codes
    if (response?.status === HTTP_STATUS.UNAUTHORIZED) {
      // Token is invalid or expired - clear it and redirect to login
      this.clearAuthToken();
      
      // Only redirect if we're not already on a public page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Transform the error into a consistent format
    const errorResponse: ErrorResponse = {
      error: (response?.data as any)?.error || 'Network error occurred',
      details: (response?.data as any)?.details || error.message,
      statusCode: response?.status
    };

    return Promise.reject(errorResponse);
  }

  // Authentication token management
  // These methods provide a consistent way to handle authentication tokens
  
  setAuthToken(token: string): void {
    // Store the token in a secure HTTP-only cookie
    // The secure and sameSite options provide protection against XSS and CSRF attacks
    Cookies.set('auth_token', token, {
      expires: 7, // Token expires in 7 days
      secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
      sameSite: 'strict', // Prevent CSRF attacks
      path: '/' // Available throughout the application
    });
  }

  getAuthToken(): string | undefined {
    return Cookies.get('auth_token');
  }

  clearAuthToken(): void {
    Cookies.remove('auth_token', { path: '/' });
  }

  // Check if user is currently authenticated
  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return Boolean(token);
  }

  // Authentication API methods
  // These methods handle user registration, login, and profile management

  async register(userData: CreateUserRequest): Promise<AuthResponse> {
    try {
      const response = await this.axios.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        userData
      );
      
      // Automatically store the token when registration is successful
      if (response.data.token) {
        this.setAuthToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw error; // Re-throw to let the calling component handle it
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.axios.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      
      // Store the authentication token
      if (response.data.token) {
        this.setAuthToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Call the backend logout endpoint
      await this.axios.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Even if the backend call fails, we should clear the local token
      console.warn('Logout API call failed, but clearing local token anyway');
    } finally {
      // Always clear the local authentication token
      this.clearAuthToken();
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.axios.get<{ user: User }>(API_ENDPOINTS.AUTH.ME);
      return response.data.user;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await this.axios.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH);
      
      if (response.data.token) {
        this.setAuthToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Post API methods
  // These methods handle all blog post operations (CRUD - Create, Read, Update, Delete)

  async getPosts(authorId?: number): Promise<Post[]> {
    try {
      const params = authorId ? { author: authorId } : {};
      const response = await this.axios.get<PostListResponse>(
        API_ENDPOINTS.POSTS.BASE,
        { params }
      );
      return response.data.posts;
    } catch (error) {
      throw error;
    }
  }

  async getPostById(id: number): Promise<Post> {
    try {
      const response = await this.axios.get<PostResponse>(`${API_ENDPOINTS.POSTS.BASE}/${id}`);
      return response.data.post;
    } catch (error) {
      throw error;
    }
  }

  async createPost(postData: CreatePostRequest): Promise<Post> {
    try {
      const response = await this.axios.post<PostResponse>(
        API_ENDPOINTS.POSTS.BASE,
        postData
      );
      return response.data.post;
    } catch (error) {
      throw error;
    }
  }

  async updatePost(id: number, postData: UpdatePostRequest): Promise<Post> {
    try {
      const response = await this.axios.put<PostResponse>(
        `${API_ENDPOINTS.POSTS.BASE}/${id}`,
        postData
      );
      return response.data.post;
    } catch (error) {
      throw error;
    }
  }

  async deletePost(id: number): Promise<void> {
    try {
      await this.axios.delete(`${API_ENDPOINTS.POSTS.BASE}/${id}`);
    } catch (error) {
      throw error;
    }
  }

  async getMyPosts(): Promise<Post[]> {
    try {
      const response = await this.axios.get<PostListResponse>(API_ENDPOINTS.POSTS.MY_POSTS);
      return response.data.posts;
    } catch (error) {
      throw error;
    }
  }

  async getPostStats(): Promise<any> {
    try {
      const response = await this.axios.get(API_ENDPOINTS.POSTS.STATS);
      return response.data.stats;
    } catch (error) {
      throw error;
    }
  }

  // Utility methods for common operations

  // Generic method for making custom API calls
  // This provides flexibility for future endpoints without modifying this class
  async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    data?: any,
    config?: any
  ): Promise<T> {
    try {
      const response = await this.axios.request<T>({
        method,
        url,
        data,
        ...config
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Health check method to verify API connectivity
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.axios.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Upload file method (for future features like profile pictures or post images)
  async uploadFile(file: File, endpoint: string = '/upload'): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await this.axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // Monitor upload progress
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload Progress: ${percentCompleted}%`);
          }
        }
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// Create and export a singleton instance
// This ensures we have only one API client throughout our application
// The singleton pattern is perfect here because we want consistent configuration
const apiClient = new ApiClient();

export default apiClient;

// Also export the class itself for testing or special use cases
export { ApiClient };