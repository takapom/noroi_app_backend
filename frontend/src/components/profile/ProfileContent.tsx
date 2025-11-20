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
      {/* Avatar */}
      <div className="relative w-40 h-40 mx-auto mb-6">
        {/* Stone frame decoration */}
        <div className="absolute inset-0 -m-3">
          <div
            className="w-full h-full rounded-full border-4 border-bone-500"
            style={{
              background: 'linear-gradient(135deg, #8f7d5f 0%, #5a4a3a 50%, #8f7d5f 100%)',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 0 20px rgba(143,125,95,0.3)',
            }}
          />
          {/* Weathering effect */}
          <div className="absolute inset-0 rounded-full opacity-30">
            <svg className="w-full h-full">
              <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#3a3a3a" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
          </div>
        </div>

        {/* Avatar image */}
        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-abyss-950 shadow-2xl">
          <img src={user.avatar} alt="avatar" className="w-full h-full object-cover grayscale-[30%]" />
        </div>

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
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-abyss-700 border-2 ${stat.color === 'bloodstain-500'
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
          </div>
        ))}
      </div>

      {/* Personal Info Section */}
      <div className="border-t-2 border-dashed border-moonlight-600/30 pt-6 mb-6">
        <h3 className="font-body text-bone-500 text-lg mb-4 flex items-center gap-2">
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
      </div>

      {/* Post History Section */}
      <div className="border-t-2 border-dashed border-moonlight-600/30 pt-6">
        <h3 className="font-body text-bone-500 text-lg mb-4 flex items-center gap-2">
          投稿履歴
        </h3>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-abyss-700 border border-moonlight-600/30 rounded-lg p-4 transition-colors hover:border-moonlight-600"
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
            </div>
          ))}

          {/* Load More Button - This could be a client component for interactivity */}
          <button className="w-full border border-bone-500 text-bone-500 py-3 rounded-lg font-body text-sm hover:bg-bone-500 hover:text-abyss-950 transition-colors">
            過去の投稿をもっと見る
          </button>
        </div>
      </div>
    </div>
  );
}
