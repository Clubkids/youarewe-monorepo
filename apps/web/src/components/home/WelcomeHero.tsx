import React from 'react';
import Link from 'next/link';

/**
 * WelcomeHero component displays a welcoming message and call-to-action
 * for the Perth Music Community Forum homepage.
 */
const WelcomeHero: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg overflow-hidden shadow-xl">
      <div className="px-6 py-12 md:py-20 md:px-12 text-center md:text-left space-y-6 flex flex-col md:flex-row items-center">
        <div className="md:flex-1 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Welcome to the Perth Music Community Forum
          </h1>
          <p className="text-lg md:text-xl text-purple-100">
            Connect with local musicians, discover new music, and join the conversation
            about Perth's vibrant music scene.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
            <Link href="/messageboard" className="bg-white text-purple-600 hover:bg-purple-100 px-6 py-3 rounded-lg font-medium shadow-md transition duration-200">
              Browse Forums
            </Link>
            <Link href="/register" className="bg-transparent hover:bg-purple-700 text-white border border-white px-6 py-3 rounded-lg font-medium transition duration-200">
              Join Community
            </Link>
          </div>
        </div>
        <div className="hidden md:block md:flex-1">
          <div className="relative h-64 w-full max-w-sm mx-auto">
            <div className="absolute top-0 left-0 w-full h-full rounded-full bg-purple-500 opacity-20 animate-pulse" style={{ animationDuration: '3s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
                <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHero;