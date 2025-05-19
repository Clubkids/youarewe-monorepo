import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { formatApiError } from '@/utils/apiUtils';

import WelcomeHero from '@/components/home/WelcomeHero';
import FeaturedThreads from '@/components/forums/FeaturedThreads';
import RecentActivity from '@/components/forums/RecentActivity';
import CategoryList from '@/components/forums/CategoryList';

// Set the correct API URL - ensure this is the correct server IP
const API_URL = 'http://134.199.169.23:1337';

/**
 * Helper function to ensure we have a usable array from API responses
 * regardless of the format returned
 */
const ensureArray = (data: any): any[] => {
  if (!data) {
    return [];
  }
  
  // If it's already an array, return it
  if (Array.isArray(data)) {
    return data;
  }
  
  // If it has a data property that's an array, return that
  if (data.data && Array.isArray(data.data)) {
    return data.data;
  }
  
  // Return empty array as fallback
  console.warn('Unable to extract array from data:', data);
  return [];
};

/**
 * MessageBoard is the main homepage component for the forum section
 * of the Perth Music Community Forum.
 */
const MessageBoard: React.FC = () => {
  const { data: session } = useSession();
  
  // Direct state for data fetching
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<null | { message: string }>(null);
  
  const [featuredThreads, setFeaturedThreads] = useState<any[]>([]);
  const [featuredThreadsLoading, setFeaturedThreadsLoading] = useState(true);
  const [featuredThreadsError, setFeaturedThreadsError] = useState<null | { message: string }>(null);
  
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [recentActivityLoading, setRecentActivityLoading] = useState(true);
  const [recentActivityError, setRecentActivityError] = useState<null | { message: string }>(null);
  
  // Test API connection
  const testQuery = useQuery({
    queryKey: ['apiTest'],
    queryFn: async () => {
      console.log('Testing API connection...');
      
      try {
        const response = await fetch(`${API_URL}/api/categories`);
        
        if (!response.ok) {
          console.error(`API error: ${response.status} ${response.statusText}`);
          return { error: `API request failed: ${response.status} ${response.statusText}` };
        }
        
        const data = await response.json();
        console.log('API test successful:', data);
        return data;
      } catch (err) {
        console.error('Fetch error:', err);
        return { error: String(err) };
      }
    }
  });
  
  // Check if test query returned an error
  const hasTestError = testQuery.data && 'error' in testQuery.data;
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      if (hasTestError) return;
      
      try {
        console.log("Fetching categories...");
        const categoriesUrl = `${API_URL}/api/categories?populate=threads`;
        console.log("Categories URL:", categoriesUrl);
        
        const response = await fetch(categoriesUrl);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Categories data:", data);
        
        // Process the categories data based on format
        const processedData = ensureArray(data);
        console.log("Processed categories:", processedData);
        setCategories(processedData);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategoriesError({ message: error instanceof Error ? error.message : String(error) });
      } finally {
        setCategoriesLoading(false);
      }
    };
    
    fetchCategories();
  }, [hasTestError, testQuery.data]);
  
  // Fetch featured threads
  useEffect(() => {
    const fetchFeaturedThreads = async () => {
      if (hasTestError) return;
      
      try {
        console.log("Fetching featured threads...");
        const url = `${API_URL}/api/threads?populate=*&filters[isPinned]=true&sort[0]=createdAt:desc&pagination[limit]=5`;
        console.log("Featured threads URL:", url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Featured threads data:", data);
        
        // Process the data
        const processedData = ensureArray(data);
        console.log("Processed featured threads:", processedData);
        setFeaturedThreads(processedData);
      } catch (error) {
        console.error("Error fetching featured threads:", error);
        setFeaturedThreadsError({ message: error instanceof Error ? error.message : String(error) });
      } finally {
        setFeaturedThreadsLoading(false);
      }
    };
    
    fetchFeaturedThreads();
  }, [hasTestError, testQuery.data]);
  
  // Fetch recent activity
  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (hasTestError) return;
      
      try {
        console.log("Fetching recent activity...");
        const url = `${API_URL}/api/posts?populate=*&sort[0]=createdAt:desc&pagination[limit]=10`;
        console.log("Recent activity URL:", url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Recent activity data:", data);
        
        // Process the data
        const processedData = ensureArray(data);
        console.log("Processed recent activity:", processedData);
        setRecentActivity(processedData);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
        setRecentActivityError({ message: error instanceof Error ? error.message : String(error) });
      } finally {
        setRecentActivityLoading(false);
      }
    };
    
    fetchRecentActivity();
  }, [hasTestError, testQuery.data]);

  // Display global API error if API test fails
  if (hasTestError || testQuery.isError) {
    const errorMessage = hasTestError 
      ? (testQuery.data?.error || 'Unknown error')
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
                threads={featuredThreads}
                isLoading={featuredThreadsLoading}
                error={featuredThreadsError}
              />
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-6">Categories</h2>
              <CategoryList 
                categories={categories}
                isLoading={categoriesLoading}
                error={categoriesError}
              />
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
              <RecentActivity 
                activity={recentActivity}
                isLoading={recentActivityLoading}
                error={recentActivityError}
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
            
            {/* Debugging section */}
            <section>
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 text-sm">
                <h3 className="font-semibold mb-2">Debug Info</h3>
                <div>
                  <p>API URL: {API_URL}</p>
                  <p>API Status: {hasTestError ? '❌ Error' : '✅ Connected'}</p>
                  <p>Categories: {
                    categoriesLoading 
                      ? '⏳ Loading' 
                      : categoriesError 
                        ? '❌ Error' 
                        : `✅ Loaded (${categories?.length || 0} items)`
                  }</p>
                  <p>Featured Threads: {
                    featuredThreadsLoading
                      ? '⏳ Loading' 
                      : featuredThreadsError 
                        ? '❌ Error' 
                        : `✅ Loaded (${featuredThreads?.length || 0} items)`
                  }</p>
                  <p>Recent Activity: {
                    recentActivityLoading
                      ? '⏳ Loading' 
                      : recentActivityError 
                        ? '❌ Error' 
                        : `✅ Loaded (${recentActivity?.length || 0} items)`
                  }</p>
                </div>
                
                {/* Error details section */}
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Error Details:</h4>
                  {hasTestError && (
                    <div className="mb-2 p-2 bg-red-100 text-xs rounded overflow-auto max-h-20">
                      <strong>API Test:</strong> {testQuery.data?.error || 'Unknown error'}
                    </div>
                  )}
                  {categoriesError && (
                    <div className="mb-2 p-2 bg-red-100 text-xs rounded overflow-auto max-h-20">
                      <strong>Categories:</strong> {categoriesError.message}
                    </div>
                  )}
                  {featuredThreadsError && (
                    <div className="mb-2 p-2 bg-red-100 text-xs rounded overflow-auto max-h-20">
                      <strong>Featured Threads:</strong> {featuredThreadsError.message}
                    </div>
                  )}
                  {recentActivityError && (
                    <div className="mb-2 p-2 bg-red-100 text-xs rounded overflow-auto max-h-20">
                      <strong>Recent Activity:</strong> {recentActivityError.message}
                    </div>
                  )}
                  <p className="text-xs mt-2">
                    For more detailed errors, check the browser's console (F12 &gt; Console tab)
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageBoard;