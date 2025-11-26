'use client';

import { useState } from 'react';
import MailIcon from './icons/MailIcon';
import LockIcon from './icons/LockIcon';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onLogin, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-extrabold text-[36px] leading-[40px] text-contra-black mb-3">
          Sign in
        </h1>
        <p className="font-medium text-[17px] leading-[24px] text-contra-black-800">
          Welcome back!
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-contra-black">
              <MailIcon className="w-6 h-6" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 bg-contra-white border-2 border-contra-black rounded-2xl pl-14 pr-4 text-contra-black text-[21px] font-medium leading-7 focus:outline-none focus:ring-0 placeholder:text-contra-black placeholder:opacity-100"
              placeholder="Email address"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-contra-black">
              <LockIcon className="w-6 h-6" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-contra-white border-2 border-contra-black rounded-2xl pl-14 pr-4 text-contra-black text-[21px] font-medium leading-7 focus:outline-none focus:ring-0 placeholder:text-contra-black placeholder:opacity-100"
              placeholder="●●●●●●●"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full h-[60px] bg-contra-yellow border-2 border-contra-black rounded-2xl text-contra-black text-[21px] font-extrabold leading-7 hover:bg-opacity-90 transition-all shadow-[0_4px_0_0_#18191F]"
          >
            Sign in
          </button>
        </div>

        {/* Switch to Register */}
        <div className="text-center pt-2">
          <p className="text-[13px] font-medium leading-[18px]">
            <span className="text-contra-black">Don't have account? </span>
            <button
              type="button"
              onClick={onSwitchToRegister}
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
