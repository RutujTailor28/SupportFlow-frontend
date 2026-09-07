'use client';

import React from 'react';
import { AuthLayout } from './AuthLayout';
import { LoginForm } from './LoginForm';
import { useApp } from '../../context/AppContext';

export const LoginPage: React.FC = () => {
  const { setActivePage } = useApp();

  const handleNavigateToRegister = () => {
    setActivePage('register');
    if (typeof window !== 'undefined' && window.history.pushState) {
      window.history.pushState(null, '', '/register');
    }
  };

  return (
    <AuthLayout>
      <LoginForm onNavigateToRegister={handleNavigateToRegister} />
    </AuthLayout>
  );
};
