import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function ContentsPage() {
  // Add effect to apply no-scroll class to body and hide Next.js dev indicators
  useEffect(() => {
    // Add the no-scroll class to the body
    document.body.classList.add('no-scroll');
    
    // Manually add a style to hide the Next.js development indicator
    const style = document.createElement('style');
    style.innerHTML = `
      body > div:last-child[hidden] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    
    // Clean up when component unmounts
    return () => {
      document.body.classList.remove('no-scroll');
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  return (
    <React.Fragment>
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
        padding: '0',
        margin: '0',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}>
        <div style={{
          backgroundColor: '#833ccf',
          width: 'calc(100% - 2rem)',
          height: 'calc(100% - 2rem)',
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
            <h1 
              className="text-5xl mb-8 font-elijah" 
              style={{ 
                fontFamily: 'CSElijah, serif',
                fontWeight: 'normal'
              }}
            >
              You Are We
            </h1>
            <nav>
              {['Messageboard', 'Projects', 'Search', 'Gig Guide', 'Radio Station'].map((item, index) => (
                <div key={index} style={{ margin: '0.5rem' }}>
                  <h2 
                    className="text-2xl font-sportage"
                    style={{
                      fontFamily: '"Sportage-Demo", sans-serif',
                      fontWeight: '300',
                      color: '#833ccf'
                    }}
                  >
                    <Link 
                      href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="no-underline hover:opacity-80"
                      style={{ color: '#833ccf' }}
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
    </React.Fragment>
  );
}