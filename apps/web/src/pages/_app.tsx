import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

// Function to disable React DevTools (and Next.js DevTools)
function disableReactDevTools() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Disable React DevTools
    const noop = () => undefined;
    const DEV_TOOLS = '__REACT_DEVTOOLS_GLOBAL_HOOK__';
    
    // Fix the TypeScript error with correct typing
    if (typeof (window as any)[DEV_TOOLS] === 'object') {
      for (const key in (window as any)[DEV_TOOLS]) {
        (window as any)[DEV_TOOLS][key] = typeof (window as any)[DEV_TOOLS][key] === 'function' ? noop : null;
      }
    }
  }
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  useEffect(() => {
    // Disable development tools
    disableReactDevTools();
    
    // Remove any development indicators
    const devIndicators = document.querySelectorAll('[hidden][id^="__next"]');
    devIndicators.forEach(el => {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
  }, []);

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </SessionProvider>
  );
}