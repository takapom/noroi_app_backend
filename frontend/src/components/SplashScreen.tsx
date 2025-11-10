'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [showFlame, setShowFlame] = useState(false);

  useEffect(() => {
    setShowFlame(true);
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-abyss-950 to-abyss-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Church Silhouette */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1/3"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 0.4, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
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
      </motion.div>

      {/* App Title - Vertical */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <h1
          className="text-7xl font-display font-black text-bone-100 tracking-wider mb-4"
          style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
        >
          呪癖
        </h1>
        <motion.p
          className="font-mystical text-bone-400 text-sm tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          ─── JUHEKI ───
        </motion.p>
      </motion.div>

      {/* Loading Flame */}
      {showFlame && (
        <motion.div
          className="absolute bottom-20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            className="text-4xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className="text-cursedflame-500">🔥</span>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
