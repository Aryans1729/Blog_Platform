 'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth';
import { LoginFormData, ErrorResponse } from '@/types';
import { notifications } from '@/lib/notifications';

// Login Page Component
// This component creates a secure, user-friendly login experience
// It demonstrates form handling, validation, error management, and authentication integration

const LoginPage: React.FC = () => {
  const { login, authState } = useAuth();
  const router = useRouter();

  // Form state management using React's useState hook
  // This creates a "controlled component" where React manages all form data
  // Think of this as creating a live connection between the form fields and our component's memory
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  // Loading and error state management
  // These states help us provide real-time feedback to users
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string>('');

  // Form field tracking for better UX
  // This helps us show validation messages only after users have interacted with fields
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Redirect if user is already authenticated
  // This prevents confusion when users navigate to login while already logged in
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      router.push('/dashboard');
    }
  }, [authState.isAuthenticated, authState.isLoading, router]);

  // Form validation function
  // This provides immediate feedback and prevents invalid submissions
  // Think of validation as a helpful assistant that catches mistakes before they become problems
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    
    // Return true if no errors (form is valid)
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes with real-time validation
  // This function runs every time a user types in a form field
  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    // Update the form data
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear API error when user starts typing
    // This provides immediate feedback that we're accepting their input
    if (apiError) {
      setApiError('');
    }

    // Clear field-specific error when user starts correcting it
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle field blur events (when user leaves a field)
  // This triggers validation for individual fields as users navigate through the form
  const handleFieldBlur = (field: keyof LoginFormData) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    // Validate just this field when user leaves it
    // This provides immediate feedback without being annoying during typing
    if (field === 'email' && formData.email) {
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setErrors(prev => ({
          ...prev,
          email: 'Please enter a valid email address'
        }));
      }
    }

    if (field === 'password' && formData.password) {
      if (formData.password.length < 6) {
        setErrors(prev => ({
          ...prev,
          password: 'Password must be at least 6 characters'
        }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setTouched({
      email: true,
      password: true
    });
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    // Show loading notification
    const loadingToast = notifications.loading('Signing you in...');

    try {
      // Use the login method from auth context
      await login({
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      });
      
      // Dismiss loading and show success
      notifications.dismiss(loadingToast);
      notifications.auth.loginSuccess(formData.email.split('@')[0]);
      
      // The login method will handle the redirect to dashboard
      
    } catch (error: any) {
      // Dismiss loading notification
      notifications.dismiss(loadingToast);
      
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.details || 
                          error.error || 
                          'Login failed. Please try again.';
      
      // Show error notification
      notifications.authError.loginFailed(errorMessage);
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  // This prevents the login form from flashing before redirect
  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render the form if user is already authenticated
  if (authState.isAuthenticated) {
    return null; // The useEffect will handle redirection
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        {/* Page header with branding and welcome message */}
        <div className="text-center">
          {/* Logo */}
          <div className="mx-auto h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold text-lg">BP</span>
          </div>
          
          {/* Page title and description */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-600">
            Sign in to your account to continue writing and sharing your stories
          </p>
        </div>

        {/* Login form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          
          {/* API error display */}
          {/* This shows server-side errors in a prominent but not alarming way */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{apiError}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            
            {/* Email input field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleFieldBlur('email')}
                className={`input-field ${errors.email && touched.email ? 'input-error' : ''}`}
                placeholder="Enter your email"
                disabled={isSubmitting}
              />
              
              {/* Field-specific error message */}
              {errors.email && touched.email && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password input field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onBlur={() => handleFieldBlur('password')}
                className={`input-field ${errors.password && touched.password ? 'input-error' : ''}`}
                placeholder="Enter your password"
                disabled={isSubmitting}
              />
              
              {/* Field-specific error message */}
              {errors.password && touched.password && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          {/* Additional options row */}
          <div className="flex items-center justify-between">
            {/* Remember me checkbox (placeholder for future feature) */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            {/* Forgot password link (placeholder for future feature) */}
            <div>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {/* Loading indicator inside the button */}
              {isSubmitting && (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </span>
              )}
              
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {/* Registration link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Create one now
              </Link>
            </p>
          </div>
        </form>

        {/* Social login options (placeholder for future OAuth integration) */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social login buttons (placeholder) */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              disabled
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="ml-2">Google</span>
            </button>

            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              disabled
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.986C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
              <span className="ml-2">GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;