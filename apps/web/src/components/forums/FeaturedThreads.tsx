import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

// Define the types for our data
interface Author {
  data: {
    id: string;
    attributes: {
      username: string;
    };
  };
}

interface Category {
  data: {
    id: string;
    attributes: {
      name: string;
      slug: string;
    };
  };
}

interface Thread {
  id: string;
  attributes: {
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    author: Author;
    category: Category;
    viewCount: number;
    isPinned: boolean;
    isLocked: boolean;
  };
}

interface FeaturedThreadsProps {
  threads: Thread[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Safely get nested property values with fallbacks
 */
const safeGet = <T,>(accessor: () => T, defaultValue: T): T => {
  try {
    const value = accessor();
    return value !== undefined && value !== null ? value : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

/**
 * Format a date with error handling
 */
const safeFormatDate = (dateString: string | undefined): string => {
  try {
    if (!dateString) return 'Unknown date';
    return formatDistanceToNow(new Date(dateString)) + ' ago';
  } catch (e) {
    console.error('Date formatting error:', e, dateString);
    return 'Unknown date';
  }
};

/**
 * FeaturedThreads component displays a list of pinned or featured threads
 * on the homepage.
 */
const FeaturedThreads: React.FC<FeaturedThreadsProps> = ({ threads, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 h-24 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.error('FeaturedThreads error:', error);
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading featured threads</p>
          <p className="text-sm text-gray-500">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!threads || threads.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center">
        <p className="text-gray-500 dark:text-gray-400">No featured threads yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => {
        // Safe accessors for potentially missing data
        const title = safeGet(() => thread.attributes.title, 'Untitled Thread');
        const content = safeGet(() => thread.attributes.content, '');
        const categorySlug = safeGet(() => thread.attributes.category.data.attributes.slug, 'uncategorized');
        const categoryName = safeGet(() => thread.attributes.category.data.attributes.name, 'Uncategorized');
        const authorUsername = safeGet(() => thread.attributes.author.data.attributes.username, 'Anonymous');
        const createdAt = safeGet(() => thread.attributes.createdAt, '');
        const viewCount = safeGet(() => thread.attributes.viewCount, 0);
        const isPinned = safeGet(() => thread.attributes.isPinned, false);
        const isLocked = safeGet(() => thread.attributes.isLocked, false);
        
        // Format and clean content preview
        const contentPreview = content
          ? content.replace(/<[^>]*>?/gm, '').substring(0, 150) + (content.length > 150 ? '...' : '')
          : 'No content available';
          
        return (
          <div 
            key={thread.id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <Link 
                    href={`/forums/${categorySlug}/${thread.id}`}
                    className="text-xl font-semibold hover:text-purple-600 transition duration-200"
                  >
                    {title}
                  </Link>
                  
                  <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Posted by </span>
                    <Link 
                      href={`/users/${authorUsername}`}
                      className="font-medium hover:underline mx-1"
                    >
                      {authorUsername}
                    </Link>
                    <span className="mx-1">•</span>
                    <span>{safeFormatDate(createdAt)}</span>
                    <span className="mx-1">•</span>
                    <Link 
                      href={`/forums/${categorySlug}`}
                      className="text-purple-600 hover:underline"
                    >
                      {categoryName}
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <span>{viewCount} views</span>
                </div>
              </div>
              
              <div className="mt-4 text-gray-600 dark:text-gray-300 line-clamp-2">
                {contentPreview}
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isPinned && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Pinned
                    </span>
                  )}
                  {isLocked && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Locked
                    </span>
                  )}
                </div>
                
                <Link 
                  href={`/forums/${categorySlug}/${thread.id}`}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium hover:underline"
                >
                  Read more →
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturedThreads;