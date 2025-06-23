 'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from './api';
import { User, AuthState, LoginRequest, CreateUserRequest } from '@/types';

// Authentication Context
// This creates a "global state" for authentication that any component can access
// Think of it as a "broadcast system" where authentication changes are announced to all components
const AuthContext = createContext<{
  authState: AuthState;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: CreateUserRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
} | null>(null);

// Custom hook to use authentication context
// This provides a clean interface for components to interact with authentication
// Any component can call useAuth() and immediately access user info and auth functions
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication Provider Component
// This wraps our entire application and provides authentication state to all child components
// It's like installing a "nervous system" that keeps track of authentication throughout the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  
  // Authentication state management
  // This is the "single source of truth" for authentication in our application
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true, // Start with loading = true to check existing auth
    isAuthenticated: false
  });

  // Initialize authentication state when the component mounts
  // This checks if the user was previously logged in and restores their session
  useEffect(() => {
    initializeAuth();
  }, []);

  // Initialize authentication by checking for existing tokens
  // This function runs when the app starts to restore user sessions
  const initializeAuth = useCallback(async () => {
    try {
      // Check if we have a stored authentication token
      const token = apiClient.getAuthToken();
      
      if (token) {
        // We have a token, let's verify it's still valid by getting user info
        const user = await apiClient.getCurrentUser();
        
        // Token is valid, update our authentication state
        setAuthState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true
        });
      } else {
        // No token found, user is not authenticated
        setAuthState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false
        });
      }
    } catch (error) {
      // Token exists but is invalid (expired, malformed, etc.)
      console.warn('Authentication initialization failed:', error);
      
      // Clear invalid token and set user as not authenticated
      apiClient.clearAuthToken();
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false
      });
    }
  }, []);

  // Login function
  // This handles the complete login flow and updates application state
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      // Set loading state to show user that login is in progress
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Call our API to authenticate the user
      const response = await apiClient.login(credentials);
      
      // Login successful - update our application state
      setAuthState({
        user: response.user,
        token: response.token,
        isLoading: false,
        isAuthenticated: true
      });
      
      // Redirect to dashboard after successful login
      // This provides immediate feedback that login was successful
      router.push('/dashboard');
      
    } catch (error) {
      // Login failed - reset to non-authenticated state
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false
      });
      
      // Re-throw the error so the login form can display it
      throw error;
    }
  }, [router]);

  // Registration function
  // Similar to login but for creating new user accounts
  const register = useCallback(async (userData: CreateUserRequest) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Create the new user account
      const response = await apiClient.register(userData);
      
      // Registration successful - user is immediately logged in
      setAuthState({
        user: response.user,
        token: response.token,
        isLoading: false,
        isAuthenticated: true
      });
      
      // Redirect to dashboard for new users
      router.push('/dashboard');
      
    } catch (error) {
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false
      });
      
      throw error;
    }
  }, [router]);

  // Logout function
  // Clears all authentication state and redirects to home page
  const logout = useCallback(async () => {
    try {
      // Call the API logout endpoint (for security logging, token blacklisting, etc.)
      await apiClient.logout();
    } catch (error) {
      // Even if API call fails, we should still clear local state
      console.warn('Logout API call failed, but clearing local state anyway');
    } finally {
      // Always clear authentication state locally
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false
      });
      
      // Redirect to home page after logout
      router.push('/');
    }
  }, [router]);

  // Refresh user data
  // This is useful when user information might have changed (profile updates, etc.)
  const refreshUser = useCallback(async () => {
    if (!authState.isAuthenticated) {
      return; // Can't refresh if not authenticated
    }
    
    try {
      const user = await apiClient.getCurrentUser();
      setAuthState(prev => ({ ...prev, user }));
    } catch (error) {
      // If refresh fails, the user might have been deleted or token expired
      console.error('Failed to refresh user data:', error);
      await logout(); // Log them out to be safe
    }
  }, [authState.isAuthenticated, logout]);

  // Provide the authentication context to all child components
  const contextValue = {
    authState,
    login,
    register,
    logout,
    refreshUser,
    isLoading: authState.isLoading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Route Protection Hook
// This hook makes it easy to protect pages that require authentication
// Components can use this to automatically redirect users who aren't logged in
export const useRequireAuth = (redirectTo: string = '/login') => {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth state to be determined
    if (authState.isLoading) {
      return; // Still checking authentication status
    }

    // If user is not authenticated, redirect them
    if (!authState.isAuthenticated) {
      router.push(redirectTo);
    }
  }, [authState.isAuthenticated, authState.isLoading, router, redirectTo]);

  return authState;
};

// Utility functions for checking permissions
// These provide clean, reusable ways to check authentication and authorization

// Check if the current user is the author of a post
export const useCanEditPost = (authorId: number): boolean => {
  const { authState } = useAuth();
  return authState.user?.id === authorId;
};

// Check if user can perform admin actions (for future admin features)
export const useIsAdmin = (): boolean => {
  const { authState } = useAuth();
  // In a real app, you might check a user role or permission level
  // For now, we'll just return false since we don't have admin roles yet
  return false; // Replace with actual admin check: authState.user?.role === 'admin'
};

// Higher-Order Component for route protection
// This wraps components to automatically handle authentication requirements
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  redirectTo: string = '/login'
) => {
  // Return a new component that includes authentication protection
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const authState = useRequireAuth(redirectTo);
    
    // Show loading state while checking authentication
    if (authState.isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    // Only render the component if user is authenticated
    if (!authState.isAuthenticated) {
      return null; // The useRequireAuth hook will handle redirection
    }
    
    // User is authenticated, render the protected component
    return <Component {...props} />;
  };
  
  // Set a display name for debugging
  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  
  return AuthenticatedComponent;
};

// Token refresh utilities
// These help maintain long-term user sessions by automatically refreshing tokens

let refreshPromise: Promise<void> | null = null;

// Automatic token refresh function
// This can be called periodically to keep tokens fresh
export const refreshTokenIfNeeded = async (): Promise<void> => {
  // Prevent multiple simultaneous refresh attempts
  if (refreshPromise) {
    return refreshPromise;
  }
  
  try {
    refreshPromise = apiClient.refreshToken().then(() => {
      console.log('Token refreshed successfully');
    });
    
    await refreshPromise;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Don't throw here - let the application handle expired tokens naturally
  } finally {
    refreshPromise = null;
  }
};

// Set up automatic token refresh
// This runs periodically to keep user sessions active
export const setupTokenRefresh = () => {
  // Refresh token every 6 hours (adjust based on your token expiration time)
  const REFRESH_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
  
  return setInterval(() => {
    if (apiClient.isAuthenticated()) {
      refreshTokenIfNeeded();
    }
  }, REFRESH_INTERVAL);
};

// Utility to format user display name
// This provides a consistent way to display user names throughout the app
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return 'Guest';
  
  // Extract name from email (before the @) as a fallback
  // In a real app, you might have separate first/last name fields
  const emailName = user.email.split('@')[0];
  return emailName.charAt(0).toUpperCase() + emailName.slice(1);
};

// Utility to get user initials for avatars
export const getUserInitials = (user: User | null): string => {
  if (!user) return 'G';
  
  const name = getUserDisplayName(user);
  return name.charAt(0).toUpperCase();
};