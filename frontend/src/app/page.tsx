'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PostCard from './components/PostCard';
import { Post, LoadingState } from '@/types';
import apiClient from './lib/api';

// Sample posts for demonstration (in real app, these would come from API)
const samplePosts: Post[] = [
  {
    id: 1,
    title: "Getting Started with Next.js 14: A Comprehensive Guide",
    content: "Next.js 14 introduces powerful new features that make building web applications more efficient and enjoyable. In this comprehensive guide, we'll explore the app router, server components, and how to leverage these tools to create amazing user experiences...",
    authorId: 1,
    authorEmail: "sarah.developer@example.com",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    title: "The Art of Clean Code: Writing Maintainable Software",
    content: "Clean code is not just about making your code work—it's about making it readable, maintainable, and elegant. In this post, we'll explore the principles that separate good code from great code...",
    authorId: 2,
    authorEmail: "alex.architect@example.com",
    createdAt: "2024-01-14T14:45:00Z"
  },
  {
    id: 3,
    title: "Building Accessible Web Applications: A Developer's Guide",
    content: "Accessibility isn't just a nice-to-have feature—it's a fundamental aspect of inclusive web design. This guide covers practical techniques for building applications that work for everyone...",
    authorId: 3,
    authorEmail: "morgan.designer@example.com",
    createdAt: "2024-01-13T09:15:00Z"
  }
];

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.SUCCESS);

  // Try to load real posts from API, fallback to sample posts
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoadingState(LoadingState.LOADING);
        const realPosts = await apiClient.getPosts();
        if (realPosts && realPosts.length > 0) {
          setPosts(realPosts.slice(0, 3)); // Show only first 3 posts
        } else {
          setPosts(samplePosts); // Fallback to sample posts
        }
        setLoadingState(LoadingState.SUCCESS);
      } catch (error) {
        console.log('Using sample posts as API is not available');
        setPosts(samplePosts);
        setLoadingState(LoadingState.SUCCESS);
      }
    };

    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Share Your Stories with the World
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Join our community of writers and readers. Create, discover, and engage with amazing content that matters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/posts" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                >
                  Start Reading
                </Link>
                <Link 
                  href="/auth" 
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
                >
                  Start Writing
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 lg:p-12">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Join Our Community</h3>
                <p className="text-gray-600 mb-6">Connect with writers and readers from around the world</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">1K+</div>
                    <div className="text-sm text-gray-600">Writers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">5K+</div>
                    <div className="text-sm text-gray-600">Stories</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">10K+</div>
                    <div className="text-sm text-gray-600">Readers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the perfect blend of simplicity and power for your writing journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Effortless Writing</h3>
              <p className="text-gray-600">
                Focus on your ideas with our clean, distraction-free editor. Rich formatting and auto-save make writing a joy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Vibrant Community</h3>
              <p className="text-gray-600">
                Connect with like-minded writers and readers. Share feedback, discover new perspectives, and grow together.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-purple-600 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600">
                Your content is protected with enterprise-grade security. Control who sees your work with flexible privacy settings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Stories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Latest Stories
              </h2>
              <p className="text-lg text-gray-600">
                Discover fresh perspectives from our community
              </p>
            </div>
            <Link 
              href="/posts" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View All Posts →
            </Link>
          </div>

          {/* Posts Grid */}
          {loadingState === LoadingState.LOADING ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard 
                  key={post.id}
                  post={post} 
                  showAuthor={true}
                  showFullContent={false}
                  className="h-full"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Share Your Story?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of writers who have already discovered the joy of sharing their thoughts with our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Start Writing Today
            </Link>
            <Link 
              href="/posts" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-medium"
            >
              Browse Stories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}