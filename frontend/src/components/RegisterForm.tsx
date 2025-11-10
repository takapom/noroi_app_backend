'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import CurseButton from './CurseButton';

interface RegisterFormProps {
  onRegister: (data: {
    email: string;
    username: string;
    password: string;
    age: string;
    gender: string;
    curseStyle: string;
  }) => void;
  onSwitchToLogin: () => void;
}

const CURSE_STYLES = [
  { id: 'infernal', name: '炎獄の儀式', description: 'Infernal Rite - 燃え盛る炎で対象を焼き尽くす' },
  { id: 'frozen', name: '氷結の呪縛', description: 'Frozen Curse - 永遠の氷に閉じ込める' },
  { id: 'shadow', name: '闇夜の囁き', description: 'Shadow Whisper - 暗闇から呪詛を囁く' },
  { id: 'blood', name: '血盟の刻印', description: 'Blood Covenant - 血の契約で縛る' },
  { id: 'danse', name: '骸骨の舞踏', description: 'Danse Macabre - 死の舞踏で魂を奪う' },
];

export default function RegisterForm({ onRegister, onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    age: '',
    gender: '',
    curseStyle: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto p-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl font-bold text-bone-100 mb-2">
          契約ノ儀
        </h2>
        <p className="font-mystical text-bone-400 text-sm">
          ─── 新たなる呪術師として ───
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block font-display font-normal text-sm text-bone-400 mb-2">
            <span className="text-bloodstain-700">⟨</span>
            メールアドレス
            <span className="text-bloodstain-700">⟩</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full bg-abyss-800 border border-moonlight-700 border-b-2 border-b-moonlight-600 text-bone-200 font-body px-4 py-3 focus:outline-none focus:border-b-bloodstain-700 transition-colors"
            required
          />
        </div>

        {/* Username */}
        <div>
          <label className="block font-display font-normal text-sm text-bone-400 mb-2">
            <span className="text-bloodstain-700">⟨</span>
            呪名（ユーザー名）
            <span className="text-bloodstain-700">⟩</span>
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => updateField('username', e.target.value)}
            className="w-full bg-abyss-800 border border-moonlight-700 border-b-2 border-b-moonlight-600 text-bone-200 font-body px-4 py-3 focus:outline-none focus:border-b-bloodstain-700 transition-colors"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block font-display font-normal text-sm text-bone-400 mb-2">
            <span className="text-bloodstain-700">⟨</span>
            合言葉
            <span className="text-bloodstain-700">⟩</span>
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            className="w-full bg-abyss-800 border border-moonlight-700 border-b-2 border-b-moonlight-600 text-bone-200 font-body px-4 py-3 focus:outline-none focus:border-b-bloodstain-700 transition-colors"
            required
          />
        </div>

        {/* Age and Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-display font-normal text-sm text-bone-400 mb-2">
              年齢
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => updateField('age', e.target.value)}
              className="w-full bg-abyss-800 border border-moonlight-700 text-bone-200 font-body px-4 py-3 focus:outline-none focus:border-bloodstain-700 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block font-display font-normal text-sm text-bone-400 mb-2">
              性別
            </label>
            <select
              value={formData.gender}
              onChange={(e) => updateField('gender', e.target.value)}
              className="w-full bg-abyss-800 border border-moonlight-700 text-bone-200 font-body px-4 py-3 focus:outline-none focus:border-bloodstain-700 transition-colors"
              required
            >
              <option value="">選択</option>
              <option value="male">男性</option>
              <option value="female">女性</option>
              <option value="unknown">不明</option>
            </select>
          </div>
        </div>

        {/* Curse Style */}
        <div>
          <label className="block font-display font-normal text-sm text-bone-400 mb-2">
            <span className="text-bloodstain-700">⟨</span>
            呪癖（儀式のスタイル）
            <span className="text-bloodstain-700">⟩</span>
          </label>
          <div className="space-y-2">
            {CURSE_STYLES.map((style) => (
              <label
                key={style.id}
                className={`block p-3 border cursor-pointer transition-all ${
                  formData.curseStyle === style.id
                    ? 'border-bloodstain-700 bg-bloodstain-900 bg-opacity-20'
                    : 'border-moonlight-700 hover:border-moonlight-600'
                }`}
              >
                <input
                  type="radio"
                  name="curseStyle"
                  value={style.id}
                  checked={formData.curseStyle === style.id}
                  onChange={(e) => updateField('curseStyle', e.target.value)}
                  className="sr-only"
                />
                <div className="font-body text-bone-200 text-sm font-medium mb-1">
                  {style.name}
                </div>
                <div className="font-mystical text-bone-500 text-xs">
                  {style.description}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <CurseButton type="submit" className="w-full">
            契約ヲ締結スル
          </CurseButton>
        </div>

        {/* Switch to Login */}
        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-bone-400 font-body text-sm hover:text-bloodstain-600 transition-colors"
          >
            既に契約済みの方はこちら
          </button>
        </div>
      </form>
    </motion.div>
  );
}
