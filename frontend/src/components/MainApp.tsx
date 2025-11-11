'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Timeline from './Timeline';
import RitualWaiting from './ritual/RitualWaiting';
import RitualActive from './ritual/RitualActive';
import Ranking from './ranking/Ranking';
import Profile from './profile/Profile';
import PostModal from './PostModal';
import Settings from './settings/Settings';
import { apiClient } from '@/lib/api';

type TabType = 'timeline' | 'ritual' | 'ranking' | 'profile';

// Mock data
const MOCK_RANKINGS = [
  { rank: 1, username: '@呪術師A', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', curseCount: 12345, postCount: 234 },
  { rank: 2, username: '@闇の詠唱者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', curseCount: 9876, postCount: 187 },
  { rank: 3, username: '@古き契約者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', curseCount: 7654, postCount: 156 },
  { rank: 4, username: '@夜の使者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', curseCount: 5432, postCount: 123 },
  { rank: 5, username: '@影の呪術師', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5', curseCount: 4321, postCount: 98 },
];

const MOCK_USER_PROFILE = {
  username: '@current_user',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
  bio: '深夜に必ず鏡を見てしまう。その度に何かが変わっている気がする。',
  age: 25,
  gender: '不明',
  curseStyle: '炎獄の儀式（Infernal Rite）',
  stats: {
    posts: 234,
    curses: 12345,
    days: 156,
  },
};

const MOCK_USER_POSTS = [
  {
    id: '1',
    date: '2025年11月10日 23:45',
    content: '深夜2時、また鏡を見てしまった。今日は右目の位置が少しずれている。誰も気づかないだろうけど、私には分かる。',
    curseCount: 234,
  },
  {
    id: '2',
    date: '2025年11月9日 22:12',
    content: '階段を降りる時、必ず13段数えてしまう。実際は12段しかないのに。',
    curseCount: 187,
  },
  {
    id: '3',
    date: '2025年11月8日 23:59',
    content: '夜中に目が覚めると、いつも3:33。時計が壊れているのかもしれない。でも、スマホも同じ時間を示している。',
    curseCount: 312,
  },
];

export default function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>('timeline');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isRitualActive, setIsRitualActive] = useState(false); // Toggle for testing
  const [showSettings, setShowSettings] = useState(false);

  // Ritual state
  const nextRitualTime = new Date();
  nextRitualTime.setHours(nextRitualTime.getHours() + 2);

  const handlePost = async (content: string) => {
    try {
      await apiClient.createPost(content, true);
      setIsPostModalOpen(false);
      // Reload timeline by triggering re-render
      window.location.reload();
    } catch (error) {
      console.error('Post creation error:', error);
      alert('投稿に失敗しました');
    }
  };

  const handleLogout = () => {
    apiClient.logout();
    window.location.reload(); // Reload to go back to login screen
  };

  const handleDeleteAccount = async () => {
    // TODO: Implement API call when backend endpoint is ready
    apiClient.logout();
    alert('アカウントは完全に削除されました...');
    window.location.reload();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'timeline':
        return <Timeline />;
      case 'ritual':
        return isRitualActive ? (
          <RitualActive
            currentHP={245680}
            maxHP={500000}
            participants={1234}
            timeRemaining="45:23"
            recentAttacks={[
              { username: '@user1', damage: 1234 },
              { username: '@user2', damage: 856, likeBonus: 3 },
              { username: '@user3', damage: 2100, isCritical: true },
            ]}
            onAttack={() => console.log('Attack!')}
            onLike={() => console.log('Like!')}
          />
        ) : (
          <RitualWaiting
            nextRitualTime={nextRitualTime}
            lastResult={{
              participants: 847,
              success: true,
              timeRemaining: '3分42秒',
            }}
          />
        );
      case 'ranking':
        return <Ranking rankings={MOCK_RANKINGS} />;
      case 'profile':
        return showSettings ? (
          <Settings
            onBack={() => setShowSettings(false)}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />
        ) : (
          <Profile
            user={MOCK_USER_PROFILE}
            posts={MOCK_USER_POSTS}
            onSettings={() => setShowSettings(true)}
          />
        );
      default:
        return <Timeline />;
    }
  };

  return (
    <div className="min-h-screen bg-abyss-900 pb-20">
      {/* Content */}
      <div className="relative">
        {renderContent()}
      </div>

      {/* Floating Action Button - Only on timeline */}
      {activeTab === 'timeline' && (
        <motion.button
          onClick={() => setIsPostModalOpen(true)}
          className="fixed bottom-24 right-8 w-14 h-14 bg-gradient-to-br from-bloodstain-800 to-bloodstain-900 rounded-full shadow-[0_4px_12px_rgba(107,21,21,0.6)] flex items-center justify-center text-2xl z-40"
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
        >
          📌
        </motion.button>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-abyss-950 to-abyss-900 border-t-2 border-moonlight-800 shadow-[0_-4px_12px_rgba(0,0,0,0.6)] z-50">
        <div className="relative">
          {/* Decorative line */}
          <div className="absolute top-0 left-20% right-20% h-px bg-gradient-to-r from-transparent via-bloodstain-700 to-transparent" />

          <div className="max-w-4xl mx-auto px-4 py-3 flex justify-around">
            <NavItem
              icon="📜"
              label="呪詛"
              active={activeTab === 'timeline'}
              onClick={() => {
                setActiveTab('timeline');
                setShowSettings(false);
              }}
            />
            <NavItem
              icon="🔥"
              label="儀式"
              active={activeTab === 'ritual'}
              onClick={() => {
                setActiveTab('ritual');
                setShowSettings(false);
              }}
            />
            <NavItem
              icon="👑"
              label="番付"
              active={activeTab === 'ranking'}
              onClick={() => {
                setActiveTab('ranking');
                setShowSettings(false);
              }}
            />
            <NavItem
              icon="👤"
              label="自分"
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            />
          </div>
        </div>
      </nav>

      {/* Post Modal */}
      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPost={handlePost}
      />
    </div>
  );
}

interface NavItemProps {
  icon: string;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, active = false, onClick }: NavItemProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${
        active ? 'text-bone-100' : 'text-bone-500 hover:text-bone-300'
      }`}
      whileTap={{ scale: 0.9 }}
    >
      <span
        className={`text-2xl ${
          active ? 'drop-shadow-[0_0_8px_rgba(139,30,30,1)]' : ''
        }`}
      >
        {icon}
      </span>
      <span className="font-body text-xs">{label}</span>
    </motion.button>
  );
}
