'use client';

import { useState } from 'react';
import UserIcon from './icons/UserIcon';
import MailIcon from './icons/MailIcon';
import LockIcon from './icons/LockIcon';

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
    <div className="w-full max-w-md mx-auto px-6 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-extrabold text-[36px] leading-[40px] text-contra-black mb-3">
          Sign up
        </h1>
        <p className="font-medium text-[17px] leading-[24px] text-contra-black-800">
          You have chance to create new account if you really want to.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username */}
        <div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-contra-black">
              <UserIcon className="w-6 h-6" />
            </div>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => updateField('username', e.target.value)}
              className="w-full h-14 bg-contra-white border-2 border-contra-black rounded-2xl pl-14 pr-4 text-contra-black text-[21px] font-medium leading-7 focus:outline-none focus:ring-0 placeholder:text-contra-black placeholder:opacity-100"
              placeholder="Full Name"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-contra-black">
              <MailIcon className="w-6 h-6" />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full h-14 bg-contra-white border-2 border-contra-black rounded-2xl pl-14 pr-4 text-contra-black text-[21px] font-medium leading-7 focus:outline-none focus:ring-0 placeholder:text-contra-black placeholder:opacity-100"
              placeholder="Email address"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-contra-black">
              <LockIcon className="w-6 h-6" />
            </div>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              className="w-full h-14 bg-contra-white border-2 border-contra-black rounded-2xl pl-14 pr-4 text-contra-black text-[21px] font-medium leading-7 focus:outline-none focus:ring-0 placeholder:text-contra-black placeholder:opacity-100"
              placeholder="●●●●●●●"
              required
            />
          </div>
        </div>

        {/* Age and Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => updateField('age', e.target.value)}
              className="w-full h-14 bg-contra-white border-2 border-contra-black rounded-2xl px-4 text-contra-black text-[21px] font-medium leading-7 focus:outline-none focus:ring-0 placeholder:text-contra-black-800"
              placeholder="Age"
              required
            />
          </div>
          <div>
            <select
              value={formData.gender}
              onChange={(e) => updateField('gender', e.target.value)}
              className="w-full h-14 bg-contra-white border-2 border-contra-black rounded-2xl px-4 text-contra-black text-[21px] font-medium leading-7 focus:outline-none focus:ring-0"
              required
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unknown">Other</option>
            </select>
          </div>
        </div>

        {/* Curse Style */}
        <div>
          <label className="block text-contra-black text-[13px] font-medium mb-2">
            Curse Style (Optional)
          </label>
          <div className="space-y-2">
            {CURSE_STYLES.map((style) => (
              <label
                key={style.id}
                className={`block p-3 border-2 cursor-pointer transition-all rounded-xl ${
                  formData.curseStyle === style.id
                    ? 'border-contra-black bg-contra-yellow bg-opacity-20'
                    : 'border-contra-black-800 border-opacity-30 hover:border-contra-black hover:border-opacity-50'
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
                <div className="text-contra-black text-sm font-medium mb-1">
                  {style.name}
                </div>
                <div className="text-contra-black-800 text-xs">
                  {style.description}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full h-[60px] bg-contra-yellow border-2 border-contra-black rounded-2xl text-contra-black text-[21px] font-extrabold leading-7 hover:bg-opacity-90 transition-all shadow-[0_4px_0_0_#18191F]"
          >
            Sign up
          </button>
        </div>

        {/* Switch to Login */}
        <div className="text-center pt-2">
          <p className="text-[13px] font-medium leading-[18px]">
            <span className="text-contra-black">Already have account? </span>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-contra-red font-bold hover:underline"
            >
              Go here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
