'use client';

import { useState, useEffect } from 'react';
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
    <div className="min-h-screen bg-task-bg">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Timeline Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-task-purple mx-auto mb-4"></div>
            <p className="text-task-text-light">投稿を読み込み中...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-task-text-light">まだ投稿はありません</p>
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <div key={post.id}>
                <CurseCard post={post} onLike={handleLike} />
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {!isLoading && posts.length > 0 && (
          <div className="text-center py-8">
            <button
              onClick={loadPosts}
              className="text-task-purple font-medium hover:text-task-purple-light transition-colors"
            >
              さらに読み込む
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
