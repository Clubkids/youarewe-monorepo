import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  // More permissive CSP for development
  const csp = process.env.NODE_ENV === 'production' 
    ? `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob:;
      font-src 'self';
      connect-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
    `.replace(/\s{2,}/g, ' ').trim()
    : ''; // Empty CSP in development mode
    
  return (
    <Html lang="en">
      <Head>
        {process.env.NODE_ENV === 'production' && (
          <meta httpEquiv="Content-Security-Policy" content={csp} />
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}