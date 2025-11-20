"use client";

import { motion } from 'framer-motion';

// 呪癖スタイルの定義
export type RitualStyle =
  | 'infernal_rite'    // 炎獄の儀式
  | 'frozen_curse'     // 氷結の呪縛
  | 'shadow_whisper'   // 闇夜の囁き
  | 'blood_pact'       // 血盟の刻印
  | 'danse_macabre';   // 骸骨の舞踏

interface RitualStyleConfig {
  name: string;
  latinName: string;
  symbol: string;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  decorativeChar: string; // Gothic ornamental character
}

const ritualStyles: Record<RitualStyle, RitualStyleConfig> = {
  infernal_rite: {
    name: '炎獄の儀式',
    latinName: 'Ignis Infernus',
    symbol: '🔥',
    primaryColor: 'from-bloodstain-700 to-bloodstain-900',
    secondaryColor: 'text-bloodstain-500',
    glowColor: 'shadow-[0_0_10px_rgba(139,30,30,0.5)]',
    decorativeChar: '✠'
  },
  frozen_curse: {
    name: '氷結の呪縛',
    latinName: 'Glacialis Maledictio',
    symbol: '❄️',
    primaryColor: 'from-moonlight-600 to-moonlight-800',
    secondaryColor: 'text-moonlight-400',
    glowColor: 'shadow-[0_0_10px_rgba(154,154,154,0.4)]',
    decorativeChar: '†'
  },
  shadow_whisper: {
    name: '闇夜の囁き',
    latinName: 'Umbra Sussurrus',
    symbol: '🌑',
    primaryColor: 'from-abyss-800 to-abyss-950',
    secondaryColor: 'text-bone-600',
    glowColor: 'shadow-[0_0_10px_rgba(10,10,10,0.8)]',
    decorativeChar: '☨'
  },
  blood_pact: {
    name: '血盟の刻印',
    latinName: 'Pactum Sanguinis',
    symbol: '🩸',
    primaryColor: 'from-bloodstain-800 to-abyss-900',
    secondaryColor: 'text-bloodstain-600',
    glowColor: 'shadow-[0_0_10px_rgba(107,21,21,0.6)]',
    decorativeChar: '✝'
  },
  danse_macabre: {
    name: '骸骨の舞踏',
    latinName: 'Saltatio Mortis',
    symbol: '💀',
    primaryColor: 'from-bone-500 to-abyss-800',
    secondaryColor: 'text-bone-300',
    glowColor: 'shadow-[0_0_10px_rgba(143,125,95,0.4)]',
    decorativeChar: '☦'
  }
};

interface RitualStyleBadgeProps {
  style: RitualStyle;
  variant?: 'full' | 'compact' | 'icon';
  showLatin?: boolean;
  animate?: boolean;
}

export default function RitualStyleBadge({
  style,
  variant = 'compact',
  showLatin = true,
  animate = true
}: RitualStyleBadgeProps) {
  const config = ritualStyles[style];

  // Icon only variant
  if (variant === 'icon') {
    return (
      <motion.span
        className={`
          inline-flex items-center justify-center
          w-5 h-5 rounded-full
          bg-gradient-to-br ${config.primaryColor}
          ${config.glowColor}
          border border-moonlight-700/30
        `}
        whileHover={animate ? { scale: 1.2, rotate: 15 } : {}}
        title={`${config.name} | ${config.latinName}`}
      >
        <span className="text-xs">{config.symbol}</span>
      </motion.span>
    );
  }

  // Compact variant (default for timeline)
  if (variant === 'compact') {
    return (
      <motion.div
        className={`
          inline-flex items-center gap-1.5
          px-2 py-0.5 rounded-sm
          bg-gradient-to-r ${config.primaryColor}
          border border-moonlight-800/50
          ${animate ? config.glowColor : ''}
          relative overflow-hidden
        `}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={animate ? {
          scale: 1.05,
          transition: { duration: 0.2 }
        } : {}}
      >
        {/* Gothic corner decoration */}
        <span className="absolute -left-1 top-1/2 -translate-y-1/2 text-moonlight-700/30 text-xs">
          {config.decorativeChar}
        </span>

        {/* Symbol */}
        <span className="text-xs relative z-10">{config.symbol}</span>

        {/* Style name */}
        <span className={`
          font-mystical text-xs ${config.secondaryColor}
          tracking-wider relative z-10
        `}>
          {showLatin ? config.latinName : config.name}
        </span>

        {/* Gothic corner decoration */}
        <span className="absolute -right-1 top-1/2 -translate-y-1/2 text-moonlight-700/30 text-xs">
          {config.decorativeChar}
        </span>

        {/* Subtle animated glow effect */}
        {animate && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 5,
              ease: 'linear'
            }}
          />
        )}
      </motion.div>
    );
  }

  // Full variant (for profile or detailed view)
  return (
    <motion.div
      className={`
        inline-flex flex-col items-center gap-1
        px-4 py-2 rounded
        bg-gradient-to-br ${config.primaryColor}
        border-2 border-moonlight-700/50
        ${animate ? config.glowColor : ''}
        relative overflow-hidden
      `}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={animate ? {
        scale: 1.05,
        borderColor: 'var(--bloodstain-700)',
        transition: { duration: 0.3 }
      } : {}}
    >
      {/* Gothic ornamental corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-bloodstain-800/50" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-bloodstain-800/50" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-bloodstain-800/50" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-bloodstain-800/50" />

      {/* Main content */}
      <div className="flex items-center gap-2">
        <span className="text-lg">{config.symbol}</span>
        <span className={`
          font-mystical text-sm ${config.secondaryColor}
          tracking-widest uppercase
        `}>
          {config.name}
        </span>
      </div>

      {/* Latin subtitle with decorative elements */}
      {showLatin && (
        <div className="flex items-center gap-2 opacity-70">
          <span className="text-moonlight-600 text-xs">{config.decorativeChar}</span>
          <span className="font-accent text-xs text-bone-400 italic">
            {config.latinName}
          </span>
          <span className="text-moonlight-600 text-xs">{config.decorativeChar}</span>
        </div>
      )}

      {/* Mystical floating particles effect */}
      {animate && (
        <>
          <motion.span
            className="absolute text-xs opacity-20"
            initial={{ bottom: 0, left: '20%' }}
            animate={{
              bottom: '100%',
              left: '25%',
              opacity: [0.2, 0.5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'easeOut'
            }}
          >
            {config.decorativeChar}
          </motion.span>
          <motion.span
            className="absolute text-xs opacity-20"
            initial={{ bottom: 0, right: '30%' }}
            animate={{
              bottom: '100%',
              right: '35%',
              opacity: [0.2, 0.5, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeOut'
            }}
          >
            {config.symbol}
          </motion.span>
        </>
      )}
    </motion.div>
  );
}

// Export the ritual styles configuration for use in other components
export { ritualStyles };
