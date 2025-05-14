import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Head from 'next/head';
import { getUserFriendlyErrorMessage } from '@/utils/errorUtils';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { returnTo, error: urlError } = router.query;
  
  // Handle URL-based errors (from NextAuth)
  useEffect(() => {
    if (urlError) {
      switch (urlError) {
        case 'CredentialsSignin':
          setError('Invalid email or password');
          break;
        case 'SessionRequired':
          setError('You must be signed in to access that page');
          break;
        default:
          setError(`Authentication error: ${urlError}`);
      }
    }
  }, [urlError]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        setError(getUserFriendlyErrorMessage(new Error(result.error)));
      } else {
        router.push(returnTo ? String(returnTo) : '/contents');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(getUserFriendlyErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Head>
        <title>Login - You Are We</title>
      </Head>
      <div className="min-h-screen bg-youarewe-grey flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-eskepade text-youarewe-purple text-center mb-8">
            Sign In
          </h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-youarewe-purple"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-youarewe-purple"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-youarewe-purple text-white py-2 px-4 rounded-md hover:bg-purple-900 transition disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/register" className="text-youarewe-purple hover:text-purple-900">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}