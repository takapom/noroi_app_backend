// Common type definitions for the application

export interface CursePost {
  id: string;
  username: string;
  avatar: string;
  timestamp: string;
  content: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

export interface RankingUser {
  rank: number;
  username: string;
  avatar: string;
  curseCount: number;
  postCount: number;
}

export interface UserProfile {
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

export interface UserPost {
  id: string;
  date: string;
  content: string;
  curseCount: number;
}

export interface RitualResult {
  participants: number;
  success: boolean;
  timeRemaining: string;
}

export interface RecentAttack {
  username: string;
  damage: number;
  isCritical?: boolean;
  likeBonus?: number;
}
