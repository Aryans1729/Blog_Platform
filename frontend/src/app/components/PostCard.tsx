'use client';

import Link from 'next/link';
import { Post } from '@/types';
import { useAuth } from '../lib/auth';
import { useState } from 'react';
import apiClient from '../lib/api';
import { notifications } from '@/lib/notifications';

interface PostCardProps {
  post: Post;
  showAuthor?: boolean;
  showFullContent?: boolean;
  className?: string;
  onDelete?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  showAuthor = true, 
  showFullContent = false, 
  className = '',
  onDelete 
}) => {
  const { authState } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  // Get author display name from email
  const getAuthorName = (email: string): string => {
    const localPart = email.split('@')[0];
    return localPart
      .replace(/[._-]/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get author initials for avatar
  const getAuthorInitials = (email: string): string => {
    const name = getAuthorName(email);
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Calculate reading time (rough estimate)
  const getReadingTime = (content: string): string => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    setIsDeleting(true);
    try {
      await apiClient.deletePost(post.id);
      onDelete?.();
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Truncate content for preview
  const getTruncatedContent = (content: string, maxLength: number = 120): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  const canEdit = authState.isAuthenticated && authState.user?.id === post.authorId;

  return (
    <article className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${className}`}>
      {/* Post Content */}
      <div className="p-6">
        {/* Author Info */}
        {showAuthor && (
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
              {getAuthorInitials(post.authorEmail)}
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{getAuthorName(post.authorEmail)}</p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                <span>•</span>
                <span>{getReadingTime(post.content)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Post Title */}
        <h2 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
          <Link href={`/posts/${post.id}`} className="hover:text-blue-600 transition-colors">
            {post.title}
          </Link>
        </h2>

        {/* Post Content Preview */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            {showFullContent ? post.content : getTruncatedContent(post.content)}
          </p>
        </div>

        {/* Read More Link */}
        {!showFullContent && (
          <Link 
            href={`/posts/${post.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
          >
            Read more →
          </Link>
        )}
      </div>

      {/* Action Buttons (Edit/Delete) */}
      {canEdit && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                href={`/posts/${post.id}/edit`}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default PostCard;