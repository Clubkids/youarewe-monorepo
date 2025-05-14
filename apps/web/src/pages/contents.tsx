import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function ContentsPage() {
  return (
    <>
      <Head>
        <title>You Are We - Contents</title>
      </Head>
      <div style={{
        backgroundColor: 'black',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1cm',
        boxSizing: 'border-box'
      }}>
        <div style={{
          backgroundColor: '#833ccf',
          width: '100%',
          height: '100%',
          padding: '0.5cm',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#B4A7A5',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            <h1 className="text-5xl mb-8 font-elijah">
              You Are We
            </h1>

            <nav>
              {['Messageboard', 'Projects', 'Search', 'Gig Guide', 'Radio Station'].map((item, index) => (
                <div key={index} style={{ margin: '0.5rem' }}>
                  <h2 className="text-2xl font-eskepade text-youarewe-purple">
                    <Link 
                      href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="no-underline text-youarewe-purple hover:text-purple-900"
                    >
                      {item}
                    </Link>
                  </h2>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}