'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Post } from '@/types';

// RelatedPosts Component Props
interface RelatedPostsProps {
  currentPostId: number;
  limit?: number;
}

// RelatedPosts Component
// This component suggests relevant content to keep users engaged
// It demonstrates content discovery patterns and recommendation algorithms
const RelatedPosts: React.FC<RelatedPostsProps> = ({ 
  currentPostId, 
  limit = 3 
}) => {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load related posts when component mounts or currentPostId changes
  useEffect(() => {
    loadRelatedPosts();
  }, [currentPostId]);

  // Function to fetch related posts
  // In a real application, this would use sophisticated algorithms to find related content
  // Factors might include: tags, categories, author, reading history, user preferences, etc.
  const loadRelatedPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Mock related posts data
      // In production, this would come from an API endpoint like:
      // GET /api/posts/:id/related
      // or
      // GET /api/posts/recommended?exclude=:id&limit=3
      const mockRelatedPosts: Post[] = [
        {
          id: 4,
          title: "Advanced React Patterns: Compound Components and Render Props",
          content: "Dive deep into advanced React patterns that will elevate your component design. Learn how compound components and render props can make your code more flexible and reusable. These patterns are essential for building scalable React applications...",
          authorId: 1,
          authorEmail: "sarah.developer@example.com",
          createdAt: "2024-01-12T16:20:00Z"
        },
        {
          id: 5,
          title: "TypeScript Best Practices for Large Scale Applications",
          content: "TypeScript is more than just 'JavaScript with types' – it's a powerful tool for building maintainable applications. This guide covers advanced TypeScript techniques, project organization strategies, and common pitfalls to avoid when scaling your TypeScript codebase...",
          authorId: 2,
          authorEmail: "alex.architect@example.com",
          createdAt: "2024-01-11T11:30:00Z"
        },
        {
          id: 6,
          title: "Performance Optimization Techniques for Modern Web Apps",
          content: "Learn how to make your web applications blazingly fast. From bundle optimization to lazy loading, caching strategies to performance monitoring – this comprehensive guide covers everything you need to know about web performance optimization...",
          authorId: 3,
          authorEmail: "morgan.designer@example.com",
          createdAt: "2024-01-10T14:15:00Z"
        }
      ].filter(post => post.id !== currentPostId).slice(0, limit);

      setRelatedPosts(mockRelatedPosts);
    } catch (error) {
      console.error('Failed to load related posts:', error);
      setError('Failed to load related posts');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to create post excerpts
  // This creates engaging previews that entice users to read more
  const getExcerpt = (content: string, maxLength: number = 100): string => {
    const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    
    if (plainText.length <= maxLength) {
      return plainText;
    }

    const truncated = plainText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxLength * 0.6) {
      return truncated.substring(0, lastSpace) + '...';
    }
    
    return truncated + '...';
  };

  // Helper function to format dates
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Helper function to get author name from email
  const getAuthorName = (email: string): string => {
    const localPart = email.split('@')[0];
    return localPart
      .replace(/[._-]/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Related Posts
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Related Posts
        </h3>
        <div className="text-center py-4">
          <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-600 mb-3">{error}</p>
          <button
            onClick={loadRelatedPosts}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Empty state (no related posts found)
  if (relatedPosts.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Related Posts
        </h3>
        <div className="text-center py-4">
          <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm text-gray-600 mb-3">
            No related posts found
          </p>
          <Link
            href="/posts"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Browse all posts
          </Link>
        </div>
      </div>
    );
  }

  // Main render with related posts
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Related Posts
        </h3>
        <Link
          href="/posts"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          See all
        </Link>
      </div>

      <div className="space-y-4">
        {relatedPosts.map((post, index) => (
          <article 
            key={post.id}
            className="group border-b border-gray-200 last:border-b-0 pb-4 last:pb-0"
          >
            {/* Post title and link */}
            <h4 className="mb-2">
              <Link
                href={`/posts/${post.id}`}
                className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors duration-200 text-sm leading-tight line-clamp-2"
              >
                {post.title}
              </Link>
            </h4>

            {/* Post excerpt */}
            <p className="text-xs text-gray-600 mb-2 leading-relaxed">
              {getExcerpt(post.content, 80)}
            </p>

            {/* Post metadata */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-700">
                  {getAuthorName(post.authorEmail)}
                </span>
                <span>•</span>
                <time dateTime={post.createdAt}>
                  {formatDate(post.createdAt)}
                </time>
              </div>

              {/* Reading time estimate */}
              <span className="text-gray-400">
                {Math.ceil(post.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)} min read
              </span>
            </div>

            {/* Hover effect indicator */}
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center text-blue-600 text-xs">
                <span>Read article</span>
                <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Call to action for more content */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-2">
            Enjoyed these recommendations?
          </p>
          <div className="flex justify-center space-x-3">
            <Link
              href="/posts"
              className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              Browse All Posts
            </Link>
            <Link
              href="/signup"
              className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              Get Personalized Recommendations
            </Link>
          </div>
        </div>
      </div>

      {/* Algorithm transparency note */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <details className="text-xs text-gray-500">
          <summary className="cursor-pointer hover:text-gray-700 transition-colors">
            How are these posts selected?
          </summary>
          <p className="mt-2 text-gray-600 leading-relaxed">
            Our recommendation algorithm considers factors like topic similarity, 
            reading patterns, author relationships, and community engagement to 
            suggest posts you might find interesting. We're constantly improving 
            these recommendations based on user feedback.
          </p>
        </details>
      </div>
    </div>
  );
};

export default RelatedPosts;