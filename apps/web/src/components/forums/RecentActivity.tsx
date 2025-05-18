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

interface Thread {
  data: {
    id: string;
    attributes: {
      title: string;
      category: {
        data: {
          attributes: {
            name: string;
            slug: string;
          };
        };
      };
    };
  };
}

interface Post {
  id: string;
  attributes: {
    content: string;
    createdAt: string;
    author: Author;
    thread: Thread;
  };
}

interface RecentActivityProps {
  activity: Post[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * RecentActivity component displays a list of recent posts
 * on the homepage.
 */
const RecentActivity: React.FC<RecentActivityProps> = ({ activity, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex space-x-4">
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center">
        <p className="text-red-500">Error loading recent activity</p>
      </div>
    );
  }

  if (!activity || activity.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center">
        <p className="text-gray-500 dark:text-gray-400">No recent activity.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {activity.map((post) => {
          // Strip HTML tags from content for plain text preview
          const contentPreview = post.attributes.content
            .replace(/<[^>]*>?/gm, '')
            .substring(0, 100) + (post.attributes.content.length > 100 ? '...' : '');
          
          return (
            <div key={post.id} className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center text-purple-700 dark:text-purple-200 font-bold">
                    {post.attributes.author.data.attributes.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <Link 
                      href={`/users/${post.attributes.author.data.attributes.username}`}
                      className="font-medium hover:underline"
                    >
                      {post.attributes.author.data.attributes.username}
                    </Link>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(post.attributes.createdAt))} ago
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Posted in{' '}
                    <Link 
                      href={`/forums/${post.attributes.thread.data.attributes.category.data.attributes.slug}/${post.attributes.thread.data.id}`}
                      className="text-purple-600 hover:underline"
                    >
                      {post.attributes.thread.data.attributes.title}
                    </Link>
                  </p>
                  
                  <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">
                    {contentPreview}
                  </p>
                  
                  <div className="mt-2">
                    <Link
                      href={`/forums/${post.attributes.thread.data.attributes.category.data.attributes.slug}/${post.attributes.thread.data.id}#post-${post.id}`}
                      className="text-xs text-purple-600 hover:text-purple-800 font-medium hover:underline"
                    >
                      View full post →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <Link 
          href="/messageboard"
          className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
        >
          View all activity
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default RecentActivity;