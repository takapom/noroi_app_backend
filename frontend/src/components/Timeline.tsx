'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CurseCard from './CurseCard';
import { ToastContainer, type ToastType } from './Toast';
import { apiClient, type Post } from '@/lib/api';
import { mapCurseStyleNameToRitualStyle } from '@/lib/ritualStyleMapper';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) {
    return `${diffMins}分前`;
  }

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours}時間前`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}日前`;
}

export default function Timeline() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUserInfo();
    loadPosts();
  }, []);

  const loadUserInfo = async () => {
    try {
      const profile = await apiClient.getProfile();
      setCurrentUserId(profile.id);
    } catch (err) {
      console.error('Failed to load user info:', err);
    }
  };

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const loadPosts = async () => {
    setIsLoading(true);

    try {
      const fetchedPosts = await apiClient.getPosts(20, 0);

      // Transform backend posts to frontend format
      const transformedPosts = fetchedPosts.map((post: Post) => ({
        id: post.id,
        user_id: post.user_id,
        username: post.is_anonymous ? '@匿名の呪術師' : `@${post.username}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user_id}`,
        timestamp: formatTimestamp(post.created_at),
        content: post.content,
        likeCount: post.curse_count,
        commentCount: 0, // TODO: Implement comments later
        isLiked: post.is_cursed_by_me,
        isOwnPost: currentUserId === post.user_id,
        // 呪癖スタイル情報をマッピング
        ritualStyle: mapCurseStyleNameToRitualStyle(post.curse_style_name),
      }));

      setPosts(transformedPosts);
    } catch (err) {
      showToast('投稿の読み込みに失敗しました', 'error');
      console.error('Failed to load posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (id: string) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    // Prevent cursing own post
    if (post.isOwnPost) {
      showToast('自分の投稿に怨念をつけることはできません', 'warning');
      return;
    }

    // Optimistic update
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === id
          ? {
              ...p,
              isLiked: !p.isLiked,
              likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1,
            }
          : p
      )
    );

    try {
      if (post.isLiked) {
        await apiClient.uncursePost(id);
      } else {
        await apiClient.cursePost(id);
      }
    } catch (err: any) {
      // Revert on error
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === id
            ? {
                ...p,
                isLiked: post.isLiked,
                likeCount: post.likeCount,
              }
            : p
        )
      );

      // Show user-friendly error message
      const errorMessage = err.message || '怨念の操作に失敗しました';
      showToast(errorMessage, 'error');
      console.error('Failed to update curse:', err);
    }
  };

  return (
    <div className="min-h-screen bg-abyss-900">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

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

        {isLoading ? (
          <div className="text-center py-12">
            <p className="font-body text-bone-500">呪詛を読み込み中...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-bone-500">まだ呪詛はありません</p>
          </div>
        ) : (
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
        )}

        {/* Load More */}
        {!isLoading && posts.length > 0 && (
          <div className="text-center py-8">
            <button
              onClick={loadPosts}
              className="text-bone-400 font-mystical hover:text-bone-200 transition-colors"
            >
              ─── さらなる呪いを読み込む ───
            </button>
          </div>
        )}
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
