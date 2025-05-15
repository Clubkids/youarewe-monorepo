import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function useRequireAuth(redirectTo = '/login') {
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === 'loading';
  const loggedIn = status === 'authenticated';

  useEffect(() => {
    if (!loading && !loggedIn) {
      router.push({
        pathname: redirectTo,
        query: { returnTo: router.asPath },
      });
    }
  }, [loading, loggedIn, redirectTo, router]);

  return { session, loading, loggedIn };
}