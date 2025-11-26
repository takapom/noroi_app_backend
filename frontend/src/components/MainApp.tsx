'use client';

import { useState, useEffect } from 'react';
import Timeline from './Timeline';
import RitualWaiting from './ritual/RitualWaiting';
import RitualActive from './ritual/RitualActive';
import Ranking from './ranking/Ranking';
import Profile from './profile/Profile';
import PostModal from './PostModal';
import Settings from './settings/Settings';
import { apiClient, User, UserPost } from '@/lib/api';

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

interface MainAppProps {
  onNavigateToTasks?: () => void;
}

export default function MainApp({ onNavigateToTasks }: MainAppProps = {}) {
  const [activeTab, setActiveTab] = useState<TabType>('timeline');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isRitualActive, setIsRitualActive] = useState(false); // Toggle for testing
  const [showSettings, setShowSettings] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // User data state
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [profile, posts] = await Promise.all([
          apiClient.getProfile(),
          apiClient.getUserPosts(),
        ]);

        setUserProfile(profile);
        setUserPosts(posts);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Ritual state
  const nextRitualTime = new Date();
  nextRitualTime.setHours(nextRitualTime.getHours() + 2);

  const handlePost = async (content: string, isAnonymous: boolean) => {
    try {
      await apiClient.createPost(content, isAnonymous);
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
        if (showSettings) {
          return (
            <Settings
              onBack={() => setShowSettings(false)}
              onLogout={handleLogout}
              onDeleteAccount={handleDeleteAccount}
            />
          );
        }

        // Convert API data to UserProfile format
        if (!userProfile) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-bone-500">Loading...</div>
            </div>
          );
        }

        const profileData = {
          username: `@${userProfile.username}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.username}`,
          bio: '深夜に必ず鏡を見てしまう。その度に何かが変わっている気がする。',
          age: userProfile.age,
          gender: userProfile.gender === 'male' ? '男性' : userProfile.gender === 'female' ? '女性' : '不明',
          curseStyle: `${userProfile.curse_style.name}（${userProfile.curse_style.name_en}）`,
          stats: userProfile.stats,
        };

        const postsData = userPosts.map(post => ({
          id: post.id,
          date: new Date(post.created_at).toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }).replace(/\//g, '年').replace(/,/, '日 '),
          content: post.content,
          curseCount: post.curse_count,
        }));

        return (
          <Profile
            user={profileData}
            posts={postsData}
          />
        );
      default:
        return <Timeline />;
    }
  };

  return (
    <div className="min-h-screen bg-task-bg pb-20">
      {/* Header with Menu Button */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-task-text">就活掲示板</h1>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-task-text-light hover:text-task-text transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {renderContent()}
      </div>

      {/* Floating Action Button - Only on timeline */}
      {activeTab === 'timeline' && (
        <button
          onClick={() => setIsPostModalOpen(true)}
          className="fixed bottom-24 right-8 w-14 h-14 bg-task-purple rounded-full shadow-lg flex items-center justify-center text-white hover:bg-opacity-90 transition-all z-40"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-around">
          <NavItem
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            }
            label="掲示板"
            active={activeTab === 'timeline'}
            onClick={() => {
              setActiveTab('timeline');
              setShowSettings(false);
            }}
          />
          <NavItem
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            label="プロフィール"
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          />
        </div>
      </nav>

      {/* Post Modal */}
      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPost={handlePost}
      />

      {/* Menu Overlay */}
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
            }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Side Menu */}
        <div
          className={`fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* Menu Header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-task-text">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-task-text-light hover:text-task-text"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-task-purple rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-task-text">
                  {userProfile?.username || 'User'}
                </p>
                <p className="text-sm text-task-text-light">
                  {userProfile?.email || 'loading...'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 px-6 py-4">
            <nav className="space-y-2">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onNavigateToTasks) {
                    onNavigateToTasks();
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-task-bg transition-colors text-left"
              >
                <svg className="w-5 h-5 text-task-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-task-text font-medium">タスク管理</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-task-bg transition-colors text-left">
                <svg className="w-5 h-5 text-task-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-task-text font-medium">履歴書作成</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-task-bg transition-colors text-left">
                <svg className="w-5 h-5 text-task-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-task-text font-medium">直前モード</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-task-bg transition-colors text-left">
                <svg className="w-5 h-5 text-task-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-task-text font-medium">自己分析</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-task-bg transition-colors text-left">
                <svg className="w-5 h-5 text-task-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-task-text font-medium">Settings</span>
              </button>
            </nav>
          </div>

          {/* Logout Button */}
          <div className="px-6 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-task-purple text-white rounded-xl hover:bg-opacity-90 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, active = false, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-task-purple' : 'text-task-text-light hover:text-task-text'
        }`}
    >
      <span className={active ? 'text-task-purple' : ''}>
        {icon}
      </span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
