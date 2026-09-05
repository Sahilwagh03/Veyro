import React from 'react';
import { Logo } from './logo';

interface HeaderProps {
  credits: number;
}

export const Header: React.FC<HeaderProps> = ({ credits }) => {
  return (
    <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-baseline gap-1.5">
          <Logo className="h-[42px] w-auto" color="#f02508" />
          <span className="text-[30px] font-black tracking-tight text-slate-900 leading-none">
            eyro
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Credits Counter Badge */}
          <div
            className="text-xs font-medium px-3 py-1.5 rounded-md border bg-white"
            style={{ borderColor: 'rgba(252, 150, 76, 0.35)' }}
          >
            <span className="font-extrabold" style={{ color: '#f02508' }}>{credits}</span>{' '}
            <span className="text-slate-600">credits available</span>
          </div>
        </div>
      </div>
    </header>
  );
};
