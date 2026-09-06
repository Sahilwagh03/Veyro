'use client';

import { useState, useCallback, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { adService } from '@/services/adService';
import { parseOfferText } from '@/utils/parser';
import { AdContent, TemplateId } from '@/types/ad';

const DEFAULT_OFFER =
  "We help coaches and agency owners get 40 sales calls a month without chasing leads. We place a trained setter in your business in 7 days. 30 calls in 30 days or you don't pay.";

interface UseAdGeneratorParams {
  user: any;
  credits: number;
  openAuthModal: (mode?: 'signup' | 'signin') => void;
  openTopupModal: () => void;
  deductCredits: (amount?: number) => Promise<void>;
  showToast: (msg: string) => void;
}

export function useAdGenerator({
  user,
  credits,
  openAuthModal,
  openTopupModal,
  deductCredits,
  showToast,
}: UseAdGeneratorParams) {
  const [rawOffer, setRawOffer] = useState<string>(DEFAULT_OFFER);
  const [adContent, setAdContent] = useState<AdContent>(() => parseOfferText(DEFAULT_OFFER));
  const [editingTemplateId, setEditingTemplateId] = useState<TemplateId | null>(null);
  const templatesRef = useRef<HTMLElement | null>(null);

  const scrollToTemplates = useCallback(() => {
    setTimeout(() => {
      templatesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }, []);

  const generateMutation = useMutation({
    mutationFn: (prompt: string) => adService.generateAd(prompt),
    onSuccess: (data) => {
      if (data.content) {
        setAdContent(data.content);
        deductCredits(10);
        showToast(
          data.isAiGenerated
            ? 'Generated 10 AI-crafted ad squares!'
            : 'Generated 10 high-converting ad squares!'
        );
        scrollToTemplates();
      }
    },
    onError: (err: any) => {
      console.warn('Ad generation API fallback to parser:', err?.message);
      const parsed = parseOfferText(rawOffer);
      setAdContent(parsed);
      deductCredits(10);
      showToast('Generated 10 high-converting ad squares!');
      scrollToTemplates();
    },
  });

  const handleGenerate = useCallback(() => {
    if (!rawOffer.trim()) {
      showToast('Please enter an offer description');
      return;
    }

    if (!user) {
      openAuthModal('signup');
      return;
    }

    if (credits <= 0) {
      showToast('No credits remaining! Top up to continue.');
      openTopupModal();
      return;
    }

    generateMutation.mutate(rawOffer);
  }, [rawOffer, user, credits, showToast, openAuthModal, openTopupModal, generateMutation]);

  return {
    rawOffer,
    setRawOffer,
    adContent,
    setAdContent,
    editingTemplateId,
    setEditingTemplateId,
    isGenerating: generateMutation.isPending,
    handleGenerate,
    templatesRef,
  };
}
