import React from 'react';
import Head from 'next/head';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { formatApiError } from '@/utils/apiUtils';

import WelcomeHero from '@/components/home/WelcomeHero';
import FeaturedThreads from '@/components/forums/FeaturedThreads';
import RecentActivity from '@/components/forums/RecentActivity';
import CategoryList from '@/components/forums/CategoryList';

// Get API URL from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

/**
 * MessageBoard is the main homepage component for the forum section
 * of the Perth Music Community Forum.
 */
const MessageBoard: React.FC = () => {
  const { data: session } = useSession();
  
  // Test API connection (using standard fetch without extra wrappers)
  const testQuery = useQuery({
    queryKey: ['apiTest'],
    queryFn: async () => {
      console.log('Testing API connection...');
      
      try {
        const response = await fetch(`${API_URL}/api/categories`);
        
        // Basic error handling without using Error constructor
        if (!response.ok) {
          console.error(`API error: ${response.status} ${response.statusText}`);
          return { error: `API request failed: ${response.status} ${response.statusText}` };
        }
        
        const data = await response.json();
        console.log('API test successful:', data);
        return data;
      } catch (err) {
        console.error('Fetch error:', err);
        // Return error info as object, without constructing Error
        return { error: String(err) };
      }
    }
  });
  
  // Helper function for making fetch requests that keeps errors visible
  const makeApiRequest = async (endpoint: string) => {
    try {
      console.log(`Fetching: ${API_URL}${endpoint}`);
      const response = await fetch(`${API_URL}${endpoint}`);
      
      if (!response.ok) {
        // This will preserve the error dialog in browser dev tools
        console.error(`API error: ${response.status} ${response.statusText}`);
        return { error: `API request failed: ${response.status} ${response.statusText}` };
      }
      
      return await response.json();
    } catch (err) {
      console.error('Fetch error:', err);
      return { error: String(err) };
    }
  };
  
  // Check if test query returned an error
  const hasTestError = testQuery.data && 'error' in testQuery.data;
  
  // Fetch featured threads with updated query format
  const featuredThreadsQuery = useQuery({
    queryKey: ['featuredThreads'],
    // Using populate=* to get all relations
    queryFn: () => makeApiRequest('/api/threads?populate=*&filters[isPinned]=true&sort[0]=createdAt:desc&pagination[limit]=5'),
    enabled: !hasTestError && !testQuery.isLoading,
  });

  // Fetch recent activity with updated query format
  const recentActivityQuery = useQuery({
    queryKey: ['recentActivity'],
    // Using populate=* to get all relations
    queryFn: () => makeApiRequest('/api/posts?populate=*&sort[0]=createdAt:desc&pagination[limit]=10'),
    enabled: !hasTestError && !testQuery.isLoading,
  });

  // Fetch categories with proper Strapi v5 syntax (this one already works)
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => makeApiRequest('/api/categories?populate=threads&sort[order]=asc'),
    enabled: !hasTestError && !testQuery.isLoading,
  });

  // Display global API error if API test fails
  if (hasTestError || testQuery.isError) {
    const errorMessage = hasTestError 
      ? testQuery.data.error 
      : testQuery.error instanceof Error 
        ? testQuery.error.message 
        : String(testQuery.error);
      
    return (
      <div className="container mx-auto px-4 py-12">
        <WelcomeHero />
        <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">
            API Connection Error
          </h2>
          <p className="mb-4">
            We're having trouble connecting to the server. This might be because:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>The Strapi backend is not running</li>
            <li>There's a network connectivity issue</li>
            <li>The API URL configuration is incorrect (Current URL: {API_URL})</li>
          </ul>
          <p className="mb-6">
            Technical details: {errorMessage}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Function to check if a query result has an error
  const hasQueryError = (query: any) => {
    return query.data && 'error' in query.data;
  };

  // Function to get the error message from a query
  const getQueryErrorMessage = (query: any) => {
    if (query.isError) {
      return query.error instanceof Error ? query.error.message : String(query.error);
    }
    if (query.data && 'error' in query.data) {
      return query.data.error;
    }
    return 'Unknown error';
  };

  return (
    <>
      <Head>
        <title>Perth Music Community Forum</title>
        <meta name="description" content="Connect with Perth's vibrant music community, discover new music, and join the conversation." />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <WelcomeHero />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-12">
          <div className="lg:col-span-3 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-6">Featured Discussions</h2>
              <FeaturedThreads 
                threads={!hasQueryError(featuredThreadsQuery) ? featuredThreadsQuery.data?.data || [] : []} 
                isLoading={featuredThreadsQuery.isLoading}
                error={hasQueryError(featuredThreadsQuery) ? { message: featuredThreadsQuery.data.error } : null}
              />
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-6">Categories</h2>
              <CategoryList 
                categories={!hasQueryError(categoriesQuery) ? categoriesQuery.data?.data || [] : []}
                isLoading={categoriesQuery.isLoading}
                error={hasQueryError(categoriesQuery) ? { message: categoriesQuery.data.error } : null}
              />
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
              <RecentActivity 
                activity={!hasQueryError(recentActivityQuery) ? recentActivityQuery.data?.data || [] : []}
                isLoading={recentActivityQuery.isLoading}
                error={hasQueryError(recentActivityQuery) ? { message: recentActivityQuery.data.error } : null}
              />
            </section>
          </div>
          
          <div className="space-y-6">
            {session && (
              <section>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <a 
                      href="/create-thread" 
                      className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition"
                    >
                      Create New Thread
                    </a>
                    <a 
                      href="/my-profile" 
                      className="block w-full text-center border border-purple-600 text-purple-600 hover:bg-purple-50 py-2 px-4 rounded-md transition"
                    >
                      Edit Your Profile
                    </a>
                  </div>
                </div>
              </section>
            )}
            
            {/* Debugging section with basic info only */}
            <section>
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 text-sm">
                <h3 className="font-semibold mb-2">Debug Info</h3>
                <div>
                  <p>API URL: {API_URL}</p>
                  <p>API Status: {hasTestError ? '❌ Error' : '✅ Connected'}</p>
                  <p>Featured Threads: {
                    featuredThreadsQuery.isLoading ? '⏳ Loading' : 
                    hasQueryError(featuredThreadsQuery) ? '❌ Error' : 
                    '✅ Loaded'
                  }</p>
                  <p>Categories: {
                    categoriesQuery.isLoading ? '⏳ Loading' : 
                    hasQueryError(categoriesQuery) ? '❌ Error' : 
                    '✅ Loaded'
                  }</p>
                  <p>Recent Activity: {
                    recentActivityQuery.isLoading ? '⏳ Loading' : 
                    hasQueryError(recentActivityQuery) ? '❌ Error' : 
                    '✅ Loaded'
                  }</p>
                </div>
                
                {/* Error details section */}
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Error Details:</h4>
                  {hasTestError && (
                    <div className="mb-2 p-2 bg-red-100 text-xs rounded overflow-auto max-h-20">
                      <strong>API Test:</strong> {testQuery.data.error}
                    </div>
                  )}
                  {hasQueryError(featuredThreadsQuery) && (
                    <div className="mb-2 p-2 bg-red-100 text-xs rounded overflow-auto max-h-20">
                      <strong>Featured Threads:</strong> {featuredThreadsQuery.data.error}
                    </div>
                  )}
                  {hasQueryError(categoriesQuery) && (
                    <div className="mb-2 p-2 bg-red-100 text-xs rounded overflow-auto max-h-20">
                      <strong>Categories:</strong> {categoriesQuery.data.error}
                    </div>
                  )}
                  {hasQueryError(recentActivityQuery) && (
                    <div className="mb-2 p-2 bg-red-100 text-xs rounded overflow-auto max-h-20">
                      <strong>Recent Activity:</strong> {recentActivityQuery.data.error}
                    </div>
                  )}
                  {/* Additional error detail instructions */}
                  <p className="text-xs mt-2">
                    For more detailed errors, check the browser's console (F12 &gt; Console tab)
                  </p>
                </div>
                
                {/* Network security warning (for development only) */}
                {process.env.NODE_ENV !== 'production' && (
                  <div className="mt-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md text-xs">
                    <strong>Note:</strong> Chrome security warnings about "private network requests"
                    can be safely ignored during local development.
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageBoard;