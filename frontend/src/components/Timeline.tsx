'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import CurseCard from './CurseCard';

// Mock data for development
const MOCK_POSTS = [
  {
    id: '1',
    username: '@呪術師A',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    timestamp: '2時間前',
    content: '今日も理不尽な上司に振り回された...この怒りを炎に変えて、業火で焼き尽くしてやりたい。',
    likeCount: 12,
    commentCount: 3,
    isLiked: false,
  },
  {
    id: '2',
    username: '@闇の詠唱者',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    timestamp: '5時間前',
    content: '約束を破る人間が多すぎる。氷の呪縛で永遠に閉じ込めてやりたい気分だ。',
    likeCount: 24,
    commentCount: 7,
    isLiked: true,
  },
  {
    id: '3',
    username: '@古き契約者',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    timestamp: '8時間前',
    content: 'マナー違反の人々よ、お前たちの傲慢さに呪いあれ。',
    likeCount: 8,
    commentCount: 2,
    isLiked: false,
  },
];

export default function Timeline() {
  const [posts, setPosts] = useState(MOCK_POSTS);

  const handleLike = (id: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? {
              ...post,
              isLiked: !post.isLiked,
              likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
            }
          : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-abyss-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-abyss-900 border-b-2 border-moonlight-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-bone-100">呪癖</h1>
          <div className="flex gap-4">
            <button className="text-bone-300 hover:text-bone-100 transition-colors">
              🔔
            </button>
            <button className="text-bone-300 hover:text-bone-100 transition-colors">
              ⚙
            </button>
          </div>
        </div>
      </header>

      {/* Timeline Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CurseCard post={post} onLike={handleLike} />
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <div className="text-center py-8">
          <button className="text-bone-400 font-mystical hover:text-bone-200 transition-colors">
            ─── さらなる呪いを読み込む ───
          </button>
        </div>
      </main>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => {
          // Trigger post modal from parent
          const event = new CustomEvent('openPostModal');
          window.dispatchEvent(event);
        }}
        className="fixed bottom-24 right-8 w-14 h-14 bg-gradient-to-br from-bloodstain-800 to-bloodstain-900 rounded-full shadow-[0_4px_12px_rgba(107,21,21,0.6)] flex items-center justify-center text-2xl"
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
      >
        📌
      </motion.button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-abyss-950 to-abyss-900 border-t-2 border-moonlight-800 shadow-[0_-4px_12px_rgba(0,0,0,0.6)]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-around">
          <NavItem icon="📜" label="呪詛" active />
          <NavItem icon="🔥" label="儀式" />
          <NavItem icon="👑" label="番付" />
          <NavItem icon="👤" label="自分" />
        </div>
      </nav>
    </div>
  );
}

interface NavItemProps {
  icon: string;
  label: string;
  active?: boolean;
}

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <motion.button
      className={`flex flex-col items-center gap-1 transition-colors ${
        active ? 'text-bone-100' : 'text-bone-500 hover:text-bone-300'
      }`}
      whileTap={{ scale: 0.9 }}
    >
      <span className={`text-2xl ${active ? 'drop-shadow-[0_0_8px_rgba(139,30,30,1)]' : ''}`}>
        {icon}
      </span>
      <span className="font-body text-xs">{label}</span>
    </motion.button>
  );
}
