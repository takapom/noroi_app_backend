'use client';

import { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import MainApp from '@/components/MainApp';
import { apiClient } from '@/lib/api';

type AppState = 'splash' | 'login' | 'register' | 'timeline';

export default function AuthWrapper() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('juheki_user');
    if (isLoggedIn && appState === 'splash') {
      // Skip to timeline if already logged in
      setTimeout(() => setAppState('timeline'), 3500);
    }
  }, [appState]);

  const handleSplashComplete = () => {
    const isLoggedIn = localStorage.getItem('juheki_user');
    setAppState(isLoggedIn ? 'timeline' : 'login');
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError('');

    try {
      await apiClient.login(email, password);
      setAppState('timeline');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: any) => {
    setIsLoading(true);
    setError('');

    try {
      await apiClient.register(data);
      setAppState('timeline');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました');
      console.error('Register error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {appState === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}

      {appState === 'login' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full">
            {error && (
              <div className="max-w-md mx-auto mb-4 p-4 bg-bloodstain-900 border border-bloodstain-700 rounded-lg">
                <p className="font-body text-bloodstain-500 text-center">{error}</p>
              </div>
            )}
            <LoginForm
              onLogin={handleLogin}
              onSwitchToRegister={() => setAppState('register')}
            />
            {isLoading && (
              <div className="text-center mt-4">
                <p className="font-body text-bone-500">読み込み中...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {appState === 'register' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full">
            {error && (
              <div className="max-w-md mx-auto mb-4 p-4 bg-bloodstain-900 border border-bloodstain-700 rounded-lg">
                <p className="font-body text-bloodstain-500 text-center">{error}</p>
              </div>
            )}
            <RegisterForm
              onRegister={handleRegister}
              onSwitchToLogin={() => setAppState('login')}
            />
            {isLoading && (
              <div className="text-center mt-4">
                <p className="font-body text-bone-500">読み込み中...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {appState === 'timeline' && <MainApp />}
    </div>
  );
}
