'use client';

import React from 'react';
import Link from 'next/link';
import { User, LogOut, Loader2 } from 'lucide-react';
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
    <header className="w-full border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-3 sm:px-5 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-baseline gap-1 cursor-pointer shrink-0">
          <Logo className="h-[32px] sm:h-[42px] w-auto" color="#f02508" />
          <span className="text-[22px] sm:text-[30px] font-black tracking-tight text-slate-900 leading-none">
            eyro
          </span>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Interactive Credits Counter Text (No Border, Clean Text) */}
          <button
            type="button"
            onClick={onOpenTopup}
            title="Click to top up credits"
            className="group px-2 py-1 rounded-md hover:bg-slate-100/80 transition-all flex items-center cursor-pointer"
          >
            {isLoadingCredits ? (
              <div className="flex items-center gap-1.5 py-0.5">
                <Loader2 className="w-3 h-3 animate-spin text-[#f02508]" />
                <span className="text-xs text-slate-400 font-medium">Loading...</span>
              </div>
            ) : (
              <span className="text-xs sm:text-sm font-semibold text-slate-600">
                <span className="font-extrabold mr-1 text-[#f02508]">
                  {credits}
                </span>
                credits
              </span>
            )}
          </button>

          {/* User Auth Controls */}
          {isLoadingCredits ? (
            <div className="w-16 h-7 bg-slate-100 rounded-md animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md">
                <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="font-semibold max-w-[80px] sm:max-w-[130px] truncate">
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
              className="text-xs sm:text-sm font-bold px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
