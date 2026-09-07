'use client';

import React from 'react';
import { X, Mail, Lock, User, Phone, Loader2, Sparkles } from 'lucide-react';
import { Logo } from '@/components/logo';
import { useAuthForm } from '@/hooks/useAuthForm';
import { AuthModalMode } from '@/types/auth';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  initialMode?: AuthModalMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signup',
}) => {
  const {
    isSignUp,
    formData,
    loading,
    errorMsg,
    infoMsg,
    handleChange,
    handleModeSwitch,
    handleClose,
    handleSubmit,
  } = useAuthForm({ isOpen, initialMode, onSuccess, onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleClose}
          type="button"
          aria-label="Close authentication modal"
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1 mb-2">
            <Logo className="h-[28px] w-auto" color="#f02508" />
            <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">eyro</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {isSignUp ? 'Create your Veyro account' : 'Welcome back'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isSignUp
              ? 'Get 30 free credits instantly to generate 30 high-converting ads'
              : 'Sign in to access your credits and saved templates'}
          </p>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg animate-shake">
            {errorMsg}
          </div>
        )}
        {infoMsg && (
          <div className="mb-4 p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
            {infoMsg}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="fullName">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange('fullName')}
                    placeholder="Your full name"
                    autoComplete="name"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f02508] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="phone">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange('phone')}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f02508] transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="you@company.com"
                autoComplete="email"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f02508] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange('password')}
                placeholder="••••••••"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f02508] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg text-sm font-bold text-white transition-all shadow-sm hover:brightness-105 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #f02508 0%, #fc964c 100%)',
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSignUp ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Create Account (30 Free Credits)</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Mode Switch Footer */}
        <div className="mt-5 text-center text-xs text-slate-500">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch(false)}
                className="font-bold text-[#f02508] hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch(true)}
                className="font-bold text-[#f02508] hover:underline cursor-pointer"
              >
                Create one (30 free credits)
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
