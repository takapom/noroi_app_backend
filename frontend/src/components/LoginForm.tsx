'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import CurseButton from './CurseButton';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onLogin, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto p-8"
    >
      {/* Header with Gothic Arch */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <svg width="60" height="80" viewBox="0 0 60 80" className="text-moonlight-700">
            <path
              d="M 5,80 L 5,40 Q 5,15 30,5 Q 55,15 55,40 L 55,80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <h1 className="font-display text-4xl font-bold text-bone-100 mx-4">
            呪癖
          </h1>
          <svg width="60" height="80" viewBox="0 0 60 80" className="text-moonlight-700">
            <path
              d="M 5,80 L 5,40 Q 5,15 30,5 Q 55,15 55,40 L 55,80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Seal Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-bloodstain-900 to-bloodstain-800 border-2 border-bloodstain-700 flex items-center justify-center">
          <span className="text-4xl">🔒</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label className="block font-display font-normal text-sm text-bone-400 mb-2">
            <span className="text-bloodstain-700">⟨</span>
            メールアドレス
            <span className="text-bloodstain-700">⟩</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-abyss-800 border border-moonlight-700 border-b-2 border-b-moonlight-600 text-bone-200 font-body px-4 py-3 focus:outline-none focus:border-b-bloodstain-700 transition-colors"
            placeholder="your@email.com"
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <label className="block font-display font-normal text-sm text-bone-400 mb-2">
            <span className="text-bloodstain-700">⟨</span>
            合言葉
            <span className="text-bloodstain-700">⟩</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-abyss-800 border border-moonlight-700 border-b-2 border-b-moonlight-600 text-bone-200 font-body px-4 py-3 focus:outline-none focus:border-b-bloodstain-700 transition-colors"
            placeholder="••••••••"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <CurseButton type="submit" className="w-full">
            呪縛ニ入ル
          </CurseButton>
        </div>

        {/* Switch to Register */}
        <div className="text-center">
          <p className="text-bone-500 text-sm font-body mb-2">または</p>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-bone-400 font-mystical hover:text-bloodstain-600 transition-colors underline decoration-dotted"
          >
            ─── 契約ヲ結ブ ───
          </button>
        </div>
      </form>
    </motion.div>
  );
}
