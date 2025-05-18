import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { browserClient } from '@youarewe/api-client';
import { formatApiError } from '@/utils/apiUtils';

const ThreadDetailPage: React.FC = () => {
  const router = useRouter();
  const { categorySlug, threadId } = router.query;
  
  // Fetch thread data
  const threadQuery = useQuery({
    queryKey: ['thread', threadId],
    queryFn: async () => {
      if (!threadId) return null;
      return browserClient.get(`/api/threads/${threadId}?populate=*`);
    },
    enabled: !!threadId // Only run query when threadId is available
  });
  
  // Wait for the router to be ready
  if (router.isFallback || !categorySlug || !threadId) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Handle loading state
  if (threadQuery.isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading thread...</p>
        </div>
      </div>
    );
  }
  
  // Handle error state
  if (threadQuery.error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-red-500">
          <p>Error: {formatApiError(threadQuery.error)}</p>
          <Link href={`/forums/${categorySlug}`} className="inline-block mt-4 text-blue-500 hover:underline">
            Return to Category
          </Link>
        </div>
      </div>
    );
  }
  
  const thread = threadQuery.data?.data?.attributes;
  
  if (!thread) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Thread Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">The thread you're looking for doesn't exist.</p>
          <Link href={`/forums/${categorySlug}`} className="inline-block mt-4 text-blue-500 hover:underline">
            Return to Category
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{thread.title} | Perth Music Community Forum</title>
        <meta name="description" content={thread.content.substring(0, 160)} />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center text-sm mb-2">
            <Link href="/messageboard" className="text-gray-500 hover:text-purple-600">
              Forum Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href={`/forums/${categorySlug}`} className="text-gray-500 hover:text-purple-600">
              {thread.category?.data?.attributes?.name || categorySlug}
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700 dark:text-gray-300">Thread</span>
          </div>
          
          <h1 className="text-3xl font-bold">{thread.title}</h1>
          
          <div className="flex items-center mt-4 text-sm text-gray-500">
            <span>Posted by {thread.author?.data?.attributes?.username || 'Anonymous'}</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 shadow-md text-center">
          <p className="text-xl text-gray-500">Thread detail view will be implemented in Block 12</p>
        </div>
      </div>
    </>
  );
};

export default ThreadDetailPage;