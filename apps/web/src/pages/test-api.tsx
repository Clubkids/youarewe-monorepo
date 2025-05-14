import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { strapiClient } from '@youarewe/api-client';
import { getUserFriendlyErrorMessage } from '@/utils/errorUtils';
import Head from 'next/head';
import Link from 'next/link';

export default function TestApi() {
  const { data: session } = useSession();
  
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => strapiClient.get('/api/categories'),
    enabled: !!session,
  });
  
  return (
    <>
      <Head>
        <title>API Test - You Are We</title>
      </Head>
      <div className="p-8 min-h-screen bg-youarewe-grey">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-eskepade text-youarewe-purple mb-6">API Test Page</h1>
          
          {session ? (
            <>
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl mb-3">Session Information</h2>
                <p>Logged in as: <strong>{session.user?.email}</strong></p>
                <p>User ID: <strong>{session.user?.id}</strong></p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl mb-3">API Test: Categories</h2>
                
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="animate-pulse h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded p-4">
                    <p className="text-red-700">Error: {getUserFriendlyErrorMessage(error)}</p>
                  </div>
                ) : (
                  <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-96">
                    {JSON.stringify(categories, null, 2)}
                  </pre>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="mb-4">Please sign in to test the API</p>
              <Link 
                href="/login" 
                className="inline-block bg-youarewe-purple text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Sign In
              </Link>
            </div>
          )}
          
          <div className="mt-6">
            <Link 
              href="/contents"
              className="text-youarewe-purple hover:text-purple-900"
            >
              ← Back to Contents
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}