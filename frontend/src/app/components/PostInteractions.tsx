'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';

// PostInteractions Component Props
interface PostInteractionsProps {
  postId: number;
}

// Interface for interaction state
interface InteractionState {
  isLiked: boolean;
  isBookmarked: boolean;
  likeCount: number;
  viewCount: number;
  shareCount: number;
}

// PostInteractions Component
// This component handles all user interactions with blog posts
// It demonstrates optimistic updates, state management, and user engagement features
const PostInteractions: React.FC<PostInteractionsProps> = ({ postId }) => {
  const { authState } = useAuth();
  
  // State for tracking various post interactions
  // This creates a local state that updates immediately when users interact
  const [interactions, setInteractions] = useState<InteractionState>({
    isLiked: false,
    isBookmarked: false,
    likeCount: 0,
    viewCount: 0,
    shareCount: 0
  });

  // Loading states for individual actions
  // These provide feedback during async operations
  const [isLikingPost, setIsLikingPost] = useState(false);
  const [isBookmarkingPost, setIsBookmarkingPost] = useState(false);

  // Load interaction data when component mounts
  // This fetches the current state of interactions for the post
  useEffect(() => {
    loadInteractionData();
  }, [postId, authState.isAuthenticated]);

  // Function to load interaction data from the API
  // In a real application, this would fetch actual data from your backend
  const loadInteractionData = async () => {
    try {
      // Simulate API call - in production, replace with actual API calls
      // This would typically fetch from endpoints like:
      // - GET /api/posts/:id/interactions
      // - GET /api/posts/:id/user-interactions (if authenticated)
      
      // Mock data that demonstrates the interaction state structure
      const mockInteractions: InteractionState = {
        isLiked: false, // Whether current user has liked this post
        isBookmarked: false, // Whether current user has bookmarked this post
        likeCount: Math.floor(Math.random() * 50) + 5, // Random like count for demo
        viewCount: Math.floor(Math.random() * 500) + 50, // Random view count for demo
        shareCount: Math.floor(Math.random() * 15) + 2 // Random share count for demo
      };

      setInteractions(mockInteractions);
    } catch (error) {
      console.error('Failed to load interaction data:', error);
    }
  };

  // Handle liking/unliking a post
  // This function demonstrates optimistic updates - the UI changes immediately
  const handleLike = async () => {
    // Require authentication for likes
    if (!authState.isAuthenticated) {
      // You might want to show a login modal here
      alert('Please log in to like posts');
      return;
    }

    setIsLikingPost(true);

    // Optimistic update - change the UI immediately
    // This makes the app feel more responsive
    const wasLiked = interactions.isLiked;
    setInteractions(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1
    }));

    try {
      // In a real application, you would call your API here
      // const response = await apiClient.likePost(postId, !wasLiked);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // If the API call fails, you would revert the optimistic update here
      // For now, we'll assume it always succeeds

    } catch (error) {
      console.error('Failed to update like status:', error);
      
      // Revert the optimistic update on failure
      setInteractions(prev => ({
        ...prev,
        isLiked: wasLiked,
        likeCount: wasLiked ? prev.likeCount + 1 : prev.likeCount - 1
      }));

      // Show user-friendly error message
      alert('Failed to update like status. Please try again.');
    } finally {
      setIsLikingPost(false);
    }
  };

  // Handle bookmarking/unbookmarking a post
  // Similar pattern to liking but for saving posts for later reading
  const handleBookmark = async () => {
    if (!authState.isAuthenticated) {
      alert('Please log in to bookmark posts');
      return;
    }

    setIsBookmarkingPost(true);

    // Optimistic update
    const wasBookmarked = interactions.isBookmarked;
    setInteractions(prev => ({
      ...prev,
      isBookmarked: !prev.isBookmarked
    }));

    try {
      // API call would go here
      // const response = await apiClient.bookmarkPost(postId, !wasBookmarked);
      
      await new Promise(resolve => setTimeout(resolve, 300));

    } catch (error) {
      console.error('Failed to update bookmark status:', error);
      
      // Revert optimistic update
      setInteractions(prev => ({
        ...prev,
        isBookmarked: wasBookmarked
      }));

      alert('Failed to update bookmark status. Please try again.');
    } finally {
      setIsBookmarkingPost(false);
    }
  };

  // Handle sharing the post
  // This demonstrates the Web Share API with fallbacks for better browser support
  const handleShare = async () => {
    const shareData = {
      title: `Check out this post`, // In a real app, you'd pass the actual post title
      text: 'I found this interesting article and thought you might enjoy it!',
      url: window.location.href
    };

    // Update share count optimistically
    setInteractions(prev => ({
      ...prev,
      shareCount: prev.shareCount + 1
    }));

    try {
      // Use the Web Share API if available (mobile browsers)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }

      // In a real app, you might track shares in your analytics
      // await apiClient.trackShare(postId);

    } catch (error) {
      console.error('Share failed:', error);
      
      // Revert share count on error
      setInteractions(prev => ({
        ...prev,
        shareCount: prev.shareCount - 1
      }));

      // Provide alternative sharing method
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (clipboardError) {
        alert('Unable to share. Please copy the URL manually.');
      }
    }
  };

  // Handle reporting inappropriate content
  // This would integrate with content moderation systems in a real application
  const handleReport = () => {
    if (!authState.isAuthenticated) {
      alert('Please log in to report content');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to report this post? Our moderation team will review it.'
    );

    if (confirmed) {
      // In a real app, this would send a report to your moderation system
      // await apiClient.reportPost(postId, { reason: 'inappropriate' });
      alert('Thank you for your report. Our team will review this content.');
    }
  };

  // Format large numbers for display
  // This makes large numbers more readable (1.2K instead of 1200)
  const formatCount = (count: number): string => {
    if (count < 1000) {
      return count.toString();
    } else if (count < 10000) {
      return `${(count / 1000).toFixed(1)}K`;
    } else if (count < 1000000) {
      return `${Math.floor(count / 1000)}K`;
    } else {
      return `${(count / 1000000).toFixed(1)}M`;
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          What did you think?
        </h3>
        
        {/* Post statistics */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{formatCount(interactions.viewCount)} views</span>
          </div>
        </div>
      </div>

      {/* Interaction buttons */}
      <div className="flex items-center justify-between">
        
        {/* Left side: Like and bookmark */}
        <div className="flex items-center space-x-4">
          
          {/* Like button */}
          <button
            onClick={handleLike}
            disabled={isLikingPost}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              interactions.isLiked
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLikingPost ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg 
                className={`w-5 h-5 ${interactions.isLiked ? 'fill-current' : ''}`} 
                fill={interactions.isLiked ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
            <span className="font-medium">
              {interactions.isLiked ? 'Liked' : 'Like'}
            </span>
            <span className="text-sm">
              ({formatCount(interactions.likeCount)})
            </span>
          </button>

          {/* Bookmark button */}
          <button
            onClick={handleBookmark}
            disabled={isBookmarkingPost}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              interactions.isBookmarked
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isBookmarkingPost ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg 
                className={`w-5 h-5 ${interactions.isBookmarked ? 'fill-current' : ''}`} 
                fill={interactions.isBookmarked ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            )}
            <span className="font-medium">
              {interactions.isBookmarked ? 'Saved' : 'Save'}
            </span>
          </button>
        </div>

        {/* Right side: Share and more options */}
        <div className="flex items-center space-x-2">
          
          {/* Share button */}
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span className="font-medium">Share</span>
            <span className="text-sm">({formatCount(interactions.shareCount)})</span>
          </button>

          {/* More options dropdown */}
          <div className="relative">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
              </svg>
            </button>
            
            {/* Dropdown menu would go here - for now, just a report button */}
            {/* In a real app, this would be a proper dropdown with options like:
                - Copy link
                - Report content
                - Follow author
                - Mute author
            */}
          </div>
        </div>
      </div>

      {/* Additional engagement prompt */}
      {authState.isAuthenticated && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">
            Enjoying this content? Here are more ways to engage:
          </p>
          <div className="flex flex-wrap gap-2">
            <button className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors">
              Follow Author
            </button>
            <button className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors">
              Subscribe to Updates
            </button>
            <button 
              onClick={handleReport}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              Report Issue
            </button>
          </div>
        </div>
      )}

      {/* Login prompt for non-authenticated users */}
      {!authState.isAuthenticated && (
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-3">
            Join our community to like, save, and interact with posts!
          </p>
          <div className="flex justify-center space-x-3">
            <a 
              href="/login"
              className="text-sm px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign In
            </a>
            <a 
              href="/signup"
              className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostInteractions;