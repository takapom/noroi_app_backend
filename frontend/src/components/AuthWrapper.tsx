'use client';

import { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import MainApp from '@/components/MainApp';
import TodaysTasks from '@/components/TodaysTasks';
import { apiClient } from '@/lib/api';

type AppState = 'login' | 'register' | 'tasks' | 'timeline';

export default function AuthWrapper() {
  const [appState, setAppState] = useState<AppState>('login');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = localStorage.getItem('juheki_user');
      if (isLoggedIn) {
        // Verify token is still valid
        try {
          await apiClient.getProfile();
          // Token is valid, go to tasks
          setAppState('tasks');
        } catch (err) {
          // Token is invalid, clear storage and show login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('juheki_user');
          setAppState('login');
        }
      } else {
        setAppState('login');
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setError('');

    try {
      await apiClient.login(email, password);
      setAppState('tasks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました');
      console.error('Login error:', err);
    }
  };

  const handleRegister = async (data: any) => {
    setError('');

    try {
      await apiClient.register(data);
      setAppState('tasks');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました');
      console.error('Register error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-contra-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-task-purple mx-auto mb-4"></div>
          <p className="text-task-text-light">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      {appState === 'login' && (
        <div className="min-h-screen bg-contra-white flex items-center justify-center">
          <div className="w-full">
            {error && (
              <div className="max-w-md mx-auto mb-4 p-4 bg-contra-red bg-opacity-10 border border-contra-red rounded-lg">
                <p className="font-body text-contra-red text-center">{error}</p>
              </div>
            )}
            <LoginForm
              onLogin={handleLogin}
              onSwitchToRegister={() => setAppState('register')}
            />
          </div>
        </div>
      )}

      {appState === 'register' && (
        <div className="min-h-screen bg-contra-white flex items-center justify-center">
          <div className="w-full">
            {error && (
              <div className="max-w-md mx-auto mb-4 p-4 bg-contra-red bg-opacity-10 border border-contra-red rounded-lg">
                <p className="font-body text-contra-red text-center">{error}</p>
              </div>
            )}
            <RegisterForm
              onRegister={handleRegister}
              onSwitchToLogin={() => setAppState('login')}
            />
          </div>
        </div>
      )}

      {appState === 'tasks' && (
        <TodaysTasks onNavigateToTimeline={() => setAppState('timeline')} />
      )}

      {appState === 'timeline' && <MainApp onNavigateToTasks={() => setAppState('tasks')} />}
    </div>
  );
}
