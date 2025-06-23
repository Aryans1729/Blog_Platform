'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth';
import apiClient from '../../lib/api';
import { notifications } from '@/lib/notifications';

// New Post Creation Page
// This page allows authenticated users to create new blog posts
// Features: Rich text editor, form validation, auto-save, preview mode
const NewPostPage: React.FC = () => {
  const router = useRouter();
  const { authState } = useAuth();
  
  // Form state - simplified for backend compatibility
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push('/auth');
    }
  }, [authState.isAuthenticated, router]);

  // Update word count when content changes
  useEffect(() => {
    const words = formData.content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [formData.content]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (status: 'published' | 'draft' = 'published') => {
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      notifications.validation.required('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Show loading notification
    const loadingToast = notifications.loading('Creating your post...');

    try {
      const newPost = await apiClient.createPost({
        title: formData.title.trim(),
        content: formData.content.trim()
      });

      // Dismiss loading and show success
      notifications.dismiss(loadingToast);
      notifications.post.created(formData.title);

      // Redirect to the new post
      router.push(`/posts/${newPost.id}`);
      
    } catch (error: any) {
      // Dismiss loading notification
      notifications.dismiss(loadingToast);
      
      console.error('Error creating post:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create post';
      
      notifications.postError.createFailed(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
              <p className="mt-2 text-gray-600">Share your thoughts with the world</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {isPreviewMode ? 'Edit' : 'Preview'}
              </button>
              <span className="text-sm text-gray-500">
                {wordCount} words
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {!isPreviewMode ? (
            /* Edit Mode */
            <form className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter your post title..."
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={16}
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Start writing your post..."
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                    errors.content ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
              </div>

              {/* Error Messages */}
              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSubmit('published')}
                  disabled={isLoading}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Post'}
                </button>
              </div>
            </form>
          ) : (
            /* Preview Mode */
            <div className="p-6">
              <div className="prose max-w-none">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {formData.title || 'Untitled Post'}
                </h1>
                
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {formData.content || 'Start writing your content...'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewPostPage; 