'use client';

import ProfileContent from './ProfileContent';

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

interface ProfileClientProps {
  user: UserProfile;
  posts: UserPost[];
}

export default function ProfileClient({ user, posts }: ProfileClientProps) {
  return (
    <div className="min-h-screen bg-task-bg">
      <div className="container mx-auto px-4 py-6">
        {/* Profile Content */}
        <div>
          <ProfileContent user={user} posts={posts} />
        </div>
      </div>
    </div>
  );
}
