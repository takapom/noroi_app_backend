'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface CursePost {
  id: string;
  username: string;
  avatar: string;
  timestamp: string;
  content: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

interface CurseCardProps {
  post: CursePost;
  onLike: (id: string) => void;
}

export default function CurseCard({ post, onLike }: CurseCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-5 mb-4 bg-gradient-to-b from-abyss-800 to-abyss-900 border border-moonlight-800 transition-all duration-300"
      style={{
        backgroundImage: `linear-gradient(180deg, var(--abyss-800) 0%, var(--abyss-900) 100%)`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        borderColor: 'var(--bloodstain-700)',
        boxShadow: '0 4px 16px rgba(139, 30, 30, 0.2)',
      }}
    >
      {/* Header */}
      <div className="flex items-center mb-3 pb-2 border-b border-moonlight-700">
        <img
          src={post.avatar}
          alt=""
          className="w-10 h-10 border-2 border-moonlight-600 grayscale-50"
        />
        <div className="ml-3 flex-1">
          <p className="font-body font-medium text-bone-200 text-sm">
            {post.username}
          </p>
          <p className="font-body font-light text-bone-500 text-xs">
            {post.timestamp}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="font-body text-bone-300 leading-relaxed mb-4">
        {post.content}
      </p>

      {/* Actions */}
      <div className="flex gap-3 pt-3 border-t border-moonlight-800">
        <motion.button
          onClick={() => onLike(post.id)}
          className={`
            px-3 py-1.5 text-sm font-body rounded
            transition-all duration-200
            ${
              post.isLiked
                ? 'bg-gradient-to-br from-bloodstain-900 to-abyss-800 border border-bloodstain-700 text-bloodstain-500 shadow-inner'
                : 'bg-transparent border border-moonlight-600 text-bone-400 hover:border-bloodstain-700 hover:text-bone-200'
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔥 {post.likeCount}
        </motion.button>

        <button className="px-3 py-1.5 text-sm font-body text-bone-400 border border-moonlight-600 hover:border-moonlight-400 transition-all">
          💬 {post.commentCount}
        </button>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-bloodstain-800 opacity-30" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-bloodstain-800 opacity-30" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-bloodstain-800 opacity-30" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-bloodstain-800 opacity-30" />
    </motion.div>
  );
}
