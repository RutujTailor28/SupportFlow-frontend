'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PasswordInput } from './PasswordInput';
import { SocialLoginButtons } from './SocialLoginButtons';
import { ArrowRight, CheckCircle2, Check, X, AlertCircle } from 'lucide-react';

interface RegisterFormProps {
  onNavigateToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onNavigateToLogin }) => {
  const { setActivePage } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    form?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password validation rules
  const passwordRules = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    };
  }, [password]);

  const isPasswordValid = passwordRules.minLength && passwordRules.hasUppercase && passwordRules.hasNumber;

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your work email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Please create a password.';
    } else if (!isPasswordValid) {
      newErrors.password = 'Password does not meet all strength requirements.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms of Service & Privacy Policy.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (!validateForm()) return;

    setIsLoading(true);

    // Mock registration flow
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Account created successfully! Setting up your workspace...');

      setTimeout(() => {
        setActivePage('dashboard');
        if (typeof window !== 'undefined' && window.history.pushState) {
          window.history.pushState(null, '', '/');
        }
      }, 750);
    }, 1000);
  };

  const handleSocialRegister = (provider: 'google' | 'microsoft') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(`Account initialized with ${provider === 'google' ? 'Google' : 'Microsoft'}. Redirecting...`);
      setTimeout(() => {
        setActivePage('dashboard');
        if (typeof window !== 'undefined' && window.history.pushState) {
          window.history.pushState(null, '', '/');
        }
      }, 750);
    }, 800);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-5">
      {/* Header */}
      <div className="space-y-1.5 text-left">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create your workspace
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Start managing support tickets smarter with AI triage and automated draft replies.
        </p>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form Error */}
      {errors.form && (
        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
            Full name
          </label>
          <input
            id="reg-name"
            type="text"
            autoComplete="name"
            placeholder="John Smith"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
            }}
            className={`w-full px-3.5 py-2.5 text-sm rounded-lg bg-white dark:bg-slate-900 border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
              errors.fullName
                ? 'border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100 focus:border-rose-500'
                : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-indigo-600 dark:focus:border-indigo-500'
            }`}
          />
          {errors.fullName && <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.fullName}</p>}
        </div>

        {/* Work Email */}
        <div className="space-y-1.5">
          <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
            Work email
          </label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            placeholder="john@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            className={`w-full px-3.5 py-2.5 text-sm rounded-lg bg-white dark:bg-slate-900 border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
              errors.email
                ? 'border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100 focus:border-rose-500'
                : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-indigo-600 dark:focus:border-indigo-500'
            }`}
          />
          {errors.email && <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.email}</p>}
        </div>

        {/* Password */}
        <PasswordInput
          id="reg-password"
          label="Create password"
          autoComplete="new-password"
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
        />

        {/* Password Requirements */}
        {password.length > 0 && (
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Password requirements:
            </p>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                {passwordRules.minLength ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className={passwordRules.minLength ? 'text-emerald-700 dark:text-emerald-300 font-medium' : 'text-slate-500 dark:text-slate-400'}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {passwordRules.hasUppercase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className={passwordRules.hasUppercase ? 'text-emerald-700 dark:text-emerald-300 font-medium' : 'text-slate-500 dark:text-slate-400'}>
                  One uppercase letter
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {passwordRules.hasNumber ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className={passwordRules.hasNumber ? 'text-emerald-700 dark:text-emerald-300 font-medium' : 'text-slate-500 dark:text-slate-400'}>
                  One number
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Password */}
        <PasswordInput
          id="reg-confirm-password"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="••••••••••••"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }}
          error={errors.confirmPassword}
        />

        {/* Terms Checkbox */}
        <div className="space-y-1 pt-1">
          <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked);
                if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }));
              }}
              className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 h-4 w-4 cursor-pointer shrink-0"
            />
            <span>
              I agree to the{' '}
              <a href="#terms" onClick={(e) => e.preventDefault()} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                Privacy Policy
              </a>.
            </span>
          </label>
          {errors.terms && <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.terms}</p>}
        </div>

        {/* Create Account Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-sm shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Creating workspace...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
        <span className="bg-slate-50 dark:bg-slate-950 px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
          Or continue with
        </span>
      </div>

      {/* Social Login */}
      <SocialLoginButtons onSocialClick={handleSocialRegister} isLoading={isLoading} />

      {/* Login Link */}
      <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => {
            if (onNavigateToLogin) {
              onNavigateToLogin();
            } else {
              setActivePage('login');
              if (typeof window !== 'undefined' && window.history.pushState) {
                window.history.pushState(null, '', '/login');
              }
            }
          }}
          className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
        >
          Sign in →
        </button>
      </div>
    </div>
  );
};
