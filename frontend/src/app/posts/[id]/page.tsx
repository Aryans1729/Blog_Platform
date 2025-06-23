import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PostInteractions from '../../components/PostInteractions';
import RelatedPosts from '../../components/RelatedPosts';
import { Post } from '@/types';

// This interface defines the structure of route parameters
// In Next.js 14's app router, dynamic routes like [id] pass parameters through props
interface PostPageProps {
  params: {
    id: string;
  };
}

// Server-side function to fetch a specific post from the API
async function getPost(id: string): Promise<Post | null> {
  try {
    const response = await fetch(`http://localhost:3001/api/posts/${id}`, {
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch post: ${response.status}`);
    }

    const data = await response.json();
    return data.post; // The backend returns { message, post }
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}

// Dynamic metadata generation for SEO optimization
// This function runs on the server to generate page-specific meta tags
// Think of this as creating a custom "business card" for each blog post that search engines love
export async function generateMetadata(
  { params }: PostPageProps
): Promise<Metadata> {
  const post = await getPost(params.id);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.'
    };
  }

  // Extract a clean excerpt from the content for meta description
  const getPlainTextExcerpt = (content: string, maxLength: number = 160): string => {
    const plainText = content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (plainText.length <= maxLength) {
      return plainText;
    }

    const lastSpace = plainText.substring(0, maxLength).lastIndexOf(' ');
    return plainText.substring(0, lastSpace) + '...';
  };

  const excerpt = getPlainTextExcerpt(post.content);

  return {
    title: post.title,
    description: excerpt,
    authors: [{ name: post.authorEmail?.split('@')[0] || 'Unknown' }],
    openGraph: {
      title: post.title,
      description: excerpt,
      type: 'article',
      publishedTime: post.createdAt,
      authors: [post.authorEmail?.split('@')[0] || 'Unknown'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: excerpt,
    },
  };
}

// Main Post Page Component
// This is a server component that renders on the server for optimal performance and SEO
const PostPage: React.FC<PostPageProps> = async ({ params }) => {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  // Helper functions
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const getReadingTime = (content: string): string => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  const getAuthorName = (email: string): string => {
    if (!email) return 'Anonymous';
    return email.split('@')[0]
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const getAuthorInitials = (name: string): string => {
    return name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const authorName = getAuthorName(post.authorEmail || '');
  const authorInitials = getAuthorInitials(authorName);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href="/posts" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Posts
          </Link>
        </div>

        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-8 py-8">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author and Meta Info */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {authorInitials}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{authorName}</p>
                  <p className="text-sm text-gray-500">{post.authorEmail}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {formatDate(post.createdAt)}
                </p>
                <p className="text-sm text-gray-500">
                  {getReadingTime(post.content)}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>
        </article>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            href={`/posts/${post.id}/edit`}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Post
          </Link>
          <Link
            href="/posts"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            View All Posts
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PostPage;