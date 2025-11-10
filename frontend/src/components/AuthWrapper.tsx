'use client';

import { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import MainApp from '@/components/MainApp';

type AppState = 'splash' | 'login' | 'register' | 'timeline';

export default function AuthWrapper() {
  const [appState, setAppState] = useState<AppState>('splash');

  // Check if user is already logged in (in real app, check localStorage/session)
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

  const handleLogin = (email: string, password: string) => {
    // In real app, make API call to authenticate
    console.log('Login:', { email, password });
    // Mock login
    localStorage.setItem('juheki_user', JSON.stringify({ email }));
    setAppState('timeline');
  };

  const handleRegister = (data: any) => {
    // In real app, make API call to register
    console.log('Register:', data);
    // Mock registration
    localStorage.setItem('juheki_user', JSON.stringify(data));
    setAppState('timeline');
  };

  return (
    <div className="min-h-screen">
      {appState === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}

      {appState === 'login' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <LoginForm
            onLogin={handleLogin}
            onSwitchToRegister={() => setAppState('register')}
          />
        </div>
      )}

      {appState === 'register' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <RegisterForm
            onRegister={handleRegister}
            onSwitchToLogin={() => setAppState('login')}
          />
        </div>
      )}

      {appState === 'timeline' && <MainApp />}
    </div>
  );
}
