'use client';

import { motion } from 'framer-motion';
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
  onSettings: () => void;
}

export default function ProfileClient({ user, posts, onSettings }: ProfileClientProps) {
  return (
    <div className="min-h-screen bg-abyss-950 relative overflow-hidden">
      {/* Stone texture background */}
      <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(154,154,154,0.1)_10px,rgba(154,154,154,0.1)_20px)]" />

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header - Settings Button */}
        <div className="flex justify-end mb-6">
          <motion.button
            onClick={onSettings}
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
            className="w-10 h-10 rounded-full bg-abyss-700 border border-bone-500 flex items-center justify-center hover:bg-bone-500 hover:text-abyss-950 transition-colors"
          >
            <svg className="w-5 h-5 text-bone-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
            </svg>
          </motion.button>
        </div>

        {/* Profile Content - Server Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProfileContent user={user} posts={posts} />
        </motion.div>
      </div>
    </div>
  );
}
