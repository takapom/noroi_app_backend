// Server Component - Pure display component (No client-side interactivity)

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

interface ProfileContentProps {
  user: UserProfile;
  posts: UserPost[];
}

export default function ProfileContent({ user, posts }: ProfileContentProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        {/* Avatar */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-full h-full rounded-full border-4 border-task-purple shadow-lg object-cover"
          />
        </div>

        {/* Username */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-task-text mb-2">
            {user.username}
          </h2>
          <p className="text-task-text-light text-sm max-w-md mx-auto leading-relaxed">
            {user.bio}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: '投稿数', value: user.stats.posts },
          { label: 'いいね数', value: user.stats.curses },
          { label: '継続日数', value: user.stats.days },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-3xl font-bold text-task-purple mb-2 tabular-nums">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-sm text-task-text-light">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Personal Info Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-task-text mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-task-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          個人情報
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-task-text-light">年齢</span>
            <span className="text-task-text font-medium">{user.age}歳</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-task-text-light">性別</span>
            <span className="text-task-text font-medium">{user.gender}</span>
          </div>
          <div className="pt-3">
            <div className="text-task-text-light text-sm mb-2">スタイル</div>
            <div className="text-task-text text-sm leading-relaxed bg-task-bg p-3 rounded-xl">
              {user.curseStyle}
            </div>
          </div>
        </div>
      </div>

      {/* Post History Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-task-text mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-task-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          投稿履歴
        </h3>

        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-task-bg rounded-xl p-4 border border-gray-200 hover:border-task-purple transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-xs text-task-text-light">
                  {post.date}
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-task-purple" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-xs text-task-text font-medium">{post.curseCount}</span>
                </div>
              </div>
              <p className="text-task-text text-sm leading-relaxed">
                {post.content}
              </p>
            </div>
          ))}

          {/* Load More Button */}
          <button className="w-full border border-task-purple text-task-purple py-3 rounded-xl text-sm font-medium hover:bg-task-purple hover:text-white transition-colors">
            過去の投稿をもっと見る
          </button>
        </div>
      </div>
    </div>
  );
}
