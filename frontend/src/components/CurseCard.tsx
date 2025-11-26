'use client';

import RitualStyleBadge, { RitualStyle } from './RitualStyleBadge';

interface CursePost {
  id: string;
  username: string;
  avatar: string;
  timestamp: string;
  content: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isOwnPost?: boolean;
  ritualStyle?: RitualStyle;
}

interface CurseCardProps {
  post: CursePost;
  onLike: (id: string) => void;
}

export default function CurseCard({ post, onLike }: CurseCardProps) {
  return (
    <div className="relative p-5 mb-4 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start mb-3 pb-3 border-b border-gray-200">
        {/* Avatar */}
        <div className="relative">
          <img
            src={post.avatar}
            alt=""
            className="w-12 h-12 rounded-full border-2 border-gray-300"
          />
          {/* Ritual style indicator */}
          {post.ritualStyle && (
            <div className="absolute -bottom-1 -right-1">
              <RitualStyleBadge
                style={post.ritualStyle}
                variant="icon"
                animate={false}
              />
            </div>
          )}
        </div>

        <div className="ml-3 flex-1">
          {/* Username */}
          <p className="font-medium text-task-text text-base">
            {post.username}
          </p>

          {/* Ritual Style Badge */}
          {post.ritualStyle && (
            <div className="my-1">
              <RitualStyleBadge
                style={post.ritualStyle}
                variant="compact"
                showLatin={true}
                animate={false}
              />
            </div>
          )}

          {/* Timestamp */}
          <p className="text-task-text-light text-sm mt-1">
            {post.timestamp}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-task-text leading-relaxed mb-4">
        {post.content}
      </p>

      {/* Actions */}
      <div className="flex gap-3 pt-3 border-t border-gray-200">
        <button
          onClick={() => !post.isOwnPost && onLike(post.id)}
          disabled={post.isOwnPost}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl
            transition-all
            ${
              post.isOwnPost
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                : post.isLiked
                ? 'bg-task-purple text-white'
                : 'bg-task-bg text-task-text hover:bg-gray-300'
            }
          `}
        >
          <svg className="w-5 h-5" fill={post.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {post.likeCount}
        </button>

        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-task-text bg-task-bg rounded-xl hover:bg-gray-300 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {post.commentCount}
        </button>
      </div>
    </div>
  );
}
