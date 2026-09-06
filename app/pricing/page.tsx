'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, ShieldCheck, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { AuthModal } from '@/components/AuthModal';
import { TopupModal } from '@/components/TopupModal';
import { Toast } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { usePayment } from '@/hooks/usePayment';

export default function PricingPage() {
  const { toastMessage, showToast } = useToast(4000);
  const [isTopupModalOpen, setIsTopupModalOpen] = useState<boolean>(false);

  const {
    user,
    setUser,
    credits,
    isAuthLoading,
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    handleSignOut,
    refetchCredits,
  } = useAuth(showToast);

  const { isPaying, subscribeToPro } = usePayment({
    user,
    openAuthModal,
    showToast,
    onSuccessCallback: () => {
      refetchCredits();
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-orange-100 selection:text-[#f02508]">
      {/* Global Header */}
      <Header
        credits={credits}
        isLoadingCredits={isAuthLoading}
        user={user}
        onOpenTopup={() => {
          if (!user) {
            openAuthModal('signup');
          } else {
            setIsTopupModalOpen(true);
          }
        }}
        onOpenAuth={() => openAuthModal('signin')}
        onSignOut={handleSignOut}
      />

      <Toast message={toastMessage} />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-5 py-12">
          {/* Section Heading */}
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#9c3918' }}>
              Pricing
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl">
              One plan. ₹99 a month.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-slate-600">
              Every generation makes ten ad creatives and costs 10 credits. Start free, upgrade when you run out.
            </p>
          </div>

          {/* 2-Column Pricing Grid */}
          <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Free Tier Card */}
            <section className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 flex flex-col justify-between shadow-2xs">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Free</h2>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-900">₹0</span>
                </div>
                <p className="mt-1 text-xs font-medium text-slate-500">One time, on signup</p>

                <ul className="mt-6 space-y-3">
                  <li className="flex gap-3 text-sm text-slate-700">
                    <Check className="mt-0.5 w-4 h-4 shrink-0 text-slate-400" />
                    <span>30 credits on signup</span>
                  </li>
                  <li className="flex gap-3 text-sm text-slate-700">
                    <Check className="mt-0.5 w-4 h-4 shrink-0 text-slate-400" />
                    <span>3 generations — 30 ad creatives</span>
                  </li>
                  <li className="flex gap-3 text-sm text-slate-700">
                    <Check className="mt-0.5 w-4 h-4 shrink-0 text-slate-400" />
                    <span>All ten ad layouts</span>
                  </li>
                  <li className="flex gap-3 text-sm text-slate-700">
                    <Check className="mt-0.5 w-4 h-4 shrink-0 text-slate-400" />
                    <span>1080×1080 PNG downloads</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                {user ? (
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 transition-colors h-10 px-4 w-full shadow-2xs"
                  >
                    Start generating
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => openAuthModal('signup')}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 transition-colors h-10 px-4 w-full cursor-pointer shadow-2xs"
                  >
                    Create a free account
                  </button>
                )}
              </div>
            </section>

            {/* Pro Plan Card */}
            <section className="rounded-2xl border-2 border-[#f02508] bg-white p-7 sm:p-8 flex flex-col justify-between shadow-md relative">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Pro</h2>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white"
                    style={{ background: 'linear-gradient(135deg, #f02508 0%, #fc964c 100%)' }}
                  >
                    Most popular
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-900">₹99</span>
                  <span className="text-base font-semibold text-slate-500"> / month</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-[#f02508]">300 credits every month</p>

                <ul className="mt-6 space-y-3">
                  <li className="flex gap-3 text-sm text-slate-900 font-medium">
                    <Check className="mt-0.5 w-4 h-4 shrink-0 text-[#f02508]" />
                    <span>300 credits every month</span>
                  </li>
                  <li className="flex gap-3 text-sm text-slate-800">
                    <Check className="mt-0.5 w-4 h-4 shrink-0 text-[#f02508]" />
                    <span>30 generations — 300 ad creatives</span>
                  </li>
                  <li className="flex gap-3 text-sm text-slate-800">
                    <Check className="mt-0.5 w-4 h-4 shrink-0 text-[#f02508]" />
                    <span>All ten ad layouts, fully editable</span>
                  </li>
                  <li className="flex gap-3 text-sm text-slate-800">
                    <Check className="mt-0.5 w-4 h-4 shrink-0 text-[#f02508]" />
                    <span>Bulk ZIP download of every creative</span>
                  </li>
                  <li className="flex gap-3 text-sm text-slate-800">
                    <Check className="mt-0.5 w-4 h-4 shrink-0 text-[#f02508]" />
                    <span>Run out early? Pay ₹99 again — credits stack on what&apos;s left</span>
                  </li>
                  <li className="flex gap-3 text-sm text-slate-800">
                    <Check className="mt-0.5 w-4 h-4 shrink-0 text-[#f02508]" />
                    <span>Cancel any time</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => subscribeToPro(99, 300)}
                  disabled={isPaying}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold text-white transition-all h-11 px-8 w-full cursor-pointer shadow-md hover:brightness-105 active:scale-[0.99] disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #f02508 0%, #fc964c 100%)',
                  }}
                >
                  {isPaying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Opening Secure Checkout...</span>
                    </>
                  ) : (
                    <span>{user ? 'Subscribe for ₹99/mo' : 'Sign up and subscribe'}</span>
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Secure payment via Razorpay. UPI, cards and netbanking.</span>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={closeAuthModal}
        onSuccess={(newUser) => {
          setUser(newUser);
          refetchCredits();
          closeAuthModal();
          showToast(`Welcome ${newUser.email || 'friend'}! 30 free credits loaded.`);
        }}
      />

      {/* Topup Modal */}
      <TopupModal
        isOpen={isTopupModalOpen}
        currentCredits={credits}
        isPaying={isPaying}
        userId={user?.id}
        userEmail={user?.email}
        onClose={() => setIsTopupModalOpen(false)}
        onCheckout={() => subscribeToPro(99, 300)}
        onSuccess={(newCredits) => {
          refetchCredits();
          setIsTopupModalOpen(false);
          showToast(`Credits topped up! New balance: ${newCredits} credits.`);
        }}
      />
    </div>
  );
}
