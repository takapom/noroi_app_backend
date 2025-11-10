'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface RitualActiveProps {
  currentHP: number;
  maxHP: number;
  participants: number;
  timeRemaining: string;
  recentAttacks: Array<{
    username: string;
    damage: number;
    isCritical?: boolean;
    likeBonus?: number;
  }>;
  onAttack: () => void;
  onLike: () => void;
}

export default function RitualActive({
  currentHP,
  maxHP,
  participants,
  timeRemaining,
  recentAttacks,
  onAttack,
  onLike,
}: RitualActiveProps) {
  const [floatingDamage, setFloatingDamage] = useState<number | null>(null);
  const hpPercentage = (currentHP / maxHP) * 100;

  const showDamage = (damage: number) => {
    setFloatingDamage(damage);
    setTimeout(() => setFloatingDamage(null), 2000);
  };

  return (
    <div className="min-h-screen bg-abyss-950 relative overflow-hidden">
      {/* Cursed flame particles background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cursedflame-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header Info */}
        <div className="flex justify-between items-center mb-6">
          <div className="font-body text-bloodstain-500 text-lg flex items-center gap-2">
            <span>⏳</span>
            <span>
              残り時間: <span className="font-display tabular-nums">{timeRemaining}</span>
            </span>
          </div>
          <div className="font-body text-cursedflame-500 text-lg flex items-center gap-2">
            <span>👥</span>
            <span>
              参加者: <span className="font-display tabular-nums">{participants.toLocaleString()}</span>人
            </span>
          </div>
        </div>

        {/* HP Gauge */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mystical text-bone-100 text-xl tracking-wider">HP</span>
            <span className="font-display text-bone-500 tabular-nums">
              {currentHP.toLocaleString()} / {maxHP.toLocaleString()}
            </span>
          </div>
          <div className="h-8 bg-moonlight-800 rounded-full overflow-hidden border-2 border-bone-500 relative shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-bloodstain-500 via-bloodstain-800 to-bloodstain-500 rounded-full relative"
              initial={{ width: `${hpPercentage}%` }}
              animate={{ width: `${hpPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="absolute inset-0 opacity-30 animate-pulse" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
          </div>
        </div>

        {/* Straw Doll */}
        <div className="relative w-full max-w-md mx-auto h-96 mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Straw doll body */}
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-48 h-72 bg-bone-500 rounded-lg shadow-2xl"
                style={{
                  clipPath: 'polygon(50% 0%, 60% 5%, 65% 15%, 70% 30%, 75% 50%, 70% 70%, 65% 85%, 60% 95%, 50% 100%, 40% 95%, 35% 85%, 30% 70%, 25% 50%, 30% 30%, 35% 15%, 40% 5%)',
                }}
              />

              {/* Green cursed flame effect */}
              <motion.div
                animate={{
                  opacity: [0.5, 0.9, 0.5],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-t from-cursedflame-500 via-cursedflame-900/60 to-transparent opacity-70 blur-sm"
              />

              {/* Floating damage numbers */}
              <AnimatePresence>
                {floatingDamage && (
                  <motion.div
                    initial={{ y: 0, opacity: 1, scale: 1 }}
                    animate={{ y: -100, opacity: 0, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2"
                  >
                    <span className="font-display text-4xl text-cursedflame-500 drop-shadow-[0_0_10px_rgba(90,154,90,0.9)] font-bold">
                      -{floatingDamage.toLocaleString()}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
          <motion.button
            onClick={() => {
              onAttack();
              showDamage(Math.floor(Math.random() * 2000) + 500);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-abyss-700 border-2 border-cursedflame-600 rounded-lg py-4 px-6 font-body text-cursedflame-600 hover:bg-cursedflame-600 hover:text-abyss-950 transition-all duration-300 shadow-[0_0_15px_rgba(90,154,90,0.3)] hover:shadow-[0_0_25px_rgba(90,154,90,0.6)]"
          >
            <div className="text-sm mb-1">呪詛を刻む</div>
            <div className="text-xs opacity-70">(投稿)</div>
          </motion.button>
          <motion.button
            onClick={onLike}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-abyss-700 border-2 border-cursedflame-600 rounded-lg py-4 px-6 font-body text-cursedflame-600 hover:bg-cursedflame-600 hover:text-abyss-950 transition-all duration-300 shadow-[0_0_15px_rgba(90,154,90,0.3)] hover:shadow-[0_0_25px_rgba(90,154,90,0.6)]"
          >
            <div className="text-sm mb-1">怨念を送る</div>
            <div className="text-xs opacity-70">(いいね)</div>
          </motion.button>
        </div>

        {/* Attack Log */}
        <div className="max-w-md mx-auto">
          <h3 className="font-body text-bone-500 text-sm mb-3 border-b border-bone-500/30 pb-2">
            最近の攻撃
          </h3>
          <div className="space-y-2 bg-abyss-700/30 rounded-lg p-4 backdrop-blur-sm">
            {recentAttacks.map((attack, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between text-sm font-body"
              >
                <span className="text-moonlight-400">{attack.username}:</span>
                <span className={`font-bold ${attack.isCritical ? 'text-bloodstain-500' : 'text-cursedflame-500'}`}>
                  -{attack.damage.toLocaleString()} dmg{' '}
                  {attack.likeBonus && <span className="text-xs">(怨念×{attack.likeBonus})</span>}
                  {attack.isCritical && <span className="text-xs">(クリティカル!)</span>}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
