'use client';

import { useState, useEffect } from 'react';
import CompanyDetail from './CompanyDetail';
import AddCompanyModal from './AddCompanyModal';
import { apiClient, User } from '@/lib/api';

interface Task {
  id: string;
  title: string;
  time: string;
  color: 'orange' | 'purple';
  completed: boolean;
}

const MOCK_TASKS: Task[] = [
  { id: '1', title: '任天堂', time: '8:00 AM', color: 'orange', completed: false },
  { id: '2', title: 'zozotown', time: '10:00 AM', color: 'purple', completed: false },
  { id: '3', title: 'chatworks', time: '2:00 PM', color: 'orange', completed: false },
  { id: '4', title: 'マイナビ', time: '4:00 PM', color: 'purple', completed: false },
];

const CATEGORIES = [
  { id: 'main', label: '本選考' },
  { id: 'intern', label: 'インターン選考' },
  { id: 'info', label: '説明会' },
];

type TabType = 'All' | 'To do' | 'In Progress' | 'On';

interface TodaysTasksProps {
  onNavigateToTimeline?: () => void;
}

export default function TodaysTasks({ onNavigateToTimeline }: TodaysTasksProps) {
  const [selectedCategory, setSelectedCategory] = useState('main');
  const [selectedTab, setSelectedTab] = useState<TabType>('All');
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Task | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await apiClient.getProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleTaskToggle = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('juheki_user');
    window.location.reload();
  };

  const handleNavigateToBoard = () => {
    setIsMenuOpen(false);
    if (onNavigateToTimeline) {
      onNavigateToTimeline();
    }
  };

  const handleAddCompany = () => {
    setIsAddModalOpen(true);
  };

  const handleAddNewCompany = (companyName: string, time: string, color: 'orange' | 'purple') => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: companyName,
      time: time,
      color: color,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="min-h-screen bg-task-bg pb-6">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6 rounded-b-3xl shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-task-text">就活</h1>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-task-text-light hover:text-task-text transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Category Selection */}
        <div className="flex gap-3 mb-6">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-1 flex flex-col items-center py-3 rounded-2xl transition-all ${selectedCategory === category.id
                ? 'bg-task-purple text-white'
                : 'bg-task-bg text-task-text-light hover:bg-gray-200'
                }`}
            >
              <span className="text-sm font-bold">{category.label}</span>
              {selectedCategory === category.id && (
                <div className="w-1 h-1 bg-white rounded-full mt-1"></div>
              )}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-3">
          {(['All', 'To do', 'In Progress', 'On'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTab === tab
                ? 'bg-task-purple text-white'
                : 'bg-task-bg text-task-text-light hover:bg-gray-200'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="px-6 mt-6 space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4"
          >
            {/* Color Indicator */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${task.color === 'orange' ? 'bg-task-orange' : 'bg-task-purple'
              }`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>

            {/* Task Info - Clickable */}
            <div
              className="flex-1 cursor-pointer"
              onClick={() => setSelectedCompany(task)}
            >
              <h3 className={`font-medium text-task-text mb-1 ${task.completed ? 'line-through opacity-50' : ''}`}>
                {task.title}
              </h3>
              <p className="text-sm text-task-text-light flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {task.time}
              </p>
            </div>

            {/* Checkbox */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTaskToggle(task.id);
              }}
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${task.completed
                ? 'bg-task-purple border-task-purple'
                : 'border-gray-300 hover:border-task-purple'
                }`}
            >
              {task.completed && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Floating Action Button - Add Company */}
      <button
        onClick={handleAddCompany}
        className="fixed bottom-8 right-8 w-14 h-14 bg-task-purple rounded-full shadow-lg flex items-center justify-center text-white hover:bg-opacity-90 transition-all z-30"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Menu Overlay */}
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
            }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Side Menu */}
        <div
          className={`fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* Menu Header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-task-text">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-task-text-light hover:text-task-text"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-task-purple rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-task-text">
                  {userProfile?.username || 'User'}
                </p>
                <p className="text-sm text-task-text-light">
                  {userProfile?.email || 'loading...'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 px-6 py-4">
            <nav className="space-y-2">
              <button
                onClick={handleNavigateToBoard}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-task-bg transition-colors text-left"
              >
                <svg className="w-5 h-5 text-task-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-task-text font-medium">掲示板</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-task-bg transition-colors text-left">
                <svg className="w-5 h-5 text-task-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-task-text font-medium">履歴書作成</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-task-bg transition-colors text-left">
                <svg className="w-5 h-5 text-task-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-task-text font-medium">直前モード</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-task-bg transition-colors text-left">
                <svg className="w-5 h-5 text-task-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-task-text font-medium">自己分析</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-task-bg transition-colors text-left">
                <svg className="w-5 h-5 text-task-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-task-text font-medium">Settings</span>
              </button>
            </nav>
          </div>

          {/* Logout Button */}
          <div className="px-6 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-task-purple text-white rounded-xl hover:bg-opacity-90 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </>

      {/* Company Detail View */}
      {selectedCompany && (
        <CompanyDetail
          company={selectedCompany}
          category={selectedCategory}
          onClose={() => setSelectedCompany(null)}
        />
      )}

      {/* Add Company Modal */}
      <AddCompanyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        category={selectedCategory}
        onAdd={handleAddNewCompany}
      />
    </div>
  );
}
