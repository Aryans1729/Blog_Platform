 // Type definitions for our blog platform
// These interfaces define the shape of data that flows between frontend and backend
// Think of them as "contracts" that ensure type safety throughout our application

// User-related types
// This matches the user data structure from our backend User model
export interface User {
    id: number;
    email: string;
    createdAt: string; // ISO date string from the database
  }
  
  // This is used when creating a new user account
  // Notice how it only includes the fields the user provides
  export interface CreateUserRequest {
    email: string;
    password: string;
  }
  
  // Login request - similar to create but represents a different action
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  // Post-related types
  // This matches our backend Post model structure
  export interface Post {
    id: number;
    title: string;
    content: string;
    authorId: number;
    authorEmail: string; // This comes from the JOIN in our backend queries
    createdAt: string;
  }
  
  // For creating new posts - only includes user-provided fields
  export interface CreatePostRequest {
    title: string;
    content: string;
  }
  
  // For updating existing posts
  export interface UpdatePostRequest {
    title: string;
    content: string;
  }
  
  // API Response types
  // These define the structure of responses from our backend
  // Having consistent response shapes makes frontend code much more predictable
  
  // Generic API response wrapper
  // Most of our API endpoints return data in this format
  export interface ApiResponse<T = any> {
    message: string;
    data?: T;
    error?: string;
    details?: string;
  }
  
  // Authentication responses include both user data and token
  export interface AuthResponse {
    message: string;
    user: User;
    token: string;
  }
  
  // Post list responses include metadata about the collection
  export interface PostListResponse {
    message: string;
    posts: Post[];
    count: number;
    authorId?: number; // Present when filtered by author
  }
  
  // Single post response
  export interface PostResponse {
    message: string;
    post: Post;
  }
  
  // Error response structure for consistent error handling
  export interface ErrorResponse {
    error: string;
    details?: string;
    statusCode?: number;
  }
  
  // Frontend-specific types
  // These types are used for managing application state and UI behavior
  
  // Authentication state in our app
  export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  }
  
  // Form states for better user experience
  export interface FormState {
    isSubmitting: boolean;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
  }
  
  // Post form data structure
  export interface PostFormData {
    title: string;
    content: string;
  }
  
  // Login form data
  export interface LoginFormData {
    email: string;
    password: string;
  }
  
  // Registration form data
  export interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string; // Frontend-only field for validation
  }
  
  // Navigation and UI state types
  export interface NavigationItem {
    href: string;
    label: string;
    requiresAuth?: boolean; // Some nav items only show when logged in
    icon?: string;
  }
  
  // Modal state for dialogs and overlays
  export interface ModalState {
    isOpen: boolean;
    type: 'confirm' | 'alert' | 'form' | null;
    title?: string;
    content?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }
  
  // Pagination types for when we add pagination to post lists
  export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: 'createdAt' | 'title';
    sortOrder?: 'asc' | 'desc';
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }
  
  // Filter types for advanced post filtering
  export interface PostFilters {
    authorId?: number;
    searchTerm?: string;
    dateFrom?: string;
    dateTo?: string;
    tags?: string[]; // For future tag functionality
  }
  
  // Theme and UI preference types
  export interface ThemeState {
    mode: 'light' | 'dark' | 'system';
    primaryColor: string;
    fontSize: 'small' | 'medium' | 'large';
  }
  
  // HTTP request configuration
  export interface RequestConfig {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
    data?: any;
    headers?: Record<string, string>;
    params?: Record<string, string | number>;
  }
  
  // Component prop types
  // These define the props that our React components expect
  
  export interface PostCardProps {
    post: Post;
    showAuthor?: boolean;
    showFullContent?: boolean;
    onEdit?: (post: Post) => void;
    onDelete?: (postId: number) => void;
    className?: string;
  }
  
  export interface HeaderProps {
    user: User | null;
    onLogout: () => void;
    className?: string;
  }
  
  export interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
    requireAuth?: boolean;
  }
  
  // Form validation types
  export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null;
  }
  
  export interface ValidationSchema {
    [fieldName: string]: ValidationRule[];
  }
  
  // Utility type helpers
  // These make working with our types more convenient
  
  // Make all properties optional (useful for partial updates)
  export type Partial<T> = {
    [P in keyof T]?: T[P];
  };
  
  // Pick only certain properties from a type
  export type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };
  
  // Exclude certain properties from a type
  export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
  
  // Create a type with some required and some optional fields
  export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
  
  // Example usage of utility types:
  // UserWithoutId = User data without the ID (useful for create operations)
  export type UserWithoutId = Omit<User, 'id' | 'createdAt'>;
  
  // PostPreview = Post with only basic info for list views
  export type PostPreview = Pick<Post, 'id' | 'title' | 'authorEmail' | 'createdAt'>;
  
  // Constants and enums
  export enum LoadingState {
    IDLE = 'idle',
    LOADING = 'loading',
    SUCCESS = 'success',
    ERROR = 'error'
  }
  
  export enum PostAction {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    VIEW = 'view'
  }
  
  // API endpoint constants to ensure consistency
  export const API_ENDPOINTS = {
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      ME: '/auth/me',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh'
    },
    POSTS: {
      BASE: '/posts',
      MY_POSTS: '/posts/my',
      STATS: '/posts/stats'
    }
  } as const;
  
  // HTTP status codes for reference
  export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
  } as const;