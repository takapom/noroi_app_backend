'use client';

import { useEffect } from 'react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-abyss-950 to-abyss-900">
      {/* Church Silhouette */}
      <div className="absolute top-0 left-0 right-0 h-1/3 opacity-40">
        <svg
          viewBox="0 0 800 300"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gothic Cathedral Silhouette */}
          <path
            d="M 100,300 L 100,150 L 150,100 L 150,80 L 145,80 L 145,60 L 155,60 L 155,80 L 150,80 L 150,100 L 200,150 L 200,300 Z
               M 250,300 L 250,120 L 350,50 L 350,20 L 345,20 L 345,0 L 355,0 L 355,20 L 350,20 L 350,50 L 450,120 L 450,300 Z
               M 500,300 L 500,140 L 550,90 L 550,70 L 545,70 L 545,50 L 555,50 L 555,70 L 550,70 L 550,90 L 600,140 L 600,300 Z"
            fill="#3a3a3a"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* App Title - Vertical */}
      <div className="relative z-10 text-center">
        <h1
          className="text-7xl font-display font-black text-bone-100 tracking-wider mb-4"
          style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
        >
          呪癖
        </h1>
        <p className="font-mystical text-bone-400 text-sm tracking-widest">
          ─── JUHEKI ───
        </p>
      </div>

      {/* Loading Flame */}
      <div className="absolute bottom-20">
        <div className="text-4xl">
          <span className="text-cursedflame-500">🔥</span>
        </div>
      </div>
    </div>
  );
}
