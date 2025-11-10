// Server Component - Ranking list display without client-side state
interface RankingUser {
  rank: number;
  username: string;
  avatar: string;
  curseCount: number;
  postCount: number;
}

interface RankingListProps {
  rankings: RankingUser[];
}

export default function RankingList({ rankings }: RankingListProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Top 1 - Special Card */}
      {rankings[0] && (
        <div className="mb-6 bg-gradient-to-br from-cursedflame-900 via-abyss-700 to-cursedflame-900 border-4 border-bone-500 rounded-lg p-6 relative shadow-[0_0_30px_rgba(143,125,95,0.5)]">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="w-full h-full" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(143,125,95,0.1) 35px, rgba(143,125,95,0.1) 70px)'
            }} />
          </div>

          <div className="relative z-10">
            {/* Crown and Rank */}
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">👑</div>
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
        </div>
      )}

      {/* Top 2 */}
      {rankings[1] && (
        <div className="mb-4 bg-moonlight-800 border-2 border-moonlight-400 rounded-lg p-4 shadow-[0_0_15px_rgba(154,154,154,0.3)]">
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
        </div>
      )}

      {/* Top 3 */}
      {rankings[2] && (
        <div className="mb-4 bg-abyss-700 border-2 border-bone-500 rounded-lg p-4 shadow-[0_0_10px_rgba(143,125,95,0.2)]">
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
        </div>
      )}

      {/* Ranks 4+ */}
      <div className="space-y-2">
        {rankings.slice(3).map((user) => (
          <div
            key={user.rank}
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
          </div>
        ))}
      </div>
    </div>
  );
}
