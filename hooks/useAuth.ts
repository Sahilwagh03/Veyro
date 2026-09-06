'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSupabaseClient } from '@/utils/supabase/client';
import { userService } from '@/services/userService';
import { AuthModalMode } from '@/types/auth';

export function useAuth(showToast?: (msg: string) => void) {
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('signup');
  const queryClient = useQueryClient();

  const userId = user?.id;

  // Query credit balance using TanStack Query
  const { data: credits = 0, refetch: refetchCredits } = useQuery({
    queryKey: ['userCredits', userId],
    queryFn: async () => {
      if (!userId) return 0;
      const val = await userService.fetchUserCredits(userId);
      return val ?? 0;
    },
    enabled: !!userId,
  });

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setIsAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
      setIsAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        queryClient.invalidateQueries({ queryKey: ['userCredits', session.user.id] });
      } else {
        setUser(null);
        queryClient.setQueryData(['userCredits', undefined], 0);
      }
      setIsAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const openAuthModal = useCallback((mode: AuthModalMode = 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const handleSignOut = useCallback(async () => {
    await userService.signOut();
    setUser(null);
    queryClient.setQueryData(['userCredits', undefined], 0);
    showToast?.('Signed out successfully.');
  }, [queryClient, showToast]);

  const deductCredits = useCallback(
    async (amount: number = 10) => {
      if (!userId) return;

      // Optimistic cache update
      queryClient.setQueryData<number>(['userCredits', userId], (old = 0) => Math.max(0, old - amount));

      const newBal = await userService.deductCredits(userId, credits, amount);
      queryClient.setQueryData<number>(['userCredits', userId], newBal);
    },
    [userId, credits, queryClient]
  );

  return {
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
  };
}
