import ProfileClient from './ProfileClient';

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

interface ProfileProps {
  user: UserProfile;
  posts: UserPost[];
}

export default function Profile({ user, posts }: ProfileProps) {
  return <ProfileClient user={user} posts={posts} />;
}
