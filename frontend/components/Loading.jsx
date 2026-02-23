"use client"
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);

    return () => {
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <div className="text-center">
        {/* Simple spinner */}
        <div className="w-12 h-12 mx-auto mb-4 relative">
          <div className="absolute inset-0 border-3 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-3 border-transparent border-t-cyan-500 border-r-emerald-500 rounded-full animate-spin"></div>
        </div>
        
        {/* Loading text */}
        <p className="text-gray-700 text-base font-medium">
          Loading{dots}
        </p>
      </div>
    </div>
  );
}