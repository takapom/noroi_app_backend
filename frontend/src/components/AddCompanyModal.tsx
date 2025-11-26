'use client';

import { useState } from 'react';

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  onAdd: (companyName: string, time: string, color: 'orange' | 'purple') => void;
}

export default function AddCompanyModal({ isOpen, onClose, category, onAdd }: AddCompanyModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [time, setTime] = useState('');
  const [color, setColor] = useState<'orange' | 'purple'>('orange');

  const categoryLabels: { [key: string]: string } = {
    main: '本選考',
    intern: 'インターン選考',
    info: '説明会',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim() && time.trim()) {
      onAdd(companyName, time, color);
      // Reset form
      setCompanyName('');
      setTime('');
      setColor('orange');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-task-text">企業を追加</h2>
              <button
                onClick={onClose}
                className="text-task-text-light hover:text-task-text transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-task-text-light">
              {categoryLabels[category]}に企業を追加します
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-task-text mb-2">
                企業名 <span className="text-task-purple">*</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-task-text focus:outline-none focus:border-task-purple"
                placeholder="例: 任天堂"
                required
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-task-text mb-2">
                時間 <span className="text-task-purple">*</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-task-text focus:outline-none focus:border-task-purple"
                required
              />
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-task-text mb-2">
                カラー
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setColor('orange')}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                    color === 'orange'
                      ? 'bg-task-orange border-task-orange text-white'
                      : 'bg-white border-gray-300 text-task-text hover:border-task-orange'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-task-orange"></div>
                    オレンジ
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setColor('purple')}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                    color === 'purple'
                      ? 'bg-task-purple border-task-purple text-white'
                      : 'bg-white border-gray-300 text-task-text hover:border-task-purple'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-task-purple"></div>
                    パープル
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-12 bg-task-bg text-task-text rounded-xl font-medium hover:bg-gray-300 transition-all"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="flex-1 h-12 bg-task-purple text-white rounded-xl font-medium hover:bg-opacity-90 transition-all"
              >
                追加
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
