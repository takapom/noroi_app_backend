'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface UserProfile {
  username: string;
  avatar: string;
  bio: string;
  age: number;
  gender: string;
  curseStyle: string;
  stats: {
    posts: number;
    curses: number;
    days: number;
  };
}

interface UserPost {
  id: string;
  date: string;
  content: string;
  curseCount: number;
}

interface ProfileProps {
  user: UserProfile;
  posts: UserPost[];
  onSettings: () => void;
}

export default function Profile({ user, posts, onSettings }: ProfileProps) {
  return (
    <div className="min-h-screen bg-abyss-950 relative overflow-hidden">
      {/* Stone texture background */}
      <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(154,154,154,0.1)_10px,rgba(154,154,154,0.1)_20px)]" />

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header - Settings Button */}
        <div className="flex justify-end mb-6">
          <motion.button
            onClick={onSettings}
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
            className="w-10 h-10 rounded-full bg-abyss-700 border border-bone-500 flex items-center justify-center hover:bg-bone-500 hover:text-abyss-950 transition-colors"
          >
            <svg className="w-5 h-5 text-bone-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
            </svg>
          </motion.button>
        </div>

        {/* Profile Header */}
        <div className="max-w-2xl mx-auto mb-8">
          {/* Avatar */}
          <div className="relative w-40 h-40 mx-auto mb-6">
            {/* Stone frame decoration */}
            <div className="absolute inset-0 -m-3">
              <motion.div
                animate={{
                  boxShadow: [
                    'inset 0 0 20px rgba(0,0,0,0.5), 0 0 20px rgba(143,125,95,0.3)',
                    'inset 0 0 20px rgba(0,0,0,0.5), 0 0 30px rgba(143,125,95,0.5)',
                    'inset 0 0 20px rgba(0,0,0,0.5), 0 0 20px rgba(143,125,95,0.3)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full rounded-full border-4 border-bone-500"
                style={{
                  background: 'linear-gradient(135deg, #8f7d5f 0%, #5a4a3a 50%, #8f7d5f 100%)',
                }}
              />
              {/* Weathering effect */}
              <div className="absolute inset-0 rounded-full opacity-30">
                <svg className="w-full h-full">
                  <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#3a3a3a" strokeWidth="2" strokeDasharray="5,5"/>
                </svg>
              </div>
            </div>

            {/* Avatar image */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative w-full h-full rounded-full overflow-hidden border-2 border-abyss-950 shadow-2xl"
            >
              <img src={user.avatar} alt="avatar" className="w-full h-full object-cover grayscale-[30%]"/>
            </motion.div>

            {/* Corner decoration */}
            <div className="absolute -top-2 -right-2 text-2xl opacity-60">⚰️</div>
          </div>

          {/* Username and Bio */}
          <div className="text-center mb-6">
            <h2 className="font-display text-3xl text-bone-100 mb-3">
              {user.username}
            </h2>
            <p className="font-mystical text-lg text-cursedflame-500 italic max-w-md mx-auto leading-relaxed">
              "{user.bio}"
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: '投稿数', value: user.stats.posts, color: 'moonlight-400' },
              { label: '怨念数', value: user.stats.curses, color: 'bloodstain-500' },
              { label: '日数', value: user.stats.days, color: 'moonlight-400' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-abyss-700 border-2 ${
                  stat.color === 'bloodstain-500'
                    ? 'border-bloodstain-500/30 hover:border-bloodstain-500 shadow-[0_0_15px_rgba(199,64,64,0.2)]'
                    : 'border-moonlight-600/30 hover:border-moonlight-600'
                } rounded-lg p-4 text-center transition-colors`}
              >
                <div className={`font-display text-3xl text-${stat.color} mb-2 tabular-nums`}>
                  {stat.value.toLocaleString()}
                </div>
                <div className="font-body text-sm text-bone-500">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Personal Info Section */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="border-t-2 border-dashed border-moonlight-600/30 pt-6 mb-6"
          >
            <h3 className="font-body text-bone-500 text-lg mb-4 flex items-center gap-2">
              <span className="font-accent text-2xl">個</span>
              個人情報
            </h3>
            <div className="bg-abyss-700/50 rounded-lg p-4 space-y-3 font-body">
              <div className="flex justify-between text-sm">
                <span className="text-bone-500">年齢:</span>
                <span className="text-moonlight-400">{user.age}歳</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-bone-500">性別:</span>
                <span className="text-moonlight-400">{user.gender}</span>
              </div>
              <div className="pt-2 border-t border-moonlight-600/20">
                <div className="text-bone-500 text-sm mb-2">呪癖:</div>
                <div className="text-moonlight-400 text-sm leading-relaxed">
                  {user.curseStyle}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Post History Section */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="border-t-2 border-dashed border-moonlight-600/30 pt-6"
          >
            <h3 className="font-body text-bone-500 text-lg mb-4 flex items-center gap-2">
              <span className="font-accent text-2xl">記</span>
              投稿履歴
            </h3>

            <div className="space-y-4">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{
                    borderColor: 'rgba(154,154,154,1)',
                    boxShadow: '0 0 15px rgba(154,154,154,0.3)',
                  }}
                  className="bg-abyss-700 border border-moonlight-600/30 rounded-lg p-4 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-xs text-bone-500 font-body">
                      {post.date}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-bloodstain-500 font-display">{post.curseCount}</span>
                      <span className="text-bone-500 font-body">怨念</span>
                    </div>
                  </div>
                  <p className="font-body text-moonlight-400 text-sm leading-relaxed">
                    {post.content}
                  </p>
                </motion.div>
              ))}

              {/* Load More Button */}
              <button className="w-full border border-bone-500 text-bone-500 py-3 rounded-lg font-body text-sm hover:bg-bone-500 hover:text-abyss-950 transition-colors">
                過去の投稿をもっと見る
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
