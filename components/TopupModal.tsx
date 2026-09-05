'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Check, Zap, Sparkles, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { loadRazorpayScript } from '@/utils/loadRazorpay';

export interface CreditPlan {
  id: string;
  name: string;
  credits: number;
  inr: number;
  perCreative: string;
  badge?: string;
  features: string[];
}

export const TOPUP_PLANS: CreditPlan[] = [
  {
    id: 'pro',
    name: 'Pro',
    credits: 300,
    inr: 99,
    perCreative: '₹0.33 / creative',
    badge: 'Most popular',
    features: [
      '300 credits every month',
      '30 generations — 300 ad creatives',
      'All ten ad layouts, fully editable',
      'Bulk ZIP download of every creative',
      'Run out early? Pay ₹99 again — credits stack on what’s left',
      'Cancel any time',
    ],
  },
];

interface TopupModalProps {
  isOpen: boolean;
  currentCredits: number;
  userId?: string;
  userEmail?: string;
  onClose: () => void;
  onSuccess: (newCredits: number) => void;
}

export const TopupModal: React.FC<TopupModalProps> = ({
  isOpen,
  currentCredits,
  userId,
  userEmail,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const plan = TOPUP_PLANS[0];

  const handleCheckout = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Create order on server
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: plan.inr,
          creditsToAdd: plan.credits,
          userId: userId || 'anonymous',
          planName: 'Pro Subscription (₹99/mo)',
        }),
      });

      if (!orderRes.ok) {
        throw new Error('Failed to create payment order');
      }

      const orderData = await orderRes.json();

      // Demo/Mock fallback if Razorpay keys are not yet configured in .env.local
      if (orderData.isMock) {
        const verifyRes = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderData.orderId,
            paymentId: `pay_demo_${Date.now()}`,
            signature: 'mock_signature',
            userId: userId || 'anonymous',
            creditsToAdd: plan.credits,
            isMock: true,
          }),
        });

        const verifyData = await verifyRes.json();
        const updatedBalance = currentCredits + plan.credits;
        onSuccess(verifyData.newCredits || updatedBalance);
        onClose();
        return;
      }

      // 2. Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error('Could not load Razorpay payment gateway. Please check your internet connection or disable ad-blockers.');
      }

      // 3. Launch Razorpay Standard Checkout Popup
      const options = {
        key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Veyro',
        description: `Pro Subscription (${plan.credits} Credits)`,
        order_id: orderData.orderId,
        prefill: {
          email: userEmail || '',
        },
        theme: {
          color: '#f02508', // Veyro flame red
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                userId: userId || 'anonymous',
                creditsToAdd: plan.credits,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              const updatedBalance = currentCredits + plan.credits;
              onSuccess(verifyData.newCredits || updatedBalance);
              onClose();
            } else {
              setErrorMsg(verifyData.error || 'Payment verification failed');
            }
          } catch (vErr: any) {
            setErrorMsg(vErr.message || 'Payment verification network error');
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMsg(err.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-xs font-bold text-[#9c3918] mb-2">
            <Zap className="w-3.5 h-3.5 fill-[#f02508] text-[#f02508]" />
            <span>Current Balance: {currentCredits} Credits</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">One plan. ₹99 a month.</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Every generation makes ten ad creatives and costs 10 credits. Start free, upgrade when you run out.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* Pro Plan Card (Matching /pricing page) */}
        <div className="rounded-2xl border-2 border-[#f02508] bg-slate-50/50 p-5 sm:p-6 mb-6 shadow-xs relative">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Pro</h3>
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white"
              style={{ background: 'linear-gradient(135deg, #f02508 0%, #fc964c 100%)' }}
            >
              Most popular
            </span>
          </div>

          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">₹99</span>
            <span className="text-sm font-semibold text-slate-500"> / month</span>
          </div>
          <p className="text-xs font-semibold text-[#f02508] mt-0.5">300 credits every month</p>

          <ul className="mt-4 space-y-2 border-t border-slate-200/60 pt-3.5">
            {plan.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-800">
                <Check className="w-3.5 h-3.5 text-[#f02508] shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full h-11 rounded-xl text-sm font-extrabold text-white transition-all shadow-md hover:brightness-105 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #f02508 0%, #fc964c 100%)',
              boxShadow: '0 4px 14px rgba(240, 37, 8, 0.25)',
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Checkout...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Pay ₹99 for 300 Credits</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Razorpay Secured (UPI, Cards, NetBanking)</span>
            </span>
            <Link
              href="/pricing"
              onClick={onClose}
              className="text-slate-600 hover:text-[#f02508] font-semibold flex items-center gap-0.5 transition-colors"
            >
              <span>Full details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
