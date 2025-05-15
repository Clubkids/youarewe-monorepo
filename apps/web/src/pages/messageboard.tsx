import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function MessageboardPage() {
  return (
    <>
      <Head>
        <title>Messageboard - You Are We</title>
      </Head>
      <div className="min-h-screen bg-youarewe-grey p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-eskepade text-youarewe-purple mb-8">
            Messageboard
          </h1>
          <p className="text-xl mb-8">
            This area is under construction. Please check back soon!
          </p>
          <Link 
            href="/contents"
            className="inline-block text-youarewe-purple hover:text-purple-900"
          >
            ← Back to Contents
          </Link>
        </div>
      </div>
    </>
  );
}