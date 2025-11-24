'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface SettingsProps {
  onBack: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export default function Settings({ onBack, onLogout, onDeleteAccount }: SettingsProps) {
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await apiClient.getProfile();
        setUserEmail(profile.email);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setUserEmail('Error loading email');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="min-h-screen bg-abyss-950 relative overflow-hidden">
      {/* Stone texture background */}
      <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(154,154,154,0.1)_10px,rgba(154,154,154,0.1)_20px)]" />

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <div className="flex items-center mb-8">
          <motion.button
            onClick={onBack}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            className="mr-4 text-bone-500 hover:text-bone-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <div>
            <h1 className="font-display text-3xl text-bone-100">設定</h1>
            <p className="font-mystical text-sm text-bone-500">Settings</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Account Section */}
          <Section title="アカウント" icon="🔐">
            <SettingItem
              label="メールアドレス"
              value={loading ? 'Loading...' : userEmail}
              onClick={() => console.log('Edit email')}
              actionLabel="変更"
            />
          </Section>

          {/* Privacy Section */}
          <Section title="プライバシー" icon="🔒">
            <ToggleItem
              label="プロフィール公開"
              description="他のユーザーがプロフィールを閲覧可能"
              enabled={privacySettings.publicProfile}
              onToggle={() => setPrivacySettings((prev) => ({ ...prev, publicProfile: !prev.publicProfile }))}
            />
            <SettingItem
              label="ブロックリスト"
              description="ブロックしたユーザーの管理"
              onClick={() => console.log('Block list')}
              actionLabel="管理"
            />
          </Section>

          {/* Danger Zone */}
          <DangerSection>
            <DangerItem
              label="ログアウト"
              description="このデバイスからログアウト"
              onClick={() => setShowLogoutConfirm(true)}
              level="medium"
            />
            <DangerItem
              label="アカウント削除(未実装)"
              description="全てのデータが完全に削除されます"
              onClick={() => setShowDeleteConfirm(true)}
              level="extreme"
            />
          </DangerSection>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <ConfirmDialog
          title="ログアウト確認"
          message="本当にログアウトしますか？"
          confirmLabel="ログアウト"
          onConfirm={() => {
            setShowLogoutConfirm(false);
            onLogout();
          }}
          onCancel={() => setShowLogoutConfirm(false)}
          danger="medium"
        />
      )}

      {/* Delete Account Confirmation Dialog */}
      {showDeleteConfirm && (
        <ConfirmDialog
          title="アカウント削除"
          message="この操作は取り消せません。全ての投稿、怨念、記録が永久に失われます。本当に削除しますか？"
          confirmLabel="完全に削除"
          onConfirm={() => {
            setShowDeleteConfirm(false);
            onDeleteAccount();
          }}
          onCancel={() => setShowDeleteConfirm(false)}
          danger="extreme"
        />
      )}
    </div>
  );
}

// Section Component
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-abyss-800 border border-moonlight-700 rounded-lg p-6"
    >
      <h2 className="font-body text-bone-200 text-lg mb-4 flex items-center gap-2 border-b border-moonlight-700/30 pb-3">
        <span className="text-2xl">{icon}</span>
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}

// Setting Item Component
function SettingItem({
  label,
  value,
  description,
  onClick,
  actionLabel,
}: {
  label: string;
  value?: string;
  description?: string;
  onClick: () => void;
  actionLabel: string;
}) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-3 rounded-lg hover:bg-abyss-700 transition-colors"
    >
      <div className="flex-1">
        <div className="font-body text-bone-300 mb-1">{label}</div>
        {description && <div className="text-sm text-bone-500">{description}</div>}
        {value && <div className="text-sm text-moonlight-400 mt-1">{value}</div>}
      </div>
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 bg-abyss-700 border border-cursedflame-700 text-cursedflame-500 rounded-lg hover:bg-cursedflame-700 hover:text-abyss-950 transition-colors text-sm font-body"
      >
        {actionLabel}
      </motion.button>
    </motion.div>
  );
}

// Toggle Item Component
function ToggleItem({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg">
      <div className="flex-1">
        <div className="font-body text-bone-300 mb-1">{label}</div>
        <div className="text-sm text-bone-500">{description}</div>
      </div>
      <button onClick={onToggle} className="relative">
        <div
          className={`w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-cursedflame-700' : 'bg-moonlight-700'
            }`}
        >
          <motion.div
            className="w-5 h-5 bg-bone-100 rounded-full m-0.5"
            animate={{ x: enabled ? 24 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </div>
      </button>
    </div>
  );
}

// Danger Section Component
function DangerSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-bloodstain-950 to-abyss-900 border-2 border-bloodstain-800 rounded-lg p-6"
    >
      <h2 className="font-mystical text-bloodstain-500 text-lg mb-4 flex items-center gap-2 border-b border-bloodstain-800/50 pb-3">
        <span className="text-2xl">⚠️</span>
        危険な操作
      </h2>
      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}

// Danger Item Component
function DangerItem({
  label,
  description,
  onClick,
  level,
}: {
  label: string;
  description: string;
  onClick: () => void;
  level: 'medium' | 'extreme';
}) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-3 rounded-lg hover:bg-bloodstain-900/30 transition-colors"
    >
      <div className="flex-1">
        <div className="font-body text-bone-300 mb-1">{label}</div>
        <div className="text-sm text-bone-500">{description}</div>
      </div>
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-4 py-2 border rounded-lg transition-all text-sm font-body ${level === 'extreme'
            ? 'bg-bloodstain-800 border-bloodstain-600 text-bone-100 hover:bg-bloodstain-700 shadow-[0_0_15px_rgba(199,64,64,0.4)]'
            : 'bg-bloodstain-900 border-bloodstain-700 text-bloodstain-500 hover:bg-bloodstain-800 hover:text-bone-100'
          }`}
      >
        {label}
      </motion.button>
    </motion.div>
  );
}

// Confirm Dialog Component
function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  danger,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger: 'medium' | 'extreme';
}) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="fixed inset-0 bg-black bg-opacity-80 z-50 backdrop-blur-sm"
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-abyss-800 border-2 border-bloodstain-700 z-50 p-6 rounded-lg"
      >
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-bloodstain-500" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-bloodstain-500" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-bloodstain-500" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-bloodstain-500" />

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="font-display text-2xl text-bone-100 mb-3">{title}</h3>
          <p className="font-body text-bone-400 leading-relaxed">{message}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <motion.button
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-4 py-3 bg-abyss-700 border border-moonlight-700 text-bone-300 rounded-lg hover:bg-abyss-600 transition-colors font-body"
          >
            キャンセル
          </motion.button>
          <motion.button
            onClick={onConfirm}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={
              danger === 'extreme'
                ? {
                  boxShadow: [
                    '0 0 15px rgba(199,64,64,0.4)',
                    '0 0 25px rgba(199,64,64,0.7)',
                    '0 0 15px rgba(199,64,64,0.4)',
                  ],
                }
                : {}
            }
            transition={danger === 'extreme' ? { duration: 2, repeat: Infinity } : {}}
            className={`flex-1 px-4 py-3 border rounded-lg transition-all font-body ${danger === 'extreme'
                ? 'bg-bloodstain-700 border-bloodstain-600 text-bone-100'
                : 'bg-bloodstain-800 border-bloodstain-700 text-bone-200'
              }`}
          >
            {confirmLabel}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
