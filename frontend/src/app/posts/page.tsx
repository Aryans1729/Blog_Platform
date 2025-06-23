'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Post, LoadingState } from '@/types';
import PostCard from '../components/PostCard';
import { useAuth } from '../lib/auth';
import apiClient from '../lib/api';

// Author interface for filtering
interface Author {
  id: number;
  name: string;
  email: string;
}

// Posts Page Component
const PostsPage: React.FC = () => {
  const { authState } = useAuth();
  const searchParams = useSearchParams();
  
  const authorFilter = searchParams.get('author');

  // State management
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredAndSortedPosts, setFilteredAndSortedPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.LOADING);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState<string>(authorFilter || '');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  // Load posts when component mounts
  useEffect(() => {
    loadPosts();
  }, []);

  // Update selected author when URL parameter changes
  useEffect(() => {
    if (authorFilter) {
      setSelectedAuthor(authorFilter);
    }
  }, [authorFilter]);

  // Update filtered posts when filters change
  useEffect(() => {
    filterAndSortPosts();
  }, [posts, searchTerm, selectedAuthor, sortBy]);

  // Function to load all posts and authors
  const loadPosts = async () => {
    try {
      setLoadingState(LoadingState.LOADING);
      
      const postsData = await apiClient.getPosts();
      setPosts(postsData);
      
      // Extract unique authors from posts
      const uniqueAuthors = Array.from(
        new Map(postsData.map((post: Post) => [post.authorId, {
          id: post.authorId,
          name: getAuthorName(post.authorEmail),
          email: post.authorEmail
        }])).values()
      ) as Author[];
      setAuthors(uniqueAuthors);
      
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setLoadingState(LoadingState.ERROR);
    }
  };

  // Function to get author display name from email
  const getAuthorName = (email: string): string => {
    const localPart = email.split('@')[0];
    return localPart
      .replace(/[._-]/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  // Function to filter and sort posts
  const filterAndSortPosts = () => {
    let filtered = [...posts];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply author filter
    if (selectedAuthor) {
      filtered = filtered.filter(post => post.authorId.toString() === selectedAuthor);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredAndSortedPosts(filtered);
  };

  // Get unique authors for the filter dropdown
  const authorsForDropdown = useMemo(() => {
    const uniqueAuthors = Array.from(new Set(posts.map(post => post.authorEmail)))
      .map(email => {
        const post = posts.find(p => p.authorEmail === email);
        return {
          id: post?.authorId || 0,
          email,
          name: getAuthorName(email)
        };
      });
    return uniqueAuthors;
  }, [posts]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredAndSortedPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredAndSortedPosts, currentPage, postsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedAuthor, sortBy]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedAuthor('');
    setSortBy('newest');
  };

  // Loading state
  if (loadingState === LoadingState.LOADING) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Discover Amazing Stories
            </h1>
            <p className="text-gray-600">
              Explore insights, experiences, and ideas from our community of writers
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (loadingState === LoadingState.ERROR) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Failed to Load Posts
          </h3>
          <p className="text-gray-600 mb-6">
            There was an error loading posts. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Discover Amazing Stories
          </h1>
          <p className="text-gray-600">
            Explore insights, experiences, and ideas from our community of writers
          </p>
        </div>

        {/* Search and Filters - Horizontal Layout */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            
            {/* Search input */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search posts
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Author filter */}
            <div className="w-full lg:w-48">
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by author
              </label>
              <select
                id="author"
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All authors</option>
                {authorsForDropdown.map((author) => (
                  <option key={author.id} value={author.id.toString()}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort options */}
            <div className="w-full lg:w-48">
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                Sort by
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>

            {/* Clear filters button */}
            {(searchTerm || selectedAuthor) && (
              <div className="w-full lg:w-auto">
                <button
                  onClick={clearFilters}
                  className="w-full lg:w-auto px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Results count and active filters */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-gray-600">
                {filteredAndSortedPosts.length} {filteredAndSortedPosts.length === 1 ? 'post' : 'posts'} found
              </span>

              {/* Active filters */}
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedAuthor && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Author: {authorsForDropdown.find(a => a.id.toString() === selectedAuthor)?.name}
                  <button
                    onClick={() => setSelectedAuthor('')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {filteredAndSortedPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {searchTerm || selectedAuthor ? 'No posts found' : 'No posts available'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedAuthor 
                  ? 'Try adjusting your search terms or filters.' 
                  : 'Be the first to share your story! Create an account and start writing today.'
                }
              </p>
              {searchTerm || selectedAuthor ? (
                <button 
                  onClick={clearFilters} 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                <Link 
                  href="/auth" 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedPosts.map((post) => (
                <PostCard 
                  key={post.id}
                  post={post} 
                  showAuthor={true}
                  showFullContent={false}
                  className="h-full"
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Call to Action Section */}
        {filteredAndSortedPosts.length > 0 && (
          <div className="mt-16">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Ready to Share Your Story?
              </h3>
              <p className="text-gray-600 mb-6">
                Join our community of writers and readers. Share your thoughts, experiences, and insights with the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/auth" 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                >
                  Start Writing Today
                </Link>
                <Link 
                  href="/" 
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors inline-block"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsPage;