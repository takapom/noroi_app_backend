'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CurseButton from './CurseButton';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (content: string) => void;
}

export default function PostModal({ isOpen, onClose, onPost }: PostModalProps) {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const maxLength = 300;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onPost(content);
      setContent('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-80 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-2xl mx-auto bg-abyss-800 border-2 border-moonlight-700 z-50 p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-moonlight-700">
              <h2 className="font-display text-2xl font-bold text-bone-100">
                ← 呪イヲ刻ム
              </h2>
              <button
                onClick={onClose}
                className="text-bone-400 hover:text-bone-100 transition-colors text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Text Area */}
              <div className="mb-4">
                <div className="relative">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="ここに呪いを記す..."
                    maxLength={maxLength}
                    className="w-full min-h-[200px] bg-abyss-900 border-2 border-moonlight-700 text-bone-200 font-body text-base leading-relaxed p-4 resize-vertical focus:outline-none focus:border-bloodstain-700 transition-colors"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 1.75rem,
                        rgba(212, 196, 168, 0.05) 1.75rem,
                        rgba(212, 196, 168, 0.05) 1.8rem
                      )`,
                    }}
                  />
                  {/* Double Border Decoration */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-2 left-2 right-2 bottom-2 border border-moonlight-800 opacity-30" />
                  </div>
                </div>

                {/* Character Counter */}
                <p className="text-right text-bone-500 text-sm font-body mt-2">
                  残リ{maxLength - content.length}文字
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {/* Anonymous Toggle */}
                <label className="flex items-center justify-between p-3 border border-moonlight-700 hover:border-moonlight-600 transition-colors cursor-pointer">
                  <span className="font-body text-bone-300 text-sm">匿名性</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-12 h-6 rounded-full transition-colors ${
                        isAnonymous ? 'bg-bloodstain-700' : 'bg-moonlight-700'
                      }`}
                    >
                      <motion.div
                        className="w-5 h-5 bg-bone-100 rounded-full m-0.5"
                        animate={{ x: isAnonymous ? 24 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </div>
                  </div>
                </label>

                {/* Public Range */}
                <div className="p-3 border border-moonlight-700">
                  <label className="font-body text-bone-300 text-sm block mb-2">
                    公開範囲
                  </label>
                  <select className="w-full bg-abyss-900 border border-moonlight-700 text-bone-200 font-body px-3 py-2 focus:outline-none focus:border-bloodstain-700">
                    <option value="all">全体</option>
                    <option value="followers">追従者のみ</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <CurseButton type="submit" disabled={!content.trim()} className="w-full">
                ━━━ 呪ウ ━━━
              </CurseButton>
            </form>

            {/* Decorative Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-bloodstain-700" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-bloodstain-700" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-bloodstain-700" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-bloodstain-700" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
