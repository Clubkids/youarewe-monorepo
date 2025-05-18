import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const CreateThreadPage: React.FC = () => {
  // Require authentication for this page
  const { session, loading } = useRequireAuth();
  const router = useRouter();
  const { category } = router.query;
  
  // Wait for auth check
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Create Thread | Perth Music Community Forum</title>
        <meta name="description" content="Start a new discussion on the Perth Music Community Forum" />
      </Head>
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center text-sm mb-2">
            <Link href="/messageboard" className="text-gray-500 hover:text-purple-600">
              Forum Home
            </Link>
            {category && (
              <>
                <span className="mx-2 text-gray-400">/</span>
                <Link href={`/forums/${category}`} className="text-gray-500 hover:text-purple-600">
                  {category}
                </Link>
              </>
            )}
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700 dark:text-gray-300">Create Thread</span>
          </div>
          
          <h1 className="text-3xl font-bold">Create New Thread</h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 shadow-md text-center">
          <p className="text-xl text-gray-500">Thread creation will be implemented in Block 13</p>
          <Link 
            href="/messageboard" 
            className="inline-block mt-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Return to Forum
          </Link>
        </div>
      </div>
    </>
  );
};

export default CreateThreadPage;