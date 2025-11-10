// Server-side data fetching functions
// These functions can be used in Server Components or Server Actions

import { CursePost, RankingUser, UserProfile, UserPost } from '@/types';

// Mock data - In production, these would fetch from API
export async function getTimelinePosts(): Promise<CursePost[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  return [
    {
      id: '1',
      username: '@呪術師A',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      timestamp: '2時間前',
      content: '今日も理不尽な上司に振り回された...この怒りを炎に変えて、業火で焼き尽くしてやりたい。',
      likeCount: 12,
      commentCount: 3,
      isLiked: false,
    },
    {
      id: '2',
      username: '@闇の詠唱者',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      timestamp: '5時間前',
      content: '約束を破る人間が多すぎる。氷の呪縛で永遠に閉じ込めてやりたい気分だ。',
      likeCount: 24,
      commentCount: 7,
      isLiked: true,
    },
    {
      id: '3',
      username: '@古き契約者',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      timestamp: '8時間前',
      content: 'マナー違反の人々よ、お前たちの傲慢さに呪いあれ。',
      likeCount: 8,
      commentCount: 2,
      isLiked: false,
    },
  ];
}

export async function getRankings(): Promise<RankingUser[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  return [
    { rank: 1, username: '@呪術師A', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', curseCount: 12345, postCount: 234 },
    { rank: 2, username: '@闇の詠唱者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', curseCount: 9876, postCount: 187 },
    { rank: 3, username: '@古き契約者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', curseCount: 7654, postCount: 156 },
    { rank: 4, username: '@夜の使者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', curseCount: 5432, postCount: 123 },
    { rank: 5, username: '@影の呪術師', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5', curseCount: 4321, postCount: 98 },
  ];
}

export async function getUserProfile(): Promise<UserProfile> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  return {
    username: '@current_user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    bio: '深夜に必ず鏡を見てしまう。その度に何かが変わっている気がする。',
    age: 25,
    gender: '不明',
    curseStyle: '炎獄の儀式(Infernal Rite)',
    stats: {
      posts: 234,
      curses: 12345,
      days: 156,
    },
  };
}

export async function getUserPosts(): Promise<UserPost[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  return [
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
}
