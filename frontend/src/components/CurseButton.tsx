'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CurseButtonProps {
  onClick?: () => void;
  children: ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function CurseButton({
  onClick,
  children,
  disabled = false,
  variant = 'primary',
  className = '',
  type = 'button',
}: CurseButtonProps) {
  const baseClasses =
    'relative px-8 py-4 font-display font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: `
      bg-gradient-to-br from-bloodstain-800 to-bloodstain-900
      border-2 border-bloodstain-700
      text-bone-100
      shadow-[0_4px_12px_rgba(107,21,21,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]
      hover:shadow-[0_6px_16px_rgba(139,30,30,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]
      active:shadow-[0_2px_8px_rgba(107,21,21,0.4),inset_0_2px_4px_rgba(0,0,0,0.3)]
    `,
    secondary: `
      bg-abyss-800
      border border-moonlight-700
      text-bone-300
      hover:bg-abyss-700
      hover:border-moonlight-600
    `,
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      whileHover={!disabled ? { y: -2 } : {}}
      whileTap={!disabled ? { y: 0 } : {}}
    >
      <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
        {children}
      </span>

      {/* Decorative corners */}
      {variant === 'primary' && (
        <>
          <span className="absolute -top-2 -left-2 text-bloodstain-500 text-xs opacity-60">
            ✦
          </span>
          <span className="absolute -bottom-2 -right-2 text-bloodstain-500 text-xs opacity-60">
            ✦
          </span>
        </>
      )}
    </motion.button>
  );
}
