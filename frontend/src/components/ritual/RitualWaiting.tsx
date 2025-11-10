'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface RitualWaitingProps {
  nextRitualTime: Date;
  lastResult?: {
    participants: number;
    success: boolean;
    timeRemaining: string;
  };
}

export default function RitualWaiting({ nextRitualTime, lastResult }: RitualWaitingProps) {
  const [countdown, setCountdown] = useState('--:--:--');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = nextRitualTime.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown('00:00:00');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [nextRitualTime]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1410] to-[#0a0a0a] relative overflow-hidden">
      {/* Chain decoration */}
      <div className="absolute top-0 left-0 right-0 h-16 opacity-30">
        <svg viewBox="0 0 800 100" className="w-full h-full">
          <defs>
            <pattern id="chain-link" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <ellipse cx="10" cy="20" rx="8" ry="12" fill="none" stroke="#9a9a9a" strokeWidth="2"/>
              <ellipse cx="30" cy="20" rx="8" ry="12" fill="none" stroke="#9a9a9a" strokeWidth="2" transform="rotate(90 30 20)"/>
            </pattern>
          </defs>
          <rect width="800" height="100" fill="url(#chain-link)"/>
        </svg>
      </div>

      <div className="container mx-auto px-4 pt-20 pb-12 relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-5xl text-bone-100 mb-2 drop-shadow-[0_0_10px_rgba(74,14,14,0.5)] tracking-wider">
            焼滅の儀
          </h1>
          <p className="font-mystical text-xl text-bone-500 tracking-widest">
            The Burning Ritual
          </p>
        </motion.div>

        {/* Sealed Straw Doll */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="relative w-64 h-80 mx-auto mb-16"
        >
          <motion.div
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-moonlight-800 rounded-lg shadow-[0_0_30px_rgba(58,58,58,0.3)]"
            style={{
              clipPath: 'polygon(50% 0%, 60% 10%, 70% 20%, 80% 40%, 85% 60%, 80% 80%, 70% 90%, 50% 100%, 30% 90%, 20% 80%, 15% 60%, 20% 40%, 30% 20%, 40% 10%)'
            }}
          />
          {/* Seal character */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-accent text-6xl text-bloodstain-900 opacity-60 rotate-12">
              封
            </span>
          </div>
        </motion.div>

        {/* Countdown */}
        <div className="text-center mb-8">
          <div className="inline-block border-t border-b border-bone-500 py-4 px-12">
            <p className="font-body text-bone-500 mb-3 tracking-widest">
              次回開催まで
            </p>
            <motion.div
              animate={{
                textShadow: [
                  '0 0 15px rgba(90,154,90,0.6)',
                  '0 0 25px rgba(90,154,90,0.9)',
                  '0 0 15px rgba(90,154,90,0.6)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="font-display text-6xl text-cursedflame-500 tabular-nums"
            >
              {countdown}
            </motion.div>
          </div>
        </div>

        <p className="text-center font-body text-moonlight-400 mb-12">
          午前2:00 〜 3:00
        </p>

        {/* Last Result */}
        {lastResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="max-w-md mx-auto bg-abyss-700 border-2 border-bloodstain-900 rounded-lg p-6 mb-8 shadow-[0_0_20px_rgba(74,14,14,0.3)]"
          >
            <h3 className="font-body text-bone-100 text-lg mb-4 text-center border-b border-bone-500 pb-2">
              前回の儀式結果
            </h3>
            <div className="space-y-2 font-body text-bone-500">
              <div className="flex justify-between">
                <span>参加者:</span>
                <span className="text-moonlight-400">{lastResult.participants.toLocaleString()}人</span>
              </div>
              <div className="flex justify-between">
                <span>結果:</span>
                <span className={lastResult.success ? 'text-cursedflame-500 font-bold' : 'text-bloodstain-500 font-bold'}>
                  【{lastResult.success ? '成功' : '失敗'}】
                </span>
              </div>
              <div className="flex justify-between">
                <span>残り時間:</span>
                <span className="text-moonlight-400">{lastResult.timeRemaining}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA Button */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="font-body text-bone-500 border border-bone-500 px-8 py-3 rounded-lg hover:bg-bone-500 hover:text-abyss-950 transition-all duration-300 hover:shadow-[0_0_15px_rgba(143,125,95,0.4)]"
          >
            儀式の心得を読む
          </motion.button>
        </div>
      </div>
    </div>
  );
}
