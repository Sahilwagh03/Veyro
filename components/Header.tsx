'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, User, LogOut, Loader2 } from 'lucide-react';
import { Logo } from './logo';

interface HeaderProps {
  credits: number;
  isLoadingCredits?: boolean;
  user?: any;
  onOpenTopup?: () => void;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  credits,
  isLoadingCredits = false,
  user,
  onOpenTopup,
  onOpenAuth,
  onSignOut,
}) => {
  return (
    <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-baseline gap-1.5 cursor-pointer">
          <Logo className="h-[42px] w-auto" color="#f02508" />
          <span className="text-[30px] font-black tracking-tight text-slate-900 leading-none">
            eyro
          </span>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/pricing"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Pricing
          </Link>

          {/* Interactive Credits Counter Badge */}
          <button
            type="button"
            onClick={onOpenTopup}
            title="Click to top up credits"
            className="group text-xs font-medium px-3 py-1.5 rounded-md border bg-white hover:bg-orange-50/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs min-w-[96px] justify-center"
            style={{ borderColor: 'rgba(252, 150, 76, 0.4)' }}
          >
            {isLoadingCredits ? (
              <div className="flex items-center gap-1.5 py-0.5">
                <Loader2 className="w-3 h-3 animate-spin text-[#f02508]" />
                <span className="text-[11px] text-slate-400 font-medium">Loading...</span>
              </div>
            ) : (
              <>
                <span className="font-extrabold" style={{ color: '#f02508' }}>
                  {credits}
                </span>
                <span className="text-slate-600">credits</span>
                <span className="w-4 h-4 rounded-full bg-orange-100 text-[#f02508] group-hover:bg-[#f02508] group-hover:text-white flex items-center justify-center transition-colors ml-0.5">
                  <Plus className="w-2.5 h-2.5" />
                </span>
              </>
            )}
          </button>

          {/* User Auth Controls */}
          {isLoadingCredits ? (
            <div className="w-16 h-7 bg-slate-100 rounded-md animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-md">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-medium max-w-[120px] truncate">
                  {user.user_metadata?.full_name || user.email || 'User'}
                </span>
              </div>
              <button
                type="button"
                onClick={onSignOut}
                title="Sign Out"
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="text-xs font-bold px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
