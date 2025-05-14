import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function LandingPage() {
  const router = useRouter();
  const [imageIndex, setImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [displayGif, setDisplayGif] = useState(false);
  const [showOk, setShowOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load manifest.json and select random images
  useEffect(() => {
    fetch('/images/manifest.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response error: ${response.status}`);
        }
        return response.json();
      })
      .then((data: string[]) => {
        const allImages = data.filter(filename => filename !== 'gif1.gif');
        if (allImages.length === 0) {
          throw new Error('No images found in manifest');
        }
        
        const numToSelect = Math.min(30, allImages.length);
        const selected: string[] = [];
        
        while (selected.length < numToSelect) {
          const randomIndex = Math.floor(Math.random() * allImages.length);
          const randomImage = allImages[randomIndex];
          if (!selected.includes(randomImage)) {
            selected.push(randomImage);
          }
        }
        
        const fullPaths = selected.map(file => `/images/${file}`);
        setImages(fullPaths);
      })
      .catch(err => {
        console.error('Error loading image manifest:', err);
        setError(`Failed to load images: ${err.message}`);
      });
  }, []);

  // Preload selected images with cleanup
  useEffect(() => {
    const imageObjects: HTMLImageElement[] = [];
    if (images.length) {
      images.forEach(src => {
        const img = new Image();
        img.src = src;
        imageObjects.push(img);
      });
    }
    return () => {
      imageObjects.forEach(img => img.src = '');
    };
  }, [images]);

  // Flash images, show GIF, then show OK
  useEffect(() => {
    if (images.length) {
      let count = 0;
      const interval = setInterval(() => {
        setImageIndex(count);
        count++;
        if (count >= images.length) {
          clearInterval(interval);
          setDisplayGif(true);
          setTimeout(() => {
            setDisplayGif(false);
            setShowOk(true);
          }, 3700);
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [images]);

  const handleOkClick = () => {
    router.push('/contents');
  };

  // Show error message if loading fails
  if (error) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>You Are We</title>
        <meta name="description" content="Perth Music Community Forum" />
      </Head>
      <div
        className="landing-page"
        style={{
          backgroundColor: 'black',
          height: '100vh',
          position: 'relative',
          color: 'white',
          fontFamily: 'initial'
        }}
      >
        {/* Flashing images */}
        {!displayGif && !showOk && images.length > 0 && (
          <img
            src={images[imageIndex]}
            alt="flashing"
            loading="eager"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        )}

        {/* GIF display */}
        {displayGif && (
          <img
            src={`/images/gif1.gif?timestamp=${new Date().getTime()}`}
            alt="gif"
            loading="eager"
            style={{
              maxWidth: '125%',
              maxHeight: '125%',
              objectFit: 'contain',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        )}

        {/* Clickable OK Text */}
        {showOk && (
          <span
            onClick={handleOkClick}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: '2.25rem',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'color 0.2s ease-in-out'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'lightgray'}
            onMouseOut={(e) => e.currentTarget.style.color = 'white'}
          >
            OK
          </span>
        )}
      </div>
    </>
  );
}