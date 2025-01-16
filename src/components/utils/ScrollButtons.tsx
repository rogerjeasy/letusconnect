"use client";

import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const ScrollButtons = () => {
  const [showButtons, setShowButtons] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show buttons when page is scrolled
      setShowButtons(window.scrollY > 200);
      
      // Check if at top
      setIsAtTop(window.scrollY === 0);
      
      // Check if at bottom
      const isBottom = 
        window.innerHeight + window.scrollY >= 
        document.documentElement.scrollHeight - 20; // 20px threshold
      setIsAtBottom(isBottom);
    };

    // Initial check
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  if (!showButtons) return null;

  return (
    <div className="fixed right-4 bottom-4 flex flex-col gap-2">
      <button
        onClick={scrollToTop}
        disabled={isAtTop}
        className={`p-2 rounded-full shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300
          ${isAtTop 
            ? 'bg-gray-100 cursor-not-allowed' 
            : 'bg-white hover:bg-gray-100 cursor-pointer'
          }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className={`w-6 h-6 ${isAtTop ? 'text-gray-400' : 'text-gray-600'}`} />
      </button>
      
      <button
        onClick={scrollToBottom}
        disabled={isAtBottom}
        className={`p-2 rounded-full shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300
          ${isAtBottom 
            ? 'bg-gray-100 cursor-not-allowed' 
            : 'bg-white hover:bg-gray-100 cursor-pointer'
          }`}
        aria-label="Scroll to bottom"
      >
        <ChevronDown className={`w-6 h-6 ${isAtBottom ? 'text-gray-400' : 'text-gray-600'}`} />
      </button>
    </div>
  );
};

export default ScrollButtons;