'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FolderArchive, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { AdSquare } from '@/components/AdTemplates';
import { EditorModal } from '@/components/EditorModal';
import { AuthModal } from '@/components/AuthModal';
import { TopupModal } from '@/components/TopupModal';
import { Toast } from '@/components/Toast';
import { Logo } from '@/components/logo';
import { exportAdAsPng, copyAdToClipboard, exportAllAdsAsZip } from '@/utils/exporter';
import { TemplateId } from '@/types/ad';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { useAdGenerator } from '@/hooks/useAdGenerator';

export default function Home() {
  const { toastMessage, showToast } = useToast();
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);

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
    deductCredits,
    refetchCredits,
  } = useAuth(showToast);

  const {
    rawOffer,
    setRawOffer,
    adContent,
    setAdContent,
    editingTemplateId,
    setEditingTemplateId,
    isGenerating,
    handleGenerate,
    templatesRef,
  } = useAdGenerator({
    user,
    credits,
    openAuthModal,
    openTopupModal: () => setIsTopupModalOpen(true),
    deductCredits,
    showToast,
  });

  const handleDownloadPng = async (id: TemplateId) => {
    try {
      showToast(`Exporting Template #${id} as 1080x1080 PNG...`);
      await exportAdAsPng(`ad-canvas-${id}`, `veyro-template-${id}`);
      showToast(`Downloaded Template #${id} PNG successfully!`);
    } catch (e) {
      console.error(e);
      showToast(`Failed to export Template #${id}`);
    }
  };

  const handleCopyClipboard = async (id: TemplateId) => {
    const success = await copyAdToClipboard(`ad-canvas-${id}`);
    if (success) {
      showToast(`Copied Template #${id} image to clipboard!`);
    } else {
      showToast(`Failed to copy image (try PNG download)`);
    }
  };

  const handleDownloadAllZip = async () => {
    if (!user) {
      openAuthModal('signup');
      return;
    }

    setIsExportingZip(true);
    showToast('Exporting all 10 creatives as a 1080×1080 PNG ZIP archive...');
    try {
      await exportAllAdsAsZip([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'veyro-creative');
      showToast('Downloaded all 10 ad creatives as ZIP successfully!');
    } catch (e) {
      console.error(e);
      showToast('Failed to export bulk ZIP archive.');
    } finally {
      setIsExportingZip(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Toast message={toastMessage} />

      {/* Header */}
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

      <main className="flex-1">
        {/* Exact Hero 2-Column Section */}
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-12">
          {/* Left Column */}
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#9c3918' }}>
              Veyro
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
              High-converting ads sell. Make ten in a minute.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-600">
              Paste your offer in plain words. Veyro crafts direct-response copy, ten proven high-converting ad layouts render instantly in your browser, and you download the whole set as 1080×1080 PNGs.
            </p>
            <ul className="mt-8 space-y-3">
              <li className="flex gap-3 text-sm text-slate-900">
                <span className="mt-0.5 font-bold text-[#f02508]">→</span>
                <span>30 free credits the moment you sign up — 3 generations, 30 ad squares.</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-900">
                <span className="mt-0.5 font-bold text-[#f02508]">→</span>
                <span>Ten different high-converting direct-response layouts per generation.</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-900">
                <span className="mt-0.5 font-bold text-[#f02508]">→</span>
                <span>Every creative is a real 1080×1080 PNG you can upload straight to ads.</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-900">
                <span className="mt-0.5 font-bold text-[#f02508]">→</span>
                <span>After your free credits, it&apos;s ₹99 a month for 300 credits.</span>
              </li>
            </ul>

            <p className="mt-8 text-sm text-slate-500">
              Need more?{' '}
              <Link
                href="/pricing"
                className="font-semibold text-slate-900 underline underline-offset-4 hover:text-[#f02508] transition-colors"
              >
                See pricing — ₹99/mo for 300 credits
              </Link>
            </p>
          </section>

          {/* Right Column Form Card */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Generate 10 ad creatives
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Paste your offer below — 30 credits included, no card needed.
              </p>

              <div className="mt-6 space-y-2">
                <label className="text-sm font-semibold leading-none text-slate-900" htmlFor="offerText">
                  Your Offer Description
                </label>
                <textarea
                  id="offerText"
                  rows={10}
                  value={rawOffer}
                  onChange={(e) => setRawOffer(e.target.value)}
                  disabled={isGenerating}
                  style={{ resize: 'none' }}
                  placeholder="Paste your offer in plain words... (e.g. We help coaches get 40 sales calls a month without chasing leads. We place a trained setter in your business in 7 days. 30 calls in 30 days or you don't pay.)"
                  className="flex w-full resize-none rounded-md border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900 shadow-2xs placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f02508] transition-all leading-relaxed disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold cursor-pointer transition-all text-white h-11 rounded-md px-8 w-full disabled:opacity-50 shadow-md hover:brightness-105 active:scale-[0.99]"
                style={{
                  background: 'linear-gradient(135deg, #f02508 0%, #fc964c 100%)',
                  boxShadow: '0 4px 14px rgba(240, 37, 8, 0.25)',
                }}
              >
                {isGenerating ? 'Rendering 10 Ads...' : 'Get my 10 ad creatives'}
              </button>
            </div>
          </section>
        </div>

        {/* Templates Grid Section */}
        <section ref={templatesRef} className="border-t border-slate-200 bg-slate-50/50 scroll-mt-16">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  The ten templates you get
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  Every generation fills all ten layouts with your offer — audience, pain, timeline and a “Book Your 1:1 Call” CTA. Click any card to edit.
                </p>
              </div>

              {user && (
                <button
                  type="button"
                  onClick={handleDownloadAllZip}
                  disabled={isExportingZip}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-extrabold text-white transition-all shadow-sm hover:brightness-110 active:scale-[0.99] cursor-pointer shrink-0 disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #f02508 0%, #fc964c 100%)',
                  }}
                >
                  {isExportingZip ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating ZIP Archive...</span>
                    </>
                  ) : (
                    <>
                      <FolderArchive className="w-4 h-4" />
                      <span>Download All 10 (ZIP)</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as TemplateId[]).map((id) => (
                <AdSquare
                  key={id}
                  id={id}
                  content={adContent}
                  isLoggedIn={!!user}
                  onRequireAuth={() => {
                    openAuthModal('signup');
                  }}
                  onEdit={(templateId) => {
                    if (!user) {
                      openAuthModal('signup');
                      return;
                    }
                    setEditingTemplateId(templateId);
                  }}
                  onDownload={(templateId) => {
                    if (!user) {
                      openAuthModal('signup');
                      return;
                    }
                    handleDownloadPng(templateId);
                  }}
                  onCopy={(templateId) => {
                    if (!user) {
                      openAuthModal('signup');
                      return;
                    }
                    handleCopyClipboard(templateId);
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Editor Modal */}
      <EditorModal
        isOpen={editingTemplateId !== null}
        templateId={editingTemplateId}
        content={adContent}
        onChange={(updated) => setAdContent(updated)}
        onClose={() => setEditingTemplateId(null)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={closeAuthModal}
        onSuccess={(authPayload) => {
          setUser(authPayload);
          refetchCredits();
          showToast(`Welcome! Signed in as ${authPayload.email || 'User'}`);
        }}
      />

      {/* Topup Modal */}
      <TopupModal
        isOpen={isTopupModalOpen}
        currentCredits={credits}
        userId={user?.id}
        userEmail={user?.email}
        onClose={() => setIsTopupModalOpen(false)}
        onSuccess={(updatedCredits) => {
          refetchCredits();
          showToast(`Top-up successful! New balance: ${updatedCredits} credits.`);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-xs text-slate-500 bg-white">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-0.5">
            <Logo className="h-4 w-auto" color="#f02508" />
            <span className="font-bold text-slate-900 tracking-tight">eyro</span>
            <span className="ml-1.5">— © {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <p>Built for direct-response marketing & growth teams</p>
        </div>
      </footer>
    </div>
  );
}
