import toast from 'react-hot-toast';

/**
 * Comprehensive Notification Service for Blog Platform
 * 
 * This service provides a centralized way to handle all notifications
 * throughout the application with consistent styling and behavior.
 */

export interface NotificationOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  icon?: string;
  className?: string;
}

class NotificationService {
  
  // ===== SUCCESS NOTIFICATIONS =====
  
  /**
   * Show success notification
   */
  success(message: string, options?: NotificationOptions) {
    return toast.success(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      icon: options?.icon || '✅',
      className: options?.className,
    });
  }

  /**
   * Authentication success notifications
   */
  auth = {
    loginSuccess: (username?: string) => {
      return this.success(
        username ? `Welcome back, ${username}!` : 'Successfully logged in!',
        { icon: '👋', duration: 3000 }
      );
    },
    
    signupSuccess: (username?: string) => {
      return this.success(
        username ? `Welcome to our blog, ${username}!` : 'Account created successfully!',
        { icon: '🎉', duration: 4000 }
      );
    },
    
    logoutSuccess: () => {
      return this.success('Successfully logged out', { icon: '👋' });
    }
  };

  /**
   * Blog post operation success notifications
   */
  post = {
    created: (title?: string) => {
      return this.success(
        title ? `"${title}" published successfully!` : 'Post published successfully!',
        { icon: '📝', duration: 5000 }
      );
    },
    
    updated: (title?: string) => {
      return this.success(
        title ? `"${title}" updated successfully!` : 'Post updated successfully!',
        { icon: '✏️' }
      );
    },
    
    deleted: (title?: string) => {
      return this.success(
        title ? `"${title}" deleted successfully` : 'Post deleted successfully',
        { icon: '🗑️' }
      );
    },
    
    liked: () => {
      return this.success('Post liked!', { icon: '❤️', duration: 2000 });
    },
    
    unliked: () => {
      return this.success('Post unliked', { icon: '💔', duration: 2000 });
    },
    
    bookmarked: () => {
      return this.success('Post saved to bookmarks!', { icon: '🔖', duration: 3000 });
    },
    
    unbookmarked: () => {
      return this.success('Post removed from bookmarks', { icon: '📖', duration: 2000 });
    },
    
    shared: () => {
      return this.success('Post shared successfully!', { icon: '🔗', duration: 3000 });
    }
  };

  // ===== ERROR NOTIFICATIONS =====
  
  /**
   * Show error notification
   */
  error(message: string, options?: NotificationOptions) {
    return toast.error(message, {
      duration: options?.duration || 5000,
      position: options?.position || 'top-right',
      icon: options?.icon || '❌',
      className: options?.className,
    });
  }

  /**
   * Authentication error notifications
   */
  authError = {
    loginFailed: (reason?: string) => {
      return this.error(
        reason || 'Login failed. Please check your credentials.',
        { icon: '🔒', duration: 4000 }
      );
    },
    
    signupFailed: (reason?: string) => {
      return this.error(
        reason || 'Account creation failed. Please try again.',
        { icon: '❌' }
      );
    },
    
    sessionExpired: () => {
      return this.error(
        'Your session has expired. Please log in again.',
        { icon: '⏰', duration: 6000 }
      );
    },
    
    unauthorized: () => {
      return this.error(
        'You need to be logged in to perform this action.',
        { icon: '🔐', duration: 4000 }
      );
    }
  };

  /**
   * Blog post operation error notifications
   */
  postError = {
    createFailed: (reason?: string) => {
      return this.error(
        reason || 'Failed to create post. Please try again.',
        { icon: '📝' }
      );
    },
    
    updateFailed: (reason?: string) => {
      return this.error(
        reason || 'Failed to update post. Please try again.',
        { icon: '✏️' }
      );
    },
    
    deleteFailed: (reason?: string) => {
      return this.error(
        reason || 'Failed to delete post. Please try again.',
        { icon: '🗑️' }
      );
    },
    
    loadFailed: () => {
      return this.error(
        'Failed to load posts. Please refresh the page.',
        { icon: '📄' }
      );
    },
    
    likeFailed: () => {
      return this.error('Failed to like post. Please try again.', { icon: '💔' });
    },
    
    bookmarkFailed: () => {
      return this.error('Failed to bookmark post. Please try again.', { icon: '🔖' });
    },
    
    shareFailed: () => {
      return this.error('Failed to share post. Please try again.', { icon: '🔗' });
    }
  };

  // ===== WARNING NOTIFICATIONS =====
  
  /**
   * Show warning notification
   */
  warning(message: string, options?: NotificationOptions) {
    return toast(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      icon: options?.icon || '⚠️',
      style: {
        background: '#f59e0b',
        color: '#ffffff',
        borderRadius: '10px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      },
      className: options?.className,
    });
  }

  /**
   * Form validation warnings
   */
  validation = {
    required: (fieldName: string) => {
      return this.warning(`${fieldName} is required`, { duration: 3000 });
    },
    
    invalid: (fieldName: string) => {
      return this.warning(`Please enter a valid ${fieldName}`, { duration: 3000 });
    },
    
    passwordMismatch: () => {
      return this.warning('Passwords do not match', { duration: 3000 });
    },
    
    weakPassword: () => {
      return this.warning('Please choose a stronger password', { duration: 4000 });
    }
  };

  // ===== INFO NOTIFICATIONS =====
  
  /**
   * Show info notification
   */
  info(message: string, options?: NotificationOptions) {
    return toast(message, {
      duration: options?.duration || 3000,
      position: options?.position || 'top-right',
      icon: options?.icon || 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#ffffff',
        borderRadius: '10px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      },
      className: options?.className,
    });
  }

  /**
   * General info notifications
   */
  general = {
    copied: () => {
      return this.info('Copied to clipboard!', { icon: '📋', duration: 2000 });
    },
    
    saved: () => {
      return this.info('Changes saved', { icon: '💾', duration: 2000 });
    },
    
    loading: (message: string = 'Loading...') => {
      return toast.loading(message, {
        style: {
          background: '#3b82f6',
          color: '#ffffff',
        }
      });
    },
    
    welcome: (isFirstTime: boolean = false) => {
      return this.info(
        isFirstTime ? 'Welcome to our blog platform!' : 'Welcome back!',
        { icon: '👋', duration: 3000 }
      );
    }
  };

  // ===== LOADING NOTIFICATIONS =====
  
  /**
   * Show loading notification
   */
  loading(message: string = 'Loading...', options?: NotificationOptions) {
    return toast.loading(message, {
      position: options?.position || 'top-right',
      className: options?.className,
    });
  }

  /**
   * Async operation notifications
   */
  async = {
    promise: <T>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string;
        error: string;
      }
    ) => {
      return toast.promise(promise, messages, {
        style: {
          borderRadius: '10px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
        },
        success: {
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        },
        error: {
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        },
        loading: {
          style: {
            background: '#3b82f6',
            color: '#ffffff',
          },
        },
      });
    }
  };

  // ===== UTILITY METHODS =====
  
  /**
   * Dismiss a specific notification
   */
  dismiss(toastId: string) {
    toast.dismiss(toastId);
  }

  /**
   * Dismiss all notifications
   */
  dismissAll() {
    toast.dismiss();
  }

  /**
   * Custom notification with full control
   */
  custom(message: string, options: {
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    icon?: string;
    style?: React.CSSProperties;
    className?: string;
  }) {
    const baseStyle = {
      borderRadius: '10px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      ...options.style,
    };

    const typeStyles = {
      success: { background: '#10b981', color: '#ffffff' },
      error: { background: '#ef4444', color: '#ffffff' },
      warning: { background: '#f59e0b', color: '#ffffff' },
      info: { background: '#3b82f6', color: '#ffffff' },
    };

    return toast(message, {
      duration: options.duration || 4000,
      position: options.position || 'top-right',
      icon: options.icon,
      style: {
        ...baseStyle,
        ...(options.type ? typeStyles[options.type] : {}),
      },
      className: options.className,
    });
  }
}

// Create and export a singleton instance
export const notifications = new NotificationService();

// Export individual methods for convenience
export const {
  success,
  error,
  warning,
  info,
  loading,
  dismiss,
  dismissAll,
  custom,
  auth,
  post,
  authError,
  postError,
  validation,
  general,
  async: asyncNotifications,
} = notifications;

// Default export
export default notifications; 