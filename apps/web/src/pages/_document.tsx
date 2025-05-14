import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  // Define CSP directives
  const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  return (
    <Html lang="en">
      <Head>
        <meta httpEquiv="Content-Security-Policy" content={csp} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}