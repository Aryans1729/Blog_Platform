'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/navigation';
import apiClient from '../lib/api';
import PostCard from '../components/PostCard';
import { Post, CreatePostRequest, LoadingState } from '@/types';

// Dashboard Page Component
// This is a protected route that serves as the main hub for authenticated users
// It demonstrates state management, API integration, and complex user interactions

const DashboardPage: React.FC = () => {
  const { authState } = useAuth();
  const router = useRouter();

  // State management for dashboard features
  // These states handle the various aspects of the dashboard experience
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.LOADING);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // New post form state
  // This manages the creation of new blog posts
  const [newPost, setNewPost] = useState<CreatePostRequest>({
    title: '',
    content: ''
  });
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [postErrors, setPostErrors] = useState<Record<string, string>>({});

  // Dashboard statistics state
  // This tracks metrics that help users understand their impact
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    postsThisMonth: 0
  });

  // Error state for dashboard operations
  const [error, setError] = useState<string | null>(null);

  // Load user's posts and statistics when component mounts
  // This effect runs when the dashboard first loads and whenever authentication changes
  useEffect(() => {
    if (authState.isAuthenticated) {
      loadDashboardData();
    }
  }, [authState.isAuthenticated]);

  // Redirect to login if not authenticated
  // This creates a protected route that ensures only logged-in users can access the dashboard
  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push('/login');
    }
  }, [authState.isLoading, authState.isAuthenticated, router]);

  // Function to load all dashboard data
  // This orchestrates multiple API calls to populate the dashboard
  const loadDashboardData = async () => {
    try {
      setLoadingState(LoadingState.LOADING);
      setError(null);
      
      // Load user's posts in parallel with other data
      // Using Promise.all makes multiple requests simultaneously for better performance
      const [postsResponse] = await Promise.all([
        apiClient.getMyPosts()
      ]);

      setPosts(postsResponse);
      
      // Calculate statistics from the loaded data
      // In a production app, you might get these from a dedicated analytics API
      calculateStats(postsResponse);
      
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data');
      setLoadingState(LoadingState.ERROR);
    }
  };

  // Calculate user statistics from their posts
  // This provides insights that help users understand their content performance
  const calculateStats = (posts: Post[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Count posts created this month
    const postsThisMonth = posts.filter(post => {
      const postDate = new Date(post.createdAt);
      return postDate.getMonth() === currentMonth && postDate.getFullYear() === currentYear;
    }).length;

    // In a real application, you would get these metrics from your analytics system
    // For now, we'll use placeholder values that demonstrate the concept
    setStats({
      totalPosts: posts.length,
      totalViews: posts.length * 45, // Simulated view count
      totalLikes: posts.length * 12, // Simulated like count
      postsThisMonth
    });
  };

  // Validate new post form
  // This ensures posts meet quality standards before submission
  const validatePost = (): boolean => {
    const errors: Record<string, string> = {};

    if (!newPost.title.trim()) {
      errors.title = 'Title is required';
    } else if (newPost.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    } else if (newPost.title.trim().length > 200) {
      errors.title = 'Title must be less than 200 characters';
    }

    if (!newPost.content.trim()) {
      errors.content = 'Content is required';
    } else if (newPost.content.trim().length < 10) {
      errors.content = 'Content must be at least 10 characters';
    }

    setPostErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle creating a new post
  // This manages the entire post creation workflow
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePost()) {
      return;
    }

    setIsSubmittingPost(true);
    setPostErrors({});

    try {
      // Create the post using our API client
      const createdPost = await apiClient.createPost({
        title: newPost.title.trim(),
        content: newPost.content.trim()
      });

      // Add the new post to the beginning of the user's post list
      // This provides immediate feedback that the post was created
      setPosts(prev => [createdPost, ...prev]);

      // Reset the form and close the creation interface
      setNewPost({ title: '', content: '' });
      setShowCreateForm(false);

      // Update statistics to reflect the new post
      calculateStats([createdPost, ...posts]);

    } catch (error) {
      console.error('Failed to create post:', error);
      setPostErrors({ submit: 'Failed to create post. Please try again.' });
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Handle editing an existing post
  // This opens the edit interface with the current post data
  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      content: post.content
    });
    setShowCreateForm(true);
  };

  // Handle updating an existing post
  // This manages the post update workflow
  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingPost || !validatePost()) {
      return;
    }

    setIsSubmittingPost(true);
    setPostErrors({});

    try {
      // Update the post using our API client
      const updatedPost = await apiClient.updatePost(editingPost.id, {
        title: newPost.title.trim(),
        content: newPost.content.trim()
      });

      // Update the post in our local state
      setPosts(prev => 
        prev.map(post => 
          post.id === updatedPost.id ? updatedPost : post
        )
      );

      // Reset the form and close the editing interface
      setNewPost({ title: '', content: '' });
      setShowCreateForm(false);
      setEditingPost(null);

    } catch (error) {
      console.error('Failed to update post:', error);
      setPostErrors({ submit: 'Failed to update post. Please try again.' });
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Handle deleting a post
  // This manages the post deletion workflow with confirmation
  const handleDeletePost = async (postId: number) => {
    try {
      await apiClient.deletePost(postId);
      
      // Remove the post from our local state
      setPosts(prev => prev.filter(post => post.id !== postId));
      
      // Recalculate statistics
      const updatedPosts = posts.filter(post => post.id !== postId);
      calculateStats(updatedPosts);

    } catch (error) {
      console.error('Failed to delete post:', error);
      // In a production app, you might show a toast notification here
      alert('Failed to delete post. Please try again.');
    }
  };

  // Handle canceling post creation/editing
  // This resets the form and closes the interface
  const handleCancelPost = () => {
    setNewPost({ title: '', content: '' });
    setShowCreateForm(false);
    setEditingPost(null);
    setPostErrors({});
  };

  // Show loading state while authentication is being determined
  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!authState.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-display-lg font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Here's what's happening with your blog
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-8">
            <div className="flex items-center">
              <span className="text-lg mr-3">⚠️</span>
              <div>
                <strong>Something went wrong:</strong> {error}
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          
          {/* Total Posts */}
          <div className="stat-card hover-lift group">
            <div className="stat-icon bg-gradient-to-br from-blue-500 to-purple-600 text-white group-hover:scale-110 transition-transform">
              📝
            </div>
            <div className="stat-value">{stats.totalPosts}</div>
            <div className="stat-label">Total Posts</div>
          </div>

          {/* Total Views */}
          <div className="stat-card hover-lift group">
            <div className="stat-icon bg-gradient-to-br from-green-500 to-emerald-600 text-white group-hover:scale-110 transition-transform">
              👁️
            </div>
            <div className="stat-value">{stats.totalViews}</div>
            <div className="stat-label">Total Views</div>
          </div>

          {/* Total Likes */}
          <div className="stat-card hover-lift group">
            <div className="stat-icon bg-gradient-to-br from-pink-500 to-rose-600 text-white group-hover:scale-110 transition-transform">
              ❤️
            </div>
            <div className="stat-value">{stats.totalLikes}</div>
            <div className="stat-label">Total Likes</div>
          </div>

          {/* Posts This Month */}
          <div className="stat-card hover-lift group">
            <div className="stat-icon bg-gradient-to-br from-orange-500 to-amber-600 text-white group-hover:scale-110 transition-transform">
              🗓️
            </div>
            <div className="stat-value">{stats.postsThisMonth}</div>
            <div className="stat-label">Posts This Month</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <Link href="/posts/new" className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
                ✍️
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Write New Post</h3>
              <p className="text-gray-600">Share your thoughts with the world</p>
            </Link>

            <Link href="/posts" className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
                📖
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Posts</h3>
              <p className="text-gray-600">Discover amazing content</p>
            </Link>

            <div className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow group cursor-pointer" onClick={() => loadDashboardData()}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
                🔄
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Refresh Data</h3>
              <p className="text-gray-600">Update your statistics</p>
            </div>
          </div>
        </div>

        {/* Recent Posts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Recent Posts</h2>
            <Link href="/posts" className="btn-outline">
              View All Posts
              <span className="ml-2">→</span>
            </Link>
          </div>

          {loadingState === LoadingState.LOADING && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-fade-in-scale">
                  <div className="p-6">
                    <div className="skeleton-title mb-4"></div>
                    <div className="skeleton-text mb-2"></div>
                    <div className="skeleton-text mb-4"></div>
                    <div className="flex items-center space-x-3">
                      <div className="skeleton-avatar"></div>
                      <div className="skeleton-text w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {loadingState === LoadingState.ERROR && (
            <div className="text-center py-16">
              <div className="stat-icon bg-red-100 text-red-600 mx-auto mb-6">
                ❌
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Failed to Load Posts
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't load your posts right now. Please try again.
              </p>
              <button
                onClick={loadDashboardData}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          )}

          {loadingState === LoadingState.SUCCESS && (
            <>
              {posts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="stat-icon bg-blue-100 text-blue-600 mx-auto mb-6">
                    📝
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    No Posts Yet
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    You haven't written any posts yet. Start sharing your thoughts with the world!
                  </p>
                  <Link href="/posts/new" className="btn-primary">
                    Write Your First Post
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.slice(0, 6).map((post, index) => (
                    <div key={post.id} className="animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                      <PostCard
                        post={post}
                        showAuthor={false}
                        showFullContent={false}
                        onDelete={() => loadDashboardData()}
                        className="h-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Welcome Message for New Users */}
        {posts.length === 0 && loadingState === LoadingState.SUCCESS && (
          <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="p-8 text-center">
              <div className="stat-icon bg-gradient-to-br from-blue-500 to-purple-600 text-white mx-auto mb-6">
                🎉
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to Your Dashboard!
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                This is your personal space to manage your blog posts, track your progress, and engage with your audience. 
                Start by writing your first post and watch your community grow!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/posts/new" className="btn-primary">
                  Write Your First Post
                </Link>
                <Link href="/posts" className="btn-secondary">
                  Explore Other Posts
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;