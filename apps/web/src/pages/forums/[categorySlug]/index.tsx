import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { browserClient } from '@youarewe/api-client';
import { formatApiError } from '@/utils/apiUtils';

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { categorySlug } = router.query;
  
  // Fetch category data
  const categoryQuery = useQuery({
    queryKey: ['category', categorySlug],
    queryFn: async () => {
      if (!categorySlug) return null;
      return browserClient.get(`/api/categories?filters[slug][$eq]=${categorySlug}&populate=*`);
    },
    enabled: !!categorySlug // Only run query when categorySlug is available
  });
  
  // Wait for the router to be ready
  if (router.isFallback || !categorySlug) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Handle loading state
  if (categoryQuery.isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading category...</p>
        </div>
      </div>
    );
  }
  
  // Handle error state
  if (categoryQuery.error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-red-500">
          <p>Error: {formatApiError(categoryQuery.error)}</p>
          <Link href="/messageboard" className="inline-block mt-4 text-blue-500 hover:underline">
            Return to Forum Home
          </Link>
        </div>
      </div>
    );
  }
  
  const categoryData = categoryQuery.data?.data[0];
  
  if (!categoryData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Category Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">The category you're looking for doesn't exist.</p>
          <Link href="/messageboard" className="inline-block mt-4 text-blue-500 hover:underline">
            Return to Forum Home
          </Link>
        </div>
      </div>
    );
  }
  
  const category = categoryData.attributes;
  
  return (
    <>
      <Head>
        <title>{category.name} | Perth Music Community Forum</title>
        <meta name="description" content={category.description} />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center text-sm mb-2">
            <Link href="/messageboard" className="text-gray-500 hover:text-purple-600">
              Forum Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <Link 
              href={`/create-thread?category=${categorySlug}`}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Create Thread
            </Link>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {category.description}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 shadow-md text-center">
          <p className="text-xl text-gray-500">Thread listing will be implemented in Block 11</p>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;