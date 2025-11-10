'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface RankingUser {
  rank: number;
  username: string;
  avatar: string;
  curseCount: number;
  postCount: number;
}

interface RankingProps {
  rankings: RankingUser[];
}

type TabType = 'week' | 'month' | 'all';

export default function Ranking({ rankings: initialRankings }: RankingProps) {
  const [selectedTab, setSelectedTab] = useState<TabType>('week');
  const [rankings] = useState(initialRankings);

  return (
    <div className="min-h-screen bg-abyss-950 relative overflow-hidden">
      {/* Parchment texture overlay */}
      <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(212,196,168,0.1)_2px,rgba(212,196,168,0.1)_4px)]" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Scroll top decoration */}
        <div className="w-full h-16 mb-6 opacity-30">
          <svg viewBox="0 0 800 100" className="w-full h-full">
            <path d="M0,50 Q200,20 400,50 T800,50" stroke="#8f7d5f" strokeWidth="2" fill="none"/>
            <path d="M0,55 Q200,25 400,55 T800,55" stroke="#8f7d5f" strokeWidth="1" fill="none"/>
          </svg>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-5xl text-bone-100 mb-2 drop-shadow-[0_0_10px_rgba(74,14,14,0.5)]">
            呪術師番付
          </h1>
          <p className="font-mystical text-xl text-bone-500 tracking-widest">
            Sorcerer Rankings
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-8 mb-8 border-b-2 border-bone-500/30">
          {[
            { key: 'week' as TabType, label: '今週' },
            { key: 'month' as TabType, label: '今月' },
            { key: 'all' as TabType, label: '全期間' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`font-body pb-3 transition-colors ${
                selectedTab === tab.key
                  ? 'text-bloodstain-500 border-b-4 border-bloodstain-500'
                  : 'text-moonlight-400 hover:text-bloodstain-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Rankings List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            {/* Top 1 - Special Card */}
            {rankings[0] && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="mb-6 bg-gradient-to-br from-cursedflame-900 via-abyss-700 to-cursedflame-900 border-4 border-bone-500 rounded-lg p-6 relative shadow-[0_0_30px_rgba(143,125,95,0.5)]"
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(143,125,95,0.1) 35px, rgba(143,125,95,0.1) 70px)'
                  }} />
                </div>

                <div className="relative z-10">
                  {/* Crown and Rank */}
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                        textShadow: [
                          '0 0 15px rgba(143,125,95,0.8)',
                          '0 0 25px rgba(143,125,95,1)',
                          '0 0 15px rgba(143,125,95,0.8)',
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-5xl"
                    >
                      👑
                    </motion.div>
                    <div className="font-display text-4xl text-bone-100 drop-shadow-[0_0_10px_rgba(143,125,95,0.6)]">
                      1位
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-bone-500 shadow-[0_0_20px_rgba(143,125,95,0.6)]">
                        <img src={rankings[0].avatar} alt="avatar" className="w-full h-full object-cover"/>
                      </div>
                      <div className="absolute inset-0 -z-10 bg-bone-500 blur-xl opacity-50 rounded-full scale-125" />
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="font-body text-2xl text-bone-100 mb-3">
                        {rankings[0].username}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-abyss-950/50 rounded-lg p-3 border border-bone-500/30">
                          <div className="text-bone-500 mb-1">怨念</div>
                          <div className="font-display text-2xl text-cursedflame-500 tabular-nums">
                            {rankings[0].curseCount.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-abyss-950/50 rounded-lg p-3 border border-bone-500/30">
                          <div className="text-bone-500 mb-1">投稿数</div>
                          <div className="font-display text-2xl text-moonlight-400 tabular-nums">
                            {rankings[0].postCount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="mt-4 text-center">
                    <div className="inline-block bg-bone-500 text-abyss-950 px-6 py-2 rounded-full font-body text-sm font-bold shadow-[0_0_15px_rgba(143,125,95,0.6)]">
                      今週のベスト呪いスト
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Top 2 */}
            {rankings[1] && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-4 bg-moonlight-800 border-2 border-moonlight-400 rounded-lg p-4 shadow-[0_0_15px_rgba(154,154,154,0.3)]"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">🥈</div>
                  <div className="font-display text-2xl text-moonlight-400">2位</div>
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-moonlight-400">
                    <img src={rankings[1].avatar} alt="avatar" className="w-full h-full object-cover"/>
                  </div>
                  <div className="flex-1">
                    <div className="font-body text-lg text-bone-100 mb-1">{rankings[1].username}</div>
                    <div className="flex gap-4 text-sm font-body">
                      <span className="text-bone-500">
                        怨念: <span className="text-cursedflame-500 font-display">{rankings[1].curseCount.toLocaleString()}</span>
                      </span>
                      <span className="text-bone-500">
                        投稿: <span className="text-moonlight-400 font-display">{rankings[1].postCount}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Top 3 */}
            {rankings[2] && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 bg-abyss-700 border-2 border-bone-500 rounded-lg p-4 shadow-[0_0_10px_rgba(143,125,95,0.2)]"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">🥉</div>
                  <div className="font-display text-2xl text-bone-500">3位</div>
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-bone-500">
                    <img src={rankings[2].avatar} alt="avatar" className="w-full h-full object-cover"/>
                  </div>
                  <div className="flex-1">
                    <div className="font-body text-lg text-bone-100 mb-1">{rankings[2].username}</div>
                    <div className="flex gap-4 text-sm font-body">
                      <span className="text-bone-500">
                        怨念: <span className="text-cursedflame-500 font-display">{rankings[2].curseCount.toLocaleString()}</span>
                      </span>
                      <span className="text-bone-500">
                        投稿: <span className="text-moonlight-400 font-display">{rankings[2].postCount}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Ranks 4+ */}
            <div className="space-y-2">
              {rankings.slice(3).map((user, index) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(143,125,95,0.4)' }}
                  className="bg-abyss-700/50 border border-moonlight-600/30 rounded-lg p-3 hover:bg-abyss-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="font-display text-lg text-moonlight-400 w-12">{user.rank}位</div>
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-moonlight-400/50">
                      <img src={user.avatar} alt="avatar" className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div className="font-body text-bone-500">{user.username}</div>
                      <div className="font-display text-cursedflame-500 tabular-nums">
                        {user.curseCount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Scroll bottom decoration */}
        <div className="w-full h-16 mt-12 opacity-30">
          <svg viewBox="0 0 800 100" className="w-full h-full">
            <path d="M0,50 Q200,80 400,50 T800,50" stroke="#8f7d5f" strokeWidth="2" fill="none"/>
            <path d="M0,45 Q200,75 400,45 T800,45" stroke="#8f7d5f" strokeWidth="1" fill="none"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
