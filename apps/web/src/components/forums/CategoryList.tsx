import React from 'react';
import Link from 'next/link';

// Define the types specifically for your Strapi response format
interface StrapiCategory {
  id: string | number;
  documentId?: string;
  name?: string;
  slug?: string;
  description?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  threads?: {
    data?: any[];
  };
}

interface CategoryListProps {
  categories: any[];
  isLoading: boolean;
  error: { message: string } | null;
}

// Special function to convert the Strapi v5 response format to our expected format
const processCategoryData = (categories: any[]): StrapiCategory[] => {
  if (!categories || !Array.isArray(categories)) {
    console.warn('processCategoryData received invalid input:', categories);
    return [];
  }

  // Check if data is already in the right format (direct array of categories)
  if (categories.length > 0 && 'name' in categories[0]) {
    return categories;
  }

  // Handle Strapi v5 format where properties are direct on the object (not in attributes)
  return categories.map(category => ({
    id: category.id,
    documentId: category.documentId,
    name: category.name,
    slug: category.slug,
    description: category.description,
    order: category.order,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    threads: category.threads
  }));
};

/**
 * CategoryList component displays all forum categories in a list.
 * Updated to handle Strapi v5 response format directly.
 */
const CategoryList: React.FC<CategoryListProps> = ({ categories, isLoading, error }) => {
  // Show loading state with skeleton UI
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6 animate-pulse">
              <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="flex justify-end mt-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show error state with details
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
          Error Loading Categories
        </h3>
        <p className="text-red-600 dark:text-red-300 mb-4">
          {error.message || 'An unknown error occurred'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Process the categories data to match our expected format
  const processedCategories = processCategoryData(categories);
  
  // Show empty state with helpful message
  if (!processedCategories || processedCategories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Categories Available
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Categories will appear here once they've been created in the admin panel.
        </p>
      </div>
    );
  }

  // Sort categories by order field
  const sortedCategories = [...processedCategories].sort((a, b) => {
    const orderA = a?.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b?.order ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });

  return (
    <div className="space-y-4">
      {sortedCategories.map((category) => {
        if (!category) {
          return null;
        }
        
        const { 
          id,
          name = 'Unnamed Category', 
          slug = `category-${id}`, 
          description = '',
          threads
        } = category;
        
        const threadCount = threads?.data?.length || 0;
        
        return (
          <div 
            key={id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <Link 
              href={`/forums/${slug}`}
              className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                    {name}
                  </h3>
                  {description && (
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      {description}
                    </p>
                  )}
                </div>
                
                <div className="inline-flex px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {threadCount} {threadCount === 1 ? 'thread' : 'threads'}
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryList;