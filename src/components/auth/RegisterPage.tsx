'use client';

import React from 'react';
import { AuthLayout } from './AuthLayout';
import { RegisterForm } from './RegisterForm';
import { useApp } from '../../context/AppContext';

export const RegisterPage: React.FC = () => {
  const { setActivePage } = useApp();

  const handleNavigateToLogin = () => {
    setActivePage('login');
    if (typeof window !== 'undefined' && window.history.pushState) {
      window.history.pushState(null, '', '/login');
    }
  };

  return (
    <AuthLayout>
      <RegisterForm onNavigateToLogin={handleNavigateToLogin} />
    </AuthLayout>
  );
};
