'use client';

import React from 'react';
import { Zap } from 'lucide-react';

interface ToastProps {
  message: string | null;
  accentColor?: string;
}

export const Toast: React.FC<ToastProps> = ({ message, accentColor = '#f02508' }) => {
  if (!message) return null;

  return (
    <div
      className="fixed top-20 right-6 z-50 px-4 py-3 bg-white/95 backdrop-blur-md text-slate-900 font-semibold text-xs rounded-xl shadow-xl border border-slate-200/80 animate-fadeIn border-l-4 flex items-center gap-2.5 max-w-md"
      style={{ borderLeftColor: accentColor }}
    >
      <Zap className="w-4 h-4 fill-[#f02508] text-[#f02508] shrink-0" />
      <span className="text-slate-800">{message}</span>
    </div>
  );
};
